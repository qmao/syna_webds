import tornado
from jupyter_server.base.handlers import APIHandler
import os
import json

from . import webds
from .programmer_manager import ProgrammerManager
from .touchcomm_manager import TouchcommManager

import threading
from queue import Queue
import time
import sys

g_stdout_handler = None
g_program_thread = None

class StdoutHandler(Queue):
    _progress = 0
    _status = 'idle'
    _message = ''

    def __init__(self):
        super().__init__()

    def write(self,msg):
        if "%" in msg:
            progress = msg[12:-1]
            self._progress = int(progress, base=10)
        sys.__stdout__.write(msg)

    def flush(self):
        sys.__stdout__.flush()

    def get_progress(self):
        return self._progress

    def set_progress(self, num):
        self._progress = num

    def reset(self):
        self._status = 'idle'
        self._progress = 0
        self._message = ''

    def set_status(self, status):
        self._status = status

    def get_status(self):
        return self._status

    def get_message(self):
        return self._message
        
    def set_message(self, message):
        self._message = message
        

class ProgramHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server

    @tornado.web.authenticated
    def get(self):
        print("request progress")

        if g_stdout_handler is None:
            data = {
                  'status': 'unknown',
                  'progress': 0,
                }
        else:
            data = {
                  "status": g_stdout_handler.get_status(),
                  "progress": g_stdout_handler.get_progress(),
                }

        print(data)
        self.finish(json.dumps(data))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionary with a key "filename"
        input_data = self.get_json_body()
        print(input_data)
        data = ""

        global g_stdout_handler
        global g_program_thread

        action = input_data["action"]
        if action == "start":
            print("start to erase and program!!!")

            filename = os.path.join(webds.PACKRAT_CACHE, input_data["filename"])
            print(filename)

            if not os.path.isfile(filename):
                raise Exception(filename)

            if g_program_thread is not None and g_program_thread.is_alive():
                print("erase and program thread is still running...")
                g_program_thread.join()
                print("erase and program thread finished.")

            if g_stdout_handler is None:
                print("create StdoutHandler")
                g_stdout_handler = StdoutHandler()

            g_program_thread = threading.Thread(target=self.program, args=(filename, g_stdout_handler))
            g_program_thread.start()
            print("program thread start")
            g_program_thread.join()

            print("program thread done")

            data = {
              "status": g_stdout_handler.get_status(),
              "message": g_stdout_handler.get_message()
            }
            print(data)
            g_stdout_handler.reset()

        elif action == "cancel":
            print("cancel thread")
            data = "erase and program is canceled"

        elif action == "request":
            print("request progress")

            if g_stdout_handler is None:
                data = {
                  'status': 'unknown',
                  'progress': 0,
                }
            else:
                data = {
                  "status": g_stdout_handler.get_status(),
                  "progress": g_stdout_handler.get_progress(),
                }

        print(data)
        self.finish(json.dumps(data))

    def program(self, filename, handler):
        temp = sys.stdout
        sys.stdout = handler

        handler.set_status("unknown")
        try:
            ret = ProgrammerManager.program(filename)
            sys.stdout = temp

            if handler.get_progress() != 100:
                print(handler.get_progress())
                handler.set_message("Unkwon error")
                handler.set_progress(-1)
                handler.set_status("error")
            else:
                print("Erase and program done.")

                tc = TouchcommManager()
                handler.set_message(json.dumps(tc.identify()))
                handler.set_status("success")

        except Exception as error:
            print(error)
            handler.set_progress(-1)
            handler.set_message(str(error))
            handler.set_status("error")

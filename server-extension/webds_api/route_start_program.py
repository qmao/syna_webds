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

    def set_status(self, status):
        self._status = status

    def get_status(self):
        return self._status

class ProgramHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server

    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /erase-and-program/start-program endpoint!"
        }))

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
            else:
                g_stdout_handler.reset()

            g_program_thread = threading.Thread(target=self.program, args=(filename, g_stdout_handler))
            g_program_thread.start()

            data = "start erase and program"

        elif action == "cancel":
            print("cancel thread")
            data = "erase and program is canceled"

        elif action == "request":
            print("request progress")
            data = {
              "status": g_stdout_handler.get_status(),
              "progress": g_stdout_handler.get_progress()
            }

        self.finish(json.dumps(data))

    def program(self, filename, handler):
        temp = sys.stdout
        sys.stdout = handler

        handler.set_status("running")
        try:
            ret = ProgrammerManager.program(filename)
        except Exception as error:
            print(error)
            handler.set_progress(-1)

        sys.stdout = temp

        if handler.get_progress() != 100:
            print(handler.get_progress())
            print("Unkwon error")
            handler.set_progress(-1)
        else:
            print("Erase and program done.")

        handler.set_status("done")
import tornado
from jupyter_server.base.handlers import APIHandler
import os
import json
import sys
sys.path.append("/usr/local/syna/lib/python")

from touchcomm import TouchComm

from . import webds
from .programmer_manager import ProgrammerManager
from .touchcomm_manager import TouchcommManager

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

        print("start to erase and program!!!")
        
        filename = os.path.join(webds.PACKRAT_CACHE, input_data["filename"])
        print(filename)

        if not os.path.isfile(filename):
            raise Exception(filename)

        ProgrammerManager.program(filename)
        print("Erase and program done!!!")
        
        data = TouchcommManager().identify()

        self.finish(json.dumps(data))
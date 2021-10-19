import tornado
import os
import json
import sys
sys.path.append("/usr/local/syna/lib/python")

from touchcomm import TouchComm
from programmer import AsicProgrammer

from jupyter_server.base.handlers import APIHandler
from . import webds


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

        AsicProgrammer.programHexFile(filename, communication='socket', server='127.0.0.1')
        print("Erase and program done!!!")
        
        tc = TouchComm.make(protocols='report_streamer', server='127.0.0.1')
        if(tc):
            id = tc.identify()
            print(id)
            tc.close()
            tc = None

        data = id
        self.finish(json.dumps(data))
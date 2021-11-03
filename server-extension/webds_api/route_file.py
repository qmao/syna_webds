import tornado
from jupyter_server.base.handlers import APIHandler
import os
import json

from . import webds
from . import utils

class FileHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        print(self.request)
        self.finish(json.dumps({
            "data": "file is created la!"
        }))  


    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        print(input_data)
        
        action = input_data["action"]
        print(action)

        extension = input_data["extension"]
        print(extension)

        if (action == 'get-list'):
            filelist = utils.GetFileList(extension)
            self.finish(filelist)
        elif (action == 'delete'):
            filename = input_data["file"]
            print("delete file: ", filename)
            utils.CallSysCommand(['rm', webds.PACKRAT_CACHE + "/" + filename])

            filelist = utils.GetFileList(extension)
            self.finish(filelist)
        else:
            self.write(action, "unknown")   # 0 is the default case if x is not found
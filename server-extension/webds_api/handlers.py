import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

import os
import tornado

import re

from .route_start_program import ProgramHandler
from .route_general import GeneralHandler
from .route_upload import UploadHandler
from . import webds
from . import utils


class GetListHandler(APIHandler):
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

        if ( action == 'get-list'):
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



def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]

    general_pattern = url_path_join(base_url, "webds-api", "general")
        
    program_pattern = url_path_join(base_url, "webds-api", "start-program")

    upload_pattern = url_path_join(base_url, "webds-api", "upload")

    get_list_pattern = url_path_join(base_url, "webds-api", "manage-file")
    
    handlers = [(general_pattern, GeneralHandler), (program_pattern, ProgramHandler), (upload_pattern, UploadHandler), (get_list_pattern, GetListHandler)]

    web_app.add_handlers(host_pattern, handlers)

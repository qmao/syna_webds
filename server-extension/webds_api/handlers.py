import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

from pathlib import Path

import logging

import os
import tornado

import grp, pwd
import glob
import re
from werkzeug.utils import secure_filename


from .route_start_program import ProgramHandler
from .route_general import GeneralHandler
from . import webds
from . import utils


def GetFileList(extension, packrat=""):
    filelist = []
    os.chdir(webds.PACKRAT_CACHE)
    for file in glob.glob("**/*." + extension):
        print(file)
        filelist += [str(file)]

    data = json.loads("{}")
    data["filelist"] = filelist
    data["upload"] = packrat

    jsonString = json.dumps(data)
    return jsonString

def GetSymbolValue(symbol, content):
    find=r'(?<='+ symbol + r'=").*(?=")'
    x = re.findall(find, content)

    if (len(x) > 0):
        return x[0]
    else:
        return None
    

class UploadHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        print(self.request)
        self.finish(json.dumps({
            "data": "file is created!"
        }))  


    @tornado.web.authenticated
    def post(self):
        print(self.request)

        for field_name, files in self.request.files.items():
            print(field_name)
            for f in files:
                filename, content_type = f["filename"], f["content_type"]
                body = f["body"]
                logging.info(
                    'POST "%s" "%s" %d bytes', filename, content_type, len(body)
                )
                print(filename)
                print(content_type)

                ## save file
                ## img_path = os.path.join(save_father_path, str(uuid.uuid1()) + '.' + secure_filename(f.filename).split('.')[-1])

                packrat_id = GetSymbolValue("PACKRAT_ID", body.decode('utf-8'))
                print(packrat_id)

                # save temp hex file in worksapce
                with open(webds.WORKSPACE_TEMP_HEX, 'wb') as f:
                    f.write(body)

                # move temp hex to packrat cache
                path = os.path.join(webds.PACKRAT_CACHE, packrat_id)
                utils.CallSysCommand(['mkdir','-p', path])
                packrat_filename="PR" + packrat_id + ".hex"
                file_path = os.path.join(path, packrat_filename)
                print(file_path)
                utils.CallSysCommand(['mv', webds.WORKSPACE_TEMP_HEX, file_path])


                data = GetFileList('hex', packrat_filename)
                utils.UpdateWorkspace()

                print(data)
                self.finish(data)

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
            filelist = GetFileList(extension)
            self.finish(filelist)
        elif (action == 'delete'):
            filename = input_data["file"]
            print("delete file: ", filename)
            utils.CallSysCommand(['rm', webds.PACKRAT_CACHE + "/" + filename])

            filelist = GetFileList(extension)
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

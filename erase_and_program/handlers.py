import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

from pathlib import Path

import os

import tornado

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /erase-and-program/get_example endpoint!"
        }))
        
    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionary with a key "filename"
        input_data = self.get_json_body()
        print(input_data)

        if input_data["type"] == 'upload':
            txt = Path(input_data["filename"]).read_text()
            print(txt)
        
        path = '/'
        directory_contents = os.listdir(path)
        print(directory_contents)

        data = {"filename": "file:{}".format(input_data["filename"]), "type": "type:{}".format(input_data["type"])}
        self.finish(json.dumps(data))


class UploadHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is upload endpoint!"
        }))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionary with a key "filename"
        input_data = self.get_json_body()
        print(input_data)

        if input_data["type"] == 'upload':
            txt = Path(input_data["filename"]).read_text()
            print(txt)
        
        path = '/'
        directory_contents = os.listdir(path)
        print(directory_contents)

        data = {"filename": "file:{}".format(input_data["filename"]), "type": "type:{}".format(input_data["type"])}
        self.finish(json.dumps(data))
        

def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "erase-and-program", "start_program")
    
    upload_pattern = url_path_join(base_url, "upload", "upload")
        
    handlers = [(route_pattern, RouteHandler), (upload_pattern, UploadHandler)]

    web_app.add_handlers(host_pattern, handlers)

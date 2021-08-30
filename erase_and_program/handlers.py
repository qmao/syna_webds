import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

from pathlib import Path

import logging

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
        file_name = 'qmao.qmao'
        buf_size = 4096
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', 'attachment; filename=' + file_name)
        with open(file_name, 'r') as f:
            while True:
                data = f.read(buf_size)
                if not data:
                    break
                self.write(data)
        self.finish(json.dumps({
            "data": "file is created la!"
        }))  


    @tornado.web.authenticated
    def post(self):
        print(self.request)
        print(self.request.files)
        print(self.request.files.items())
        for field_name, files in self.request.files.items():
            for info in files:
                filename, content_type = info["filename"], info["content_type"]
                body = info["body"]
                logging.info(
                    'POST "%s" "%s" %d bytes', filename, content_type, len(body)
                )
                print(filename)
                print(content_type)
                print(body)

        self.write("OK")
        

def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "webds-api", "start-program")
    
    upload_pattern = url_path_join(base_url, "webds-api", "upload")

    handlers = [(route_pattern, RouteHandler), (upload_pattern, UploadHandler)]

    web_app.add_handlers(host_pattern, handlers)

import tornado
from jupyter_server.base.handlers import APIHandler
import os
import json
from . import webds
from .utils import SystemHandler
                
                
class CommandHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def post(self):

        print(self.request.arguments)

        data = {'data': 'done'}
        self.set_header('content-type', 'application/json')
        self.finish(json.dumps(data))
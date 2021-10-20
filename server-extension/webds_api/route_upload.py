import tornado
from jupyter_server.base.handlers import APIHandler
import os
import json

from . import webds
from . import utils

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
                #logging.info(
                #    'POST "%s" "%s" %d bytes', filename, content_type, len(body)
                #)
                print(filename)

                packrat_id = utils.GetSymbolValue("PACKRAT_ID", body.decode('utf-8'))
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


                data = utils.GetFileList('hex', packrat_filename)
                utils.UpdateWorkspace()

                print(data)
                self.finish(data)
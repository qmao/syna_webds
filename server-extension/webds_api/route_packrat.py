import tornado
from jupyter_server.base.handlers import APIHandler
import os
import json

from . import webds
from . import utils

class PackratHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        print(self.request)

        packrat_id = self.get_argument('packrat-id', None)
        filename = self.get_argument('filename', None)
        extension = self.get_argument('extension', None)

        data = json.loads("{}")

        if extension:
            filelist = utils.GetFileList(extension)
            data = filelist

        elif packrat_id and filename:
            print(packrat_id) 
            print(filename)
        
        ##response = {'key': key}
        ##self.write(response)


        self.finish(data)  

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
                packrat_id = None

                try:
                    packrat_id = utils.GetSymbolValue("PACKRAT_ID", body.decode('utf-8'))
                    print(packrat_id)
                except:
                    print("Invalid Hex File")
                    ##return

                if packrat_id is None:
                    print("Invalid Hex File (PACKRAT_ID not found)")
                    ##return
                if filename is 'test':
                    packrat_id=1234567

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
                utils.UpdateWorkspace()

                data = json.loads("{}")
                data["filename"] = packrat_filename
                print(data)

                self.finish(json.dumps(data))
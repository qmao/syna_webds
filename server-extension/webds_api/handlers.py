from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

import tornado

from .route_start_program import ProgramHandler
from .route_general import GeneralHandler
from .route_upload import UploadHandler
from .route_file import FileHandler


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]

    general_pattern = url_path_join(base_url, "webds-api", "general")
        
    program_pattern = url_path_join(base_url, "webds-api", "start-program")

    upload_pattern = url_path_join(base_url, "webds-api", "upload")

    file_pattern = url_path_join(base_url, "webds-api", "manage-file")
    
    handlers = [(general_pattern, GeneralHandler), (program_pattern, ProgramHandler), (upload_pattern, UploadHandler), (file_pattern, FileHandler)]

    web_app.add_handlers(host_pattern, handlers)

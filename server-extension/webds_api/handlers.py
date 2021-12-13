from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

import tornado

from .route_program      import ProgramHandler
from .route_general      import GeneralHandler
from .route_packrat      import PackratHandler
from .route_about        import AboutHandler
from .route_filesystem   import FilesystemHandler

def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]

    general_pattern = url_path_join(base_url, "webds", "general")

    program_pattern = url_path_join(base_url, "webds", "program")

    packrat_pattern = url_path_join(base_url, "webds", "packrat" + '(.*)')

    about_pattern = url_path_join(base_url, "webds", "about")
    
    filesystem_pattern = url_path_join(base_url, "webds", "filesystem")

    handlers = [
                (general_pattern, GeneralHandler),
                (program_pattern, ProgramHandler),
                (packrat_pattern, PackratHandler),
                (about_pattern, AboutHandler),
                (filesystem_pattern, FilesystemHandler),
               ]

    web_app.add_handlers(host_pattern, handlers)

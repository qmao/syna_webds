from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

import tornado

from .route_reprogram    import ProgramHandler
from .route_general      import GeneralHandler
from .route_packrat      import PackratHandler
from .route_about        import AboutHandler
from .route_filesystem   import FilesystemHandler
from .route_command      import CommandHandler
from .route_report       import ReportHandler
from .route_settings     import SettingsHandler

def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]

    general_pattern = url_path_join(base_url, "webds", "general")

    reprogram_pattern = url_path_join(base_url, "webds", "reprogram")

    packrat_pattern = url_path_join(base_url, "webds", "packrat" + '(.*)')

    about_pattern = url_path_join(base_url, "webds", "about")

    filesystem_pattern = url_path_join(base_url, "webds", "filesystem")

    command_pattern = url_path_join(base_url, "webds", "command")

    report_pattern = url_path_join(base_url, "webds", "report")

    settings_pattern = url_path_join(base_url, "webds", "settings/" + '(.*)?' + '(.*)')

    handlers = [
                (general_pattern, GeneralHandler),
                (reprogram_pattern, ProgramHandler),
                (packrat_pattern, PackratHandler),
                (about_pattern, AboutHandler),
                (filesystem_pattern, FilesystemHandler),
                (command_pattern, CommandHandler),
                (report_pattern, ReportHandler),
                (settings_pattern, SettingsHandler),
               ]

    web_app.add_handlers(host_pattern, handlers)

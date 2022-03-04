import tornado
from tornado.iostream import StreamClosedError
from jupyter_server.base.handlers import APIHandler
import os
import json
import numpy as np
from . import webds
from .utils import SystemHandler
from .touchcomm_manager import TouchcommManager
from .report_manager import ReportManager
import time
from copy import deepcopy


fps = 300
debug = True

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

class ReportHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        print(input_data)
        frameRate = None
        debugLog = None

        try:
            enable = input_data["enable"]
        except:
            pass
        try:
            disable = input_data["disable"]
        except:
            pass
        try:
            frameRate = input_data["fps"]
        except:
            pass
        try:
            debugLog = input_data["debug"]
        except:
            pass

        try:
            tc = TouchcommManager()

            for x in disable:
                print('disable:{}'.format(x))
                ret = tc.disableReport(x)

            for x in enable:
                print('enable:{}'.format(x))
                ret = tc.enableReport(x)

            if frameRate is not None:
                global fps
                fps = frameRate
                print('fps:{}'.format(fps))

            if debugLog is not None:
                global debug
                debug = debugLog
                print('debug:{}'.format(debug))

            data = {'data': 'done'}

        except Exception as e:
            print(e)
            message=str(e)
            raise tornado.web.HTTPError(status_code=400, log_message=message)

        self.set_header('content-type', 'application/json')
        self.finish(json.dumps(data))

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def publish(self, data):
        """Pushes data to a listener."""
        try:
            self.set_header('content-type', 'text/event-stream')
            self.write('event: report\n')
            self.write('data: {}\n'.format(data))
            self.write('\n')
            yield self.flush()
        except StreamClosedError:
            raise

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def get(self):
        print("get report")

        manager = None
        frame_count = 0
        try:
            manager = ReportManager()
            manager.setState(True)
            global fps
            step = 1 / fps
            report_count = 0
            t0 = time.time()
            t00 = t0
            while True:
                t1 = time.time()
                if (t1 - t00 >= step):
                    t00 = t1
                    data = manager.getReport()
                    if frame_count != data[1]:
                        report = deepcopy(data[0])
                        if report[0] == 'delta' or report[0] == 'raw':
                            report[1]['image'] = report[1]['image'].tolist()
                            report_count += 1
                        send = {"report": report, "frame": report_count}
                        yield self.publish(json.dumps(send, cls=NumpyEncoder))
                        frame_count = data[1]
                    else:
                        yield self.publish(json.dumps({}, cls=NumpyEncoder))
                if (t1 - t0 >= 1):
                    t0 = t1
                    print(str(report_count) + ' fps', flush = True)
                    report_count = 0
                yield tornado.gen.sleep(0.0001)

        except StreamClosedError:
            print("Stream Closed!")
            pass

        except Exception as e:
            ### TypeError
            ### BrokenPipeError
            print("Oops! get report", e.__class__, "occurred.")
            print(e)
            message=str(e)
            raise tornado.web.HTTPError(status_code=400, log_message=message)

        finally:
            if manager:
                print("Finally stop report manager")
                manager.setState(False)

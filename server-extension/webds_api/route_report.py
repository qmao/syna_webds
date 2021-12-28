import tornado
from tornado.iostream import StreamClosedError
from jupyter_server.base.handlers import APIHandler
import os
import json
import numpy as np
from . import webds
from .utils import SystemHandler
from .touchcomm_manager import TouchcommManager
import time

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

        enable = input_data["enable"]
        disable = input_data["disable"]

        try:
            tc = TouchcommManager()

            for x in disable:
                print('disable:{}'.format(x))
                ret = tc.disableReport(x)

            for x in enable:
                print('enable:{}'.format(x))
                ret = tc.enableReport(x)

            data = {'data': 'done'}

        except:
            data = {'data': 'reprogram needed'}
            print("Exception...device needs to be reprogrammed")

        self.set_header('content-type', 'application/json')
        self.finish(json.dumps(data))

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def publish(self, data):
        """Pushes data to a listener."""
        self.set_header('content-type', 'text/event-stream')
        self.write('event: report\n')
        self.write('data: {}\n'.format(data))
        self.write('\n')
        yield self.flush()

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def get(self):
        print("get report")

        tc = TouchcommManager()
        fcount = 0
        fprev = 0
        start_time = time.time()

        try:
          while True:

              time_before_report = time.time()

              report = tc.getReport()

              time_after_report = time.time()

              image = report[1]['image']
              fcount = fcount + 1
              send = { "image": image, "frame": fcount }
              yield self.publish(json.dumps(send, cls=NumpyEncoder))

              time_after_send = time.time()

              if (fcount % 50) == 0:
                  print(fcount)
                  end_time = time.time()
                  fps = ((fcount - fprev) / (end_time - start_time))
                  start_time = end_time
                  fprev = fcount
                  print("FPS: ", fps)
                  print("get report takes: ", time_after_report - time_before_report)
                  print("send sse   takes: ", time_after_send - time_after_report)

        except StreamClosedError:
            print("stream close error!!")

        data = {"info": 'ready to close'}
        self.set_header('content-type', 'text/event-stream')
        self.write('event: close\n')
        self.write('data: {}\n'.format(data))
        self.write('\n')
        yield self.flush()

        print("sse finished")        
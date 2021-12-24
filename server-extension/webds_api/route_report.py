import tornado
from jupyter_server.base.handlers import APIHandler
import os
import json
import numpy as np
from . import webds
from .utils import SystemHandler
from .touchcomm_manager import TouchcommManager

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
        try:
            self.set_header('content-type', 'text/event-stream')
            self.write('event: report\n')
            self.write('data: {}\n'.format(data))
            self.write('\n')
            yield self.flush()

        except StreamClosedError:
            print("stream close error!!")
            pass

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def get(self):
        print("get report")

        tc = TouchcommManager()

        while True:
            report = tc.getReport()
            image = report[1]['image']
            send = {"image": image}
            yield self.publish(json.dumps(send, cls=NumpyEncoder))

        print("sse finished")        
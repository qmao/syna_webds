import sys
sys.path.append("/usr/local/syna/lib/python")
from touchcomm import TouchComm

class TouchcommManager(object):
    _instance = None
    _tc = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.connect()
        print("TouchcommManager init")

    def connect(self):
        print('Touchcomm instance:{}'.format(self))

        if self._tc is None:
            self._tc = TouchComm.make(protocols='report_streamer', server='127.0.0.1')
            print("TouchcommManager connect")
            self._tc.reset()
            print("TouchcommManager reset")
        else:
            print("already connected")

    def disconnect(self):
        if self._tc is not None:
            self._tc.close()
            self._tc = None
            print("TouchcommManager disconnect")
        else:
            print("already disconnected")

    def identify(self, auto = True):
        if auto:
            self.connect()

        data = self._tc.identify()

        if auto:
            self.disconnect()
        return data

    def disableReport(self, id):
        return self._tc.disableReport(id)

    def enableReport(self, id):
        return self._tc.enableReport(id)

    def getReport(self):
        data = self._tc.getReport()
        ### print(data)
        return data

    def getAppInfo(self):
        return self._tc.getAppInfo()
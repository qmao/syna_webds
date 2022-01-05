import sys
sys.path.append("/usr/local/syna/lib/python")
from touchcomm import TouchComm

from threading import Lock

class TouchcommManager(object):
    _instance = None
    _tc = None
    _lock = Lock()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.connect()
        print("TouchcommManager init")

    def connect(self):
        print("Touchcomm connect()")
        print('Touchcomm instance:{}'.format(self))

        self._lock.acquire()
        print("Touchcomm connect() lock")
        try:
            if self._tc is None:
                self._tc = TouchComm.make(protocols='report_streamer', server='127.0.0.1', streaming=False)
            else:
                print("already connected")
        except Exception as e:
            print('Touchcomm disconnect exception:{}'.format(e))
        finally:
            self._lock.release()
            print("Touchcomm connect() done")

    def disconnect(self):
        print("Touchcomm disconnect()")
        self._lock.acquire()
        print("Touchcomm disconnect() lock")
        try:
            if self._tc is not None:
                self._tc.close()
            else:
                print("already disconnected")
        except Exception as e:
            print('Touchcomm disconnect exception:{}'.format(e))
        finally:
            self._tc = None
            self._lock.release()
            print("Touchcomm disconnect() done")

    def identify(self):
        data = {}
        self._lock.acquire()
        try:
            data = self._tc.identify()
        except Exception as e:
            print('Touchcomm identify exception:{}'.format(e))
        finally:
            self._lock.release()
        return data

    def disableReport(self, id):
        data = {}
        self._lock.acquire()
        try:
            data = self._tc.disableReport(id)
        except Exception as e:
            print('Touchcomm disableReport exception:{}'.format(e))
        finally:
            self._lock.release()
        return data

    def enableReport(self, id):
        data = {}
        self._lock.acquire()
        try:
            data = self._tc.enableReport(id)
        except Exception as e:
            print('Touchcomm enableReport exception:{}'.format(e))
        finally:
            self._lock.release()
        return data

    def getReport(self):
        data = {}
        self._lock.acquire()
        try:
            data = self._tc.getReport()
        except Exception as e:
            print('Touchcomm getReport exception:{}'.format(e))
        finally:
            self._lock.release()
        ### print(data)
        return data

    def getAppInfo(self):
        data = {}
        self._lock.acquire()
        try:
            data = self._tc.getAppInfo()
        except Exception as e:
            print('Touchcomm enableReport exception:{}'.format(e))
        finally:
            self._lock.release()
        return data

    def lock(self, lock):
        if lock:
            self._lock.acquire()
        else:
            self._lock.release()
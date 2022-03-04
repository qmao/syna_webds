import sys
sys.path.append("/usr/local/syna/lib/python")
import threading
import time
from .touchcomm_manager import TouchcommManager
from threading import Thread
from threading import Lock
from time import sleep
    

class ReportManager(object):
    _instance = None
    _counter = 0
    _thread = None
    _report = ('timeout', None)
    ###_lock = Lock()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        print("ReportManager singleton object is created")


    def doit(self, arg):
        t = threading.currentThread()
        tc = None
        try:
            tc = TouchcommManager()
            while getattr(t, "do_run", True):
                ###self._lock.acquire()
                self._report = tc.getReport(1)
                ###self._lock.release()
                sleep(0.0001)
                ###print ("working on %s" % self._counter)
            _report = ('timeout', None)
            print("Stopping as you wish.")
        except Exception as e:
            print(tc)
            if tc is not None:
                print("report sse disconnect tc")
                tc.disconnect()
            raise

    def getReport(self):
        ###self._lock.acquire()
        data = self._report
        ###self._lock.release()
        return data
            
    def setState(self, state):
        print("Set state:", state)
        if state:
            if self._counter is 0:
                print("Create Report Thread")
                self._thread = threading.Thread(target=self.doit, args=("task",))
                self._thread.start()
            self._counter += 1
        else:
            if self._counter > 0:
                self._counter -= 1
                if self._counter is 0:
                    self._thread.do_run = False
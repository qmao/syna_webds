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
        print("TouchcommManager init")
 
    def connect(self):
        if self._tc is None:
            self._tc = TouchComm.make(protocols='report_streamer', server='127.0.0.1')
            print("TouchcommManager connect")
            
    def disconnect(self):
        if self._tc is not None:
            self._tc.close()
            self._tc = None
            print("TouchcommManager disconnect")
            
    def identify(self, auto_close = True):
        self.connect()
        msg = self._tc.identify()
        
        if auto_close:
            self.disconnect()
        return msg
import sys
sys.path.append("/usr/local/syna/lib/python")
from programmer import AsicProgrammer

class ProgrammerManager(object):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        printf("ProgrammerManager singleton object is created")

    def program(filename):
        return AsicProgrammer.programHexFile(filename, communication='socket', server='127.0.0.1')
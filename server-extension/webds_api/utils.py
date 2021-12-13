import os
import subprocess
import shutil
import glob
import re
import json
from . import webds

from tornado import iostream, gen

class SystemHandler():
    def CallSysCommand(command, user = False):
        if os.geteuid() == 0 or user:
            print("No need to call with sudo")
        else:
            print("We're not root.")
            command = ['sudo'] + command
        print(command)
        subprocess.call(command)

    def RunSysCommand(command, user = False):
        if os.geteuid() == 0 or user:
            print("No need to call with sudo")
        else:
            print("We're not root.")
            command = ['sudo'] + command + ['']

        print(command)
        result = subprocess.run(command, capture_output=True, text=True)
        print("stdout:", result.stdout)

        ### should throw exception
        print("stderr:", result.stderr)
        return result.stdout

    def UpdateHexLink():
        if os.path.exists(webds.WORKSPACE_CACHE):
            try:
                shutil.rmtree(webds.WORKSPACE_CACHE)
            except OSError as e:
                print("Error: %s - %s." % (e.filename, e.strerror))

        os.makedirs(webds.WORKSPACE_CACHE, exist_ok=True)

        for packrat in os.listdir(webds.PACKRAT_CACHE):
            print(packrat)
            dirpath = webds.PACKRAT_CACHE + '/' + packrat
            for fname in os.listdir(dirpath):
                if fname.endswith('.hex'):
                    print(dirpath)
                    os.symlink(dirpath, webds.WORKSPACE_CACHE + '/' + packrat)
                    break

    def UpdateWorkspace():
        SystemHandler.CallSysCommand(['mkdir','-p', webds.PACKRAT_CACHE])
        SystemHandler.UpdateHexLink()

class HexFile():
    def GetSymbolValue(symbol, content):
          find=r'(?<='+ symbol + r'=").*(?=")'
          x = re.findall(find, content)

          if (len(x) > 0):
              return x[0]
          else:
              return None

class FileHandler():
    def GetFileList(extension):
        filelist = []
        os.chdir(webds.PACKRAT_CACHE)
        for file in glob.glob("**/*." + extension):
            print(file)
            filelist += [str(file)]

        data = json.loads("{}")
        data["filelist"] = filelist

        jsonString = json.dumps(data)
        return jsonString

    async def download(Handler, filename):
        # chunk size to read
        chunk_size = 1024 * 1024 * 1 # 1 MiB

        with open(filename, 'rb') as f:
            while True:
                print("ready to read file")
                chunk = f.read(chunk_size)
                if not chunk:
                    print("not chunk")
                    break
                try:
                    Handler.write(chunk)
                    await Handler.flush()
                    print("write flush")
                except iostream.StreamClosedError:
                    print("iostream error")
                    break
                finally:
                    print("iostream finally")
                    del chunk
                    # pause the coroutine so other handlers can run
                    await gen.sleep(0.000000001) # 1 nanosecond
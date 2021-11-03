import os
import subprocess
import shutil
import glob
import re
import json
from . import webds

def CallSysCommand(command):
    if os.geteuid() == 0:
        print("We're root")
        subprocess.call(command)
    else:
        print("We're not root.")
        sudo_command = ['sudo'] + command
        print(command)
        subprocess.call(sudo_command)
        

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
    CallSysCommand(['mkdir','-p', webds.PACKRAT_CACHE])
    UpdateHexLink()
    
def GetSymbolValue(symbol, content):
    find=r'(?<='+ symbol + r'=").*(?=")'
    x = re.findall(find, content)

    if (len(x) > 0):
        return x[0]
    else:
        return None
        
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
    
    
def GetFileList2(extension, packrat=""):
    filelist = []
    os.chdir(webds.PACKRAT_CACHE)
    for file in glob.glob("**/*." + extension):
        print(file)
        filelist += [str(file)]

    data = json.loads("{}")
    data["filelist"] = filelist
    data["upload"] = packrat

    jsonString = json.dumps(data)
    return jsonString             
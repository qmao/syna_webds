import os
import subprocess

def CallSysCommand(command):
    if os.geteuid() == 0:
        print("We're root")
        subprocess.call(command)
    else:
        print("We're not root.")
        sudo_command = ['sudo'] + command
        print(command)
        subprocess.call(sudo_command)
        
        
        
def GetSymbolValue(symbol, content):
    find=r'(?<='+ symbol + r'=").*(?=")'
    x = re.findall(find, content)

    if (len(x) > 0):
        return x[0]
    else:
        return None        
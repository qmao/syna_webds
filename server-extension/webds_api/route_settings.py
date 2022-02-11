import tornado
from jupyter_server.base.handlers import APIHandler
import os
import json

from . import webds
from .utils import FileHandler
from .touchcomm_manager import TouchcommManager

class ConnectionSettings:
    @staticmethod
    def getValue(key):
        with open(webds.CONNECTION_SETTINGS_FILE) as json_file:
            data = json.load(json_file)
            # Print the data of dictionary
            if key in data:
                print(key, ":", data[key])
                return data[key]
            else:
                print(key, " value not found")
                return json.loads("{}")

    @staticmethod
    def setValue(key, value):
        with open(webds.CONNECTION_SETTINGS_FILE) as json_file:
            data = json.load(json_file)

        if key in data:
            print(key, " found")
        else:
            print("key not found. create new")

        data[key] = value
        with open(webds.CONNECTION_SETTINGS_FILE, 'w') as json_file:
            json.dump(data, json_file)

    @staticmethod
    def deleteObject(obj):
        with open(webds.CONNECTION_SETTINGS_FILE) as json_file:
            data = json.load(json_file)
        if obj in data:
            del data[obj]
            with open(webds.CONNECTION_SETTINGS_FILE, 'w') as json_file:      
                json.dump(data, json_file)
        else:
            print(obj, " not exist");


class SettingsHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self, subpath: str = "", cluster_id: str = ""):
        print(self.request)
        print(subpath)
        print(self.request.arguments)
        query = self.get_argument('query', None)
        print(query)

        data = json.loads("{}")

        if subpath == 'connection':
            argument = self.get_argument('query', None)
            print(argument)
            if argument == 'default':
                data = ConnectionSettings.getValue('default')
            if argument == 'custom':
                data = ConnectionSettings.getValue('custom')

        self.finish(data)

    @tornado.web.authenticated
    def post(self, subpath: str = "", cluster_id: str = ""):
        print(self.request)

        data = json.loads("{}")

        if subpath == 'connection':
            input_data = self.get_json_body()
            print(input_data)

            action = input_data["action"]
            print(action)
            if action == "reset":
                ConnectionSettings.deleteObject('custom')
            elif action == "update":
                ConnectionSettings.setValue('custom', input_data["value"])

                ### touchcomm use new settings
                tc = TouchcommManager()
                tc.disconnect()
                tc.connect()
                obj = tc.getInstance()

                protocol = obj.comm.get_interface()
                data["interface"] = protocol
                if protocol == "i2c":
                    data["i2cAddr"] = obj.comm.i2cAddr
                elif protocol == "spi":
                    data["spiMode"] = obj.comm.spiMode
                    data["speed"] = obj.comm.speed

                data["useAttn"] = obj.comm.useAttn
                data["vdd"] = obj.comm.vdd
                data["vddtx"] = obj.comm.vddtx
                data["vled"] = obj.comm.vled
                data["vpu"] = obj.comm.vpu
                data["streaming"] = obj.comm.streaming

                print(data)

        self.finish(data)

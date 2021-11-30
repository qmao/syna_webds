var BlobFile = function (filename, blobContent) {
    this.name = filename;
    this.content = blobContent;
};

BlobFile.prototype = {
    name: null,
    content: null
};

var PackratSession = function(args) {
  this.thriftClient = null;
  this.thriftTransport = null;
  this.thriftProtocol = null;
  this.serverUrl = null;
  this.debugMode = null;
  if (args) {
    if (args.serverUrl !== undefined && args.serverUrl !== null) {
      this.serverUrl = args.serverUrl;
    }
  }
};


PackratSession.prototype = {

    authToken: null,
    thriftClient: null,
    thriftTransport: null,
    thriftProtocol: null,

    connect: function () {
        this.thriftTransport = new Thrift.Transport(this.serverUrl, {useCORS: true});
        this.thriftProtocol = new Thrift.TJSONProtocol(this.thriftTransport);
        this.thriftClient = new PackratClient(this.thriftProtocol);
    },

    close: function () {
        this.thriftClient = null;
        this.thriftProtocol = null;
        this.thriftTransport = null;
    },

    login: function(username, password) {
        if (this.thriftClient) {
            this.authToken = this.thriftClient.login(username, password);
        } else {
            throw "Client not set";
        }
    },

    convertStringToUtf8ByteArray: function (str) {
        let binaryArray = new Uint8Array(str.length);
        Array.prototype.forEach.call(binaryArray, function (el, idx, arr) {
            arr[idx] = str.charCodeAt(idx)
        });
        return binaryArray;
    },

    saveFile: function (filename, fileDataBlob) {
        // var fileDataBin = this.convertStringToUtf8ByteArray(fileDataStr);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        // var fileBlob = new Blob([fileDataBin], {type: "application/octet-stream"}),
        let url = URL.createObjectURL(fileDataBlob);
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },

    sha512Digest: function (data) {
        return crypto.subtle.digest("SHA-512", data).then(buf => {
            return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
        });
    },

    downloadFileListAsBlob: function (packratId, fileList) {
        if (fileList && fileList.constructor && fileList.constructor.toString().indexOf("Array") > -1) {
            let returnList = new Array();
            for (let i = 0; i < fileList.length; i++) {
                let fileBlob = this.downloadFileAsBlob(packratId, fileList[i]);
                returnList.push(fileBlob);
            }
            return returnList;
        }
        return new Array();
    },

    downloadFileAsBlob: function(packratId, filename) {
        eval("debugger;");
        if (this.authToken && this.thriftClient) {
            console.log("Requesting download...");
            let downloadRequest = this.thriftClient.request_download(packratId, filename, this.authToken);
            if (downloadRequest) {
                console.log("Starting download for packratId: " + packratId + ": " + filename + "");
                var fileBlock = this.thriftClient.next_file_block(downloadRequest.requestId);
                var completeFile = fileBlock;
                while (null !== fileBlock && fileBlock.length > 0) {
                    fileBlock = this.thriftClient.next_file_block(downloadRequest.requestId);
                    completeFile += fileBlock;
                }
                if (null !== completeFile) {
                    console.log("file_hash = " + downloadRequest.file_hash);
                    console.log(completeFile.length);
                    // let checksumPromise = this.sha512Digest(this.convertStringToUtf8ByteArray(completeFile));
                    // let checksum = "";
                    // checksumPromise.then(x => {
                    //     checksum += x;
                    //     console.log(x);
                    //     return x;
                    // });
                    console.log("Download of file " + filename + " complete. Saving file...");
                    // this.saveFile(filename, completeFile);
                    // if (downloadRequest.file_hash === checksum) {
                    //     this.saveFile(filename, completeFile);
                    // }
                }
                this.endDownload(downloadRequest.requestId);
                let fileBlob = new Blob([this.convertStringToUtf8ByteArray(completeFile)], {type: "application/octet-stream"});
                return new BlobFile(filename, fileBlob);
            }
        } else {
            throw "Client or AuthToken not set";
        }
    },

    validateAndSaveFile: function () {

    },
    
    endDownload: function (requestId) {
        if (this.thriftClient) {
            this.thriftClient.end_download(requestId);
        }
    },

    listFiles: function (packratId) {
        if (this.thriftClient) {
            return this.thriftClient.list_files(packratId);
        } else {
            throw "Client instance not set";
        }
    },

    exists: function(packratId) {
        if (this.thriftClient) {
            return this.thriftClient.exists(packratId);
        } else {
            throw "Client or AuthToken not set";
        }
    },

    ping: function () {
        return this.thriftClient.ping();
    }

};


module.exports = {
    PackratSession
};

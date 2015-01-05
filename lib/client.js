var debug = require('debug')('serandules:socproc');
var Request = require('./request');
var ChildProcess = require('./child-process');

var Client = function (id, socket) {
    this.id = id;
    this.ip = socket.client.request.socket.remoteAddress;
    this.socket = socket;
    this.requests = [];
};

module.exports = Client;

Client.prototype.spawn = function (command, args, options, callback) {
    debug('spawn request');
    var req = new Request(this);
    req.start('spawn', {
        command: command,
        args: args,
        options: options
    });
    req.on('started', function(data) {
        callback(false, new ChildProcess(req, data));
    });
};

Client.prototype.exec = function (command, args, callback) {

};

Client.prototype.executeFile = function (file, args, options, callback) {

};

Client.prototype.fork = function (modulePath, args, options) {

};

Client.prototype.findById = function (id) {
    var request = null;
    this.requests.every(function (req) {
        if (req.id !== id) {
            return true;
        }
        request = req;
        return false;
    });
    return request;
};
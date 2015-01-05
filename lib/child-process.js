var debug = require('debug')('serandules-socproc');
var util = require('util');
var events = require('events');
var stream = require('stream');

var stdout = function(req) {
    var str = new stream.Stream();
    str.writable = true;
    req.on('stdout', function(data) {
        str.emit('data', data);
    });
    req.on('end', function() {
        str.emit('end');
    });
    return str;
};

var stdin = function(req) {
    var str = new stream.Stream();
    str.readable = true;
    str.write = function(data) {
        req.send('stdin', data);
        return true;
    };
    str.end = function() {
        //TODO
    };
    return str;
};

var emit = function(child, req) {
    req.on('error', function(data) {
        child.emit('error', data);
    });
    req.on('exit', function(data) {
        child.emit('exit', data);
    });
    req.on('close', function(data) {
        child.emit('close', data);
    });
};

var ChildProcess = function(req, data) {
    this.pid = data.pid;
    this.stdout = stdout(req);
    this.stdin = stdin(req);
    this.stderr = null;
    emit(this, req);
};

util.inherits(ChildProcess, events.EventEmitter);

module.exports = ChildProcess;

ChildProcess.prototype.exec = function(command) {
    this.stdin.write(command + '\n');
};

ChildProcess.prototype.kill = function() {

};


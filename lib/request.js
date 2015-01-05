var debug = require('debug')('serandules-socproc');
var util = require('util');
var events = require('events');
var uuid = require('node-uuid');

var Request = function (client) {
    this.id = uuid.v4();
    this.client = client;
};

util.inherits(Request, events.EventEmitter);

module.exports = Request;

Request.prototype.start = function (event, data) {
    debug('emitting start : ' + this.id);
    this.client.socket.emit('start', {
        id: this.id,
        event: event,
        data: data
    });
    this.client.requests.push(this);
};

Request.prototype.started = function (data) {
    this.emit('started', data);
};

Request.prototype.send = function (event, data) {
    this.client.socket.emit('data', {
        id: this.id,
        event: event,
        data: data
    });
};

Request.prototype.receive = function (data) {
    //debug(data);
    this.emit(data.event, data.data);
};

Request.prototype.ended = function (data) {
    var requests = this.client.requests;
    requests.splice(requests.indexOf(this), 1);
    this.emit('ended', data);
};

/**
    request  > start, data, end

 */
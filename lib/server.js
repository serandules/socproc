var util = require('util');
var events = require('events');
var uuid = require('node-uuid');
var Client = require('./client');
var Request = require('./request');
/*
 var removeById = function (requests, id) {
 var i,
 length = requests.length;
 for (i = 0; i < length; i++) {
 if (requests[i].id !== id) {
 continue;
 }
 requests.splice(i, 1);
 break;
 }
 };

 var removeByClient = function (requests, client) {
 var i,
 length = requests.length;
 for (i = 0; i < length; i++) {
 if (requests[i].client !== client) {
 continue;
 }
 requests.splice(i, 1);
 break;
 }
 };*/

var Server = function (id, io, options) {
    this.id = id;
    this.io = io;
    var that = this;
    io.of('/socproc-' + this.id).on('connection', function (socket) {
        var client = new Client(uuid.v4(), socket);
        that.emit('connection', client);
        socket.on('disconnect', function () {
            that.emit('disconnect', client);
        });
        socket.on('started', function (data) {
            console.log('started request : ' + data.id);
            var req = client.findById(data.id);
            //console.log(data);
            req.started(data.data);
        });
        socket.on('data', function (data) {
            console.log('data received : ' + data.id);
            var req = client.findById(data.id);
            //console.log(data);
            req.receive(data);
        });
        socket.on('ended', function (data) {
            console.log('ended request : ' + data.id);
            var req = client.findById(data.id);
            req.ended(data.data);
        });
    });
};

util.inherits(Server, events.EventEmitter);

module.exports = Server;


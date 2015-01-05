var debug = require('debug')('serandules:socproc');
var Server = require('./lib/server');

var socprocs = [];

var connect = function (socket) {

};

var disconnect = function () {

};

var ChildProcess = function () {

};

module.exports = function (id, io, options) {
    return new Server(id, io, options);
};

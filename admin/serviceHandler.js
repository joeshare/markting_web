var express = require('express');
var request = require('request');
var RemoteCall = require('./common/remote');

module.exports = {
    router: null,
    callback: function(reqPath, method, exec, afterExec) {
        if (this.router == null) {
            this.router = express.Router();
        }
        method = method || 'get';
        this.router[method](reqPath, function(req, res, next) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            var params = Array.prototype.slice.call(arguments, 0);
            params.push(function(actionResult) {
                var remoteCall = new RemoteCall({
                    req: req,
                    res: res
                });
                remoteCall.exec(actionResult);
            });
            exec.apply(this, params);
        });
        return this;
    },
    send: function(reqPath, method, exec, afterExec) {
        if (this.router == null) {
            this.router = express.Router();
        }
        method = method || 'get';
        this.router[method](reqPath, function(req, res, next) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            var actionResult = exec.apply(this, arguments);
            var remoteCall = new RemoteCall({
                req: req,
                res: res
            });
            remoteCall.exec(actionResult);
        });
        return this;
    }
};
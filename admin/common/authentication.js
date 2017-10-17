var express = require('express');
var userModel = require('../models/UserInfo');
var crypto = require('crypto');

function hashPW(userName, pwd) {
    var hash = crypto.createHash('md5');
    hash.update(userName + pwd);
    return hash.digest('hex');
}

function getLastLoginTime(userName, callback) {
    userModel.getUserInfoByName(userName, function(userinfo) {
        if (userinfo != null) {
            callback(userinfo.modifyTime);
        } else {
            callback("");
        }
    });
}

function updateLastLoginTime(userName, callback) {
    userModel.updateUser({
        UserName: userName
    }, {
        LastTime: Date().toString()
    }, function(err, updateCount) {
        if (err) {
            console.log(err);
            callback(error, -1);
        } else {
            callback(null, updateCount);
        }
    });
}

/**
 * Session存储在数据库中。
 * 如果Session验证失败，跳回Login页面
 * 如果Session验证成功，继续执行
 */
function Authentication(req, res, next) {
    var outAuthPaths = [
        '/login',
        '/doLogin',
        '/registUser',
        '/regist',
        '/captcha'
    ];
    var servicesOutAuthPaths = [
        '/services/doLogin'
    ];

    if (outAuthPaths.indexOf(req.path) >= 0) {
        next();
        return;
    }

    if (req.session["account"] != null && req.session['account'].sessionId) {
        var account = req.session["account"];
        /* var uid = account.uid;
         var user = account.account;
         var hash = account.hash;*/
        if (account.sessionId) {
            console.log(req.session.account.sessionId + " has login.\r\n");
            next();
        } else {
            console.log('sessionId expired,need re-login\r\n');
            res.redirect('/login?' + Date.now());
        }
        /*authenticate(user, hash, function(pass) {
            if (pass === true) {
                req.session.account = {
                    uid: uid,
                    account: user,
                    hash: hash
                };
                console.log(req.session.account.account + " has login.\r\n");
                next();
            } else {
                console.log(req.session.account.account + ' has expired,need re-login\r\n');
                res.redirect('/login?' + Date.now());
            }
        })*/
    } else {
        //服务授权验证
        if (/^\/services\//.test(req.path)) {
            if (servicesOutAuthPaths.indexOf(req.path) >= 0) {
                next();
                return;
            }
            res.write(JSON.stringify({
                success: false,
                error: 'Not authorized.'
            }));
            res.end();
        } else {
            //路由授权验证
            console.log("un-login,redirect to login\r\n");
            res.redirect('/login?' + Date.now());
        }

    }

}

/**
 * 每次页面访问都会调用数据库比对
 * @param  {[type]}   userName [description]
 * @param  {[type]}   hash     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function authenticate(userName, hash, callback) {
    userModel.find({
        UserName: userName,
        Password: hash
    }, function(err, doc) {
        if (err) {
            console.log(err + '\r\n');
            callback(err);
        } else {
            if (doc.length > 0) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
}

module.exports = {
    Authentication: Authentication,
    authenticate: authenticate,
    updateLastLoginTime: updateLastLoginTime,
    getLastLoginTime: getLastLoginTime,
    hashPW: hashPW
};
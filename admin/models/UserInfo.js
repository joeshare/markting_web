var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var crypto = require('crypto');
var async = require('async');
var autoinc = require('mongoose-id-autoinc');

function hashPW(userName, pwd) {
    var hash = crypto.createHash('md5');
    hash.update(userName + pwd);
    return hash.digest('hex');
}


var db = mongoose.connection;
autoinc.init(db);

//Schema
    //var ObjectId   = Schema.Types.ObjectId;
    var UserSchema = new Schema({
    //UniqueID       : {type:Schema.Types.ObjectId},
    UserName       : {type: String},
    Password       : {type: String},
    Telephone      : {type: String},
    State          : {type: Number,default: 1},
    CreateTime     : {type: Date,default: Date.now},
    LastTime       : {type: Date,default: Date.now}
    });
    //UserSchema.set('_id', false);
/**
 * 根据用户编号查找用户详细信息   
 * @param  {Number}   userId   用户编号
 * @param  {Function} callback 回调函数
 * @return {undefined}         无返回值
 */
UserSchema.statics.findByUserID = function(userId, callback) {
    this
        .findOne({
            UniqueID: userId
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
                callback(null);
            } else {
                callback(doc);
            }
        });
}

/**
 * 查找某个时间之前注册的用户
 * @param  {[type]}   time     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
UserSchema.statics.findByTime = function(time, callback) {
    this
        .find({
            CreateTime: {
                $gt: time
            }
        })
        .sort({
            CreateTime: -1
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
UserSchema.statics.findAll = function(callback) {
    return
    this
        .find()
        .sort({
            CreateTime: -1
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
                callback([]);
            } else {
                callback(doc);
            }
        });
}

UserSchema.statics.getUserInfoByName = function(userName, callback) {
    this
        .find({
            UserName: userName
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                console.log(doc);
                callback(null, doc[0]);
            }
        });
}

/**
 * 用户登录校验
 * @param  {String}   userName 登录用户名
 * @param  {String}   password 登录密码
 * @param  {Function} callback 登录验证后的回调函数，返回参数：1.错误信息，2查找到的用户信息
 * @return {undefined}         无返回值
 */
UserSchema.statics.validUserInfo = function(userName, password, callback) {
    password = hashPW(userName, password);
    this
        .find({
            UserName: userName,
            Password: password
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                console.log(doc);
                callback(null, doc[0]);
            }
        });
}

//新增用户
UserSchema.statics.addUser = function(userName, password,email, telephone, callback) {
        password = hashPW(userName, password);
        this
            .create({
                UserName: userName,
                Password: password,
                Telephone: telephone,
                Email:email,
                State:1
            }, function(err, doc) {
                if (err) {
                    console.log(err);
                    callback(null);
                } else {
                    callback(doc);
                }
            })
    }
/**
 * 更新用户信息
 * @param  {json}       fc          filter-condition 查询条件
 * @param  {json}       user        要更新的用户属性对象
 * @param  {Function}   callback    数据库更新完的回调函数
 * @return {undefined}              不返回任意值
 */
UserSchema.statics.updateUser = function(fc, user, callback) {
        if (user && user.Password) {
            user.hash = hashPW(User.UserName, user.Password);
        }
        this.update(fc, {
            "$set": user
        }, function(err, doc) {
            if (err) {
                console.log(err),
                    callback(err, doc);
            } else {
                callback(null, doc);
            }
        })
    }
    //删除用户
UserSchema.statics.deleteUser = function(userId, callback) {
    this.remove({
        UniqueID: userId
    }, function(err, doc) {
        if (err) {
            console.log(err),
                callback(err, doc);
        } else {
            callback(null, doc);
        }
    })
}

UserSchema.plugin(autoinc.plugin, {
    model: 'UserInfo',
    field: 'UniqueID',
    start: 1,
    step: 1
});
/*可以通过下面两种方式更改collection的名字：
1.xxschema = new Schema({
…
}, {collection: “your collection name”});

2.mongoose.model(‘User’, UserSchema, “your collection name”);*/
module.exports = mongoose.model('UserInfo', UserSchema, "SYS_User");
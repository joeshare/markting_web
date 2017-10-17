var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var crypto = require('crypto');
var async = require('async');
var autoinc = require('mongoose-id-autoinc');

var validator = require('../common/validate');

var db = mongoose.connection;

var MSG = {
    OVERVIEW_HASEXISTS: '概览主题已存在',
    MODEL_USERID_REQUIRE: '用户编号不可为空。',
    MODEL_TITLE_REQUIRE: '标题不可为空。',
    MODEL_MODULES_FORMAT_ERROR: '概览配置格式错误。'
}

//Schema
var OverViewSchema = new Schema({
    UserID: { type: Number },
    Title: { type: String },
    Description: { type: String },
    Modules: { type: [Schema.Types.Mixed] },//[{analysisId:1,type:'behavior'},{analysisId:2,type:'funnel'}]
    LastTime: { type: Date }
});

/**
 * 获取指定用户的所有的概览信息
 * @param {Number}   userId   要查询的用户编号
 * @param {Function} callback 查询结果回调函数
 */
OverViewSchema.statics.GetOverViewsByUserID = function (userId, callback) {
    this
        .find({
            UserID: userId
        })
        .exec(function (err, doc) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, doc);
            }
        });
}

/**
 * 获取指定ID的概览信息
 * @param {Number}   uniqueId   要查询的概览编号
 * @param {Function} callback   查询结果回调函数
 */
OverViewSchema.statics.GetOverViewByUniqueID = function (uniqueId, callback) {
    var that = this;
    that
        .findOne({
            UniqueID: uniqueId
        })
        .exec(function (err, doc) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, doc);
            }
        });
}

/**
 * 实体校验
 * @param  {Number} userId      用户编号
 * @param  {String} title       标题
 * @param  {String} description 概览描述
 * @param  {[Mixed]} modules    概览设置
 * @return {undefined}          无返回值
 */
function validateModel(userId, title, description, modules) {
    var err = [];
    if (userId && !validator.required(userId)) {
        err.push(MSG.MODEL_USERID_REQUIRE);
    }
    if (title && !validator.required(title)) {
        err.push(MSG.MODEL_TITLE_REQUIRE);
    }
    if (modules && !validator.isArray(modules)) {
        err.push(MSG.MODEL_MODULES_FORMAT_ERROR);
    }

    return err;
}

/**
 * 添加概览信息
 * @param {Number}   userId      用户编号
 * @param {String}   title       概览标题
 * @param {String}   description 描述信息
 * @param {[Mix]}    modules     概览设置
 * @param {Function} callback    回调函数
 */
OverViewSchema.statics.AddOverView = function (userId, title, description, modules, callback) {
    var err = validateModel(userId, title, description, modules);
    if (err.length > 0) {
        callback(err, null);
        return;
    }
    var that = this;
    //that
    //    .find({
    //        UserID: userId,
    //        Title: title
    //    })
    //    .exec(function (err, doc) {
    //        if (err) {
    //            callback(err, null);
    //        } else {
    //            if (doc && doc.length > 0) {
    //                callback(MSG.OVERVIEW_HASEXISTS, null);
    //            } else {
    //                //TODO...
    //            }
    //        }
    //    });

    this.create({
        UserID: userId,
        Title: title,
        Description: description,
        Modules: modules,
        LastTime:Date.now()
    }, function (err, doc) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, doc);
        }
    });
}


OverViewSchema.statics.UpdateOverView = function (uniqueId, entity, callback) {
    var err = validateModel(entity.UserID, entity.Title, entity.Description, entity.Modules);
    if (err.length > 0) {
        callback(err, null);
        return;
    }


    this.update({
        UniqueID: uniqueId
    }, {
        "$set": entity
    }, function (err, doc) {
        if (err) {
            callback(err, doc);
        } else {
            callback(null, doc);
        }
    })
}

OverViewSchema.statics.DeleteOverView = function (uniqueId, callback) {
    this.remove({
        UniqueID: uniqueId
    })
    .exec(function (err, doc) {
        if (err) {
            console.log(err),
                callback(err, doc);
        } else {
            callback(null, doc);
        }
    })
}

OverViewSchema.plugin(autoinc.plugin, {
    model: 'OverView',
    field: 'UniqueID',
    start: 1,
    step: 1
});

module.exports = mongoose.model('OverView', OverViewSchema, "BUS_OverView");
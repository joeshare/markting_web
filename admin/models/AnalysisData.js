var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var crypto = require('crypto');
var async = require('async');
var autoinc = require('mongoose-id-autoinc');

var validator = require('../common/validate');

var db = mongoose.connection;

var MSG = {
    ANALYSISDATA_HASEXISTS: '分析主题已存在',
    MODEL_USERID_REQUIRE: '用户编号不可为空。',
    MODEL_ANATYPE_REQUIRE: '分析类型不可为空。',
    MODEL_TITLE_REQUIRE: '标题不可为空。',
    MODEL_CONFIG_FORMAT_ERROR: '分析配置格式错误。'
}

//Schema
var AnalysisDataSchema = new Schema({
    UserID: { type: Number },//用户ID
    AnalysisType: { type: String },//分析模型类别
    Title: { type: String },//分析标题
    Config: { type: Schema.Types.Mixed },//分析配置{condition:[],attrs:[],actions:[],etc...}
    Remark: { type: String },//备注
    LastTime: { type: Date }//最后更新时间
});

/**
 * 获取指定用户的指定类型的分析模型信息
 * @param {Number}   userId         要查询的用户编号
 * @param {Number}   analysisType   要查询的分析类型
 * @param {Function} callback       查询结果回调函数
 */
AnalysisDataSchema.statics.GetAnalysisDatasByUserID = function (userId, analysisType, callback) {
    var condition = {};
    if (userId) {
        condition.UserID = userId;
    }
    if (analysisType) {
        condition.AnalysisType = analysisType;
    }
    this
        .find(condition)
        .exec(function (err, doc) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, doc);
            }
        });
}

/**
 * 获取指定ID的分析模型信息
 * @param {Number}   uniqueId   要查询的分析模型编号
 * @param {Function} callback   查询结果回调函数
 */
AnalysisDataSchema.statics.GetAnalysisDataByUniqueID = function (uniqueId, callback) {
    this
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
 * 获取指定ID的分析模型信息,$in查询
 * @param [{Number}] uniqueIds  要查询的分析模型编号
 * @param {Function} callback   查询结果回调函数
 */
AnalysisDataSchema.statics.GetAnalysisDatasByUniqueIDs = function (uniqueIds, callback) {
    this
        .find({
            UniqueID: { "$in": uniqueIds }
        })
        .exec(function (err, docs) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, docs);
            }
        });
}


function validateModel(userId, analysisType, title, config, remark) {
    var err = [];
    if (userId && !validator.required(userId)) {
        err.push(MSG.MODEL_USERID_REQUIRE);
    }
    if (analysisType && !validator.required(analysisType)) {
        err.push(MSG.MODEL_ANATYPE_REQUIRE);
    }
    if (title && !validator.required(title)) {
        err.push(MSG.MODEL_TITLE_REQUIRE);
    }
    if (config && !validator.isPlainObject(config)) {
        err.push(MSG.MODEL_CONFIG_FORMAT_ERROR);
    }

    return err;
}

AnalysisDataSchema.statics.AddAnalysisData = function (userId, analysisType, title, config, remark, callback) {
    var err = validateModel(userId, analysisType, title, config, remark);
    if (err.length > 0) {
        callback(err, null);
        return;
    }
    var that = this;
    that
        .find({
            UserID: userId,
            Title: title
        })
        .exec(function (err, doc) {
            if (err) {
                callback(err, null);
            } else {
                if (doc && doc.length > 0) {
                    callback(MSG.ANALYSISDATA_HASEXISTS, null);
                } else {
                    that.create({
                        UserID: userId,
                        AnalysisType: analysisType,
                        Title: title,
                        Config: config,
                        Remark: remark,
                        LastTime: Date.now()
                    }, function (err, doc) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, doc);
                        }
                    });
                }
            }
        });
}


AnalysisDataSchema.statics.UpdateAnalysisData = function (uniqueId, entity, callback) {
    var err = validateModel(null, null, entity.Title, entity.Config, entity.Remark);
    if (err.length > 0) {
        callback(err, null);
        return;
    }
    var that = this;
    that
       .find({
           UserID: entity.UserID,
           UniqueID: { "$ne": uniqueId },//!=
           Title: entity.Title
       })
       .exec(function (err, doc) {
           if (err) {
               callback(err, null);
           } else {
               if (doc && doc.length > 0) {
                   callback(MSG.ANALYSISDATA_HASEXISTS, null);
               } else {
                   that.update({
                       UniqueID: uniqueId
                   }, {
                       "$set": entity
                   }).exec(function (err, doc) {
                       if (err) {
                           callback(err, doc);
                       } else {
                           entity.UniqueID = uniqueId;
                           callback(null, entity);
                       }
                   })
               }
           }
       });


}

AnalysisDataSchema.statics.DeleteAnalysisData = function (uniqueId, callback) {
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

AnalysisDataSchema.plugin(autoinc.plugin, {
    model: 'AnalysisData',
    field: 'UniqueID',
    start: 1,
    step: 1
});

module.exports = mongoose.model('AnalysisData', AnalysisDataSchema, "BUS_AnalysisData");
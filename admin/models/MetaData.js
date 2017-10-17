var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var crypto = require('crypto');
var async = require('async');
var autoinc = require('mongoose-id-autoinc');

var db = mongoose.connection;

var MSG={
    METADATA_HASEXISTS:'元数据已存在'
}

//Schema
var MetaDataSchema = new Schema({
UserID             : {type: Number},
AnalysisType       : {type: String},
MetaData           : {type: Schema.Types.Mixed}
});

MetaDataSchema.statics.GetMetaDataByUserID = function(userId, analysisType, callback) {
    this
        .findOne({
            UserID: userId,
            AnalysisType: analysisType
        })
        .exec(function(err, doc) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, doc);
            }
        });
}

MetaDataSchema.statics.AddMetaData = function(userId, analysisType, metaData, callback) {
    this
        .find({
            UserID: userId,
            AnalysisType: analysisType
        })
        .exec(function(err, doc) {
            if (err) {
                callback(err, null);
            } else {
                if (doc && doc.length > 0) {
                    callback(MSG.METADATA_HASEXISTS, null);
                } else {
                    this.create({
                            UserID: userId,
                            AnalysisType: analysisType,
                            MetaData: metaData
                        })
                        .exec(function(err, doc) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback('', doc);
                            }
                        })
                }
            }
        });
}
MetaDataSchema.plugin(autoinc.plugin, {
    model: 'MetaData',
    field: 'UniqueID',
    start: 1,
    step: 1
});

module.exports = mongoose.model('MetaData', MetaDataSchema,"SYS_MetaData");
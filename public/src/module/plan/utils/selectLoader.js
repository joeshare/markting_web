/**
 *  author LLJ
 *  time 2016-06-14 10:58
 *  下拉框数据加载器
 */

var API = {
    //人群细分
    querySegment: "?method=mkt.segment.publishstatus.list.get",
    //公众号
   // queryPublic: "?method=mkt.data.inbound.wechat.public.authlist.get",
    queryPublic: "?method=mkt.asset.wechat.type.list.get",
    //新公众号
    queryPublic_v16: "?method=mkt.asset.register.list",
    //微信图文
    queryImgtext: "?method=mkt.asset.imgtext.get",
    //新微信图文
    queryNewImgtext_v16: "?method=mkt.asset.imgtext.campaign.get",
    //短信素材
    querySMSMaterial:"?method=mkt.sms.material.get",
    //事件列表
    queryeventModellist:"?method=mkt.event.eventModel.list",
    // 个人号
    queryPersonal: "?method=mkt.data.inbound.wechat.personal.authlist.get",
    //标签下拉
    queryGrouptags: "?method=mkt.tag.search.grouptags.get",
    //群组
    queryGroup: "?method=mkt.asset.wechat.list.get",
    //固定人群
    queryAudience:"?method=mkt.audience.list.get",
    //细分人群（查询全部）
    querySegmentAll:"?method=mkt.segment.allsummary.list.get",
    //固定人群（查询全部）
    queryAudienceAll:"?method=mkt.audience.all.list.get"
};
const MockData=require('../mock/mock.js');
var pageSize=30;
var pageSize_v17=100;
function isAvailable(res){
    return res && res.code == 0 && res.data && res.data.length;
};
function thousandbit(num) {
    return num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}
var loader={
    ajax:function(arg,callBack,errFun){
      return  util.api({
            url: arg.url,
            type: 'get',
            data: arg.data,
            success: function (res) {
                //if (isAvailable(res)) {
                //    callBack&&callBack.call(null,res.data)
                //}
                callBack&&callBack.call(null,isAvailable(res)?res.data:[])
            },
            error: function (res) {
                errFun&&errFun.call(null)
            }
        })
    },
    queryData:function(type,fun){
        if(type=='target-group'){ //目标人群细分
            this.queryTargetGroup(fun)
        }else if(type=='segement-group'){//细分人群
            this.querySegment(fun)
        }else if(type=='fix-group'){//固定人群
            this.queryFixGroup(fun)
        }else if(type=='wechat-send'
            ||type=='wechat-check'
            ||type=='wechat-forwarded'
            ||type=='send-img'){//微信图文是否发送
            this.queryWechatSend(fun);
        }else if(type=='subscriber-public'){//订阅
            this.querySubscriberPublic(fun)
        }else if(type=='save-current-group'){//保存当前人群
            this.querySaveCurrentGroup(fun);
        }else if(type=="send-h5"){//发送h5
            this.querySendH5(fun);
        }else if(type=="personal-friend"||type=="send-msg"){//个人好友，发送个人消息
            this.queryPersonal(fun)
        }else if(type=="send-sms"){//发送短信
            this.querySendSMS(fun)
        }else if(type=="event-trigger"){
            this.queryEvent(fun);
        }else{
            fun();
        }
    },
    //查询目标人群细分
    queryTargetGroup:function(callBack){
        this.ajax({
            url: API.querySegment,
            data: {
                publish_status:3//0:未发布,1:已发布,2:活动中,3:全部
            }
        },function(data){
            //    {"segment_name":"全部北京vip-1","segment_head_id":101},
            var res=[];
            data.forEach(function(rec,i){
                if(rec.publish_status!=0){
                    res.push({
                        val:rec.segment_head_id,
                        text:rec.segment_name,
                        count:thousandbit(rec.cover_count)+'人'
                    });
                }
            });
            callBack.call(null,{segmentArr:res});
        },function(){
            //TODO::
            callBack.call(null,{segmentArr:[]})
        })
    },
    //查询人群细分
   querySegment:function(callBack){
        this.ajax({
            url: API.querySegmentAll,
            data: {
                publish_status:3//0:未发布,1:已发布,2:活动中,3:全部
            }
        },function(data){
            //    {"segment_name":"全部北京vip-1","segment_head_id":101},
            var res=[];
            data.forEach(function(rec,i){
                if(rec.publish_status!=0){
                    res.push({
                        val:rec.segment_head_id,
                        text:rec.segment_name,
                        count:thousandbit(rec.cover_count)+'人'
                    });
                }
            });
            var segmentation_id=res.length?res[0].val:"";
            callBack.call(null,{segmentArr:res,segmentation_id});
        },function(){
            callBack.call(null,{segmentArr:[]})
        })
   },
   queryFixGroup(callBack){
       this.ajax({
           url: API.queryAudienceAll
       },function(data){
           var res=[];
           data.forEach(function(rec,i){
               res.push({
                   val:rec.audience_list_id,
                   text:rec.audience_list_name,
                   count:thousandbit(rec.audience_count)+'人'
               });
           });
           var fix_group_id=res.length?res[0].val:'';
           callBack.call(null,{fixArr:res,fix_group_id});
       },function(){
           callBack.call(null,{fixArr:[]})
       })
   },
    queryWechatSend:function(callBack){
        var imgTextArr=[],publicArr=[],_this=this;
        this.ajax({
            url: API.queryPublic_v16
        }).always((res)=> {
            if(res&&!res.code&&res.data&&res.data.length){
                res.data.forEach(function(rec,i){
                    publicArr.push({val:rec.wx_acct,text:rec.asset_name,asset_id:rec.asset_id});
                });
                _this.ajax({
                    url: API.queryNewImgtext_v16,
                    data: {
                        pub_id:res.data[0].wx_acct,
                        name:''
                    }
                }).always((data)=> {
                    if(data&&!data.code&&data.data&&data.data.length){
                        data.data.forEach(function(rec,i){
                            imgTextArr.push({val:rec.imgtext_id,text:rec.imgtext_name,url:FILE_PATH+rec.imgfile_name});
                        });
                    }
                    callBack.call(null,{publicArr:publicArr,imgTextArr:imgTextArr});

                });
            }

        })

    },
    //发送短信
    querySendSMS:function(callBack){
        var materialArr=[],_this=this;
        callBack.call(null,{materialArr});
    },
    //事件触发
    queryEvent:function(callBack){
        var eventArr=[],_this=this;
        callBack.call(null,{eventArr});
    },
    //订阅公众号
    querySubscriberPublic:function(callBack){
        this.ajax({
            url: API.queryPublic,
            data: {
                asset_type:3,
                size:pageSize
            }
        },function(data){
            var res=[];
            data.forEach(function(rec,i){
                res.push({val:rec.asset_id,text:rec.asset_name});
            });
            callBack.call(null,{publicArr:res});
        },function(){
            callBack.call(null,{publicArr:[]})
        })
    },
    //个人号
    queryPersonal:function(callBack){
        var perArr=[];
        this.ajax({
                url: API.queryPublic,
                data: {
                    asset_type:1,
                    size:pageSize
                }
            },function(data){
                data.forEach(function(rec,i){
                    perArr.push({val:rec.asset_id,text:rec.asset_name});
                });
                    callBack.call(null,{perArr:perArr})
            },
            function(){
                callBack.call(null,{perArr:perArr})
            })
    },
    querySaveCurrentGroup:function(callBack){
        this.ajax({
            url: API.queryAudience,
            data: {
                size:pageSize
            }
        },function(data){
            var res=[];
            data.forEach(function(rec,i){
                res.push({val:rec.audience_list_id,text:rec.audience_list_name});
            });
            callBack.call(null,{segmentArr:res});
        },function(){
            callBack.call(null,{segmentArr:[]})
        })
    },
    querySendH5:function(callBack){//发送h5
        var imgTextArr=[],publicArr=[],perArr=[];
        $.when(
            this.ajax({
                url: API.queryImgtext,
                data: {
                    type:1,//0:微信图文,1:H5图文,2:全部(默认)
                    size:pageSize
                }
            }),this.ajax({
                url: API.queryPublic,
                data: {
                    asset_type:3,
                    size:pageSize
                }
            }),this.ajax({
                url: API.queryPublic,
                data: {
                    asset_type:1,
                    size:pageSize
                }
            }))
            .done(function(a1,a2,a3){
                if (isAvailable(a1[0])) {
                    //imgtext_id  图文id imgtext_name  图文名称,Title
                    a1[0].data.forEach(function(rec,i){
                        imgTextArr.push({val:rec.imgtext_id,text:rec.imgtext_name});
                    });
                }
                if (isAvailable( a2[0])) {
                    a2[0].data.forEach(function(rec,i){
                        publicArr.push({val:rec.asset_id,text:rec.asset_name});
                    });
                }
                if (isAvailable( a3[0])) {
                    a3[0].data.forEach(function(rec,i){
                        perArr.push({val:rec.asset_id,text:rec.asset_name});
                    });
                }
                callBack.call(null,{publicArr:publicArr,imgTextArr:imgTextArr,perArr:perArr});
            })
            .fail(function(){
                callBack.call(null,{publicArr:publicArr,imgTextArr:imgTextArr,perArr:perArr});
            });
    }

};
module.exports = loader;

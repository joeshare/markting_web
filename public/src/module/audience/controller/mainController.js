/**
 * Created by AnThen on 2016-11-8.
 */
'use strict';
require('../utils/jQuery.md5');
let Modals = require('component/modals.js');
let modalsTpl = require("../tpl/modal-tpl.html");
var relTagTpl = require('../tpl/rel-tag.html');
let formatter = require("../utils/formatter");
let REL_TAG_NAMS=[];
let msg1='受众标签人群至少有一个，才可生效';
let msg2='受众标签人群至少有一个，才可保存';
let msg3='受众标签人群至少有一个，才可编辑';
var API = {
    saveSegmentInfo: "?method=mkt.segment.creupdate",
    querySegmentInfo: "?method=mkt.segment.detail.get",//查询主体信息
    updateHeaderInfo: "?method=mkt.segment.header.update",
    updateRelTags: "?method=mkt.segment.tag.update",//增加或修改受众细分关联的标签
    queryRelTags: "?method=mkt.segment.tag.get",//查询众细分关联的标签
    querySysParams:"?method=mkt.taggroup.limit.get"//获取系统参数
};
function getDateStr() {
    var date = new Date(); //日期对象
    var now = "";
    now = date.getFullYear() + "-";
    now = now + (date.getMonth() + 1) + "-";
    now = now + date.getDate() + " ";
    now = now + date.getHours() + ":";
    now = now + date.getMinutes() + ":";
    now = now + date.getSeconds() + "";
    return now;
}
function errorAlertMsg(msg) {
    new Modals.Alert(msg||"数据获取失败！");
}
function successMsg(msg){
    Materialize.toast(msg||"保存成功！", 3000)
}
function errorMsgByStatus(status){
    if(status==2){
        errorAlertMsg("活动中无法编辑！");
    }else if(status==1){
        errorAlertMsg("生效失败，您可保存信息！");
    }else if(status==0){
        errorAlertMsg("取消生效失败！");
    }else{
        errorAlertMsg("操作失败！");
    }

}
//渲染已有关联标签
function renderTagsRel(data) {
    console.log(data)
    var h = _.template($(relTagTpl).filter('#rel-tag').html())({data: data});
    $('#tag-wrap').append(h);
    data.forEach(function (itm, i) {
        REL_TAG_NAMS.push(itm.tag_name);
    })
}
//增加标签
function addTag() {
    var val = $('#tag-name').val();
    if ($.trim(val)) {
        var html = '<div class="segment-tag" attr-name="' + val + '">' + val + '<i class="icon iconfont rui-close">&#xe608;</i></div>';
        if (!formatter.isSameName(REL_TAG_NAMS, val)) {
            $('#tag-wrap').append(html);
            formatter.setTagData(REL_TAG_NAMS, val);
        }

    }

}

//绑定键盘事件
function bindKeydown(type) {
    if (type) {
        document.onkeydown = function (e) {
            e = e || window.event;
            if ((e.keyCode || e.which) == 13) {
                addTag();
            }
        }
    } else {
        document.onkeydown = null;
    }
}
class controller {
    constructor(view) { //构造函数
    }

    /**
     *  比较新旧数组(group.tag_list)是否相等，如果相等返回true,否则返回false
     * @param oldData
     * @param newData
     * @returns {boolean}
     */
    isSameGroupData(oldData,newData){
        let f=false;
        console.log('oArr',JSON.stringify(oldData))
        console.log('nArr',JSON.stringify(newData))
        if(oldData&&newData&&Array.isArray(oldData.tag_list)&&Array.isArray(newData.tag_list)){
            let oArr= oldData.tag_list.filter((x)=>{
                return Array.isArray(x.tag_value_list)&&!!x.tag_value_list.length;
            });
            let nArr= newData.tag_list.filter((x)=>{
                return Array.isArray(x.tag_value_list)&&!!x.tag_value_list.length;
            })
            console.log('oArr filter',JSON.stringify(oArr))
            console.log('nArr filter',JSON.stringify(nArr))
            f=this.isSame(JSON.stringify(oArr),JSON.stringify(nArr));
        }
        return f;
    }
    isSame(s1,s2){
        return $.md5(s1)==$.md5(s2);
    }

    /**
     * 是否进行生效操作 (必须有个一标签)
     * @param view
     * return Boolean
     */
    isEffectAction(view,msg){
        console.log('isEffectAction')
        let segmentlData= view.getSegmentInfo();
        let filter_groups= segmentlData.filter_groups;
        let flag=true;
        if(Array.isArray(filter_groups)&&filter_groups.length){
            flag=!filter_groups.every((group,i)=>{
                console.log('isEffectAction',group.tag_list)
                if(Array.isArray( group.tag_list)&& group.tag_list.length){
                    return group.tag_list.every((tag,i)=>{
                        return !(Array.isArray( tag.tag_value_list)&&tag.tag_value_list.length);
                    });
                }else{
                    return true;
                }
            })
        }else{
            flag=false;
        }
        if(!flag){
            errorAlertMsg(msg);
        }
        return flag;


    }
    /**
     *
     * @param id
     * @param name
     * @param status
     * @param view
     */
    saveHeaderInfo(id,name,status,view){
        let _this=this;
        if(id){
            this.updateHeaderAction(id,name,status,function(res){
                  //{"code":0,"msg":"success","total":0,"data":[],"date":"2016-11-10","total_count":0,"col_names":[]}
                  if(res&&!res.code){
                      view.setState({
                          "updatetime": res.date,
                          "segment_name":name,
                          "publish_status":status
                      })
                  }else{
                      errorAlertMsg("操作失败！")
                  }
            })
        }else{
            this.saveAction(id,name,status,view,function(res){
                _this.saveActionCallBack(res,name,status,view);
            })
        }
    }
    updateSegmentInfo(id,status,view){
        if(status&&!this.isEffectAction(view,msg1)){
            return;
        }
        if(id){
            this.saveHeaderInfo(id,view.segmentData.segment_name,status,view)
        }else{
            this.editSegmentTitle(id,status,view)
        }
    }
    saveSegmentInfo(id,status,view) {
        let _this=this;
        if(!this.isEffectAction(view,msg2)){
            return;
        }
        if(id){
            this.saveAction(id,view.segmentData.segment_name,status,view,function(res){
                _this.saveActionCallBack(res,view.segmentData.segment_name,status,view);
            })
        }else{
            this.editSegmentTitle(id,status,view)
        }
    }
    updateHeaderAction(id,name,status,callBack){
        util.api({
            url: API.updateHeaderInfo,
            type: 'post',
            data: {
                "segment_head_id": id,
                "segment_name": name,
                "publish_status": status||0
            },
            success: function (res) {
                callBack&&callBack(res);
            },
            error: function (res) {
                errorAlertMsg("操作失败！")
            }
        })
    }
    //保存受众细分数据回调
    saveActionCallBack(res,name,status,view){
        /**
         *  {
                    "code": 0,
                    "msg": "success",
                    "total": 1,
                    "data": [{
                        "oper": "Mock_奥巴马",
                        "id": 91,
                        "updatetime": "2016-11-02 15:50:47"
                    }],
                    "date": "2016-11-02",
                    "total_count": 1,
                    "col_names": []
                }
         */
        console.log("saveActionCallBack",res)
        if(res&&!res.code&&Array.isArray(res.data)&&res.data.length){
            let rec=res.data[0];
            let state={"oper": rec.oper,
                "id": rec.id,
                "updatetime": rec.updatetime,
                "segment_head_id": rec.id,
                "segment_name": name
            }
            if(status){
                state.publish_status=status;
            }
            view.setState(state,()=>{successMsg("保存成功！")})
        }else{
            errorAlertMsg("操作失败！")
        }
    }
    //保存/新建信息
    saveAction(id,name,status,view,callBack){
        let segmentInfo=view.getSegmentInfo();
        if(!id){
            delete segmentInfo['segment_head_id'];
        }
        if(status){
            segmentInfo.publish_status=status;
        }
        if(name){
            segmentInfo.segment_name=name;
        }
        formatter.transformerSaveData(segmentInfo);

        util.api({
            url: API.saveSegmentInfo,
            type: 'post',
            data: segmentInfo,
            success: function (res) {
                if (res && res.code == 0) {
                    if(callBack){
                        callBack(res);
                    }else{
                        successMsg("保存成功！");
                    }
                }else if(res && res.code == 3003){//活动中的细分无法编辑 错误码是 3003
                    errorAlertMsg("活动中无法操作！");
                }else if(res && res.code == 6001){
                    errorAlertMsg(res.msg);
                } else {
                    errorAlertMsg('保存失败！');
                }
            },
            error: function (res) {
                errorAlertMsg("保存失败！");
            }
        })
    }
    editSegmentTitle(id,status,view){
        let _this=this;
        if(!this.isEffectAction(view,msg3)){
            return;
        }
        let name=view.segmentData.segment_name;
        var win=new Modals.Window({
            id: "modals-edit",
            title: '细分信息编辑',
            content: _.template($(modalsTpl).filter('#tpl-modal-edit').html())({ name: name || ""}),
            width: 384,
            buttons: [{
                text: '保存', handler: function (thiz) {
                    var name = $('#audience-name').val();
                    !$.trim(name) && (name = '未命名-'+getDateStr());
                    _this.saveHeaderInfo(id,name,status,view);
                    thiz.close();
                }
            }, {
                text: '取消', cls: 'decline', handler: function (thiz) {
                    thiz.close();
                }
            }],
            listeners: {
                afterRender: function (thiz) {
                },
                close: function (thiz) {
                    $("#modals-edit").remove();
                    win=null;
                }
            }
        })
    }
    querySegmentInfo(id,cb){
        util.api({
            url: API.querySegmentInfo,
            data: {
                "id": id
            },
            success: function (res) {
                // console.info('bigJSON',res)
                cb&&cb(res)
            },
            error: function (res) {
                errorAlertMsg("获取数据失败！");
            }
        })
    }
    querySegmentSysParams(cb){
        util.api({
            url: API.querySysParams,
            success: function (res) {
                cb&&cb(res)
            },
            error: function (res) { console.info(res)
                cb&&cb({
                    "code": 0,
                    "data": [ {
                            group_limit:5,
                            tag_limit:5
                        }]
                })
            }
        })
    }
    //保存标签
     updateRelTagsAction(id) {
        util.api({
            url: API.updateRelTags,
            type: 'post',
            data: {
                segment_head_id: id,
                tag_names: REL_TAG_NAMS
            },
            success: function (res) {
                if (res && res.code == 0) {
                    successMsg();
                } else {
                    errorAlertMsg("保存失败！");
                }
            },
            error: function (res) {
                errorAlertMsg("保存失败！");
            }
        })
    }
    //查询标签
    queryRelTags(id,callBack) {
        let _this=this;
        id&&util.api({
            url: API.queryRelTags,
            type: 'get',
            data: {
                segment_head_id: id
            },
            success: function (res) {
                if (res && res.code == 0 && res.data && res.data.length) {
                    callBack.call(_this, res.data);
                }
            },
            error: function (res) {
                //errorAlertMsg();
            }
        })
    }
    editRelateTag(id){
        let _this=this;
        new Modals.Window({
            id: "aud-tag-edit-window",
            title: '细分人群标签',
            content: _.template($(modalsTpl).filter('#tpl-modal-shuqian').html()),
            width: 384,
            events: {
                click: function (e) {
                    if (e.$target.hasClass('rui-close')) {
                        var p = e.$target.parent();
                        formatter.delDataInArr(REL_TAG_NAMS, p.attr('attr-name'));
                        p.remove();
                    }
                }
            },
            buttons: [{
                text: '保存', cls: 'accept', handler: function (thiz) {
                    _this.updateRelTagsAction(id);
                    thiz.close();
                }
            }, {
                text: '取消', cls: 'decline', handler: function (thiz) {
                    thiz.close();
                }
            }],
            listeners: {
                open: function (thiz) {
                    bindKeydown(true);
                    _this.queryRelTags(id,renderTagsRel)
                },
                close: function () {
                    bindKeydown(false);
                }
            }
        })
    }



}

module.exports = controller;
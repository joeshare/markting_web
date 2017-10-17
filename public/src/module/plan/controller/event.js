/**
 * Created by AnThen on 2017-1-19.
 */

'use strict';
var TipsUtils = require('../utils/tips-utils.js');
var layer = require('plugins/layer.js');//弹窗插件
var Modals = require('component/modals.js');
var MockData= require('../mock/mock.js');
let materialRepeatMsg="该短信素材已经占用，请重选。";
function errorAlertMsg(msg) {
    new Modals.Alert(msg || "数据获取失败！");
}
export default function EvntObject(api,controller){
    this.api=api;
    const _mainController=controller;
    //==========
    //private function
    //==========
    function _segementGroupSelectFocus(dom,evt){
        var content= $('#segement-group-select-content');
        var Left= dom.offsetLeft;
        var Top= dom.offsetTop;
        content.css({
            position:'absolute',
            left:Left,
            top:Top+35,
            display:'block',
            opacity:1
        }).show()
    };
    function _fixGroupSelectClick(dom,evt){
        var content= $('#fix-group-select-content');
        var Left= dom.offsetLeft;
        var Top= dom.offsetTop;
        content.css({
            position:'absolute',
            left:Left,
            top:Top+35,
            display:'block',
            opacity:1
        }).show()
    };
    function  _planMatchTagSearchFocus(dom,evt){
        var content= $('#label-judgment-tag-search-content');
        var Left= dom.offsetLeft;
        var Top= dom.offsetTop;
        content.css({
            position:'absolute',
            left:Left,
            top:Top+35,
            display:'block',
            opacity:1
        });
        _planMatchTagSearchSuggest(dom,evt)
    };
    function  _planMatchTagSearchClear(dom,evt){
        var $input= $('#label-judgment-tag-search-input');
        var content= $('#label-judgment-tag-search-content');
        $input.val("");
        $(dom).hide();
        content.hide().html("");
    };

    function _planMatchTagSearchSuggest(dom,evt){
        var name=$.trim(dom.value);
        var mainController=_mainController;
        var $clear=$('#label-judgment-tips .clear-ico');
        if(!name){
            _planMatchTagSearchClear($clear[0]);
            return;
        }else{
            $clear.show();
        }
        util.api({
            url:api.queryMatchTag,
            data: {
                name: name
            },
            success: function (res) {
                if (res.code != 0)return;
                var systemTagArr=[],customTagArr=[];
                if (res.data&&res.data.length) {
                    var $content=$('#label-judgment-tag-search-content');
                    if(res.data&&res.data.length){
                        var o=res.data[0];
                        //{
                        //    "tag_id": "lyL0qutY",
                        //    "tag_name": "人口属性市",
                        //    "tag_path": "用户属性>地理区域>",
                        //    "tag_value": "上海市",
                        //    "tag_value_seq": "lyL0qutY_1"
                        //}
                        if(o.system_tag&&o.system_tag.length){//系统标签
                            o.system_tag.forEach((rec,i)=>{
                                systemTagArr.push({
                                    val:rec.tag_value_seq,
                                    path:rec.tag_path,
                                    text:rec.tag_name+"-"+rec.tag_value});
                            })

                        }
                        var systemTotalCount=o.system_total_count;
                        //{
                        //    "custom_tag_id": "p7dIdVs6TP1483954957293",
                        //    "custom_tag_name": "火星",
                        //    "tag_path": "太阳系>",
                        //    "custom_tag_category_id": "BulUGcgLOt1483518681313",
                        //    "custom_tag_category_name": "未分类"
                        //}
                        if(o.custom_tag&&o.custom_tag.length){//自定义标签
                            o.custom_tag.forEach((rec,i)=>{
                                customTagArr.push({
                                    val:rec.custom_tag_id,
                                    path:rec.tag_path,
                                    text:rec.custom_tag_name});
                            })
                        }
                        var customTotalCount=o.custom_total_count;
                    }
                }
                $content.html(mainController.getTpl(mainController.tpls.suggestTpl, "#match-tag-suggest", {systemTotalCount,systemTagArr,customTotalCount,customTagArr})).show();
            },
            error:function(res){
                console.log('error');
            }
        });
    }



    function hideDom(selecter){
        $(selecter).is(":visible")&&$(selecter).hide();
    }
    function _bindWindowEvnt(){
        //发送微信图文
        window.planSendImgPublicSelectOnChange=_sendImgPublicSelectOnChange;
        window.planSendImgSelectFocus= _suggestHandler;
        window.planSendImgSelect=_suggestHandler;
        window.planSendImgSelectChange=(dom,evt)=>{
            $('#send-img-img-select-val').val("")
        };
        //发送短信
        window.planSendSMSTypeSelectOnChange=_planSendSMSTypeSelectOnChange;
        window.planSendSMSMaterialSelectFocus= _suggestSMSMaterialHandler;
        window.planSendSMSMaterialSelect=_suggestSMSMaterialHandler;
        window.planSendSMSMaterialSelectChange=(dom,evt)=>{
            $('#send-sms-material-val').val("")
        };
        //触发事件

        window.planEventSelectFocus= _suggestEventHandler;
        window.planEventSelect=_suggestEventHandler;

        //细分人群
        window.segementGroupSelectFocus= _segementGroupSelectFocus;
        //固定人群
        window.fixGroupSelectClick= _fixGroupSelectClick;
        //匹配标签
        window.planMatchTagSearchFocus= _planMatchTagSearchFocus;
        window.planMatchTagSearchSuggest= _planMatchTagSearchSuggest;
        window.planMatchTagSearchClear= _planMatchTagSearchClear;
    }
    function _bindLayerCloseEvnt(){
        let _this=_mainController;
        $('#container').on('click', function (e) {
            var currentTipsType=_this.getCurrentTipsType();
            if (currentTipsType) {
                var data = TipsUtils.getDataByType(currentTipsType, "#" + currentTipsType + "-tips"),
                    currentNodeId=_this.getCurrentNodeId();
                if(currentTipsType=='send-img'){
                    if(!$('#send-img-img-select-val').val()){
                        data['img_text_asset_name']="";
                        data['desc']="";
                    }
                }else if(currentTipsType=='send-sms'){
                    if(!$('#send-sms-material-val').val()){
                        data['material_name']="";
                        data['desc']="";
                    }
                }
                _this.setNodeDataByType(currentNodeId, currentTipsType, data);
                _this.setNodeInfo({
                    id: currentNodeId,
                    info: data
                })
            }
            _this.setCurrentTipsType(null);
            if(window.LAYERINDEX){//验证节点info 信息是否合法
                //var info=window.CURRENT_NODE_JQ.data("data");
                // console.log("info",info)
                //var res=validator.nodeDataValidity({
                //    code:window.CURRENT_NODE_JQ.attr("attr-item-type"),
                //    info:info
                //})
                //console.log("info res",res)
                //window.CURRENT_NODE_JQ.removeClass('error').addClass(res.isValidity?"":"error");
                window.CURRENT_NODE_JQ=null;
                window.LAYERINDEX=null;
            }
            layer.closeAll();
            //if(window.LAYERINDEX){
            //    console.log(window.LAYERINDEX)
            //    layer.close(window.LAYERINDEX)
            //}else{
            //    layer.closeAll();
            //}
        })
    }


    function _suggestHandler(dom,evt){
        var val = dom.value||"";
        var mainController=_mainController;
        var content= $('#send-img-img-select-content');
        var recentlyEl = content.find('.nodata');
        var feedlistEl = content.find('.search-feeds');
        let public_id=$('#send-img-public-select').val();
        content.show();
        util.api({
            url:api.queryImgtext,
            data: {
                pub_id:public_id,
                name: val
            },
            success: function (res) {
                if (res.code != 0)return;
                if (_.isEmpty(res.data)) {
                    recentlyEl.show();
                    feedlistEl.hide();
                } else {
                    let imgTextArr=[];
                    res.data.map(rec=> {
                        imgTextArr.push({val:rec.imgtext_id,text:rec.imgtext_name,url:FILE_PATH+rec.imgfile_name});
                    });
                    feedlistEl.html(mainController.getTpl(mainController.tpls.activityTpl, "#send-img-dropdown-content", {imgTextArr:imgTextArr}));
                    recentlyEl.hide();
                    feedlistEl.show();
                }
            },
            error:function(res){
                console.log('error')
            }
        });
        var Left= dom.offsetLeft;
        var Top= dom.offsetTop;
        $('#send-img-img-select-content').css({
            position:'absolute',
            left:Left,
            top:Top+35,
            display:'block',
            opacity:1
        })
    };
    function _sendImgPublicSelectOnChange(dom,evt){
        $('#send-img-img-select-content').hide();
        $('#send-img-img-select-val').val("");
        $('#send-img-img-select').val("");
        let asset_id="";
        $(dom).children('option').each((i,o)=>{
            var $tar=$(o);
            asset_id=$tar.val()==dom.value?$tar.attr('data-asset-id'):"";
        })
        $('#send-img-public-val').val(asset_id)
    }
    //发送短信类型选择
    function _planSendSMSTypeSelectOnChange(dom,evt){
        $('#send-sms-material-select-content').hide();
        $('#send-sms-material-val').val("");
        $('#send-sms-material-select').val("");
    };
    //发送短信素材suggest
    function _suggestSMSMaterialHandler(dom,evt){
        var val = $.trim(dom.value);
        var  content= $('#send-sms-material-select-content'),
         mainController=_mainController,
         recentlyEl = content.find('.nodata'),
         feedlistEl = content.find('.search-feeds'),
         sms_type_id=$('#send-sms-type-select').val();
        util.api({
            url:api.querySMSMaterial,
            data: {
                sms_material_name:val,
                channel_type:sms_type_id*1
            },
            success: function (res) {
                if (res.code != 0)return;
                if (_.isEmpty(res.data)) {
                    recentlyEl.show();
                    feedlistEl.hide();
                } else {
                    let materialArr=[];
                    res.data.map(rec=> {
                        materialArr.push({val:rec.sms_material_id,text:rec.sms_material_name});
                    });
                    feedlistEl.html(mainController.getTpl(mainController.tpls.activityTpl, "#send-sms-dropdown-content", {materialArr}));
                    recentlyEl.hide();
                    feedlistEl.show();
                }
            },
            error:function(res){
                console.log('error');
                recentlyEl.show();
                feedlistEl.hide();
            }
        });
        var Left= dom.offsetLeft;
        var Top= dom.offsetTop;
        $('#send-sms-material-select-content').css({
            position:'absolute',
            left:Left,
            top:Top+35,
            display:'block',
            opacity:1
        }).show();
    };



    //触发事件选择
    function _suggestEventHandler(dom,evt){

        var val = $.trim(dom.value);
        var  content= $('#event-select-content'),
            mainController=_mainController,
            recentlyEl = content.find('.nodata'),
            feedlistEl = content.find('.search-feeds');
        util.api({
            surl:EVENT_PATH +api.queryeventModellist,
            data: {
            },
            success: function (res) {
                if (res.code != 0)return;
                if (_.isEmpty(res.data)) {
                    recentlyEl.show();
                    feedlistEl.hide();
                } else {
                    let eventArr=[];
                    res.data.map(rec=> {
                        eventArr.push({val:rec.id,text:rec.name,code:rec.code,source:rec.source});
                    });

                    feedlistEl.html(mainController.getTpl(mainController.tpls.triggerTpl, "#event-dropdown-content", {eventArr}));
                    recentlyEl.hide();
                    feedlistEl.show();
                }
            },
            error:function(res){
                console.log('error');
                recentlyEl.show();
                feedlistEl.hide();
            }
        });
        var Left= dom.offsetLeft;
        var Top= dom.offsetTop;
        $('#event-select-content').css({
            position:'absolute',
            left:Left,
            top:Top+35,
            display:'block',
            opacity:1
        }).show();
    };


    //判断短信素材是否被占用
    function _isOccupySMSMaterial(id,callBack){
        util.api({
            url:api.queryMaterialUsed,
            data: {
                sms_material_id:id
            },
            success: function (res) {
                if(res&&!res.code&&res.data&&res.data.length&&(res.data[0].flag==false)){
                    callBack&&callBack(res);
                }else{
                    errorAlertMsg(materialRepeatMsg);
                }
            },
            error:function(res){
                console.log('error')

            }
        });
    }
    //标签判断时的添加标签
    function _judgmentAddTag(val,name,type){
        if($.trim(val)){
            var html= '<div class="active-tag" attr-val="'+val+'" attr-type="'+type+'" attr-name="'+name+'">'+name+'<i class="icon iconfont active-tag-close">&#xe608;</i></div>';
            var $tags = $("#label-judgment-tag-content .active-tag"),tempArr=[];
            if($tags[0]){
                $tags.each(function(i){
                    var $tar=$(this);
                    tempArr.push($tar.attr('attr-name'));
                })
                if(tempArr.indexOf(name)<0){
                    $('#label-judgment-tag-content').append(html);
                }
            }else{
                $('#label-judgment-tag-content').html(html);
            }

        }

    }


    //绑定window事件
    this.bindWindowEvnt=()=>{
        _bindWindowEvnt.call(this);
    };
    //点击非弹窗区域关闭弹窗
    this.bindLayerCloseEvnt=(e)=>{
        _bindLayerCloseEvnt.call(this);
    }
    //节点tips事件及body事件
    this.nodeTipsClick=(e)=>{
        var $tar = $(e.target);
        //发送微信图文
        if ($tar.hasClass("send-img-dropdown-content-li")) {
            $('#send-img-img-select-val').val($tar.attr('data-val'))
            $('#send-img-img-select').val($tar.text())
        }
        if (e.target.id != 'send-img-img-select') {
            $('#send-img-img-select-content').hide();
            if(!$('#send-img-img-select-val').val()){
                $('#send-img-img-select').val('')
            }
        }
        //===============
        //发送短信
        if ($tar.hasClass("send-sms-dropdown-content-li")) {
            var materialId=$tar.attr('data-val');
            _isOccupySMSMaterial(materialId,function(){
                if(_mainController.isRepeatMaterialById(materialId,_mainController.getCurrentNodeId())){
                      errorAlertMsg(materialRepeatMsg)
                }else{
                    $('#send-sms-material-val').val(materialId)
                    $('#send-sms-material-select').val($tar.text())
                }
            })
        }
        if (e.target.id != 'send-sms-material-select') {
            $('#send-sms-material-select-content').hide();
            if(!$('#send-sms-material-val').val()){
                $('#send-sms-material-select').val('')
            }
        }

        //===============
        //触发事件
        if ($tar.hasClass("event-content-left")||$tar.hasClass("event-content-right")) {
            var eventId=$tar.attr('data-val');
            var eventCode=$tar.attr('data-code');
            var eventtext=$tar.attr('data-text');
            $('#event-val').val(eventId);
            $('#event-code').val(eventCode);
            $('#event-trigger-select').val(eventtext);

        }
        if (e.target.id != 'event-trigger-select') {
            $('#event-select-content').hide();
            if(!$('#event-val').val()){
                $('#event-trigger-select').val('')
                $('#event-code').val('')
            }
        }

        //===============
        //细分人群
        if ($tar.hasClass("segement-group-dropdown-content-li")) {
            $('#segement-group-select-val').val($tar.attr('data-val'))
            $('#segement-group-select-text').text($tar.find('.segement-group-content-li-text').text())
        }else if($tar.hasClass('segement-group-content-li-text')){
            $('#segement-group-select-val').val($tar.parent().attr('data-val'))
            $('#segement-group-select-text').text($tar.text())
        }else if($tar.hasClass('segement-group-content-li-count')){
            $('#segement-group-select-val').val($tar.parent().attr('data-val'))
            $('#segement-group-select-text').text($tar.parent().find('.segement-group-content-li-text').text())
        }
        if(e.target.id !='segement-group-select-text'){
            hideDom('#segement-group-select-content');
        }

        //===============
        //细分人群
        if ($tar.hasClass("fix-group-dropdown-content-li")) {
            $('#fix-group-select-val').val($tar.attr('data-val'))
            $('#fix-group-select-text').text($tar.find('.fix-group-content-li-text').text())
        }else if($tar.hasClass('fix-group-content-li-text')){
            $('#fix-group-select-val').val($tar.parent().attr('data-val'))
            $('#fix-group-select-text').text($tar.text())
        }else if($tar.hasClass('fix-group-content-li-count')){
            $('#fix-group-select-val').val($tar.parent().attr('data-val'))
            $('#fix-group-select-text').text($tar.parent().find('.fix-group-content-li-text').text())
        }
        if(e.target.id !='fix-group-select-text'){
            hideDom('#fix-group-select-content');
        }
        //===============
        //判断标签
        if($tar.hasClass("label-judgment-dropdown-content-li")){
            var val=$tar.attr('data-val'),
                name=$tar.attr('data-name'),
                type=$tar.attr('data-type');
            $('#label-judgment-tag-search-input').val($tar.attr('data-name'));
            _judgmentAddTag(val,name,type);
        }
        if(e.target.id !='label-judgment-tag-search-input'){
            hideDom('#label-judgment-tag-search-content');
        }
    }
}
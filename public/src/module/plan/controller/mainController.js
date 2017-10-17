/**
 * Author LLJ
 * Date 2016-5-3 9:33
 */
var formatter = require('../utils/formatter');
var nodeTpl = require('../tpl/node-tpl.html');
var modalTpls = require('../tpl/modal-tpl.html');
var tooblarTpls = require('../tpl/toolbar.html');
var Modals = require('component/modals.js');
var nodeFormatter = require('../utils/node-formatter.js');
var NodeDataModel = require('../model/nodeDataModel.js');
var validator= require('../utils/validator.js');
var layer = require('plugins/layer.js');//弹窗插件
var isDraw = false;
var drawOriginal = {};
var startNode = null;
var currentDrawLineType = "output-dot";//output ,yes-output-dot,no-output-dot
var DRAWTYPE = 'curveTriangle';
var currentTipsType = null;
var currentNodeId = null;
var TipsUtils = require('../utils/tips-utils.js');
var dateTime = require('../utils/dateTime.js');
var activityTpl = require('../tpl/activity-tpl.html');
var triggerTpl = require('../tpl/trigger-tpl.html');
var suggestTpl = require('../tpl/suggest-tpl.html');
var API = {
    createHeaderInfo: "?method=mkt.campaign.header.create",
    updateHeaderInfo: "?method=mkt.campaign.header.update",
    queryHeaderInfo: "?method=mkt.campaign.header.get",
    queryMenu: "?method=mkt.campaign.nodeitem.list.get",
    queryMainInfo: "?method=mkt.campaign.body.get",
    saveMain: "?method=mkt.campaign.body.update",
    manualStart:"?method=mkt.campaign.manual.start",//手动开启
    saveAudience:"?method=mkt.campaign.node.audience.save",//保存人群
    getAudience:"?method=mkt.dataanalysis.audiences.get",//查询参与分析的人群对应人群的ID
    searchAudience:"mkt.campaign.body.item.audience.search",//右侧人员搜索
    queryMatchTag:"?method=mkt.tag.campaign.fuzzy.list",//匹配标签

    queryeventModellist:"?method=mkt.event.eventModel.list",    //事件列表
    queryImgtext:"?method=mkt.asset.imgtext.campaign.get",//微信图文
    querySMSMaterial:"?method=mkt.sms.material.get",//短信素材
    queryMaterialUsed:"?method=mkt.sms.material.usestatus.get"//查询短信素材是否被占用
};
window.CURRENT_CAMPAIGN_ID=null;
var current_status = 0;
var DEFAULTURL = BASE_PATH + '/html/activity/plan-iframe.html';
var GROUPURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
var triggleURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';
var tagerGroupURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
//自动设置位置坐标
var autoPost={};
window.saved_nodes_data_str="";
window.old_iframe_url='';
var headerInfo={};
var REPEAT_MATERIAL_MSG="活动中不能出现重复短信素材";

import EvntObject from './event.js';



//url String
//userIds Array
//url  String
//iframeName  String
//postData  String
function postIframeData(url, iframeName, postData) {
    var $input = $('<input name="postData" type="hidden" />').val(postData);
    var $form = $('<form style="position:absolute;top:-1200px;left:-1200px;" action="' + url + '" method="POST" target="'+iframeName+'"></form>').appendTo(document.body);
    $form.append($input).submit();
}

function successMsg(msg){
    Materialize.toast(msg||"保存成功！", 3000)
}
function errorAlertMsg(msg) {
    new Modals.Alert(msg || "数据获取失败！");
}
function getDateStr() {
    return dateTime.getDateTimeStr();
}
function save2Storage(v) {
    window.localStorage.setItem("planNodesData", JSON.stringify(v));
}

function page2MsgWin(handler){
    var newDataStr=JSON.stringify(NodeDataModel.getAll());
    if(!validator.isSame(saved_nodes_data_str,newDataStr)){

    }else{
        handler&&handler();
    }
}

function thousandbit(num) {
    return num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}
function controller() {
    var events = {};
    var _this = this;
    //建立模板对象
    _this.tpls={
        suggestTpl,
        activityTpl,
        triggerTpl
    };
    let Evnt=new EvntObject(API,_this);
    //展示Bas 数据
    function showBas(id,url){
        util.api({
            url: API.getAudience,
            data: {
                audience_type: 0,//0-细分人群 1-固定人群
                audience_ids:id//string 人群ID为0。多个用逗号分隔
            },
            success: function (res) {
                if (res && res.code == 0&&res.data) {
                    _this.changeChart(url);
                    util.postIframeData(url,'plan-bas-con', JSON.stringify({userIds:res.data}))
                }else{
                    _this.changeChart(DEFAULTURL);
                }
            },
            error: function (res) {
                _this.changeChart(DEFAULTURL);
            }
        })
    }
    //手动开始活动
    function manualStart(){
        if(current_status==1){
            util.api({
                url: API.manualStart,
                type: 'post',
                data: {
                    campaign_head_id: CURRENT_CAMPAIGN_ID
                },
                success: function (res) {
                    if (res && res.code == 0) {
                        successMsg("手动开启成功！");
                    }else if(res && res.code == 3006){//未发布状态不能手动开启
                        errorAlertMsg("请先以发布状态保存该活动！");
                        showManualTriggerBtn(false);
                    } else {
                        errorAlertMsg("操作失败！");
                    }
                },
                error: function (res) {
                    errorAlertMsg("操作失败！");
                }
            })
        }else{
            errorAlertMsg("请先以发布状态保存该活动！");
        }

    }
    //打开BAS
    function openMacketBAS(){
        var $openMacket=$('#openMacket');
        $openMacket.is(":visible")&&$openMacket.click();
    }
    function btnDisabled($btn,type){
        if(type){
            !$btn.hasClass("rui-hidden")&&$btn.addClass("rui-hidden");
        }else{
            $btn.removeClass("rui-hidden");
        }
    }
    function btnShow($btn,type){
        type?$btn.show():$btn.hide();
    }
    //保存按钮是否置灰
    function saveBtnDisabled(type){
        btnDisabled($("#plan-save"),type)
    }
    //编辑按钮是否置灰
    function editBtnDisabled(type){
        btnDisabled($("#plan-edit"),type);
    }
    function startBtnDisabled(type){
        btnDisabled($("#plan-start"),type);
    }
    function stopBtnDisabled(type){
        btnDisabled($("#plan-stop"),type);
    }
    function cancelStartBtnDisabled(type){
        btnDisabled($("#plan-cancel-start"),type);
    }
    function startBtnShow(type){
        btnShow($("#plan-start"),type);
    }
    //终止
    function stopBtnShow(type){
        btnShow($("#plan-stop"),type);
    }
    function cancelStartBtnShow(type){
        btnShow($("#plan-cancel-start"),type);
    }
    function saveBtnShow(type){
        btnShow($("#plan-save"),type);
    }
    function editBtnShow(type){
        btnShow($("#plan-edit"),type);
    }
    //更新的活动
    function updateStatusPlan(id,name,status,callBack){
        util.api({
            url: API.updateHeaderInfo,
            type: 'post',
            data: {
                "campaign_head_id": id,
                "campaign_name": name,
                "trigger_type":getTriggerType(),
                "publish_status": status||0
            },
            success: function (res) {
                if (res && res.code == 0 ) {
                    headerInfo = formatter.headerInfo(res.data[0]) || {};
                    current_status =headerInfo['release'] = status ||0;
                    headerInfo['name'] = name;
                    if (!CURRENT_CAMPAIGN_ID) {//表示新增操作 CURRENT_CAMPAIGN_ID非空表示修改
                        CURRENT_CAMPAIGN_ID = headerInfo.id;
                    }
                    changeCampaignTitle(headerInfo);
                    setStatusByVal(status);
                    successMsgByStatus(status);
                    status==1&&$('#public-header-red-corner').show();
                    callBack&&callBack();
                }else{
                    if(status==null){
                        errorAlertMsg("保存失败！");
                        pageStatusSet("cancelStart");
                    }else{
                        setStatusByCode(res.code)
                    }

                }
            },
            error: function (res) {
                errorAlertMsg("操作失败！");
                saveBtnDisabled(false);
                editBtnDisabled(false);
                setStatusByVal(current_status)
            }
        })
    }
    //创建新的活动
    function createPlan(name,callBack){
        util.api({
            url: API.createHeaderInfo,
            type: 'post',
            data: {
                "campaign_head_id": "",
                "campaign_name": name,
                "trigger_type":hasManualTriggerPlan()?1:0,//预约启动0，手动启动1
                "publish_status": 0
            },
            success: function (res) {
                if (res && res.code == 0 ) {
                    headerInfo = formatter.headerInfo(res.data[0]) || {};
                    current_status =headerInfo['release'] = status ? status : 0;
                    headerInfo['name'] = name;
                    if (!CURRENT_CAMPAIGN_ID) {//表示新增操作 CURRENT_CAMPAIGN_ID非空表示修改
                        CURRENT_CAMPAIGN_ID = headerInfo.id;
                    }
                    changeCampaignTitle(headerInfo);
                    callBack&&callBack();
                }else{
                    errorAlertMsg("操作失败！");
                }
            },
            error: function (res) {
                errorAlertMsg("操作失败！");
                saveBtnDisabled(false);
                editBtnDisabled(false);
                setStatusByVal(current_status)
            }
        })
    }
    //改变活动状态
    function changeStatus(name,status){
        var _status=status;
        var _name=name;
       if(CURRENT_CAMPAIGN_ID){//update
           if(status==1){//
               saveMainInfo(CURRENT_CAMPAIGN_ID,function(){
                   updateStatusPlan(CURRENT_CAMPAIGN_ID,_name,_status,null);
               })
           }else{
               updateStatusPlan(CURRENT_CAMPAIGN_ID,_name,_status,null);
           }
       }else{//create
           createPlan(name,function(){
               saveMainInfo(CURRENT_CAMPAIGN_ID,function(){
                   updateStatusPlan(CURRENT_CAMPAIGN_ID,_name,_status,null);
               })
           })
       }
    }
    function successMsgByStatus(val){
        if(val==1){
            successMsg("启动成功！")
        }else if(val==0){
            successMsg("取消启动成功！")
        }else if(val==2){
            successMsg("活动进行中！")
        }else if(val==3){
            successMsg("终止活动成功！");
        }else if(val==null){
            successMsg("保存成功！");
        }else{
            successMsg("操作成功！");
        }
    }
    function setStatusByVal(val){
        if(val==1){
            pageStatusSet('start');
        }else if(val==0){
            pageStatusSet("cancelStart");
        }else if(val==2){
            pageStatusSet("active");
        }else if(val==3){
            pageStatusSet("stop");
        }else{
            pageStatusSet("cancelStart")
        }
    }
    function setStatusByCode(code,msg){
        if(code == 3004){
            errorAlertMsg("活动已经开始");
            headerInfo['release']=2;
            pageStatusSet("active");
        }else if(code == 3005){
            errorAlertMsg("当前活动已结束");
            headerInfo['release']=3;
            pageStatusSet("stop");
        }else if(code == 3007){
            errorAlertMsg("当前处在未启动中");
            headerInfo['release']=0;
            pageStatusSet("cancelStart")
        }else if(code == 3011){//有短信被占用
            errorAlertMsg(msg);
            headerInfo['release']=0;
            pageStatusSet("cancelStart");
        }else{
            errorAlertMsg("操作失败");
            pageStatusSet("cancelStart")
        }
        changeCampaignTitle(headerInfo);
    }
    //保存主信息
    function saveMainInfo(id,callBack) {
        saved_nodes_data_str=JSON.stringify(NodeDataModel.getAll());

        var nodes = formatter.planTransformSubmitData(NodeDataModel.getAll());
        util.api({
            url: API.saveMain,
            type: 'post',
            data: {
                campaign_head_id: id,
                campaign_node_chain: nodes
            },
            success: function (res) {
                saveBtnDisabled(false);
                editBtnDisabled(false);
                if (res && res.code == 0) {
                    callBack?callBack():successMsg();
                }else if(res.code == 3004||res.code == 3005||res.code == 3007||res.code == 3011){
                    setStatusByCode(res.code,res.msg)
                }else {
                    errorAlertMsg("保存失败！");
                }
            },
            error: function (res) {
                errorAlertMsg("保存失败！");
                saveBtnDisabled(false);
                editBtnDisabled(false);
                setStatusByVal(current_status)
            }
        })
    }
    //保存活动编排数据(创建或修改)
    function saveCampaignInfo(name) {
        if(CURRENT_CAMPAIGN_ID){
            saveMainInfo(CURRENT_CAMPAIGN_ID,function(){
                updateStatusPlan(CURRENT_CAMPAIGN_ID,name,null,null)
            });
        }else{
            createPlan(name,function(){
                saveMainInfo(CURRENT_CAMPAIGN_ID,null);
            })
        }
    }
    //显示手动触发btn
    function showManualTriggerBtn(type){
        var data=formatter.planTransformSubmitData(NodeDataModel.getAll());
        var flag=validator.isManualTriggerPlan(data);
        if(type){
            flag&&$('#plan-manual-trigger').removeClass("rui-disabled");
        }else{
            $('#plan-manual-trigger').addClass("rui-disabled");
        }
    }
    function hasManualTriggerPlan(){
        var data=formatter.planTransformSubmitData(NodeDataModel.getAll());
        return validator.isManualTriggerPlan(data);
    }

    function getTriggerType() {
        var data=formatter.planTransformSubmitData(NodeDataModel.getAll());
        let rtType =0 ;
        if(validator.isManualTriggerPlan(data))
        {rtType=1}
        else if(validator.isEventTriggerPlan(data))
        {
            rtType=3
        }
        return rtType;
    }

    //变换toolbar title
    function changeCampaignTitle(arg) {
        if ($.trim(arg.name)) {
            var html = _.template($(tooblarTpls).filter("#toolbar").html())(arg);
            $('#plan-edit-result').html(html);
        }
    }

    //发布
    function doRelease() {
        $('#plan-edit').hide();
        $('#plan-save').addClass("rui-disabled");
    }
    //type start stop active cancelStart
    function pageStatusSet(type){
        if(type=='start'){//开启
            editBtnShow(false);
            showMenuBar(false);
            saveBtnShow(true);
            saveBtnDisabled(true);
            cancelStartBtnShow(true);
            cancelStartBtnDisabled(false);
            startBtnShow(false);
            nodesDisable(true);
            activeFlowChart(true);
        }else if(type=='stop'){//终止活动
            editBtnShow(false);
            showMenuBar(false);
            saveBtnShow(false);
            startBtnShow(false);
            cancelStartBtnShow(false);
            stopBtnShow(false);
            nodesDisable(true);
            activeFlowChart(true);
        }else if(type=='active'){//活动中
            editBtnShow(false);
            showMenuBar(false);
            saveBtnShow(true);
            saveBtnDisabled(true);
            startBtnShow(false);
            cancelStartBtnShow(false);
            stopBtnShow(true);
            stopBtnDisabled(false)
            nodesDisable(true);
            activeFlowChart(true);
        }else if(type=='cancelStart'){//取消开启
            editBtnShow(true);
            editBtnDisabled(false);
            showMenuBar(true);
            saveBtnShow(true);
            saveBtnDisabled(false);
            cancelStartBtnShow(false);
            startBtnShow(true);
            startBtnDisabled(false);
            nodesDisable(false);
            activeFlowChart(false);
        }
    }

    //页面发布状态设置
    function planReleaseStatusSet(){
        showMenuBar(false);
        saveBtnDisabled(true);
        nodesDisable(true)
    }

    //页面可编辑状态设置
    function planEditStatusSet(){
        showMenuBar(true);
        saveBtnDisabled(false);
        nodesDisable(false);
    }

    function changeAudienceTitle(title) {
        var release = $('#plan-release')[0] && $('#plan-release')[0].checked;
        var name = title || $('#plan-name').val();
        if ($.trim(name)) {
            var dateTime = getDateStr();
            var html = _.template($(tooblarTpls).filter("#toolbar").html())({
                name: name, release: release, dateTime: dateTime,
                oper: ''
            });
            $('#plan-edit-result').html(html);
        }

    };
    //展示菜单BAR
    function showMenuBar(type){
        btnShow(_this.view.$el.find('.menubar'),type);
    }
    //节点是否可编辑
    function nodesDisable(type){
        _this.dragModel.dragDisable(type);
    }
    /**
     * 发布流程图
     * @param release
     */
    function releaseFlowChart() {
        saveBtnDisabled(true);
        editBtnDisabled(true);
        showMenuBar(false);
        nodesDisable(true);
    }

    //展示节点活动
    function activeFlowChart(type) {
        var nodes = _this.view.$el.find(".plan-node");
        if (type) {
            if(nodes[0]&&!$(nodes[0]).hasClass("work")){
                nodes.addClass("work");
            }
        } else {
            nodes.removeClass("work");
        }
    }
    //发布及活动状态展示
    function releaseActiveStatusShow(){
        releaseFlowChart();
        activeFlowChart();
    }
    //获取节点展示数据
    function getNodeShowData(name, desc) {
        return {name: name, desc: desc};
    }

    function getColorByType(type) {
        var obj = {
            trigger: '#3b82c3',
            audiences: '#37baac',
            decisions: '#d98d4f',
            activity: '#ab6ce1'
        };
        return obj[type] || '#3b82c3';
    }

    function getTpl(tpls, selector, data) {
        return _.template($(tpls).filter(selector).html())(data || {});
    }
    //用在event.js中
    this.getTpl=(tpls, selector, data)=>{
        return getTpl(tpls, selector, data);
    }
    //展示或隐藏 主面板内容提示
    this.planMsgShowHide = function () {
        !$('.plan-node')[0]?$('#plan-empty-msg').show():$('#plan-empty-msg').hide();
    };
    //新增临时节点
    this.createTmpNode = function (itm, data) {
        var inner = itm.innerHTML, _this = this, type = _this.getMenuItemData(itm).type;
        var tmp = $('<div></div>').html(inner)
            .addClass(itm.className + " plan-drag tmp-drag dragging " + type)
            .css({'zIndex': 198910180})
            .attr({
                'attr-name': data.name,
                'attr-type': data.type,
                'attr-icon': data.icon,
                'attr-url': data.url,
                'attr-item-type': data.itemType,
                'attr-item_type': data.item_type,
                'attr-node_type': data.node_type
            })
        _this.view.$el.find(".content").append(tmp);
        return tmp;
    };
    //新增流程节点
    this.createFlowNode = function (itm) {
        var data = this.getMenuItemData(itm);
        data.id = new Date().getTime();
        var html = getTpl(nodeTpl, '#node', data);
        var scllTop = this.drawBox.scrollTop,
            scllFelt = this.drawBox.scrollLeft,
            itmRect = itm.getBoundingClientRect(),
            drawBoxRect = this.drawBox.getBoundingClientRect(),
            top = itmRect.top - drawBoxRect.top + scllTop,
            left = itmRect.left - drawBoxRect.left + scllFelt,
            z = itm.style.zIndex
        var node = $(html).css({
            top: top,
            left: left,
            zIndex: z
        })
        this.$drawBox.append(node);
        node.removeClass("dragging");
        NodeDataModel.setNode({
            id: data.id,
            nodeType: data.type,
            itemType: data.itemType,
            'item_type': data.item_type,
            'node_type': data.node_type,
            url: data.url,
            x: left,
            y: top,
            z: itm.style.zIndex
        })

    };
    //菜单节点数据
    this.getMenuItemData = function (itm) {
        var $tag = $(itm);
        return {
            type: $tag.attr('attr-type'),
            name: $tag.attr('attr-name'),
            title: $tag.attr('attr-title'),
            icon: $tag.attr('attr-icon'),
            url: $tag.attr('attr-url'),
            itemType: $tag.attr('attr-item-type'),
            item_type: $tag.attr('attr-item_type'),
            node_type: $tag.attr('attr-node_type'),
            desc: "",
            num: 0
        };
    };
    //限制临时节点位置
    this.limitTmpNodePos = function (tmp) {
        var dbRect = this.drawBox.getBoundingClientRect(),
            drgRect = tmp.getBoundingClientRect(),
            left = Math.max(drgRect.left - dbRect.left, 0),
            top = Math.max(drgRect.top - dbRect.top, 0),
            isTmpDrag = tmp.className.indexOf('tmp-drag') > -1;
        if (dbRect.width - left - drgRect.width - 44 < 0) {
            left = dbRect.width - drgRect.width - 44;
        }
        if (dbRect.height - top - drgRect.height - 44 < 0) {
            top = dbRect.height - drgRect.height - 44;
        }
        $(tmp).css({
            left: left,
            top: top + (isTmpDrag ? -8 : 0)
        })
    };
    //限制流程节点位置
    this.limitFlowNodePos = function (drag) {
        var dbRect = this.drawBox.getBoundingClientRect(),
            drgRect = drag.getBoundingClientRect(),
            scllTop = this.drawBox.scrollTop,
            scllLeft = this.drawBox.scrollLeft,
            left = Math.max(drgRect.left - dbRect.left, 0),
            top = Math.max(drgRect.top - dbRect.top, 0),
            isTmpDrag = drag.className.indexOf('tmp-drag') > -1;
        if (dbRect.width - left - drgRect.width - 24 < 0) {
            left = dbRect.width - drgRect.width - 24;
        }
        if (dbRect.height - top - drgRect.height - 24 < 0) {
            top = dbRect.height - drgRect.height - 34;
        }
        $(drag).css({
            left: left + scllLeft,
            top: top + scllTop + (isTmpDrag ? -8 : 0)
        })
    };
    //保存节点
    this.saveNodePos = function ($tag) {
        var tag = $tag.get(0);
        NodeDataModel.setNode({
            id: $tag.attr('id'),
            x: tag.offsetLeft,
            y: tag.offsetTop,
            z: tag.style.zIndex
        })
    };
    //变换chart
    this.changeChart = function (url) {
        document.querySelector("#plan-chart").src = url;
    };
    //是否自动改变位置
    this.isChangeAutoPos=function(tar){
        var dbRect = this.drawBox.getBoundingClientRect(),
            drgRect = tar.getBoundingClientRect(),
            left = Math.max(drgRect.left - dbRect.left, 0),
            top = Math.max(drgRect.top - dbRect.top, 0),
            isX=false,isY=false;
        if (dbRect.width - left - drgRect.width - 44 < 0) {
            isX=true;
        }
        if (dbRect.height - top - drgRect.height - 44 < 0) {
            isY=true;
        }
        return {
            isX:isX,
            isY:isY
        };
    };
    //自动设置位置
    this.setAutoPosNode=function(node){
        var x,y,$w=$(window),$left=$('#page-left'),_this=this,isChange;
        if(autoPost.x){
            x=(autoPost.x+=5);
            y=(autoPost.y+=5);
            node.style.top=y+'px';
            node.style.left=x+'px';
            isChange=this.isChangeAutoPos(node);
            if(isChange.isX){
                autoPost.x=($w.width()-$left.width())/2;
                _this.setAutoPosNode(node);

            }else if(isChange.isY){
                autoPost.y=($w.height()-250)/2;
                _this.setAutoPosNode(node);
            }else{
                return true;
            }
        }else{
            y=($w.height()-250)/2;
            x=($w.width()-$left.width())/2;
            autoPost={
                x:x,
                y:y
            };
            node.style.top=y+'px';
            node.style.left=x+'px';
            return true;
        }
    };
    this.isRepeatMaterialById=(id,nodeId)=>{
        let nodes = NodeDataModel.getAll();
        if(nodeId){
            delete nodes[nodeId];
        }
        let data=formatter.planTransformSubmitData(nodes);
       return validator.isRepeatMaterialById(data,id);
    };

    //事件初始化
    this.initEvent = function () {
        var _this = this;
        events = {
            "mousemove": function (e) {
                if (isDraw) {
                    var endPos = _this.getDrawPosByEvent(e);
                    _this.renderCanvas();
                    _this.view.painter.draw({
                        type: DRAWTYPE,
                        strokeStyle: _this.getDrawColorByType(currentDrawLineType),
                        startX: drawOriginal.x,
                        startY: drawOriginal.y,
                        endX: endPos.x,
                        endY: endPos.y
                    })
                    //_this.view.controller.isEnterInputDot({x:endPos.x+_this.drawBox.scrollTop,y:endPos.y+_this.drawBox.scrollLeft})
                    _this.view.controller.isEnterInputDot({x: endPos.x, y: endPos.y})
                }

            },
            "mouseup": function (e) {
                isDraw = false;
                startNode = null;
                _this.setDrawCursor(false);
                _this.renderCanvas();
            },
            "mouseup .plan-node": function (e) {
                if (!startNode) {  return;  }
                var $tar = $(e.currentTarget), type = $tar.attr('attr-type'), id = $tar.attr('id') || $tar.parents('.plan-node').attr('id');
                if (!id) { return; }
                if (id != startNode.id && type != 'trigger') {
                    var enode = {};
                    enode[id] = {
                        id: id,
                        "drawType": DRAWTYPE,
                        drawColor: _this.getDrawColorByType(currentDrawLineType)
                    };
                    var node = NodeDataModel.getNode(startNode.id);
                    var endN = NodeDataModel.getNode(id);
                    if (node.nodeType=="audiences"&&endN.nodeType=="audiences") {
                        errorAlertMsg("受众人群之间不能相互连接");
                        return;
                    }
                    if (node.itemType == "target-group" && endN.itemType == "target-group") {
                        errorAlertMsg("目标人群之间不能相互连接");
                        return;
                    }
                    //"target-group"
                    var switchNode = {
                        id: id,
                        "drawType": DRAWTYPE,
                        drawColor: _this.getDrawColorByType(currentDrawLineType)
                    };
                    if (currentDrawLineType == "no-output-dot") {
                        if (!node.switch[0] || (node.switch[0].id != id)) {
                            node.switch[1] = switchNode;
                            NodeDataModel.setNode({
                                id: startNode.id,
                                switch: node.switch
                            })
                        }

                    } else if (currentDrawLineType == "yes-output-dot") {
                        if (!node.switch[1] || node.switch[1].id != id) {
                            node.switch[0] = switchNode;
                            NodeDataModel.setNode({
                                id: startNode.id,
                                switch: node.switch
                            })
                        }
                    } else {
                        NodeDataModel.setNode({
                            id: startNode.id,
                            ends: enode
                        })
                    }
                    $(e.currentTarget).find(".input-dot").removeClass('hover');
                }
            },
            "mousedown .plan-node": function (e) {
                _this.dragDisabled(false);
            },
            "mousedown .output-dot,.yes-output-dot,.no-output-dot": function (e) {
                var start = _this.getDrawPosByDot(e.target, 'out');
                drawOriginal = {
                    x: start.x,
                    y: start.y
                };
                _this.setDrawCursor(true);
                _this.dragDisabled(true);
                isDraw = true;
                startNode = e.target.parentNode;
                currentDrawLineType = e.target.className;
                e.stopPropagation();
            },
            "dbclick .plan-node": function () {

                e.stopPropagation();
            },
            "click .plan-node": function (e) {//节点单击
               // console.log('------node click----');
                var node = $(e.currentTarget);
                var nodeData = node.data("data"), type = node.attr('attr-type'),
                    url = node.attr("attr-url");
                if (window.isBAS && window.old_iframe_url != url) {
                    if (type == 'audiences') {//人群节点
                        openMacketBAS();
                        if (nodeData && nodeData.segmentation_id) {
                            showBas(nodeData.segmentation_id + "", url);
                            window.old_iframe_url = url;
                        }
                    } else if (type == 'trigger') {
                        openMacketBAS();
                        showBas("0", url);
                        window.old_iframe_url = url;

                    }
                }
                if (!node.hasClass("active")) {
                    node.addClass("active").siblings('div').removeClass("active");
                }
            },
            "click #plan-edit": function (e) {//toolbar 编辑
                if ($(e.target).hasClass("rui-disabled")) {
                    return;
                }
                editBtnDisabled(true);
                var name = $("#toolbar-title").text();
                var win = new Modals.Window({
                    id: "plan-edit-win",
                    title: '活动信息编辑',
                    content: _.template($(modalTpls).filter('#tpl-modal-edit').html())({name: name || ""}),
                    width: 384,
                    buttons: [{
                        text: '保存', cls: 'accept ', handler: function (thiz) {
                            if ($('#plan-edit-win .accept').hasClass("rui-disabled")) {
                                return;
                            }
                            var name = $('#plan-name').val();
                            !$.trim(name) && (name = '未命名-' + getDateStr());
                            saveCampaignInfo(name);
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
                        close: function () {
                            $('#plan-edit-win').remove();
                            win = null;
                            editBtnDisabled(false);
                            saveBtnDisabled(false);
                        }
                    }
                })
            },
            "click #plan-save": function (e) {//toolbar 保存
                if (!$(e.target).hasClass("rui-disabled")) {
                    setTimeout(function(){
                        saveBtnDisabled(true);
                        var nodes = NodeDataModel.getAll();
                        var data=formatter.planTransformSubmitData(nodes);
                        if (current_status) {
                            var msg = validator.getSaveMsg(data);
                            if (msg) {
                                errorAlertMsg(msg);
                                saveBtnDisabled(false);
                                return;
                            }
                        }
                        if(validator.isRepeatMaterial(data)){
                            errorAlertMsg(REPEAT_MATERIAL_MSG);
                            saveBtnDisabled(false);
                            return;
                        }
                        var name = CURRENT_CAMPAIGN_ID ? $("#toolbar-title").text() : '未命名-' + getDateStr();
                        saveCampaignInfo(name);
                        //console.log(nodeFormatter.transformSubmitData(NodeDataModel.getAll()));
                    },50)

                }

            },
            "click #plan-stop": function (e) {//终止活动
                if ($(e.target).hasClass("rui-disabled")) {
                    return;
                }
                stopBtnDisabled(true);
                var name = CURRENT_CAMPAIGN_ID ? $("#toolbar-title").text() : '未命名-' + getDateStr();
                //'未启动','启动中','活动中','已结束'
                changeStatus(name, 3)
            },
            "click #plan-cancel-start": function (e) {//取消启动
                if ($(e.target).hasClass("rui-disabled")) {
                    return;
                }
                cancelStartBtnDisabled(true);
                var name = CURRENT_CAMPAIGN_ID ? $("#toolbar-title").text() : '未命名-' + getDateStr();
                //'未启动','启动中','活动中','已结束'
                changeStatus(name, 0)
            },
            "click #plan-start": function (e) {//启动
                if ($(e.target).hasClass("rui-disabled")) {
                    return;
                }
                setTimeout(function(){
                    startBtnDisabled(true);
                    var nodes = NodeDataModel.getAll();
                    var submitData = formatter.planTransformSubmitData(nodes);
                    var msg = validator.getSaveMsg(submitData);
                    if (msg) {
                        errorAlertMsg(msg);
                        pageStatusSet("cancelStart")
                        return;
                    }
                    if(validator.isRepeatMaterial(submitData)){
                        errorAlertMsg(REPEAT_MATERIAL_MSG);
                        startBtnDisabled(false);
                        return;
                    }
                    if (hasManualTriggerPlan()) {
                        new Modals.Confirm({
                            content: "<div>立即进入开启活动</div>",
                            listeners: {//各种监听
                                close: function (type) {
                                    if (type) {
                                        var name = CURRENT_CAMPAIGN_ID ? $("#toolbar-title").text() : '未命名-' + getDateStr();
                                        //'未启动','启动中','活动中','已结束'
                                        changeStatus(name, 1)
                                    } else {
                                        startBtnDisabled(false);
                                    }
                                }
                            }
                        });
                    } else {
                        var name = CURRENT_CAMPAIGN_ID ? $("#toolbar-title").text() : '未命名-' + getDateStr();
                        //'未启动','启动中','活动中','已结束'
                        changeStatus(name, 1)
                    }
                },50)
            },
            "click .remove-node": function (e) {

                var node = $(e.target).parent();
                _this.setCurrentTipsType(null);
                layer.closeAll();
                NodeDataModel.delNode(node[0].id)
                node.remove();
                _this.renderCanvas();
                _this.planMsgShowHide();
                e.stopPropagation();
            },
            "click #openMacket": function (e) {
                var openMacketID = $('#openMacket'),
                    openMacketDrawAnimateID = $('#openMacket-draw-animate'),
                    openMacketMacktAnimateID = $('#openMacket-mackt-animate');
                openMacketID.hide();
                openMacketID.addClass('show');
                openMacketDrawAnimateID.addClass('trigger-animate');
                openMacketMacktAnimateID.addClass('trigger-animate');
                openMacketMacktAnimateID.children('.mackt').addClass('trigger-animate');
                e.stopPropagation();
            },
            "click #mackt-close": function (e) {
                var openMacketID = $('#openMacket'),
                    openMacketDrawAnimateID = $('#openMacket-draw-animate'),
                    openMacketMacktAnimateID = $('#openMacket-mackt-animate');
                openMacketID.removeClass('show');
                openMacketDrawAnimateID.removeClass('trigger-animate');
                openMacketMacktAnimateID.removeClass('trigger-animate');
                openMacketMacktAnimateID.children('.mackt').removeClass('trigger-animate');
                setTimeout(function () {
                    openMacketID.show();
                }, 300)
                e.stopPropagation();
            },
            'click .plan-more-menu-item': function (e) {
                if ($(e.currentTarget).hasClass("manual-trigger")) {
                    if (!$(e.target).hasClass("rui-disabled")) {
                        manualStart();
                    }
                }
            },
            'click .plan-num': function (e) {//展开右侧人群搜索框
                var $tar = $(e.target), num = $tar.text(), $parent = $tar.parent();
                _this.layout.showgrouplist(e);
                $("#groupuser-list .num").html("总计" + (num || 0) + "人");
                /**
                 * 弹出搜索用户窗口
                 * 第1个参数e必须传，不然无法显示。
                 * 第2个参数是ajax的data和总数
                 */
                _this.layout.showgrouplist(e, {
                    data: {
                        method: API.searchAudience,
                        campaign_head_id: CURRENT_CAMPAIGN_ID,
                        item_id: $parent.attr("id")
                    },
                    total_count: num || 0//总数，如果没有总数就注释掉这行
                });
            },
            'click #return-pages':function(e){
                e.currentTarget
                window.location.href=$( e.currentTarget).attr('href');
            }
        };
        $('body').on('click', function (e) {
            Evnt.nodeTipsClick(e);
        })
        Evnt.bindWindowEvnt();
    }
    //浮层关闭事件
    this.bindLayerCloseEvnt = function () {
         Evnt.bindLayerCloseEvnt();
    };
    //设置节点数据
    this.setNodeDataByType = function (id, type, data) {
        var $node = $("#" + id), data, html = "", tmpData,
            title = data.name || this.menuDataModel.getNameByItemType(type);
        tmpData = getNodeShowData(title, data.desc);
        $node.find(".content-wrap").html(getTpl(nodeTpl, "#node-content", tmpData));
        $node.data("data", data);
    };
    /**
     * 根据点获取拖拽对象
     * @param dot
     * @returns {*}
     */
    this.getDragByDot = function (dot) {
        return dot.parentNode;
    };
    //根据点获取画线位置
    this.getDrawPosByDot = function (dot, type) {
        var drag = this.getDragByDot(dot),
            offsetY = type == 'out' ? 5 : 0;
        return {
            x: dot.offsetLeft + drag.offsetLeft + dot.offsetWidth / 2 + 5,
            y: dot.offsetTop + drag.offsetTop + dot.offsetHeight / 2 + offsetY
        };
    };
    //根据事件取画线位置
    this.getDrawPosByEvent = function (e) {
        var draw = document.querySelector("#openMacket-draw-animate"),
            cavsRect = draw.getBoundingClientRect();
        return {
            x: e.clientX - cavsRect.left + draw.scrollLeft,
            y: e.clientY - cavsRect.top + draw.scrollTop
        };
    };
    this.showFlowNode = function (data) {
        data.num=thousandbit(data.num);
        var html = getTpl(nodeTpl, '#node', data);
        var node = $(html).css({
            top: data.y,
            left: data.x,
            'zIndex': data.z
        });
        node.data("data", data.info);
        this.$drawBox.append(node);
    };
    //查询主数据
    this.queryMainInfo=function(id,callBack){
        var _this=this;
        util.api({
            url: API.queryMainInfo,
            type: 'get',
            data: {
                "campaign_head_id": id
            },
            success: function (res) {
                var showData={};
                if(res&&res.code==0&&res.data&&res.data.length){
                    showData= formatter.planTransformShowData(res.data);


                        _this.renderPlanNodes(showData);
                        window.saved_nodes_data_str=JSON.stringify(NodeDataModel.getAll());
                    _this.planMsgShowHide();
                    callBack&&callBack.call(null);
                }
            },
            error: function (res) {
                errorAlertMsg("数据获取失败！")
            }
        })
    };

    //获取工具栏信息
    this.queryHeaderInfo = function (id) {
        var _this=this;
        util.api({
            url: API.queryHeaderInfo,
            type: 'get',
            data: {
                "campaign_head_id": id
            },
            success: function (res) {
                //{"code":0,"msg":"success","total":1,"data":[{"segment_name":"母婴北京vip","publish_status":0}]}
                //segment_name 细分名称
                //publish_status 0:未发布,1:已发布,2:活动中
                //oper	string	最后修改人
                //updatetime	datetime	最后修改时间
                if (res && res.code == 0 && res.data && res.data.length) {

                    var rec = formatter.headerInfo(res.data[0]);
                    current_status=rec.release;
                    CURRENT_CAMPAIGN_ID = id;
                    changeCampaignTitle(rec);
                    _this.queryMainInfo(CURRENT_CAMPAIGN_ID,function(){
                        //如果是活动或结束状态
                        if(current_status==0){
                           pageStatusSet("cancelStart")
                        }else if( current_status==1){
                            pageStatusSet("start")
                        }else if( current_status==2){
                            pageStatusSet("active")
                        }else if( current_status==3){
                            pageStatusSet("stop")
                        }
                    });
                }
            },
            error: function (res) {
                errorAlertMsg("数据获取失败！")
            }
        })
    };
    //渲染活动编排节点
    this.renderPlanNodes = function(data){
            for (var id in data) {
                var rec = data[id];
                _this.showFlowNode(rec);

            }
            NodeDataModel.setData(data || {});
            this.renderCanvas();
    };
    this.loadNodesData = function (status) {
        //创建状态
        if (status == 'create') {
            return;
        }
        var params = util.getLocationParams();
        if (!params) {
            return;
        } else if (params['planId']) {
            CURRENT_CAMPAIGN_ID = params['planId'];
            this.queryHeaderInfo(CURRENT_CAMPAIGN_ID)
        }
        if (params && params['returnurl']) {
            this.changeHomeIcon(params['returnurl']);
        }
    };
    this.init = function () {
        document.querySelector('body').classList.add('activity-plan');
        var _this = this;
        this.initEvent();
        this.bindLayerCloseEvnt();
    };
    this.config = function (view, drag, menuDataModel, layout) {
        this.view = view;
        this.dragModel = drag;
        this.menuDataModel = menuDataModel;
        this.$drawBox = this.view.$el.find('.draw-box');
        this.drawBox = this.$drawBox[0];
        this.layout = layout;

    };
    this.bindEvent = function () {
        return events;
    }
    this.setDrawCursor = function (type) {
        $('#openMacket-draw-animate').css({
            cursor: type ? 'default' : 'auto'
        })
        type ? $('.plan-node').addClass("drawing") : $('.plan-node').removeClass("drawing");
        //$('.plan-node').css({
        //    cursor:type?'default':'auto'
        //})
    };
    /**
     * 拖拽失效
     * @param type
     */
    this.dragDisabled = function (type) {
        var drags = this.view.$el.find('.plan-node');
        type ? drags.removeClass('dome-drag') : drags.addClass('dome-drag');
    };
    this.getOutDotById = function (id, type) {
        return $('#' + id).find(type == 'decisions' ? '.no-output-dot,.yes-output-dot' : '.output-dot');
    };
    this.getInDotById = function (id) {
        return $('#' + id).find('.input-dot');
    };
    this.renderCanvas = function () {
        var nodes = NodeDataModel.getAll(), _this = this;
        this.view.painter.clearAll();
        for (var k in nodes) {
            var node = nodes[k], type = node.nodeType;
            if (type == 'decisions') {
                var outDots = this.getOutDotById(node.id, 'decisions');
                $.each(outDots, function (i, dot) {
                    var sw = node.switch[i];
                    if (sw && sw.id && $('#' + sw.id)[0]) {
                        var outDot = _this.getOutDotById(node.id, '');
                        _this.drawLineByDot(node, dot, i);
                    }
                })
            } else {
                var outDot = this.getOutDotById(node.id, '');
                this.drawLineByDot(node, outDot[0]);
            }
        }
    };
    this.drawLineByDot = function (node, dot, index) {
        var startPos = this.getDrawPosByDot(dot, 'out');
        $.each(node.nodeType == "decisions" ? node.switch : node.ends, function (i, itm) {
            if ((node.nodeType == "decisions" && index == i) || node.nodeType != "decisions") {
                var inDot = _this.getInDotById(itm.id);
                if (inDot[0]) {
                    var endPos = _this.getDrawPosByDot(inDot[0], 'in');
                    _this.view.painter.draw({
                        type: itm.drawType,
                        strokeStyle: itm.drawColor,
                        startX: startPos.x,
                        startY: startPos.y,
                        endX: endPos.x,
                        endY: endPos.y
                    })
                }
            }
        })
    };
    this.isEnterInputDot = function (pos) {
        var dBRect = this.drawBox.getBoundingClientRect(), _this = this;
        this.view.$el.find(".input-dot").each(function (i, itm) {
            var rect = itm.getBoundingClientRect();
            if ((pos.x > rect.left - dBRect.left + _this.drawBox.scrollLeft) && (pos.x < rect.left + rect.width - dBRect.left + _this.drawBox.scrollLeft) && (pos.y > rect.top - dBRect.top + _this.drawBox.scrollTop) && (pos.y < rect.top + rect.height - dBRect.top + _this.drawBox.scrollTop)) {
                itm.classList.add('hover');
            } else {
                if (itm.className.indexOf('hover') > -1) {
                    itm.classList.remove('hover');
                }
            }
        })
    };
    this.getDrawColorByType = function (type) {
        var obj = {
            'output-dot': '#787878',
            'yes-output-dot': '#65bb43',
            'no-output-dot': '#e64646'
        };
        return obj[type] ? obj[type] : obj['output-dot'];
    };

    this.changeHomeIcon = function (url) {
        var header = $('#page-body-header')
        header.addClass('return-url');
        header.find(".return-pages").attr("href", BASE_PATH + url);
    };
    this.setCurrentTipsType = function (type) {
        currentTipsType = type;
    };
    this.getCurrentTipsType =()=>{
       return currentTipsType;
    };
    this.setCurrentNodeId = function (id) {
        currentNodeId = id;
    };
    this.getCurrentNodeId= ()=> {
       return currentNodeId ;
    };
    this.setNodeInfo = function (arg) {

        NodeDataModel.setNode({
            id: arg.id,
            info: arg.info
        })

    };
    this.NodeDataModel=NodeDataModel;
    this.init();
}

module.exports = controller;
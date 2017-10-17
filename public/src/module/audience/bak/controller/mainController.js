/**
 * Author LLJ
 * Date 2016-5-3 9:33
 * version 1.1
 */
var Modals = require('component/modals.js');
var formatter = require('../utils/formatter.js');
var relTagTpl = require('../tpl/rel-tag.html');
var Mock = require('../mock/data.js');
var Random = 0;
var BarData = {
    color: ['#5182ad'],
    title: {
        text: ''
    },
    legend: {
        data: []
    },
    xAxis: {
        splitLine: {show: false},
        data: []
    },
    yAxis: {
        splitLine: {show: false},
        show: false
    },
    series: [{
        name: '',
        data: []
    }]
};
function showAudTagSearchDelBtn(type){
    type?$('#aud-tag-search-del').show():$('#aud-tag-search-del').hide();
}
window.audTagSearch=function(dom){
    console.log('audTagSearch',dom)
    showAudTagSearchDelBtn($.trim(dom.value))
}
function getData(num,data) {
    var obj={top:5,minSize: '30%'},total=0;//'40%'
    //[{"tag_count":"4","tag_name":"tester","tag_id":"1"}]
    if(num==3){
        obj.minSize= '35%';//'45%'
        //data = [{
        //    top: 5,
        //    minSize: '45%',
        //    data: [{value: 90, name: TMPConditionNames[0]},
        //        {value: 60, name: TMPConditionNames[1]},
        //        {value: 30, name: TMPConditionNames[2]}
        //    ]
        //}];
    }else if(num==0){
        obj = {data: []};
    }
    obj.data=[];
    data.forEach(function(itm,i){
        obj.data.push({value: itm.tag_count*1, name: itm.tag_name});
        total+=itm.tag_count*1;
    })
    obj.max=total;
    return [obj];
}


var TMPConditionNames;
//-----------------Mock end------------
var resultAreaTpls = require('../tpl/result-area-tpl.html');
var tooblarTpls = require('../tpl/toolbar.html');
var modalsTpl = require("../tpl/modal-tpl.html");

var rightTpls = require('../tpl/right-tpl.html');
var groupTpl = require('../tpl/group-tpl.html');
var TAGS = ['性别', '年龄', '家庭角色', '婚姻状况', '个人年收入范围', '孕产状态', '宝宝年龄', '宝宝性别', '会员级别', '会员生命周期定义', '居住位置', '曾购买的品类', '最近一次购买间隔', '客单价', '购买品牌偏好', '促销机制偏好', '曾经投诉', '用户招募来源', '最近一次参与的活动', '触达渠道偏好'];
var msg1='受众标签人群至少有一个，才可生效';//必须有一个受众标签人群
var msg2='生效中状态修改，受众标签至少有一个';
var API = {
    createHeaderInfo: "?method=mkt.segment.header.create",
    updateHeaderInfo: "?method=mkt.segment.header.update",
    queryHeaderInfo: "?method=mkt.segment.header.get",
    queryRecommendTags: "?method=mkt.segment.tagname.taglist.get",//推荐标签
    suggestTags: "?method=mkt.segment.tagkey.taglist.get",//联想查询
    queryTagVals: "?method=mkt.segment.tagname.tagvalue.get",//查询标签值
    saveTags: "?method=mkt.segment.tagname.tagvalue.get",//保存标签
    createMainInfo: "?method=mkt.segment.body.create",//创建主体信息
    updateMainInfo: "?method=mkt.segment.body.update",//修改主体信息
    queryMainInfo: "?method=mkt.segment.body.get",//查询主体信息
    updateRelTags: "?method=mkt.segment.tag.update",//增加或修改受众细分关联的标签
    queryRelTags: "?method=mkt.segment.tag.get",//查询众细分关联的标签
    queryBarChart:"?method=mkt.segment.tagname.tagcount.get",//查询柱状图
    queryFunnelChart:"?method=mkt.segment.filter.get",//漏斗chart
    cancelEffect:"?method=mkt.segment.header.update",//取消生效
    querySum:"?method=mkt.segment.filter.sum.get"//获取覆盖值
};
var CURRENTSEGMENTID = "";
//推荐标签
var RECOMMENDTAGS = [];
var REL_TAG_NAMS = [];
//当前发布状态
var current_status=0;
//主信息数据
var filter_groups = [];

var funnel_chart_data_arr=[];
var when_fun__arr=[];
var headerInfo={};
var SECOND=1000;

//回数是否有值
function notEmptyRespose(res){
    return res&&res.code==0&&res.data&&res.data.length;
}
//自定义比较函数
function creatComationFuntion(propertyName,a) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
}
function desFuntion(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
            return 1;
        } else if (value1 > value2) {
            return -1;
        } else {
            return 0;
        }
    };
}
//漏斗数据排序
function funnelChartDataSort(arr){
    arr.sort(creatComationFuntion('gId'));
}
function errorAlertMsg(msg) {
    new Modals.Alert(msg||"数据获取失败！");
}
function successMsg(msg){
    Materialize.toast(msg||"保存成功！", 3000)
}
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
function getConditionResDataByKey(k) {
    var res = [];
    Mock.tag.forEach(function (itm, i) {
        if (itm.name == k) {
            res.push($.extend(true, {}, itm));
        }
    })
    return res;
}
function getSuggestDataByKey(k) {
    var res = [];
    Mock.tag.forEach(function (itm, i) {
        if (itm.name.indexOf(k) > -1) {
            res.push(itm.name);
        }
    })
    return res;
}
//控制器
function controller() {
    var events = {};
    var _this = this;
    //延迟函数
    function deferredFun(gId){
        var dtd = $.Deferred();//在函数内部，新建一个Deferred对象
        _this.loadChartByGroup(gId,function(){
            _this.view.controller.checkoutGroup();
            var chartId=_this.view.controller.getChartIdByGId(gId);
            _this.view.controller.resizeFunnelChart(chartId);
            _this.view.controller.addDragTarAbleCls(false);
        },dtd);
        return  dtd.promise();
    }
    //标签按钮是否置灰
    function tagBtnDisabled(type){
        var $btn=$("#aud-tag-edit");
        if(type){
            !$btn.hasClass('rui-disabled')&&$btn.addClass("rui-disabled");
        }else{
            $btn.removeClass("rui-disabled");
        }
    }
    //验证是否可以生效
    function validateEffect(){
        var groups = getMainInfo(),
            isDo=false,
            msg="";
        if(groups.length){//有数据
            isDo=true;
        }else{
            msg=msg1;
        }
        return {
            isDo:isDo,
            msg:msg
        };
    }
    //按钮是否置灰
    function btnDisabled($tar,type){
        if(type){
            !$tar.hasClass('rui-disabled')&&$tar.addClass("rui-disabled");
        }else{
            $tar.removeClass("rui-disabled");
        }
    }
    //按钮是否显示
    function btnShow($tar,type){
        type?$tar.show():$tar.hide();
    }
    //取消生效按钮是否置灰
    function uneffectBtnDisabled(type){
        btnDisabled($("#audience-uneffect"),type);
    }
    //生效按钮是否置灰
    function effectBtnDisabled(type){
        btnDisabled($("#audience-effect"),type);
    }
    //保存按钮是否置灰
    function saveBtnDisabled(type){
        btnDisabled($("#rui-modals-save"),type);
    }
    //编辑按钮是否置灰
    function editBtnDisabled(type){
        btnDisabled($("#rui-modals-edit"),type);
    }
    //渲染数据
    function renderCondition(data) {
        renderGroupCondition(data);
        renderInputCondition(data);
    }

    //渲染组数据
    function renderGroupCondition(data) {
        data.every(function (itm, i) {
            if (i > 0) {
                _this.drag.addGroupCondition("group" + i);
            }
            return true;
        })
    }

    //渲染条件数据
    function renderInputCondition(data) {
        data.forEach(function (itm, i) {
            var gId = "group" + i, $con = $("#" + gId + " .term-box:last");
            var ipts = itm.tag_list;
            ipts.forEach(function (input, index) {
                //{"exclude":0,"tag_id":2,"tag_name":"女",}
                //"tag_id": 106,
                //"tag_name": "标签名字",
                //"tag_group_id":1,
                // "tag_group_name":"性别"
                //"tag_group_name":"父标签组的名字",
                //"exclude": "0" //是否排除
                var showText = input.tag_group_name + "-" + input.tag_name,
                    id = input.tag_id,
                    tagGroupId=input.tag_group_id,
                    exclude = input.exclude * 1;
                //$con,text,showText,tagId,tagGroupId,checked
                _this.drag.createConditionInput($con, input.tag_name, showText, id, tagGroupId,exclude);
            })
        })
    }

    //显示添加标签btn
    function showEditTag(type) {
        if (type&&CURRENTSEGMENTID) {
            $('#aud-tag-edit').hasClass('rui-disabled')&&$('#aud-tag-edit').removeClass("rui-disabled");
        } else {
            !$('#aud-tag-edit').hasClass('rui-disabled')&&$('#aud-tag-edit').addClass("rui-disabled");
        }

    }

    //获取主信息
    function getMainInfo() {
        var isEmpty = true, arr = [];
        $('#segment-id .actions-box .prerequisite-box').each(function (grpIndex, itm) {
            var $tar = $(this), terms = $tar.find('.init'),groupBox=$tar.find('.group-box');
            var grp = {
                "groupId":groupBox.attr("id"),
                "group_index": grpIndex, //过滤分组顺序,0开始递增
                "tag_list": []
            };
            terms.each(function (i, term) {
                isEmpty = false;
                var $tag = $(this), chked = $tag.find('input[type="checkbox"]').is(':checked') ? 1 : 0,
                    id = $tag.find('.hide-id').val(),
                    grp_id = $tag.find('.grp-id').val(),
                    showCondition= $tag.find('.show-condition').val();
                grp.tag_list.push({
                    "group_seq":i+1,
                    "tag_id": id,
                    "tag_group_id": grp_id,
                    "tag_name":showCondition,
                    "exclude": chked
                })
            })
            arr.push(grp);
        })
        return isEmpty ? [] : arr;
    }
    //查询漏斗图
    function queryFunnelChart(gId,conditions,callBack,deferred){
        //[{"tag_id":"101","exclude":"0"},..]
        util.api({
            url: API.queryFunnelChart,
            type: 'post',
            timeout:SECOND*120,
            data: {
                "conditions":conditions
            },
            success: function (res) {
                if(deferred){
                    if (notEmptyRespose(res)) {
                       funnel_chart_data_arr.push({
                           gId:gId,
                           data:res.data,
                           callBack:callBack
                       })
                    }else{
                        funnel_chart_data_arr.push({
                            gId:gId,
                            data:[],
                            callBack:callBack
                        })
                    }
                    deferred.resolve();
                    return;
                }
                if (notEmptyRespose(res)) {
                    // [ {"tag_id":101,"tag_name":"性别","tag_count":100},...]
                    _this.setFunnelChart(gId,res.data)
                }else{
                    _this.setFunnelChart(gId,[])
                }
                callBack&&callBack();

            },
            error: function (res) {
                _this.setFunnelChart(gId,[]);
                if(deferred){
                    deferred.resolve();
                    funnel_chart_data_arr.push({
                        gId:gId,
                        data:[],
                        callBack:callBack
                    })
                }
                window.console&&console.log("数据获取失败",res)
                //errorAlertMsg();
            }
        })
    }
    //查询柱状图
    function queryBarChart(arg){
        var tag_ids=arg,tag_ids_str="";
        //删除最后一个字段
        tag_ids.splice(-1, 1);
        if(tag_ids&&tag_ids.length){
            tag_ids_str= tag_ids[0].substr(0,8);
        }
        //tag_ids 后台约定只传递一个字符串的前8位字符串 (原来是tag_ids.join(","))
        util.api({
            url: API.queryBarChart,
            type: 'get',
            data: {
                tag_ids: tag_ids_str
            },
            success: function (res) {
                if (res && res.code == 0 && res.data && res.data.length) {
                    //    [{"tag_id":375,"tag_name":"男","tag_count":"100"},{"tag_id":376,"tag_name":"女","tag_count":"110"}]
                    _this.setBarChart(res.data)
                }else{
                    _this.setBarChart([])
                }

            },
            error: function (res) {
                errorAlertMsg();
            }
        })
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
    //保存主体信息
    function saveBody(id,callBack){
        var groups = getMainInfo();
        util.api({
            url: API.updateMainInfo,
            type: 'post',
            data: {
                segment_head_id: id,
                filter_groups: groups
            },
            success: function (res) {
                if (res && res.code == 0) {
                    if(callBack){
                        callBack();
                    }else{
                        successMsg("保存成功！");
                        pageEffectStatusSet(false);
                    }
                }else if(res && res.code == 3003){//活动中的细分无法编辑 错误码是 3003
                    headerInfo['release']=current_status=2;
                    pageActiveStatusSet();
                    errorAlertMsg("活动中无法编辑！");
                    changeSegmentTitle(headerInfo)
                } else {
                    errorAlertMsg('保存失败！');
                    pageEffectStatusSet(false);
                }
            },
            error: function (res) {
                errorAlertMsg("保存失败！");
                editBtnDisabled(false);
                saveBtnDisabled(false);
                pageSetByStatus(current_status);
            }
        })
    }

    function updateHeaderInfo(id,name,status,callBack){
        util.api({
            url: API.updateHeaderInfo,
            type: 'post',
            data: {
                "segment_head_id": id,
                "segment_name": name,
                "publish_status": status||0
            },
            success: function (res) {
                if (res && res.code == 0) {
                    headerInfo = formatter.headerInfo(res.data[0]) || {};
                    current_status=headerInfo['release'] = status||0;
                    headerInfo['name'] = name;
                    if (!CURRENTSEGMENTID) {//为空表示新建，非空表示修改操作
                        CURRENTSEGMENTID = headerInfo.id;
                        showEditTag(true);
                    }
                    var msg="操作成功！";
                    if(status==0){
                        msg="取消生效成功！";
                    }else if(status==1){
                        msg="生效成功！";
                    }else if(status==null){
                        msg="保存成功！";
                    }
                    callBack?callBack():successMsg(msg);

                }else if(res && res.code == 3003){//活动中的细分无法编辑 错误码是 3003
                    headerInfo['release']=current_status=2;
                    var msg="活动中无法编辑！";
                    if(status==0){
                        msg="活动中的细分人群，取消生效不可用！";
                    }else if(status==1){
                        msg="活动中的细分人群，生效不可用！";
                    }
                    errorAlertMsg(msg)
                } else {//'未生效','已生效','活动中','全部'
                    errorMsgByStatus(status)
                }
                pageSetByStatus(current_status)
                changeSegmentTitle(headerInfo);
            },
            error: function (res) {
                errorAlertMsg("操作失败！")
                pageSetByStatus(current_status)
            }
        })
    }
    function createAudience(name,callBack){
        util.api({
            url: API.createHeaderInfo,
            type: 'post',
            data: {
                "segment_head_id": "",
                "segment_name": name,
                "publish_status": 0
            },
            success: function (res) {
                if (res && res.code == 0) {
                    headerInfo = formatter.headerInfo(res.data[0]) || {};
                    current_status=headerInfo['release'] = status ? status : 0;
                    headerInfo['name'] = name;
                    if (!CURRENTSEGMENTID) {//为空表示新建，非空表示修改操作
                        CURRENTSEGMENTID = headerInfo.id;
                        showEditTag(true);
                    }
                    changeSegmentTitle(headerInfo);
                    callBack&&callBack();
                }
            },
            error: function (res) {
                errorAlertMsg("操作失败！")
            }
        })
    }
    //改变状态
    function changeStatus(name,status){

        var _status=status;
        if(CURRENTSEGMENTID){
            saveBody(CURRENTSEGMENTID,function(){
                updateHeaderInfo(CURRENTSEGMENTID,getName(),_status,null)
            })
        }else{
            createAudience(name,function(){
                  saveBody(CURRENTSEGMENTID,function(){
                      updateHeaderInfo(CURRENTSEGMENTID,getName(),_status,null)
                  })
            })
        }

    }
    //获取主信息
    function queryMainInfo(id,callBack) {
        util.api({
            url: API.queryMainInfo,
            type: 'get',
            data: {
                segment_head_id: id
            },
            success: function (res) {
                if (res && res.code == 0 && res.data && res.data.length) {
                    renderCondition(res.data);
                    callBack&&callBack();
                }

            },
            error: function (res) {
                errorAlertMsg();
            }
        })
    }


    //保存标签
    function updateRelTags() {
        util.api({
            url: API.updateRelTags,
            type: 'post',
            data: {
                segment_head_id: CURRENTSEGMENTID,
                tag_names: REL_TAG_NAMS
            },
            success: function (res) {
                tagBtnDisabled(false);
                if (res && res.code == 0) {
                    successMsg();
                } else {
                    errorAlertMsg("保存失败！");
                }
            },
            error: function (res) {
                errorAlertMsg("保存失败！");
                tagBtnDisabled(false);
            }
        })
    }
    //查询标签
    function queryRelTags(callBack) {
        CURRENTSEGMENTID&&util.api({
            url: API.queryRelTags,
            type: 'get',
            data: {
                segment_head_id: CURRENTSEGMENTID
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

    //suggest 联想数据
    function querySuggestTagsByName(name, callBack) {
        util.api({
            url: API.suggestTags,
            type: 'get',
            data: {
                tag_group_name: name
            },
            success: function (res) {
                //res.data=[{tag_group_name:123,tag_group_id:123},{tag_group_name:456,tag_group_id:456}]
                if (res && res.code == 0 && res.data && res.data.length) {
                    callBack.call(_this, res.data);
                }
            },
            error: function (res) {
                errorAlertMsg();
            }
        })
    }

    //根据idc查询标签值
    function queryTagValsById(id, callBack) {
        util.api({
            url: API.queryTagVals,
            type: 'get',
            data: {
                tag_group_id: id
            },
            success: function (res) {
                if (res && res.code == 0 && res.data) {
                    callBack.call(_this, res, id);
                }
            },
            error: function (res) {
                $('.result-search').blur();
                errorAlertMsg();
            }
        })
    }

    //根据名称获取标签值
    function queryTagValsByName(name, callBack) {
        util.api({
            url: API.queryTagVals,
            type: 'get',
            data: {
                tag_name: name
            },
            success: function (res) {
                if (res && res.code == 0 && res.data && res.data.length) {
                    callBack.call(_this, res.data);
                }
            },
            error: function (res) {
                $('.result-search').blur();
                errorAlertMsg();
            }
        })
    }
    function getName(){
       return CURRENTSEGMENTID ? $("#toolbar-title").text() : "未命名-"+getDateStr();
    }
    //查询推荐标签
    function queryRecommendTags() {
        util.api({
            url: API.queryRecommendTags,
            type: 'get',
            success: function (res) {
                if (res && res.code == 0 && res.data && res.data.length) {
                    RECOMMENDTAGS = res.data;
                }
            },
            error: function (res) {
                RECOMMENDTAGS = [];
                errorAlertMsg();
            }
        })
    }
    //保存受众细分数据(创建或修改)
    function saveSegmentInfo(name, status) {
        if(CURRENTSEGMENTID){
            updateHeaderInfo(CURRENTSEGMENTID,name,status,function(){
                saveBody(CURRENTSEGMENTID,null);
            })
        }else{
            createAudience(name,function(){
                saveBody(CURRENTSEGMENTID,null);
            })
        }
    }

    function delGroupCondition(e) {
        var group = $(e.currentTarget).siblings(".group-box"),
            gId = group.attr('id');
        group.children(".init").remove();
        //var chartId=_this.getChartIdByGId(gId);
        //console.log('chartId',chartId)
        //_this.delChartCanvas(chartId);
        var chartId = _this.getChartIdByGId(gId);
        _this.checkoutGroup();
        _this.resizeFunnelChart(chartId);


    }

    function delSingleCondition(e) {
        var group = $(e.currentTarget).parent().parent().parent(),
            gId = group.attr('id');
        $(e.currentTarget).parent().parent().remove();
        console.log('delSingleCondition',gId)
        _this.loadChartByGroup(gId,function(){
            _this.checkoutGroup();
            var chartId = _this.getChartIdByGId(gId);
            _this.resizeFunnelChart(chartId);
        });

    }

    //chart 初始化
    function initChart(arg) {
        _this.charts.create(arg);
    }

    //改变搜索结果html
    function changeResultArea(html) {
        _this.view.$el.find('#result-area').html(html)
    }

    //渲染已有关联标签
    function renderTagsRel(data) {
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

    //根据状态设置页面
    function pageSetByStatus(status){
        if(status<=1){
          pageEffectStatusSet(!!status)
        }else{
          pageActiveStatusSet();
        }
    }
    //筛选条件操作状态设置 true 表示可操作
    function conditionOptStatusSet(type){
        _this.drag.dragDisable(!type);
        if(type){
            $('#segment-id').removeClass('work');
            $('#config-area,#triggerConfig').show();
        }else{
            $('#segment-id').addClass('work');
            $('#config-area,#triggerConfig').hide();
        }
    }
    //发布(活动中)
    function doRelease() {
        $('#rui-modals-edit').hide();
        uneffectBtnDisabled(true);
        $("#audience-effect").hide();
        $('#rui-modals-save').addClass("rui-disabled");
    }
    function disabledOpt(){
        _this.drag.dragDisable(false);
        $('#segment-id').addClass('work');
        $('#config-area,#triggerConfig').hide();
    }
    //发布及活动状态展示
    function releaseActiveStatusShow() {
        doRelease();
        disabledOpt();
    }
    //页面活动状态设置
    function pageActiveStatusSet(){
        pageEffectStatusSet(true);
        uneffectBtnDisabled(true);
        $('#segment-id').addClass('work');

    }
    //生效/为生效状态显示
    function pageEffectStatusSet(type){
         if(type){//生效状态
             showEditTag(false);
             saveBtnDisabled(true);
             uneffectBtnDisabled(false);
             btnShow($("#audience-uneffect"),true);
             btnShow($("#audience-effect"),false);
             btnShow($('#rui-modals-edit'),false);
             conditionOptStatusSet(false);
         }else{//未生效
             showEditTag(true);
             saveBtnDisabled(false);
             editBtnDisabled(false);
             effectBtnDisabled(false);
             btnShow($("#audience-uneffect"),false);
             btnShow($("#audience-effect"),true);
             btnShow($('#rui-modals-edit'),true);
             conditionOptStatusSet(true);
         }
    }
    //变换toolbar title
    function changeSegmentTitle(arg) {
        var name = arg.name || $('#audience-name').val();
        if ($.trim(name)) {
            var html = _.template($(tooblarTpls).filter("#toolbar").html())(arg);
            $('#audience-edit-result').html(html);
        }
    }
    //设置柱状图
    this.setBarChart=function(data){
        // [{"tag_id":375,"tag_name":"男","tag_count":"100"},{"tag_id":376,"tag_name":"女","tag_count":"110"}]
        if(data&&data.length){
            this.addBgImg('drawing4', false);
            var  xAxisData=[],xAxisNames=[];
            data.sort(desFuntion('tag_count'))
            var other_tag_count=0;
            data.forEach(function (itm, i) {
                if(i>5){
                    other_tag_count+=itm.tag_count;
                }else{
                    xAxisData.push(itm.tag_count);
                    xAxisNames.push(itm.tag_name);
                }
            })
            if(data.length>6){
                xAxisData[6]=other_tag_count;
                xAxisNames[6]=data[6].tag_name+"及其它";
            }
            BarData.series = [{
                name: '',
                data: xAxisData
            }];
            BarData.xAxis = {
                splitLine: {show: false},
                // 'type':'category',
                // 'axisLabel':{'interval':0},
                show: true,
                data: xAxisNames
            };

        }else{//没有数据
            BarData.series = [{
                name: '',
                data: [{
                    data: []
                }]
            }];
            BarData.xAxis = {
                splitLine: {show: false},
                data: [],
                show: false
            };
            this.addBgImg('drawing4', true);
        }
        _this.charts.getChartById("bar1").setOption(BarData);

    };
    this.setFunnelChart=function(gId,data){

        // // [ {"tag_id":101,"tag_name":"性别","tag_count":100},...]
        var chartId = _this.getChartIdByGId(gId);
        if (!_this.charts.getChartById(chartId)) {
            _this.createNewChartCanvas(chartId);
            _this.charts.create({
                id: chartId,
                type: 'funnel',
                renderTo: '#' + chartId
            })
        }
        var  xAxisData=[],xAxisNames=[];
        data.forEach(function (itm, i) {
            xAxisData.push(itm.tag_count);
            xAxisNames.push(itm.tag_name);
        })
        //TMPConditionNames = _this.getConditionNamesByGId(gId);
        var num = 0;
        _this.view.$el.find("#" + gId + ' .dom-dragable').each(function (i, itm) {
            num++;
        })
        var chartData = getData(num >= 3 ? 3 : num,data);
        chartData[0].label = {
            normal: {
                position: 'inside',
                formatter: '{c}',
                textStyle: {
                    color: '#fff'
                }
            }

        };
        var arg = $.extend(true, {}, {
            legend: {
                data: xAxisNames
            },
            series: chartData
        })
        _this.charts.getChartById(chartId).setOption(arg);

    };
    /**
     *
     * @param gId 组ID
     * @param callBack 回调
     * @param isDeferred 是否延迟
     */
    this.loadChartByGroup = function (gId,callBack,isDeferred) {
        var tmpgId=gId;
        try{
            var index=tmpgId.substr(5),
                mainInfo=getMainInfo(),
                tag_list=[];
            console.log('mainInfo',mainInfo)
            if(mainInfo&&mainInfo.length){
                mainInfo.every(function(itm,i){
                    if(itm.groupId==gId){
                        tag_list=itm.tag_list;
                        return false;
                    }
                    return true;
                })
                queryFunnelChart(gId,tag_list,callBack,isDeferred);
            }else{
                var chartId = _this.getChartIdByGId(gId);
                _this.checkoutGroup();
                _this.resizeFunnelChart(chartId);
            }
        }catch (e){
            window.console&&console.log(e)
        }
    };
    this.setFunnelChartWrapDivWH = function () {
        var con = this.view.$el.find('#canvas-content'),
            h = con.height(),
            w = con.width();
        var tmpW = h > w ? w : h;
        var num = this.getFunnelChartsNum();
        var width, height;
        width = height = (tmpW / num) * 0.8 - 80;
        this.view.$el.find(".canvas-area").css({
            width: width > 280 ? width : 280,
            height: height > 200 ? height : 200,
            'marginLeft': -(width > 280 ? width / 2 : 140),
            'marginTop': -(height > 200 ? height / 2 : 100)
        })

    };
    this.resizeFunnelChart = function (chartId) {
        //var charts= this.charts.getCharts();
        var charts = _this.charts.objects;
        for (var k in charts) {
            if (k != chartId) {//Echart Bug  不能在setOption 之后立即resize ,否则漏斗不显示
                charts[k].resize();
            }
        }
    };
    /**
     * 获取漏斗chart 个数
     */
    this.getFunnelChartsNum = function () {
        return this.view.$el.find('.drawing-box .canvas-area').length;
    };
    this.validateCondition = function (name, gId) {
        var arr = this.getConditionNamesByGId(gId);
        return arr.indexOf(name) > -1;
    };
    this.isConditionLimit = function (gId) {
        //标签个数限制
        return this.view.$el.find('.actions-box #' + gId + " .init").length >= 4;
    };
    this.getConditionNamesByGId = function (gId) {

        var arr = [];
        //this.view.$el.find('#'+gId+' .term-box input[type="hidden"]').each(function(i,itm){
        //    var $tar=$(itm),text=$tar.val();
        //    if(text){
        //        arr.push(text);
        //    }
        //});
        this.view.$el.find('#' + gId + ' .term-box .input').each(function (i, itm) {
            var $tar = $(itm), text = $tar.text();
            if (text) {
                arr.push(text);
            }
        });
        return arr;
    };
    this.createNewChartCanvas = function (id) {
        if (!$('#' + id)[0]) {
            var h = _.template($(rightTpls).filter("#tab-canvas-box").html())({chartId: id});
            this.view.$el.find('#canvas-content').append(h);
        }
        this.setFunnelChartWrapDivWH();
    };
    this.delChartCanvas = function (id) {
        _this.charts.disposeChart(id);
        this.view.$el.find('#' + id + "-box").parent().parent().remove();
    };

    this.getChartIdByGId = function (gId) {
        if (!gId) {
            return "";
        }
        var num = gId.substring(5);
        return gId + "-drawing" + num;
    };
    /**
     * 设置总计覆盖人数
     * @param type
     */
    this.changeTotal = function () {
        var mainInfo=getMainInfo();
        var groups=[];
        mainInfo.forEach(function(group){
            groups.push({
                conditions:group.tag_list
            })
        })
        util.api({
            url: API.querySum,
            type: 'post',
            timeout:SECOND*120,
            data: {
                groups:groups
            },
            success: function (res) {
                //res.data=[{tag_group_name:123,tag_group_id:123},{tag_group_name:456,tag_group_id:456}]
                if (res && res.code == 0) {
                    _this.view.$el.find('#totalNum').text(res.total);
                }
            },
            error: function (res) {
                errorAlertMsg();
            }
        })
        //this.view.$el.find('#totalNum').text(t);
    };
    this.switchConfigArea = function (type) {
        if (type) {
            $('#triggerConfig').addClass('trigger-hide');
            $('#config-area').addClass('config-area-show');
            $('#config-area').children('.config-box').addClass('config-box-show');
            $('#config-area').children('.drawing-area').addClass('drawing-area-show');
            $('#aud-tag-search').val("");
            _this.showConditionSearchRes("");
            _this.setBarChart([])
            //dropdown 有问题 自动获取焦点无法显示
            //this.focusInput();
        } else {
            $('#triggerConfig').removeClass('trigger-hide');
            $('#config-area').removeClass('config-area-show');
            $('#config-area').children('.config-box').removeClass('config-box-show');
            $('#config-area').children('.drawing-area').removeClass('drawing-area-show');
        }


    };
    /**
     * 是否达到组的上限
     * @returns {boolean}
     */
    this.isGroupLimit = function () {
        //没有条件也不能增加新组或者组条件大于3个
        return _this.isAllEmpty() || this.view.$el.find('.actions-box .prerequisite-box').length >= 3;
    };

    //加载全部漏斗图
    this.loadAllFunnelChart=function(){
        funnel_chart_data_arr=[];
        var argLen=0;
        var arg=[];
        this.view.$el.find('.actions-box .prerequisite-box').each(function (i, itm) {
            var $tar = $(itm);
            var gId = $tar.find('.group-box').attr('id');
            if ($tar.find('.init').length) {
                argLen++;
                arg.push(deferredFun(gId));
                //deferredFun(gId);
            }
        })
        $.when.apply(null,arg).done(function(arg){
            funnelChartDataSort(funnel_chart_data_arr);
            funnel_chart_data_arr.forEach(function(itm,i){
              var data= itm.data,gId=itm.gId,callBack=itm.callBack;
                _this.setFunnelChart(gId,data);
                callBack&&callBack();
            })
        });
    };
    this.filterDisabledChart=function(){
        var disabledArr=[], _this = this;
        this.view.$el.find('.actions-box .prerequisite-box').each(function (i, itm) {
            var $tar = $(itm);
            var gId = $tar.find('.group-box').attr('id');
            var chartId = _this.getChartIdByGId(gId);
            disabledArr.push(chartId);
        })
        this.view.$el.find('#canvas-content .canvas-box>div').each(function(i,itm){
                var $tar=$(this),id=$tar.attr("id");
                if(disabledArr.indexOf(id)<0){
                    _this.delChartCanvas(id);
                }
        })

    };
    this.checkoutGroup = function () {
        var _this = this;
        this.view.$el.find('.actions-box .prerequisite-box').each(function (i, itm) {
            var $tar = $(itm);
            var gId = $tar.find('.group-box').attr('id');
            if (!$tar.find('.init').length) {
                var chartId = _this.getChartIdByGId(gId);
                _this.delChartCanvas(chartId);
                $tar.remove();
                $('#'+gId).siblings(".delete-all").hide();
            }else{
                $('#'+gId).siblings(".delete-all").show();
            }
        })
        _this.filterDisabledChart();
        if (_this.isAllEmpty()) {
            _this.initGroup();
            _this.addBgImg('drawing-box', true);

        } else {
            _this.addBgImg('drawing-box', false);
        }
        this.changeTotal();
        this.view.$el.find('.actions-box .prerequisite-box:first .huo-box').remove();
        this.setFunnelChartWrapDivWH();
    };
    this.initGroup = function () {
        var hml = _.template($(groupTpl).filter("#group-init").html())();
        this.view.$el.find('.actions-box').append(hml);
    };
    this.isAllEmpty = function () {
        return !this.view.$el.find('.actions-box .prerequisite-box').length || !this.view.$el.find('.actions-box  .init').length;
    };
    this.addDragTarAbleCls = function (type) {
        var _this = this;
        type ? this.view.$el.find('.actions-box .term-box:not(".init")').addClass('hover') : this.view.$el.find('.actions-box .term-box:not(".init")').removeClass('hover');
        this.view.$el.find('.actions-box .group-box').each(function (i, itm) {
            var $gp = $(itm), gId = $gp.attr('id')
            if (_this.isConditionLimit(gId)) {
                $gp.find('.term-box:not(".init")').removeClass('hover');
            }

        })
    };
    this.changeHomeIcon = function () {
        var params = util.getLocationParams();
        var data = "{}";
        if (params && params['returnurl']) {
            var header = $('#page-body-header');
            header.addClass('return-url');
            header.find(".return-pages").attr("href",BASE_PATH + params['returnurl']+(params.planId?'?planId='+params.planId:""));
        }
    };
    this.validateMsg=function(){

    };
    this.init = function () {
        var _this = this;
        events = {
            "click ": function (e) {
                var $tar = $(e.target);
                if ($tar.attr('id') != 'triggerConfig' && !$tar.parents('.config-area')[0]) {
                    _this.switchConfigArea(false);
                }
                _this.hideSuggest();
            },
            "click #rui-modals-save": function (e) {
                if ($(e.target).hasClass("rui-disabled")) {
                    return;
                }
                saveBtnDisabled(true);
                if(current_status){
                    var group=getMainInfo();
                    if(!group.length){
                        errorAlertMsg(msg2);
                        return;
                    }
                }
                var name = CURRENTSEGMENTID ? $("#toolbar-title").text() : "未命名-"+getDateStr();
                saveSegmentInfo(name,null)
            },
            "click #rui-modals-edit": function (e) {
                if ($(e.target).hasClass("rui-disabled")) {
                    return;
                }
                editBtnDisabled(true);
                var name = $("#toolbar-title").text();
                var groups = getMainInfo();

                var display="block",
                    disabled="disabled",
                    nameDisabled="disabled",
                    msg="",isSaveBtnDisabed="";
                if(groups.length){
                    display="none";
                    disabled="";
                }
                //有状态，过滤条件又为空时
                if(current_status&&!groups.length){
                    msg=msg2;
                    isSaveBtnDisabed="rui-disabled"
                }
                if(current_status==0){
                    nameDisabled="";
                }
                var win=new Modals.Window({
                    id: "modals-edit",
                    title: '细分信息编辑',
                    content: _.template($(modalsTpl).filter('#tpl-modal-edit').html())({ name: name || "",
                        display:display,
                        disabled:disabled ,
                        nameDisabled:nameDisabled ,
                        msg:msg,
                        status:current_status
                        }),
                    width: 384,
                    buttons: [{
                        text: '保存', cls: 'accept '+isSaveBtnDisabed, handler: function (thiz) {
                            if($('#modals-edit .accept').hasClass("rui-disabled")){
                                return;
                            }
                            var name = $('#audience-name').val();
                            !$.trim(name) && (name = '未命名-'+getDateStr());
                            saveSegmentInfo(name,null);

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
                            editBtnDisabled(false);
                        }
                    }
                })
            },
            "click #aud-tag-edit": function (e) {
                if ($(e.target).hasClass("rui-disabled")) {
                    return;
                }
                tagBtnDisabled(true);
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
                            updateRelTags();
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
                            queryRelTags(renderTagsRel)
                        },
                        close: function () {
                            bindKeydown(false);
                            tagBtnDisabled(false)
                        }
                    }
                })
            },
            "click #triggerConfig": function (e) {
                if (e.currentTarget.className.indexOf("shine-blue") > -1) {
                    e.currentTarget.classList.remove("shine-blue")
                }
                _this.switchConfigArea(true);
            },
            "click .action-input-close": function (e) {
                delSingleCondition(e);
                e.stopPropagation();
            },
            // 取消生效按钮
            "click #audience-uneffect":function(e){
                if ($(e.target).hasClass("rui-disabled")) {
                    return;
                }
                if(!CURRENTSEGMENTID){
                    errorAlertMsg("请先保存数据！");
                    return;
                }
                uneffectBtnDisabled(true);
                new Modals.Confirm({
                    title:'确认取消生效？',
                    content:"<div>取消生效后，受众将不能在活动中使用。</div>",
                    listeners: {//各种监听
                        close: function (type) {
                            if(type){
                                var name = CURRENTSEGMENTID ? $("#toolbar-title").text() : "未命名-"+getDateStr();
                                //cancelEffect(CURRENTSEGMENTID,name);
                                changeStatus(name,0);
                            }else{
                                uneffectBtnDisabled(false);
                            }
                        }
                    }
                });
                e.stopPropagation();
            },
            //生效按钮
            "click #audience-effect": function (e) {
                if ($(e.target).hasClass("rui-disabled")) {
                    return;
                }
                effectBtnDisabled(true);
                var res=validateEffect();
                if(res.isDo){
                    var name = CURRENTSEGMENTID ? $("#toolbar-title").text() : "未命名-"+getDateStr();
                    changeStatus(name,1);
                }else{
                    errorAlertMsg(res.msg);
                    effectBtnDisabled(false);
                }
                e.stopPropagation();

            },
            "mousedown .action-input-close": function (e) {
                //屏蔽移动式出现的可拖拽区域 （否出现bug）
                e.stopPropagation();
            },
            "click .delete-all": function (e) {
                delGroupCondition(e);
            },
            'click .act-box': function (e) {
                var group, gId,
                    tar = e.target, $tar = $(tar);
                if (e.target.nodeName.toLowerCase() == 'input') {
                    var checked = $tar.get(0) && $tar.get(0).checked;
                    var group = $tar.parent().parent().parent(),
                        gId = group.attr('id');
                    if (gId) {
                        _this.loadChartByGroup(gId);
                        _this.checkoutGroup();
                    }
                }
            },
            //推荐标签点击事件
            'click .trigger-tag': function (e) {
                var tar = e.target, $tar = $(tar),text=$tar.text(), id = $tar.attr('attr-id');
                if(text){
                    $(".result-search").val(text);
                    showAudTagSearchDelBtn(text)
                }
                //根据Id获取标签值
                queryTagValsById(id,function(res,tag_group_id){
                    _this.showConditionSearchRes(res.data,tag_group_id);
                    var tag_ids=[];
                    if(res.data.length){
                        res.data.forEach(function(itm,i){
                            tag_ids.push(itm.tag_id);
                        })
                        queryBarChart(tag_ids);
                    }

                } )
                e.stopPropagation();
            },
            //suggest 下拉框点击事件
            "click .aud-suggest-trigger": function (e) {
                var tar = e.target, $tar = $(tar);
                var val = $tar.text(),id=$tar.attr('attr-id');
                val = $.trim(val);
                _this.view.$el.find("#config-area input").val(val);
                // var res = val == "" ? "" : getConditionResDataByKey(val);
                // _this.showConditionSearchRes(res);
                //根据Id获取标签值
                queryTagValsById(id,function(res,tag_group_id){
                    _this.showConditionSearchRes(res.data,tag_group_id);
                    var tag_ids=[];
                    if(res.data.length){
                        res.data.forEach(function(itm,i){
                            tag_ids.push(itm.tag_id);
                        })
                        queryBarChart(tag_ids);
                    }
                } )
               // queryTagValsById(id, _this.showConditionSearchRes);
                _this.view.$el.find("#seg-condition-search").hide();
                e.stopPropagation();
            },
            ///标签搜索框事件
            'keyup .result-search': function (e) {
                var val = $(e.currentTarget).val();
                val = $.trim(val);
                var tpl = "",res = "";
                if (val != "") {
                    $('#aud-tag-search-del').show();
                    querySuggestTagsByName(val, _this.showSuggest);
                } else {
                    $('#aud-tag-search-del').hide();
                    _this.view.$el.find("#seg-condition-search").hide();
                    _this.showConditionSearchRes("");
                }
                //queryTagValsByName(val, _this.showConditionSearchRes);
                //_this.showConditionSearchRes(res);
            },
            'focus .result-search': function (e) {
                var val = $(e.currentTarget).val();
                val = $.trim(val);
                showAudTagSearchDelBtn(val);
                //if (val != "") {
                //    $('#aud-tag-search-del').show();
                //} else {
                //    $('#aud-tag-search-del').hide();
                //}
            },
            //清空标签搜索条件
            'click #aud-tag-search-del': function (e) {
                $(e.currentTarget).hide();
                $('#aud-tag-search').val("").focus();
                _this.view.$el.find("#seg-condition-search").hide();
                _this.showConditionSearchRes("");
            }



        };

    };
    this.focusInput = function () {
        _this.view.$el.find('.result-search').focus();

    };
    this.config = function (view, charts, drag) {
        this.view = view;
        this.charts = charts;
        this.drag = drag;
    };
    this.bindEvent = function () {
        return events;
    }
    this.hideSuggest = function () {
        _this.view.$el.find("#seg-condition-search").hide();
    };
    this.showSuggest = function (res) {
        var tpl = _.template($(resultAreaTpls).filter("#suggest").html())({
            result: res
        })
        var list = _this.view.$el.find("#seg-condition-search");
        list.show();
        list.html(tpl)

    };
    this.tagsInit = function () {
        queryRecommendTags();
    }
    //展示搜索结果
    this.showConditionSearchRes = function (data, tag_group_id) {
        var tpl = "";
        var res = [];
        if (typeof data == "string") {
            var tagHtml = _.template($(resultAreaTpls).filter('#rec-tags').html())({data: RECOMMENDTAGS});
            tpl = _.template($(resultAreaTpls).filter('#result-init').html())({tags: tagHtml});
        } else {
            res = data.length ? data : [];
            tpl = _.template($(resultAreaTpls).filter('#result-tpl').html())({data: res, tag_group_id: tag_group_id});
        }
       // Random = data ? (data.length ? 1 : null) : null;
       // console.log(formatter.tags2XAxis(res))
      //  _this.loadChartByGroup("bar1", null, formatter.tags2XAxis(res));
        changeResultArea(tpl);
    }
    /**
     * charts 初始化
     */
    this.initCharts = function () {
        var box = $("#config-area .drawing-box"), width = ($('#segment-id').width() / 2) * 0.8 - 80, height = box.height();
        $('#drawing4').css({width: width});
        var _this = this;
        initChart({
            id: 'bar1',//柱状图
            type: 'bar',
            renderTo: '#drawing4',
            tooltip : {
               formatter: "{b} : {c}"
            },
            title: {
                text: ''
            },
            legend: {
                data: []
            },
            xAxis: {
                splitLine: {show: false},
                data: [],
                show: false
            },
            yAxis: {
                splitLine: {show: false},
                show: false
            },
            series: [{data: []}]

        });

    };
    //add background img
    this.addBgImg = function (id, type) {
        var $tar = this.view.$el.find('#' + id);
        type ? $tar[0].classList.add('no-data') : $tar[0].classList.remove('no-data');

    }
    /**
     *  获取漏斗最大个数
     * @returns {Array.length|*}
     */
    this.getFunnelMaxTotal = function () {
        var arr = this.getFunnelChartData();
        var tmpArr = [];
        if (arr && arr.length > 0) {
            arr.forEach(function (itm, i) {
                var last = itm[0].data[itm[0].data.length - 1];
                last && tmpArr.push(last.value);
            })

        }
        var sum = 0;
        tmpArr.forEach(function (itm, i) {
            sum += itm;
        })
        return sum;
    };
    /**
     * 获取漏斗最小数据
     * @returns {Array}
     */
    this.getFunnelMinTotal = function () {
        var arr = this.getFunnelChartData();
        var tmpArr = [];
        if (arr && arr.length > 0) {
            arr.forEach(function (itm, i) {
                if (itm[0] && itm[0].data && itm[0].data[0]) {
                    tmpArr.push(itm[0].data[0].value)
                }
            })

        }
        tmpArr.sort(function (a, b) {
            return a < b ? 1 : -1
        });
        return tmpArr[0];
    };
    /**
     * 获取漏斗数据
     * @returns {Array}
     */
    this.getFunnelChartData = function () {
        var arr = [];
        var charts = this.charts.getCharts();
        for (var k in charts) {
            var chart = charts[k];
            var opt = chart.getOption();
            if (opt && opt.type == 'funnel') {
                arr.push(opt.series)
            }
        }
        return arr;
    };

    //获取工具栏信息
    this.queryHeaderInfo = function (id) {
        util.api({
            url: API.queryHeaderInfo,
            type: 'get',
            data: {
                "segment_head_id": id
            },
            success: function (res) {
                //{"code":0,"msg":"success","total":1,"data":[{"segment_name":"母婴北京vip","publish_status":0}]}
                //segment_name 细分名称
                //publish_status 0:未发布,1:已发布,2:活动中
                //oper	string	最后修改人
                //updatetime	datetime	最后修改时间
                //res={"code":0,"msg":"success","total":1,"data":[{"segment_name":"母婴北京vip","publish_status":0}]};
                if (res && res.code == 0 && res.data && res.data.length) {
                    var rec = formatter.headerInfo(res.data[0]);
                    current_status=rec.release;
                    pageSetByStatus(current_status);
                    changeSegmentTitle(rec);
                    CURRENTSEGMENTID = id;
                    //打开添加关联标签功能
                    showEditTag(true);
                    queryMainInfo(CURRENTSEGMENTID,function(){
                        pageSetByStatus(current_status);
                         _this.loadAllFunnelChart();

                    });
                }
            },
            error: function (res) {
                errorAlertMsg();
            }
        })
    };
    this.loadData = function () {
        //MOCK
        /*{
         "tag_id": 106,
         "tag_name": "标签名字",
         "tag_group_name":"父标签组的名字",
         "exclude": "0" //是否排除
         },*/
        var params = util.getLocationParams();//||{audienceId:124};
        if (!params) {
            return;
        } else if (params.audienceId) {
            CURRENTSEGMENTID = params.audienceId;
            this.queryHeaderInfo(CURRENTSEGMENTID)

        }
    };

    this.init();

}

module.exports = controller;
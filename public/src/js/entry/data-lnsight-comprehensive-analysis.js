/**
 * Created by AnThen on 2016-5-20.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/data-lnsight/comprehensive-analysis-tpl.html");

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 3,
    leftMenuCurName:'综合分析'
});

/*本页全局使用*/
//全局变量
var iframeTrueSrc = "http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854ccb57d0154ccce6788006c#mode=integrated&layout=table",
    iframeFalseSrc = "comprehensive-analysis-empty.html";

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({segmentData:[],activityData:[]}),
    //组织模块
    template:{
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateSegment: _.template($(tpl).filter('#tpl-filled-segment').html()),
        templateActivity: _.template($(tpl).filter('#tpl-filled-activity').html())
    },
    //设置响应事件
    events: {
        "click #filled-segment-all": "segmentAll",
        "click .filled-segment-child": "segmentChild",
        "click #filled-activity-all": "activityAll",
        "click .filled-activity-child": "activityChild"
    },
    /*取得人群i6666 d*/
    fetchAudienceUnite: function(sids,aids){
        var url = "http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854ccb57d0154ccce6788006c",
            iframeName = "bas-iframe",
            postData,
            postDatato,
            segmentData;
            ;
        util.api({
            url: "?method=mkt.dataanalysis.audname.list.get",
            type: 'get',
            data: {"audience_type":0,"audience_ids":sids},
            success: function (res) {
                if(res.code == 0){
                    if(res.data.length>0){
                        segmentData = res.data;
                        util.api({
                            url: "?method=mkt.dataanalysis.audiences.get",
                            type: 'get',
                            data: {"audience_type":1,"audience_ids":aids},
                            success: function (ress) {
                                if(ress.code == 0){
                                    if(ress.data.length>0){
                                        postDatato = segmentData.concat(ress.data);
                                        postData = {userIds:postDatato};
                                        util.postIframeData(url,iframeName,postData);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    fetchAudience: function(ids,type){
        var url = "http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854ccb57d0154ccce6788006c",
            iframeName = "bas-iframe",
            postData;
        util.api({
            url: "?method=mkt.dataanalysis.audiences.get",
            type: 'get',
            data: {"audience_type":type,"audience_ids":ids},
            success: function (res) {
                if(res.code == 0){
                    if(res.data.length>0){
                        postData = {userIds:res.data};
                        util.postIframeData(url,iframeName,postData);
                    }
                }
            }
        });
    },
    /*设置iframe*/
    resetIframe: function(){
        var fetchData = this.checkboxChecked();
        var sids = fetchData.segment.toString(),aids = fetchData.activity.toString();
        if((fetchData.segment.length<1)&&(fetchData.activity.length<1)){
            $('#iframe').attr('src',iframeFalseSrc);
        }else{
            if((fetchData.segment.length>0)&&(fetchData.activity.length>0)){
                this.fetchAudienceUnite(sids,aids);
            }else if((fetchData.segment.length>0)&&(fetchData.activity.length<1)){
                this.fetchAudience(sids,0);
            }else{
                this.fetchAudience(aids,1);
            }
        }
    },
    /*判断checkbox是否全选*/
    checkboxChecked: function(){
        var segmentAll = $('#filled-segment-li input[type=checkbox]'),
            activityAll = $('#filled-activity-li input[type=checkbox]');
        var thisResult;
        var sChecked = new Array(),si = 0,sj = 0;
        var aChecked = new Array(),ai = 0,aj = 0;
        segmentAll.each(function(){
            var type = $(this).is(':checked');
            if(type){
                sChecked[si] = $(this).attr('name');
                si++;
            }
            sj++;
        });
        activityAll.each(function(){
            var type = $(this).is(':checked');
            if(type){
                aChecked[ai] = $(this).attr('name');
                ai++;
            }
            aj++;
        });
        thisResult = {"segment":sChecked,"activity":aChecked};
        return thisResult;
    },
    segmentAll: function(e){
        var thisType = $(e.currentTarget).is(':checked'),
            segmentAll = $('#filled-segment input[type=checkbox]');
        if(thisType){
            segmentAll.prop("checked",true);
        }else{
            segmentAll.prop("checked",false);
        }
        this.resetIframe();
    },
    segmentChild: function(e){
        var segmentAll = $('#filled-segment input[type=checkbox]'),
            monitor = $('.filled-segment-child'),
            state = false;
        monitor.each(function(){
            var thisType = $(this).is(':checked');
            if(thisType){
                state = true;
            }else{
                state = false;
                return false;
            }
        });
        if(state){
            segmentAll.prop("checked",true);
        }else{
            $('#filled-segment-all').prop("checked",false);
        }
        this.resetIframe();
    },
    activityAll: function(e){
        var thisType = this.checkboxCheckedTrue($(e.currentTarget)),
            activityAll = $('#filled-activity input[type=checkbox]');
        if(thisType){
            activityAll.prop("checked",true);
        }else{
            activityAll.prop("checked",false);
        }
        this.resetIframe();
    },
    activityChild: function(e){
        var activityAll = $('#filled-activity input[type=checkbox]'),
            monitor = $('.filled-activity-child'),
            state = false;
        monitor.each(function(){
            var thisType = $(this).is(':checked');
            if(thisType){
                state = true;
            }else{
                state = false;
                return false;
            }
        });
        if(state){
            activityAll.prop("checked",true);
        }else{
            $('#filled-activity-all').prop("checked",false);
        }
        this.resetIframe();
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
        this.fetchCheckboxData();
    },
    /*整理checkbox值*/
    formatCheckboxData: function(data,total,type){
        var thisData = new Array();
        for(var i=0; i<total; i++){
            if(data[i].audience_list_name){
                thisData[i] = {"audience_list_id":data[i].audience_list_id,"audience_list_name":data[i].audience_list_name,"audience_list_type":data[i].audience_list_type};
            }else{
                thisData[i] = {"audience_list_id":data[i].audience_list_id,"audience_list_name":"未命名","audience_list_type":data[i].audience_list_type};
            }
        }
        switch (type){
            case "segment":
                this.model.set({segmentData: thisData});
                break;
            case "activity":
                this.model.set({activityData: thisData});
                break;
        }
    },
    /*取得checkbox值*/
    fetchCheckboxData: function(){
        var that = this;
        var segmentData = new Array(),activityData = new Array();
        util.api({
            url: "?method=mkt.dataanalysis.audname.list.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.code == 0){
                    var s = 0,a = 0;
                    for(var i=0; i<res.total; i++){
                        if(res.data[i].audience_list_type == 0){segmentData[s] = res.data[i];s++;}
                        if(res.data[i].audience_list_type == 1){activityData[a] = res.data[i];a++;}
                    }
                    that.formatCheckboxData(segmentData,s,'segment');
                    that.formatCheckboxData(activityData,a,'activity');
                }
            }
        });
    },
    //组织完试图做的事情
    afterRender: function () {
        /*初始化iframe高度*/
        var segmentAreaHeight = $('#segment-area').height(),
            activityAreaHeight = $('#activity-area').height();
        $('#bas-area').css('top',segmentAreaHeight+activityAreaHeight+32);
        /*初始化iframe*/
        if(util.geturlparam('crowd')==1){
            $('#filled-segment-5').prop("checked",true);
            $('#iframe').attr('src',iframeTrueSrc);
        }else{
            $('#filled-segment-5').prop("checked",false);
            $('#iframe').attr('src',iframeFalseSrc);
        }
    },
    //组织视图模板
    render: function () {
        //加载主模板
        this.$el.html(this.template.templateMain(this.model.toJSON()));
        $('#filled-segment-li').html(this.template.templateSegment(this.model.toJSON()));
        $('#filled-activity-li').html(this.template.templateActivity(this.model.toJSON()));
        this.afterRender();
        return this;
    }
})    ;

/************生成页面************/
var container = new Container({
    el: '#page-body'
});
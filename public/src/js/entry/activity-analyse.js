/**
 * Created by AnThen on 2016-5-19.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/activity/analyse-tpl.html");

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName:'活动管理'
});

/*加载echarts模块*/
let EChartsAxis = require('module/echarts/echarts-axis.js');
let EChartsFunnel = require('module/echarts/echarts-funnel.js');
let EChartsAnnular = require('module/echarts/echarts-annular.js');

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        campaign_name:'',
        outline:{
            start_time: '无开始时间',
            end_time: '无结束时间',
            send_channel: '微信',
            campaign_audience_target: [],
            campaign_audience_target_count: 0,
            campaign_content: [],
            campaign_content_count: 0
        }
    }),
    //组织模块
    template:{
        templateMain:_.template($(tpl).filter('#tpl-content').html()),
        templateOutline:_.template($(tpl).filter('#tpl-outline').html())
    },
    //设置响应事件
    events: {
        "click #uvBut": "resetUvpv",
        "click #pvBut": "resetUvpv",
        "click #date-month": "resetDate",
        "click #date-week": "resetDate",
        "click #date-day": "resetDate"
    },
    dropdownButton: function(){
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
    },
    fetchID: function(){
        let campaignId = util.geturlparam('id');
        return campaignId;
    },
    outline: function(){
        let campaignId = this.fetchID();
        let that = this;

        let campaignName,outlineData;
        let audience_target = new Array(),audience_target_count = 0,content = new Array(),content_count = 0;
        util.api({
            data: {method: 'mkt.campaign.profile.list',campaign_head_id:campaignId},
            success: function (res) {
                if(res.code == 0){
                    audience_target_count = res.campaign_audience_target.length;
                    content_count = res.campaign_content.length;

                    for(let i=0; i<audience_target_count; i++){
                        audience_target[i] = {
                            name:res.campaign_audience_target[i].audience_name,
                            count:res.campaign_audience_target[i].population_count
                        };
                    }
                    for(let i=0; i<content_count; i++){
                        content[i] = {
                            type:res.campaign_content[i].content_type,
                            name:res.campaign_content[i].content_name
                        };
                    }
                    campaignName = res.campaign_name;
                    if(campaignName){$('#campaign_name').text(campaignName)}
                    outlineData = {
                        start_time: res.start_time || '无开始时间',
                        end_time: res.end_time || '无结束时间',
                        send_channel: res.sendChannel || '微信',
                        campaign_audience_target: audience_target,
                        campaign_audience_target_count: audience_target_count,
                        campaign_content: content,
                        campaign_content_count: content_count
                    };
                    $('#outline-box', that.$el).html(that.template.templateOutline({outline:outlineData}));
                    that.dropdownButton();
                }
            }
        });
    },
    resetUvpv: function(e){
        let thisDiv = $(e.currentTarget),thisId = thisDiv.attr('id');
        let uvpvBox = $('#uvpv-box');
        uvpvBox.children('div').each(function(){
            $(this).removeClass('over');
        });
        thisDiv.addClass('over');
        switch (thisId){
            case 'uvBut':
                uvpvBox.attr('type','uvBut');
                break;
            case 'pvBut':
                uvpvBox.attr('type','pvBut');
                break;
        }
        this.resetActivityAnalysis();
    },
    resetDate: function(e){
        let thisDiv = $(e.currentTarget),thisId = thisDiv.attr('id');
        let dateBox = $('#date-box');
        dateBox.children('div').each(function(){
            $(this).removeClass('over');
        });
        thisDiv.addClass('over');
        switch (thisId){
            case 'date-month':
                dateBox.attr('type','month');
                break;
            case 'date-week':
                dateBox.attr('type','week');
                break;
            case 'date-day':
                dateBox.attr('type','day');
                break;
        }
        this.resetActivityAnalysis();
    },
    resetActivityAnalysis: function(){
        let type,date,link='';
        let uvpvBox = $('#uvpv-box'),dateBox = $('#date-box');
        type = uvpvBox.attr('type');
        date = dateBox.attr('type');
        this.activityAnalysis(type,date,link);
    },
    activityAnalysis: function(type,date,link){
        let thisType = type,thisDate = date,thisLink = link;
        let campaignId = this.fetchID();
        let myChart = echarts.init(document.getElementById('active'));
        myChart.showLoading();
        let resData;
        let legendData=[],dimensionList=[],thisDimensionList=[],xAxis=[],series=[],seriesData=[];
        let chartsData = {
            div: myChart,
            divId:$('#active'),
            legend: {
                y: 'top',orient: 'horizontal',
                data: []
            },
            formatter: function(params){
                var date = params[0].name;
                var dian = "",
                    dian1 = "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:",
                    dian12 = "'></span>";
                var value = "";
                var num = "";
                var tlp = "";
                var re;
                for(var i=0; i<params.length; i++){
                    dian = dian1 + params[i].color + dian12;
                    value = params[i].seriesName;
                    num = params[i].value;
                    if(i == (params.length)-1){
                        tlp += dian + value + "：" + num;
                    }else{
                        tlp += dian + value + "：" + num + "<br>";
                    }
                }
                re = date + "<br>" + tlp;
                return re;
            },
            xAxis: [],
            yAxisUnit:'{value} 人',
            series: []
        };
        let startTime='',endTime='';

        util.api({
            data: {method: 'mkt.campaign.analysis.list',campaign_head_id:campaignId},
            success: function (res) {
                if(res.code == 0){
                    /*组织echarts数据*/
                    switch (thisDate){
                        case 'day':
                            resData = res.data[0].dayList;
                            chartsData.xAxisFormatter = function (value,index) {
                                if(index % 7 == 0){
                                    return value;
                                }
                                if(index == 59){
                                    return value;
                                }
                            };
                            break;
                        case 'week':
                            resData = res.data[0].weekList;
                            break;
                        case 'month':
                            resData = res.data[0].monthList;
                            break;
                    }
                    if(resData.length > 0){
                        dimensionList = resData[0].dimensionList;
                        for(let i=0; i<dimensionList.length; i++){
                            xAxis[i] = dimensionList[i].date;
                        }
                        for(let i=0; i<resData.length; i++){
                            legendData[i] = resData[i].dimension;
                            thisDimensionList = resData[i].dimensionList;
                            for(let j=0; j<thisDimensionList.length; j++){
                                seriesData[j] = thisDimensionList[j].count;
                            }
                            series[i] = {name:resData[i].dimension,data:seriesData}
                        }
                        chartsData.legend.data = legendData;
                        chartsData.xAxis = xAxis;
                        chartsData.series = series;
                        /*重置始末日期*/
                        startTime = dimensionList[0].date;
                        endTime = dimensionList[dimensionList.length-1].date;
                    }
                    EChartsAxis.axis(chartsData);
                    $('#startTime').text(startTime);
                    $('#endTime').text(endTime);
                }
            }
        });
    },
    activityTransformationAnalysis: function(){
        let campaignId = this.fetchID();
        let myChart = echarts.init(document.getElementById('analysis-box'));
        myChart.showLoading();
        let resData;
        let legendData=['人数','覆盖','触达','参与'],data=[];
        let chartsData = {
            div: myChart,
            divId:$('#analysis-box'),
            title: '活动转化分析',
            legend: {
                y: 'bottom',orient: 'horizontal',
                data: []
            },
            data:[]
        };
        util.api({
            data: {method: 'mkt.campaign.conversion.list',campaign_head_id:campaignId},
            success: function (res) {
                if(res.code == 0){
                    resData = res.data[0];
                    if(res.data.length > 0){
                        data[0] = {value: '100', name: legendData[0]};
                        data[1] = {value: (resData.people_cover_count/resData.people_total_count)*100, name: legendData[1]};
                        //data[2] = {value: '', name: legendData[2]};
                        //data[3] = {value: '', name: legendData[3]};
                        chartsData.legend.data = legendData;
                        chartsData.data = data;
                    }
                    EChartsFunnel.funnel(chartsData);
                }
            }
        });
    },
    userDataSource: function(){
        let campaignId = this.fetchID();
        let myChart = echarts.init(document.getElementById('distribution-box'));
        myChart.showLoading();
        let resData;
        let legend=[],data=[];
        let chartsData = {
            div: myChart,
            divId:$('#distribution-box'),
            title: '用户来源分布',
            legend: {
                y: 'bottom',orient: 'horizontal',
                data: []
            },
            data: []
        };
        util.api({
            data: {method: 'mkt.campaign.customer.source.list',campaign_head_id:campaignId},
            success: function (res) {
                if(res.code == 0){
                    resData = res.data;
                    for(let i=0; i<resData.length; i++){
                        legend[i] = resData[i].source;
                        data[i] = {value:resData[i].people_count,name:resData[i].source};
                    }
                    chartsData.legend.data = legend;
                    chartsData.data = data;

                    EChartsAnnular.annular(chartsData);
                }
            }
        });
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
    },
    //组织完试图做的事情
    afterRender: function () {
        //活动概要
        this.outline();
        //活动分析
        this.activityAnalysis('uv','week','link');
        //活动转化分析
        this.activityTransformationAnalysis();
        //客户来源分布
        this.userDataSource();
    },
    //组织视图模板
    render: function () {
        //加载主模板
        this.$el.html(this.template.templateMain(this.model.toJSON()));
        this.afterRender();
        return this;
    }
})    ;

/************生成页面************/
var container = new Container({
    el: '#page-body'
});
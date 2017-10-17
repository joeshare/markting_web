/**
 * Created by AnThen on 2016-8-8.
 * 微信二维码-分析 es6+react版
 */
/*加载本页模块*/
var tpl = require("html/asset/qrcode-analyze-tpl.html");
/*组件*/
var Modals = require('component/modals.js');
var dateTime = require('module/plan/utils/dateTime.js');/*时间插件*/
var EChartsAxisDataZoom = require('module/echarts/echarts-axis-datazoom.js');
let pagination = require('plugins/pagination')($);//分页插件
/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName: '微信二维码'
});
var Container = Backbone.View.extend({
    //初始化model
    //时间time状态：[today,yesterday,last7,last30,intervalHours,intervalDay]
    model: new Backbone.Model({
        update: false,
        time:"",
        id:"",
        today: "",
        yesterday: "",
        last7: "",
        last30: "",
        start_date: "",
        start_time: "",
        choose_start_time: "",
        end_date: "",
        end_time: "",
        subscription:{acct:0,name:'全部'},
        channel:{id:0,name:'全部'},
        subscriptionList:[],
        channelList:[],
        tfootList:[]
    }),
    //组织模块
    template: {
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateTbodyBox: _.template($(tpl).filter('#tpl-tbody').html()),
        templateTfootBox: _.template($(tpl).filter('#tpl-tfoot').html())
    },
    //设置响应事件
    events: {
        "click #goBack": "goBack",
        "click #exact-area .exact-box": "resetExactType",
        "click #start_date": "resetStartDate",
        "click #end_date": "resetEndDate",
        "click #subscription-list a": "resetSubscription",
        "click #channel-list a": "resetChannel"
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
    goBack:function(){
        window.history.go(-1);
    },
    resetExactType: function(e){
        let thisType = $(e.currentTarget).attr('type');
        let today = this.model.attributes.today,
            yesterday = this.model.attributes.yesterday,
            last7 = this.model.attributes.last7,
            last30 = this.model.attributes.last30;
        let thisStartTime,thisEndTime;
        switch (thisType){
            case 'today':
                thisStartTime=today; thisEndTime=today;
                break;
            case 'yesterday':
                thisStartTime=yesterday; thisEndTime=yesterday;
                break;
            case 'last7':
                thisStartTime=last7[0]; thisEndTime=last7[1];
                break;
            case 'last30':
                thisStartTime=last30[0]; thisEndTime=last30[1];
                break;
        }
        $('#exact-area .exact-box').removeClass('active');
        $(e.currentTarget).addClass('active');
        this.model.set({
            time: thisType,
            start_time: thisStartTime,
            end_time: thisEndTime
        });
    },
    resetStartDate: function(){
        let that =this;
        let start_date = this.model.attributes.start_date,end_time = this.model.attributes.end_time;
        let end_date = this.model.changed.end_date;
        let thisDate;
        $('#start_date').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 5,
            min: new Date(start_date),
            max: new Date(end_date),
            onClose: function(){
                thisDate = this.component.$node.context.value;
                if(thisDate == end_time){
                    that.model.set({time: "intervalHours",start_time:thisDate});
                }else{
                    that.model.set({time: "intervalDay",start_time:thisDate});
                }
            }
        });
    },
    resetEndDate: function(){
        let that =this;
        let start_date = this.model.attributes.start_date,start_time = this.model.attributes.start_time;
        let end_date = this.model.changed.end_date;
        let thisDate;
        $('#end_date').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 5,
            min: new Date(start_date),
            max: new Date(end_date),
            onClose: function(){
                thisDate = this.component.$node.context.value;
                if(thisDate == start_time){
                    that.model.set({time: "intervalHours",start_time:thisDate});
                }else{
                    that.model.set({time: "intervalDay",start_time:thisDate});
                }
            }
        });
    },
    resetSubscription: function(e){
        let thisId = $(e.currentTarget).attr('acct'), thisName = $(e.currentTarget).attr('name');
        this.model.set({subscription:{acct:thisId,name:thisName}});
    },
    resetChannel: function(e){
        let thisId = $(e.currentTarget).attr('id'), thisName = $(e.currentTarget).attr('name');
        this.model.set({
            channel:{id:thisId,name:thisName}
        });
    },
    fetchTime: function(){
        let id = util.geturlparam('id');
        let that = this;
        let thisData,last7=[],last30=[],subscription={acct:0,name:'全部'},channel={id: 0,name:'全部'};
        util.api({
            data: {method: 'mkt.weixin.analysis.date',qrcode_id:id},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    last7 = [thisData.Day7.StarDate,thisData.Day7.EndDate];
                    last30 = [thisData.Day30.StarDate,thisData.Day30.EndDate];
                    if(thisData.wx_acct != ''){
                        subscription={acct:thisData.wx_acct,name:thisData.wxmp_name};
                    }
                    if(thisData.ch_code != ''){
                        channel={id:thisData.ch_code,name:thisData.ch_name};
                    }
                    that.model.set({
                        id:id,
                        today: thisData.Today.Today,
                        yesterday: thisData.Yestoday.Yestoday,
                        last7: last7,
                        last30: last30,
                        start_date: thisData.RecordScope.StarDate,
                        end_date: thisData.RecordScope.EndDate,
                        time:"last7",
                        start_time: last7[0],
                        end_time: last7[1],
                        subscription:subscription,
                        channel:channel
                    });
                }
            }
        });
    },
    fetchSubscription: function(){
        let that = this;
        let subscription = [];
        let thisData;
        util.api({
            data: {method: 'mkt.weixin.register.list'},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<res.total; i++){
                        subscription[i] = {name: thisData[i].name, acct:thisData[i].wx_acct}
                    }
                    subscription[res.total] = {acct:0,name: '全部'};
                    that.model.set({subscriptionList:subscription});
                    that.dropdownButton();
                }
            }
        });
    },
    fetchChannel: function(){
        let that = this;
        let channel = [],trueI=0,channelFalse=[],channelLast=[],falseI=0;
        let thisData,thisSystem=false;
        util.api({
            data: {method: 'mkt.weixin.channel.list'},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<thisData.length; i++){
                        if(thisData[i].channel_type == 0){
                            thisSystem=true;
                            channel[trueI] = {
                                id: thisData[i].channel_id,
                                name:thisData[i].channel_name
                            };
                            trueI++;
                        }else{
                            thisSystem=false;
                            channelFalse[falseI] = {
                                id: thisData[i].channel_id,
                                name:thisData[i].channel_name
                            };
                            falseI++;
                        }
                    }
                    channelLast[falseI++] = {id:0,name: '全部'};
                    channelFalse = channelFalse.concat(channelLast);
                    channel = channel.concat(channelFalse);
                    that.model.set({channelList:channel,update:true});
                }
            }
        });
    },
    formatEchartsData: function(data){
        let myChart = echarts.init(document.getElementById('echarts-box'));
        myChart.showLoading();

        let resData,remainder,xAxisNum;
        let legendData=[];
        let chartsData = {
            div: myChart,
            divId:$('#echarts-box'),
            title: '每日关注量分布',
            legend: {
                y: 'top',x: 'right',orient: 'horizontal',
                data: []
            },
            xAxis: [],
            series: []
        };

        resData = data;
        for(let i=0; i<resData.series.length; i++){
            legendData[i] = resData.series[i].name;
        }
        chartsData.legend.data = legendData;
        chartsData.xAxis = resData.date;
        chartsData.series = resData.series;
        EChartsAxisDataZoom.axis(chartsData);
    },
    fetcEcharts: function(){
        let that = this;
        /*初始化变量*/
        let time = this.model.attributes.time;
        let start_time = this.model.attributes.start_time;
        let end_time = this.model.attributes.end_time;
        let subscription = this.model.attributes.subscription.name;
        let channel = this.model.attributes.channel.id;
        /*编写*/
        if(time!=''){
            if((time=='today')||(time=='yesterday')||(time=='intervalHours')||(start_time==end_time)){
                util.api({
                    data: {
                        method: "mkt.weixin.analysis.hours.list",
                        date: start_time,
                        wx_name: subscription,
                        ch_code: channel,
                        days_type: time
                    },
                    success: function (res) {
                        if(res.code == 0){
                            that.formatEchartsData(res.data[0])
                        }
                    }
                });
            }else{
                util.api({
                    data: {
                        method: "mkt.weixin.analysis.days.list",
                        start_date: start_time,
                        end_date: end_time,
                        wx_name: subscription,
                        ch_code: channel,
                        days_type: time
                    },
                    success: function (res) {
                        if(res.code == 0){
                            that.formatEchartsData(res.data[0])
                        }
                    }
                });
            }
        }
    },
    fetcTbody: function(){
        let that = this;

        let start_time = this.model.attributes.start_time;
        let end_time = this.model.attributes.end_time;
        let subscription = this.model.attributes.subscription.acct;
        let channel = this.model.attributes.channel.id;

        let tbody = [];
        let thisData;
        if((start_time!='')&&(end_time!='')){
            util.api({
                data: {
                    method: 'mkt.weixin.analysis.chdata.list',
                    wx_name: subscription,
                    ch_code: channel,
                    start_date: start_time,
                    end_date: end_time
                },
                success: function (res) {
                    if(res.code == 0){
                        thisData = res.data;
                        for(let i=0; i<res.total; i++){
                            tbody[i] = {
                                subscription:thisData[i].wx_name,
                                channel:thisData[i].ch_name,
                                scan_code:thisData[i].total_scan,
                                scan_code_number:thisData[i].total_scan_user,
                                total_attention:thisData[i].total_focus,
                                new_attention:thisData[i].new_focus,
                                net_interest:thisData[i].add_focus,
                                drain_attention:thisData[i].lost_focus
                            };
                        }
                    }
                    $('#tbody-box').html(that.template.templateTbodyBox({tbodyList:tbody}));
                }
            });
        }
    },
    fetcTfoot: function(){
        let that = this;

        let start_time = this.model.attributes.start_time;
        let end_time = this.model.attributes.end_time;
        let subscription = this.model.attributes.subscription.acct;
        let channel = this.model.attributes.channel.id;

        let tfoot = [];
        let thisData,average,sum,max;
        if((start_time!='')&&(end_time!='')){
            util.api({
                data: {
                    method: 'mkt.weixin.analysis.chdata.summary',
                    wx_name: subscription,
                    ch_code: channel,
                    start_date: start_time,
                    end_date: end_time
                },
                success: function (res) {
                    if(res.code == 0){
                        thisData = res.data[0];
                        average = thisData.average;
                        tfoot[0] = {
                            subscription:"平均",
                            channel:"",
                            scan_code:average.amount_scan,
                            scan_code_number:average.amount_scan_user,
                            total_attention:average.amount_focus,
                            new_attention:average.new_focus,
                            net_interest:average.add_focus,
                            drain_attention:average.lost_focus
                        };
                        sum = thisData.sum;
                        tfoot[1] = {
                            subscription:"汇总",
                            channel:"",
                            scan_code:sum.amount_scan,
                            scan_code_number:sum.amount_scan_user,
                            total_attention:sum.amount_focus,
                            new_attention:sum.new_focus,
                            net_interest:sum.add_focus,
                            drain_attention:sum.lost_focus
                        };
                        max = thisData.max;
                        tfoot[2] = {
                            subscription:"历史最高",
                            channel:"",
                            scan_code:[max.amount_scan,max.amount_scan_date],
                            scan_code_number:[max.amount_scan_user,max.amount_scan_user_date],
                            total_attention:[max.amount_focus,max.amount_focus_date],
                            new_attention:[max.new_focus,max.new_focus_date],
                            net_interest:[max.add_focus,max.add_focus_date],
                            drain_attention:[max.lost_focus,max.lost_focus_date]
                        };

                    }
                    $('#tfoot-box').html(that.template.templateTfootBox({tfootList:tfoot}));
                }
            });
        }
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
        /*初始化数据*/
        this.fetchTime();
        this.fetchSubscription();
        this.fetchChannel();
    },
    /*实例化分页插件*/
    setPagination() {
        var that = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: 3,//最多显示页数
                onPageClick: function (pageNumber, event) {
                    that.fetcTbody(pageNumber,3);
                }
            });
        }
    },
    //组织完试图做的事情
    afterRender: function () {
        var update = this.model.attributes.update;
        if(update){
            this.fetcEcharts();
            this.fetcTbody();
            this.dropdownButton();
            this.fetcTfoot();
        }
    },
    /*组织视图模板*/
    render: function () {
        //加载主模板
        this.$el.html(this.template.templateMain(this.model.toJSON()));
        this.setPagination();
        this.afterRender();
        return this;
    }
});
/************生成页面************/
var container = new Container({
    el: '#page-body'
});

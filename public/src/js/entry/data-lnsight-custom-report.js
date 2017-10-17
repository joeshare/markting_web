/**
 * Created by AnThen on 2016-5-20.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/data-lnsight/custom-report-tpl.html");

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 3,
    leftMenuCurName:'定制报表'
});

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template:_.template($(tpl).filter('#tpl-content').html()),
    //设置响应事件
    events: {
        "click #tab-table": "tabTable"
    },

    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
        this.fetchRadioData();
    },
    /*取得radio值*/
    fetchRadioData: function(){
        var that = this;

    },
    //组织完试图做的事情
    afterRender: function () {
        var segmentAreaHeight = $('#segment-area').height();
        $('#bas-area').css('top',segmentAreaHeight+16);
    },
    //组织视图模板
    render: function () {
        //加载主模板
        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender();
        return this;
    }
})    ;

/************生成页面************/
var container = new Container({
    el: '#page-body'
});
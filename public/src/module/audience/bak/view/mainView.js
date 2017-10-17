/**
 * Created by AnThen on 2016-4-20.
 */
/*初始化必须的模块*/
'use strict';//严格模式
//加载本页模块
var tpl = require("../tpl/segment-tpl.html");
var modalsTpl = require("../tpl/modal-tpl.html");
var toolbarTpl = require("../tpl/toolbar.html");
/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'受众细分'
});
//Model
var DragModel=require('./dragModel.js');
var ChartModels=require('./chartModel.js');
//控制
var mainController=require('./mainController.js');
var Controller=new mainController();
//View
var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        audienceTitle: _.template($(toolbarTpl).filter('#toolbar-init').html())(),
        elementNum: 0
    }),
    //组织模块
    template: _.template($(tpl).filter('.tpl-con').html()),
    //设置响应事件
    events:Controller.bindEvent(),
    initialize: function(){
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
    },
    //组织视图模板
    render: function(){
        var that = this;
        this.$el.find('#page-body').html(this.template(this.model.toJSON()));
        that.controller=Controller;
        that.controller.config(that,new ChartModels(that),new DragModel(that));
        that.controller.initCharts();
        that.controller.tagsInit();
        that.controller.changeHomeIcon();
        that.controller.loadData();
        return this;
    }
});

module.exports=Container;
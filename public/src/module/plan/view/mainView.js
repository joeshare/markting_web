/**
 * Created by AnThen on 2016-4-29.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("../tpl/plan-tpl.html");
var modalTpls=require('../tpl/modal-tpl.html');
var menuTpl=require('../tpl/menu-tpl.html');
//加载组件
var layer = require('plugins/layer.js');//弹窗插件
/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName:'活动编排'
});
var DragModel=require('../model/dragModel.js');
var TipModel=require('../model/tipModel.js');
var mainController=require('../controller/mainController.js');
var menuController=require('../controller/menuController.js');
var Controller=new mainController();
var tooblarTpls=require('../tpl/toolbar.html');
var MenuDataModel=require('../model/menuDataModel.js');
var Painter=require('../utils/painter.js');
//TODO::
//1.1 版本不显示BAS 功能
window.isBAS=false;
var Container = Backbone.View.extend({
        //初始化model
        model: new Backbone.Model({
            audienceTitle: _.template($(tooblarTpls).filter('#toolbar-init').html())(),
            basePath:BASE_PATH,
            isBAS:window.isBAS
        }),
        //组织模块
        template: _.template($(tpl).filter('#tpl-content').html()),
        //设置响应事件
        events: Controller.bindEvent(),
        initialize: function () {
            var that = this;
            this.render();
            this.model.on('change', function (m) {
                that.render();
            });
        },
        //组织视图模板
        render: function () {
            //加载主模板
            this.$el.find('#page-body').html(this.template(this.model.toJSON()));
            this.painter=new Painter({
                renderTo:'#openMacket-draw-animate',
                id:'main-cavs',
                canvasWidth:3000,
                canvasHeight:3000
            });
            new TipModel(this);
            Controller.config(this,new DragModel(this),new MenuDataModel(),layout)
            this.controller=Controller;
            //TODO::
            //nodeType=audiences&nodeItem='target'&nodeDesc='小明'
            this.controller.loadNodesData("modify");
            new menuController(this);
            //更多菜单初始化
            $('#plan-more-menu').dropdown();
            return this;
        }

    });
module.exports=Container;
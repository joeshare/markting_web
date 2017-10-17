/**
 * Created by AnThen on 2016-5-31.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/signin/login-tpl.html");
//组件
var Modals = require('component/modals.js');

/*个人模块*/
//得到地址栏指定参数值
var geturlparam = function (param){
    var reg = new RegExp("(^|&)"+ param +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return decodeURI(r[2]); return false;
};
var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template: {
        templateLogin: _.template($(tpl).filter('#tpl-login').html()),
        templateRetrieve: _.template($(tpl).filter('#tpl-retrieve').html())
    },
    //设置响应事件
    events: {
        "click #login-submit": "loginSubmit",
        "keydown #user_name": "keydown",
        "keydown #user_password": "keydown"
    },
    keydown: function(e){
        var keycode = e.keyCode;
        if(keycode === 13){
            this.loginSubmit();
        }
    },
    loginSubmit: function(){
        var submitBut = $('#login-submit');
        if(submitBut.hasClass('sure')){
            var userName = $('#user_name').val(),userPassword = $('#user_password').val();
            util.api({
                url: "?method=mkt.user.login",
                type: 'post',
                data: {'user_id':userName,'password':userPassword},
                success: function (res) {
                    if(res.success){
                        var address = geturlparam('from');
                        localStorage.setItem('user_token',res.jsessionid);
                        localStorage.setItem('user_id',userName);
                        if(address){
                            window.history.go(-1);
                        }else{
                            window.location.href = '/'
                        }
                    }else{
                        $('#prompt').show();
                    }
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
    },
    //组织视图模板
    render: function () {
        //加载主模板
        this.$el.html(this.template.templateLogin(this.model.toJSON()));
        return this;
    }
});

/************生成页面************/
var container = new Container({
    el: '#page-body'
});
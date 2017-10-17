/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';

var tpl = require('./tpl.html');
var Header = require('../header/header');
var LeftMenu = require('./leftmenu');
var ContactList = require('module/contact-list/contact-list');
var Layout = Backbone.View.extend({
    el: 'body',
    model: new Backbone.Model({
        index: 0
    }),
    template: _.template($(tpl).filter('.tpl-con').html()),
    events: {
        "click .showuser-btn": "showgrouplist",
        "click #user-list": "stopProa",
        //"click #contact-list-wrap": "stopProa",
        // "click #container": "containerEvents",
        "click .js-showuserfile": "showUserFile",
        "click .menu-btn": "toggleMenu"
    },
    //显示联系人档案
    showUserFile: function (e) {
        var meEl = $(e.currentTarget);
        var mdType = meEl.attr('data-mdtype');
        var contactId = meEl.attr('data-contactid');
        var mdtype = meEl.attr('data-mdtype') || null;

        $('#userFileWindow').openModal({
            ready: function () {
                window.localStorage.setItem("show_user_file_md_type",mdtype);
                $('#userfilepage').attr('src', BASE_PATH + '/html/audience/contact-file.html?mdType=' + mdtype + '&user_id=' + contactId);
            },
            complete: function () {
                $('#userfilepage').attr('src', '');
                window.localStorage.removeItem("show_user_file_md_type");

            }
        });
    },
    //弹出人群中查找
    showgrouplist: function (e, data) {
        console.info(data)
        if (data) {
            this.contactList.model.set(data);
        } else {
            this.contactList.model.set({
                data: {
                    method: "mkt.audience.search.get",
                    audience_type: 0,//0全局，1人群，2自定义标签
                    group_ids: ''
                },
                total_count: 0
            });
        }
        $('#contact-list-wrap').addClass('on');
        $('.dropdown-content').hide();
        e && e.stopPropagation();
    },
    //任务期间
    duringTask: function (boolean) {
        if (boolean) {
            $('.corner', this.el).show();
        } else {
            $('.corner', this.el).hide();
        }
    },
    //阻止事件传播
    stopProa: function (e) {
        //if ($('.dropdown-button').has(e.target).length != 1) {
        //    $('.dropdown-button').trigger('close');
        //}
        e.stopPropagation();
    },
    //全局点击事件
    containerEvents: function (e) {
        util.bodyClose($('#contact-list-wrap'), function () {
            $('#contact-list-wrap').removeClass('on');
            window.localStorage.removeItem("show_user_file_md_type");
        });
        // $('.setuplist').fadeOut();
    },
    //检查登录
    checklogin: function () {
        var that = this;
        var result = false;
        util.api({
            surl: window.NODE_PATH,
            async: false,
            data: {
                method: 'mkt.user.access'
            },
            success: function (res) {
                result = !res.code;
            }
        });
        return result;
    },
    initialize: function (options) {
        this.options = _.extend({
            index: 0,
            showLeft: true,
            leftMenuCurName: ''
        }, options || {});
        this.options.pageRightClassName = this.options.showLeft ? 'on' : 'allscreen';
        this.model.set(this.options);
        //如果没登录就跳转否则才渲染页面
        //console.log(this.checklogin())
        let isLogin = this.checklogin();
        // isLogin = true;//绕过登录
        if (isLogin) {
            this.render();
            util.refreshAuth();
        } else {
            window.location.href = "/html/signin/login.html";
        }
        this.model.on('change', this.render.bind(this));
        this.setComponent();
        this.containerEvents();
    },

    toggleMenu: function (e) {
        var meEl = $(e.currentTarget);
        var leftEl = $('#page-left', this.$el);
        var rightEl = $('#page-right', this.$el);
        meEl.text('a');
        if (meEl.is('.on')) {
            meEl.html("&#xe677;").attr('title', '展开栏目');
            $('.leftmenu-wrap-b', leftEl).fadeOut(200);
            meEl.removeClass('on');
            leftEl.removeClass('on');
            rightEl.removeClass('on');
        } else {
            meEl.html('&#xe677;').attr('title', '收起栏目');

            meEl.addClass('on');
            leftEl.addClass('on');
            rightEl.addClass('on');
            setTimeout(function () {
                $('.leftmenu-wrap-b', leftEl).fadeIn();
            }, 200);

        }
    },
    setComponent: function () {
        this.header = new Header({
            el: '#header',
            index: this.options.index || 0
        });
        this.contactList = new ContactList({
            el: '#contact-list-wrap'
        });
        // this.leftMenu = new LeftMenu({
        //     el: '#page-left',
        //     index: this.options.index || 0,
        //     submenuName: this.options.leftMenuCurName || ''
        // });

        this.leftMenu = ReactDOM.render(
            <LeftMenu
                index={this.options.index || 0}
                submenuName={this.options.leftMenuCurName || ''}
            />,
            document.getElementById('page-left')
        );
    },

    render: function () {

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});

module.exports = Layout;
/**
 * Created by 刘晓帆 on 2016-4-11.
 * 头部（）
 */
'use strict';
var tpl = require('./tpl.html');
var tplfnStateList = _.template($(tpl).filter('#tpl-statelist').html());
var tplfnMainsearch = _.template($(tpl).filter('#tpl-mainsearch-list').html());
var Modals = require('component/modals.js');
var Header = Backbone.View.extend({
    template: _.template($(tpl).filter('#tpl-con').html()),
    events: {
        "click .logout-btn": "logout",//退出登录
        "click .setup-btn": "showSetupList",
        "click .tooltipped": "hidetip",
        "click #status-list .finished": "finishedtask",
        "keyup .search-input": "search",
        "click .search-ico": "searchShow",
        "click .j-backgroundtask": "showBackgroundTask",
        "mouseenter .j-backgroundtask": "fecthTaskList",
        "blur .search-input": "searchHide"
    },
    initialize: function (options) {
        this.options = _.extend({
            index: 0
        }, options || {});
        this.render();
        this.checkTaskStatus();
        this.checkusersource();
        $('#goback-li').css('display','none');
        $('#container').click(function () {
            $('.system-setuplist').fadeOut(200);
        })
    },
    //用户来源数据分类校验是否已经上传
    checkusersource: function (e) {
        var $gotoadmin = $('.j-gotoadmin', this.$el);
        util.api({
            data: {
                method: 'mkt.usersource.classification.check'
            },
            success: function (response) {
                if (response.code == 0) {
                    if (response.data[0].file_exit) {
                        $gotoadmin.attr('href','/html/admin/user-source-manage.html');
                    } else {
                        $gotoadmin.attr('href','/html/admin/user-source-uploadsource.html');
                    }
                }else{
                    // util.toast({
                    //     title:response.msg
                    // })
                }
            }
        })
    },
    //查询任务状态，结果为true时显示红点
    checkTaskStatus: function () {
        var that = this;
        util.api({
            data: {
                method: 'mkt.task.list.check'
            },
            success: function (res) {
                if (res.data && res.data[0].is_checked) {
                    $('#public-header-red-corner', that.$el).show();
                } else {

                }
            }
        })
    },
    logout: function () {
        new Modals.Confirm({
            title: '提示',
            content: "<div>您确认登出？</div>",
            listeners: {//各种监听
                close: function (type) {
                    if (type) {
                        util.api({
                            surl: window.NODE_PATH + '?method=mkt.user.logout',
                            type: 'post',
                            success: function (res) {
                                localStorage.setItem('user_token', "");
                                localStorage.setItem('showWelcomTip', 0);
                                window.location.href = "/html/signin/login.html";
                            },
                            error: function () {
                                localStorage.setItem('user_token', "");
                                window.location.href = "/html/signin/login.html";
                            }
                        })
                    }
                }
            }
        });
    },
    showSetupList: function (e) {
        $('.system-setuplist').slideDown(100);
        e.stopPropagation();
    },
    hidetip: function () {
        $('.material-tooltip').hide();
    },
    showBackgroundTask: function () {
        $('#public-header-red-corner', this.$el).hide();
    },
    fecthTaskList: function () {
        var that = this;

        util.api({
            data: {
                method: 'mkt.task.list.get'
            },
            success: function (responseData) {
                if (responseData.code != 0) {
                    return
                }
                that.$el.find('#status-list ul').html(tplfnStateList({
                    data: responseData.data
                }));
            }
        });

        //只是通知一下后台
        util.api({
            data: {
                method: 'mkt.task.list.check.update'
            }
        });
    },

    finishedtask: function () {
        window.location.href = BASE_PATH + '/html/data-supervise/quality-report.html'
    },
    search: function (e) {
        var val = $(e.currentTarget).val().trim();
        var recentlyEl = $('.nodata', this.$el);
        var feedlistEl = $('.search-feeds', this.$el);
        var that = this;
        if (!val) {
            recentlyEl.show();
            feedlistEl.hide();
        } else {

            util.api({
                data: {
                    method: "mkt.data.main.search.get",
                    name: val
                },

                success: function (res) {
                    if (res.code != 0)return;
                    if (_.isEmpty(res.data)) {
                        recentlyEl.show();
                        feedlistEl.hide();
                    } else {
                        res.data.map(m => {
                            switch (m.type) {
                                case 0:
                                    m.typeName = '人群细分';
                                    m.hrefStr = '/html/audience/segment.html?audienceId=' + m.id;
                                    break;
                                case 1:
                                    m.typeName = '营销活动';
                                    m.hrefStr = '/html/activity/plan.html?planId=' + m.id;
                                    break;
                                case 2:
                                    m.typeName = '人群管理';
                                    m.hrefStr = '/html/audience/crowd.html';
                                    break;
                            }
                        });
                        that.$('#search-list .search-feeds').html(tplfnMainsearch(res));
                        recentlyEl.hide();
                        feedlistEl.show();
                    }
                }
            });
        }

    },


    selectBtn: function (e) {
        $('.topmenu-btn', this.$el).eq(this.options.index).addClass('cur');
    },

    searchShow: function (e) {
        this.$('#search-list .search-feeds').html('');
        $('.search-input', this.$el).addClass('show');
    },
    searchHide: function (e) {
        $('.search-input', this.$el).removeClass('show').val('');
    },
    render: function () {
        this.$el.html(this.template(this.options));
        this.selectBtn();
        return this;
    }
});

module.exports = Header;
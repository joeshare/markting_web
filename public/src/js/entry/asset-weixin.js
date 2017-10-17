/**
 * Created by liuxiaofan on 2016-5-4.
 * 粉丝管理
 */
'use strict';//严格模式

var tpl = require("html/asset/weixin-tpl.html");//模板
var Layout = require('module/layout/layout');
var Modals = require('component/modals.js');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName: '粉丝管理'
});
var once = 0;
//右侧页面的view
var PageRight = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    template: _.template($(tpl).filter('#tpl-pageright').html()),
    //设置响应事件
    events: {
        "click .j-savecrowd": "savecrowd",
        "click .j-groupmore": "groupmore",
        "click .j-relogin": "relogin",
        "click .j-downloaddetail": "downloaddetail",
        "click .j-setname": "setname",
        "click #group-all": "selectAllfeed",
        "click .showgrouplist": "showgrouplist"//弹出人群中查找
    },
    showgrouplist: function (e) {
        var groupId = [];
        var meEl = $(e.currentTarget);
        if (meEl.is('.disabled')) {
            return
        }
        $('.group-list .checkitem:checked', this.$el).each(function (i, m) {
            var idStr = $(m).attr('id');
            var id = idStr.slice(idStr.indexOf('-') + 1);
            groupId.push(Number(id));
        });
        util.api({
            data: {
                method: 'mkt.asset.wechat.people.detail.download',
                group_ids: groupId.toString()
            },
            success: function (res) {
                var total_count=(!res.code&&res.data&&res.data.length)?res.data[0].total_count:0;
                window.localStorage.setItem("show_user_file_md_type",9);
                //搜索用户
                layout.showgrouplist(e, {
                    data: {
                        method: 'mkt.asset.wechat.member.search',
                        md_type:9,
                        group_ids: groupId.toString()
                    },
                    total_count: total_count
                })

            }
        });
    },
    //群组信息显示更多操作
    groupmore: function () {
        var groupId = [];
        var moreEl = $('#footer-moremenu', this.$el);
        $('.group-list .checkitem:checked', this.$el).each(function (i, m) {
            var idStr = $(m).attr('id');
            var id = idStr.slice(idStr.indexOf('-') + 1);
            groupId.push(Number(id));
        });
        if (_.isEmpty(groupId)) {
            $('.showgrouplist', moreEl).addClass('disabled');
            $('.j-downloaddetail', moreEl).addClass('disabled');
            $('.j-savecrowd', moreEl).addClass('disabled');
        }
        else {
            $('.showgrouplist', moreEl).removeClass('disabled');
            $('.j-downloaddetail', moreEl).removeClass('disabled');
            $('.j-savecrowd', moreEl).removeClass('disabled');
        }
    },
    //下载明细
    downloaddetail: function (e) {
        var groupId = [];
        var meEl = $(e.currentTarget);
        if (meEl.is('.disabled')) {
            return
        }
        $('.group-list .checkitem:checked', this.$el).each(function (i, m) {
            var idStr = $(m).attr('id');
            var id = idStr.slice(idStr.indexOf('-') + 1);
            groupId.push(Number(id));
        });
        util.api({
            data: {
                method: "mkt.asset.wechat.people.detail.download",
                group_ids: groupId.toString()
            },
            success: function (res) {
                if (res.code == 0) {
                    location.href = FILE_PATH + res.data[0].download_file_name;
                }
            }
        });
    },
    
    relogin: function (e) {
        var meEl = $(e.currentTarget);
        var that = this;
        if (!meEl.is('.disabled')) {
            that.fetchQrcode();
            $('#qrcodewrap').openModal({});
        }
    },
    /*生成个人号二维码*/
    fetchQrcode: function () {
        var config = {};
        var that = this;
        if (once <= 0) {
            /*生成二维码13942093706徐宁*/
            h5Persona.login().then(function (obj) {
                obj = obj.data;
                $('#qrcode').qrcode({width: 112, height: 112, text: obj.qrstring});
                config.uuid = obj.uuid;
                //.checklogin方法检查二维码是否被扫描并登录
                h5Persona.checkLogin(function (result) {

                    util.api({
                        url: "?method=mkt.data.inbound.wechat.personal.auth",
                        type: 'post',
                        data: {'uuid': obj.uuid, 'uin': result},
                        success: function (res) {
                          
                            if (res.code == 0) {
                                once = 0;
                                config = {};
                                that.fetchQrcode()
                            }
                        }
                    });

                });
            });
            once++;
        }
    },

    //保存人群
    savecrowd: function (e) {
        var that = this;
        var meEl = $(e.currentTarget);
        if (meEl.is('.disabled')) {
            return
        }

        new Modals.Window({
            id: 'savegroup',
            title: "保存人群",
            content: '<div style="margin: 30px 0;"><div class="input-field "> <input id="weixin-nickname" type="text" class="validate"> <label for="weixin-nickname" class="">名称</label> </div></div>',
            width: '380',//默认是auto
            buttons: [{
                text: '确定',
                handler: function (self) {
                    self.close();
                    var val = $('#weixin-nickname').val().trim();
                    if (!val) {
                        return
                    }
                    var groupId = [];
                    $('.group-list .checkitem:checked').each(function (i, m) {
                        var idStr = $(m).attr('id');
                        var id = idStr.slice(idStr.indexOf('-') + 1);
                        groupId.push(Number(id));
                    });
                    util.api({
                        url: "?method=mkt.asset.wechat.list.save",
                        type: 'post',
                        data: {
                            //asset_id: that.options.asset_id,
                            name: val,
                            group_ids: groupId
                        },
                        success: function (res) {
                            if (res.code == 0) {
                                Materialize.toast('保存成功!', 3000)
                            } else {
                                Materialize.toast('保存失败：' + res.msg, 3000)
                            }

                        }
                    });
                }
            },
                {
                    text: '取消',
                    handler: function (self) {
                        self.close();
                    }
                }
            ],
            listeners: {//window监听事件事件
                close: function () {
                    //console.log(this.$el)
                }
            }

        })
    },

    setname: function () {
        var that = this;
        new Modals.Window({
            id: 2,
            title: "设置昵称",
            content: '<div style="margin: 30px 0;"><div class="input-field "> <input id="weixin-nickname" type="text" class="validate"> <label for="weixin-nickname" class="">名称</label> </div></div>',
            width: '380',//默认是auto
            buttons: [{
                text: '确定',
                handler: function (self) {
                    self.close();
                    var val = $('#weixin-nickname').val().trim();
                    util.api({
                        url: "?method=mkt.asset.wechat.nickname.update",
                        type: 'post',
                        data: {
                            asset_id: that.options.asset_id,
                            nickname: val
                        },
                        success: function (res) {
                            Materialize.toast(res.msg, 3000);
                            if (res.code == 0) {
                                container.weixinList.refresh();
                                that.refresh();
                            }
                        }
                    });
                    //if (val) {
                    //    $('.weixin-asset-list .cur .name').text(val);
                    //    $('.option-area .header .user-name .txt').text(val);
                    //}
                }
            },
                {
                    text: '取消',
                    handler: function (self) {
                        self.close();
                    }
                }
            ],
            listeners: {//window监听事件事件

                close: function () {

                }
            }

        })
    },
    //选中所有的复选框
    selectAllfeed: function (e) {
        var meEl = $(e.currentTarget);
        if (meEl.is(':checked')) {
            $('.checkitem', this.$el).prop('checked', true);
        } else {
            $('.checkitem', this.$el).prop('checked', false);
        }
    },
    initialize: function (options) {
        var that = this;
        this.options = _.extend({
            method: "mkt.asset.wechat.list.get",
            asset_id: 0,
            size: 100
        }, options || {});
        this.model.on('change', function (m) {
            that.render();
        });
    },
    refresh: function (queryParam) {
        this.options = _.extend(this.options, queryParam || {});
        this.fecth();
    },
    dataFormat: function (responseData) {
        var resData = {};
        var assettype = $('.tabs li a.active').closest('li').attr('assettype');
        responseData.data.map(m=> {
            m.assetType = assettype;
            m.url = m.url || 'javascript:;';
            if (m.flag) {
                m.disableStr = 'disabled';
            } else {
                m.disableStr = '';
            }
        });
        resData = _.extend({}, responseData);
        return resData;
    },
    fecth: function () {
        var that = this;
        util.api({
            data: _.omit(this.options, 'el'),
            success: function (responseData) {
                if (responseData.code != 0) {
                    //alert(responseData.msg)
                } else {
                    that.model.set(that.dataFormat(responseData));
                }
            }
        });
    },
    //组织视图模板
    render: function () {
        //console.info(this.model.toJSON())
        this.$el.html(this.template(this.model.toJSON()));
        $('.dropdown-button').dropdown();
        return this;
    }
});

//微信号列表view
var WeixinList = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    template: _.template($(tpl).filter('#tpl-weixinlist').html()),
    events: {
        "click .weixin-asset-list li": "selectWeixin"
    },
    selectWeixin: function (e) {
        var that = this;
        var meEl = $(e.currentTarget);
        var assetId = meEl.attr('assetid');
        $('.weixin-asset-list li', this.$el).removeClass('cur');
        meEl.addClass('cur');
        this.pageRight.refresh({
            asset_id: assetId
        })
    },
    initialize: function (options) {
        var that = this;
        this.options = _.extend({
            method: "mkt.asset.wechat.type.list.get",
            asset_type: 2,//页面默认加载服务号
            index: 1,
            size: 100
        }, options || {});
        this.model.on('change', function (m) {
            that.render();
        });
        this.fecth();
    },
    refresh: function (queryParam) {
        if (queryParam) {
            this.options = _.extend(this.options, queryParam)
        }
        this.fecth();
    },
    fecth: function () {
        var that = this;
        util.api({
            data: _.omit(this.options, 'el'),
            success: function (resData) {
                that.model.set(resData);
            }
        });
    },
    afterRender: function () {
        var that = this;
        if (!this.pageRight) {
            this.pageRight = new PageRight({
                el: $('.option-area')
            });
        }
        $('li', this.$el).eq(0).trigger('click')
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender();
        return this;
    }
});

//最大容器view
var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        data: [
            {
                "count": "0",
                "totalNumber": "0"
            },
            {
                "count": "0",
                "totalNumber": "0"
            },
            {
                "count": "0",
                "totalNumber": "0"
            }
        ]
    }),

    template: _.template($(tpl).filter('#tpl-content').html()),
    //设置响应事件
    events: {
        "click .tabs li ": "tabEvent"
    },
    tabEvent: function (e) {
        var that = this;
        var meEl = $(e.currentTarget);
        var asset_type = meEl.attr('assettype');
        this.weixinList.refresh({
            asset_type: asset_type
        })
    },
    initialize: function () {
        var that = this;
        this.load();
        this.model.on('change', function (m) {
            that.render();
        });
    },
    afterRender: function () {
        var that = this;
        this.weixinList = new WeixinList({
            el: $('.weixinlist-wrap', that.$el)
        });
        $('ul.tabs').tabs();
        //this.weixinList.model.set({
        //    listData: that.model.get('mainData')[0]
        //})
    },
    load: function () {
        var that = this;
        util.api({
            data: {
                "method": "mkt.asset.wechat.type.count.get"
            },
            success: function (resData) {
                if (!_.isEmpty(resData.data)) {
                    // 本期上线是个人号暂时不显示
                    var personalMumbers=null;
                    var newArr = resData.data.filter(function(item){
                        var f=!!item.asset_type;
                        if(!f){
                            personalMumbers=item;
                        }
                        return f ;
                    });
                    // 指定显示顺序
                    //服务号的 asset_type": 2
                    //订阅号的 asset_type": 1
                    var weChatArr=[];
                    newArr.forEach(function(item,i){
                        weChatArr[item.asset_type]=item;
                    });
                    weChatArr[0]=personalMumbers;

                    that.model.set({
                            data: weChatArr
                        }
                    );
                }
            }
        });
    },
    //组织视图模板
    render: function () {
        //加载主模板
        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender();
        return this;
    }
});


var container = new Container({
    el: '#page-body'
});


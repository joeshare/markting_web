/**
 * Created by 刘晓帆 on 2016-4-11.
 * 搜索用户（使用标准的Backbone的MVC模式写法，模型、视图、集合）
 */
'use strict';
var tpl = require('./tpl.html');
var tplLiFn = _.template($(tpl).filter('#tpl-li').html());

//模型
var LiM = Backbone.Model.extend({
    defaults: function () {
        return {
            age: 0,
            gender: '',
            head_image_url: '/img/common/defaultimg.png',
            id: 0,
            mobile: '',
            name: ''
        };
    }
});

//视图
var LiV = Backbone.View.extend({
    tagName: 'li',
    events: {
        "click": "rowEvent"
    },
    template: _.template($(tpl).filter('#tpl-li').html()),
    rowEvent: function () {
        //console.info('aa')
    },
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        $('.dropdown-button').dropdown();
        return this;
    }
});
//集合
var LiC = Backbone.Collection.extend({
    model: LiM
});

//根视图
var ContactList = Backbone.View.extend({
    el: 'body',
    model: new Backbone.Model({
        data: {
            method: 'mkt.audience.search.get',
            audience_type: 0,//0全局，1人群，2自定义标签
            group_ids: ''
        },
        total_count: 0,
        listData: []
    }),
    template: _.template($(tpl).filter('.tpl-groupuser').html()),
    events: {
        "keyup .search-user-input": "searchUser"
    },
    initialize: function (options) {
        this.options = _.extend({
            //index: 0,
            //leftMenuCurName: ''
        }, options || {});
        this.model.set(this.options);
        this.model.on('change', this.render.bind(this));
        this.render();
        //实例化集合
        this.liC = new LiC();
        this.listenTo(this.liC, 'add', this.addOne);
        this.listenTo(this.liC, 'reset', this.reset);

    },
    //添加项目
    addOne: function (m) {
        var view = new LiV({model: m});
        this.$('.user-feedlist').append(view.render().el);
    },

    //清空数据
    reset: function () {
        this.$('.user-feedlist').html('');
    },

    //拉取列表数据
    fetch: function (val = '') {
        var that = this;
        var data = _.extend({
            query_name: val,
            search_field: val,
        }, this.model.get('data'));
        that.liC.reset();//先清空集合数据
        let mdtype=data.md_type||0;
        if(!val)return;

        util.api({
            data: data,
            beforeSend: function () {
                that.$('.user-feedlist').html('加载中...')
            },
            success: function (res) {
                if (res.code == 0) {
                    if (_.isEmpty(res.data)) {
                        that.$('.user-feedlist').html('搜索无结果')
                    } else {
                        res.data.map(m=> {
                            m.mdtype=mdtype;
                            m.nid = m.data_id||m.id || 0;
                            m.nmobile = m.mobile || '';
                        })
                        that.$('.user-feedlist').html(tplLiFn(res));
                        $('.dropdown-button').dropdown();
                        //that.liC.set(res.data);//再添加数据
                    }
                } else {
                    Materialize.toast(res.msg, 1000);
                }
            }
        })
    },

    //搜索框事件处理
    searchUser: function (e) {
        var val = $(e.currentTarget).val().trim();
        this.fetch(val);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

module.exports = ContactList;

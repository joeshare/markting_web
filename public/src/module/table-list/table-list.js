/**
 * Created by 刘晓帆 on 2016-4-11.
 * 通用表格模块
 */
'use strict';
var tpl = require("./table-list-tpl.html");//模板
var pagination = require('plugins/pagination')($);//分页插件
var M = Backbone.Model.extend();
var C = Backbone.Collection.extend({});
var V = Backbone.View.extend({});
var TableList = Backbone.View.extend({
    model: new Backbone.Model({
        listData: []
    }),

    template: _.template($(tpl).filter('#tpl-layout').html()),
    events: {
        "click tr .dropdown-button-more": "getTrData",
    },
    //初始化
    initialize: function (options) {
        var that = this;
        this.options = _.extend({
            method: "mkt.audience.list.get",
            index: 1,
            size: 7
        }, options);
        this.model.on('change', function (m) {
            that.render();
        });
        this.setPagination();
        this.fetchListData();
    },
    setPagination: function (totalCount) {
        var that = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: this.options.size,//最多显示页数
                onPageClick: function (pageNumber, event) {
                    that.refresh({
                        index: pageNumber,
                    })
                }
            });
        }


    },
    getTrData: function (e) {
        var meEl = $(e.currentTarget);
        var res = {};
        this.model.get('listData').map(function (m, i) {
            if (m.audience_list_id == meEl.attr('listid')) {
                res = m
            }
        });
        this.trData = res;
    },
    fetchListData: function () {
        var that = this;
        util.api({
            data: _.omit(this.options, 'el'),
            success: function (res) {
                that.totalCount = res.total_count || 1;
                if ($('.pagination-wrap').length > 0) {
                    $('.pagination-wrap').pagination('updateItems', that.totalCount);
                }
                that.model.set(that.formatData(res));
            }
        });
    },

    formatData: function (res) {
        var formatData = {};
        formatData.listData = res.data;
        formatData.colName = res.col_names;
        return formatData;
    },
    refresh: function (data) {
        this.options = _.extend(this.options, data);
        this.fetchListData();
    },
    afterRender: function () {
        $('.dropdown-button', this.$el).dropdown();
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.trigger('afterrender',this.model.toJSON());
        this.afterRender();
        return this;
    }
});
//
module.exports = TableList;
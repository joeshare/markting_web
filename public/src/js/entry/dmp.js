/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';
var tpl = require('../../html/dmp/tpl.html');
var lolliclock = require('plugins/lolliclock.js');//时间选择器
var Layout = require('module/layout/layout');
var layout = new Layout({
    index: 0,
    showLeft: false
});

//当前页面逻辑
var Index = Backbone.View.extend({
    model: new Backbone.Model({
        name: '点我'
    }),
    template: _.template($(tpl).filter('.tpl-foot').html()),
    events: {
        "click .clickme": "showName"
    },
    showName: () => {
        let that = this;
    },
    initialize: function (options) {
        this.model.on('change', this.render.bind(this));
        this.render();
    },

    render: function () {
        var that = this;
        //跨域ajax请求
        $.ajax({
            url: "http://bas.ruixuesoft.com/data/Event/data.json",
            success: function (res) {
                console.info(res)
            }
        });
        this.$el.html(this.template(this.model.toJSON()));

        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 5 // Creates a dropdown of 15 years to control year
        });

        $('#pick-a-time2').lolliclock({
            autoclose: true,
            //hour24: true,//24小时制
            afterHide: function () {
            }
        });

        return this;
    }
});
function x(){
    var a = 2;
    a = a + 2;
}

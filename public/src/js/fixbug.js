/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';
var echarts = require('echarts');//百度charts插件
var macarons = require('js/libs/macarons');//百度charts主题
var option = {
    //标题
    title: {
        //text: '活动转化分析',
        x: 'center'
        //subtext: '纯属虚构'
    },
    //grid: {
    //    left: '1%',
    //    right: '1%',
    //    bottom: '1%',
    //    top: '1%',
    //    containLabel: true
    //},
    //hover提示
    tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
    },
    //图例按钮
    //legend: {
    //    y: 'bottom',
    //    data: ['客户量', '覆盖', '触达', '参与']
    //},
    //可计算
    calculable: true,
    //数据系列
    series: [
        {
            name: '数量',
            type: 'funnel',
            minSize: '40%',
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [
                {
                    value: 100,
                    name: '客户量',
                    itemStyle: {
                        normal: {
                            color: '#8a93d9',
                            label: {
                                //position: 'inside',
                                formatter: '{c}%'
                            }
                        }
                    },
                },
                {
                    value: 69.53,
                    name: '覆盖',
                    itemStyle: {
                        normal: {
                            color: '#73a9dc',
                            label: {
                                //position: 'inside',
                                formatter: '{c}%'
                            }
                        }
                    },
                },
                {
                    value: 2.89,
                    name: '触达',
                    itemStyle: {
                        normal: {
                            color: '#62c1dc',
                            label: {
                                //position: 'inside',
                                formatter: '{c}%'
                            }
                        }
                    },
                },
                {
                    value: 0.07,
                    name: '参与',
                    itemStyle: {
                        normal: {
                            color: '#62dccf',
                            label: {
                                //position: 'inside',
                                formatter: '{c}%'
                            }
                        }
                    },
                }
            ]
        }
    ]
};
module.exports = {
    opt:option,
    init: function () {
        var testCharts = echarts.init(document.getElementById('group1-drawing1-box'), 'macarons');
        testCharts.setOption(option)
    }
};
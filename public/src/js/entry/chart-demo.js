/**
 * Author LLJ
 * Date 2016-4-26 11:36
 */
require('../component/index.js');
$(function(){
    var option = {
        renderTo:'#bar',
        color:[ '#5182ad'],
        title: {
            text: 'Bar'
        },
        legend: {
            data:['销量']
        },
        xAxis: {
            splitLine:{show: false},
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {
            splitLine:{ show: false},
            show:false
        },
        series: [{
            name: '销量',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    var barChart=new RUI.Chart.Bar(option);
    setTimeout(function(){
        barChart.load({
            series: [{
                data:  [125, 10, 136, 4, 120, 210]
            }]
        });
    },2000)

    //funnel
    var option = {
        renderTo:'#funnel',
        title:{
            text: 'Funnel'
        },
        legend: {
            data: ['展现','点击','访问','咨询','订单']
        },
        series: [{

            data:  [
                {value: 60, name: '访问'},
                {value: 40, name: '咨询'},
                {value: 20, name: '订单'},
                {value: 80, name: '点击'},
                {value: 100, name: '展现'}
            ]
        }]
    };

    var funnelChart=new RUI.Chart.Funnel(option);
    setTimeout(function(){
        funnelChart.load({
            series: [{
                data:  [
                    {value: 45, name: '访问'},
                    {value: 50, name: '咨询'},
                    {value: 61, name: '订单'},
                    {value: 100, name: '点击'},
                    {value: 80, name: '展现'}
                ]
            }]
        });
    },2000)
})
/**
 * Created by AnThen on 2016/10/18.
 * 折线图-阶梯类型
 */
function ladder(data) {
    /*初始化数据*/
    let chartOption = {
        color: util.getChartColors(),
        backgroundColor: 'rgb(255,255,255)',
        textStyle:{
            fontWeight: 'normal',
            fontFamily: '微软雅黑'
        },
        animation:false,
        legend: {
            show: false
        },
        grid:{
            top:56,
            right:33,
            bottom:24,
            left:'5.6%',
            containLabel: true
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {
                type : 'shadow'
            },
            formatter: function (params) {
                var tar = params[1];
                return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            },
            padding: 8,
            backgroundColor: 'rgba(51,51,51,0.7)',
            textStyle:{
                fontWeight: 'normal',
                fontFamily: '微软雅黑',
                color: '#eaeaea',
                fontSize: 11
            }
        },
        title: {
            show: true,
            text: '',
            textStyle:{
                fontWeight: 'normal',
                fontFamily: '微软雅黑',
                color: '#666666',
                fontSize: 16
            }
        },
        xAxis: {
            type : 'category',
            splitLine:{
                show:true,
                lineStyle:{
                    fontWeight: 'normal',
                    fontFamily: '微软雅黑',
                    color:'#ececec'
                }
            },
            axisLabel:{
                interval: 0
            },
            data : []
        },
        yAxis: {
            type : 'value'
        },
        series: [
            {
                type: 'bar',
                stack:  '总量',
                barWidth: '30%',
                itemStyle: {
                    normal: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    },
                    emphasis: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    }
                },
                data: []
            },
            {
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                data:[]
            }
        ]
    };
    /*整理数据*/
    let divId = data.div,divObj = data.divId;
    let backgroundColor = data.backgroundColor || [];
    let title = data.title || '';

    if(title.length > 0){
        chartOption.title.text = title;
    }else{
        chartOption.title.show = false;
        chartOption.grid.top = 10;
    }

    if(!$.isEmptyObject(data.series)){
        /*组织数据*/
        if(backgroundColor.length > 0){
            chartOption.color = backgroundColor;
        }
        chartOption.xAxis.data = data.xAxis;
        chartOption.series[0].data = data.series.data1;
        chartOption.series[1].name = data.series.data2.name;
        chartOption.series[1].data = data.series.data2.data;
        /*渲染echarts*/
        divId.hideLoading();
        divId.setOption(chartOption);
    }else{
        chartOption = "<div style='width:100%;height:100%;background:url(../../img/audience/filler.png) no-repeat center center;'><div style='float:left;width:100%;color:#666666;font-size:16px;'>"+title+"</div></div>";
        /*渲染echarts*/
        divId.hideLoading();
        divObj.empty().append(chartOption);
    }
}
exports.ladder = ladder;
/**
 * Created by AnThen on 2016-7-25.
 * 折线图
 */
function axis(data){
    // console.log(data)
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
            bottom:40,
            left:'5.6%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            formatter: '',
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
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 65,
                end: 85
            },
            {
                type: 'inside',
                realtime: true,
                start: 65,
                end: 85
            }
        ],
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
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
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine:{
                    show:true,
                    lineStyle:{
                        fontWeight: 'normal',
                        fontFamily: '微软雅黑',
                        color:'#ececec'
                    }
                },
                axisLabel:{
                    formatter: '{value}'
                },
                minInterval: 1
            }
        ],
        series: []
    };

    /*整理数据*/
    let divId = data.div,divObj = data.divId;
    let backgroundColor = data.backgroundColor || [];
    let title = data.title || '';
    let legend = data.legend || {};
    let grid = data.grid || {};
    let tooltipFormatter = data.formatter || '';
    let xAxisFormatter = data.xAxisFormatter || '';
    let yAxisUnit = data.yAxisUnit || false;
    let reconsSeries = new Array();

    if(title.length > 0){
        chartOption.title.text = title;
    }else{
        chartOption.title.show = false;
        chartOption.grid.top = 10;
    }
    if(data.series.length > 0){
        /*组织数据*/
        if(backgroundColor.length > 0){
            chartOption.color = backgroundColor;
        }
        if(!$.isEmptyObject(legend)){
            chartOption.legend = legend;
            chartOption.legend.show = true;
            if(legend.y == 'bottom'){chartOption.grid.bottom = 30;}
            if(legend.y == 'top'){chartOption.grid.top = 54;}
        }
        if(!$.isEmptyObject(grid)){
            chartOption.grid = grid;
        }
        if((tooltipFormatter.length > 0)||(!$.isEmptyObject(tooltipFormatter))){
            chartOption.tooltip.formatter = tooltipFormatter;
        }
        if(xAxisFormatter.length > 0){
            chartOption.xAxis[0].axisLabel = {
                interval: 0,
                formatter: xAxisFormatter
            };
        }
        chartOption.xAxis[0].data = data.xAxis;
        if(yAxisUnit){
            chartOption.yAxis[0].axisLabel.formatter = yAxisUnit;
        }
        for(let i=0; i<data.series.length; i++){
            reconsSeries[i] = {
                name: data.series[i].name,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default',
                            opacity: 0.3
                        }
                    }
                },
                data: data.series[i].data
            };
        }
        chartOption.series = reconsSeries;

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
exports.axis = axis;
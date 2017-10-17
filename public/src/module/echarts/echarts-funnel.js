/**
 * Created by AnThen on 2016-7-29.
 * 漏斗图-双层
 */
function funnel(data){
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
        tooltip: {
            show: false
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
        series: [
            {
                type: 'funnel',
                top: 48,
                bottom: '10%',
                left: '0.2%',
                width: '100%',
                height: '77%',
                maxSize: '70%',
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        opacity: 0.7,
                        borderWidth: 2
                    }
                },
                data: []
            },
            {
                type: 'funnel',
                top: 48,
                bottom: 48,
                left: '12.7%',
                width: '75%',
                height: '77%',
                maxSize: '60%',
                label: {
                    normal: {
                        position: 'inside',
                        formatter: '{c}%',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    emphasis: {
                        position:'inside',
                        formatter: '{b}: {c}%'
                    }
                },
                itemStyle: {
                    normal: {
                        opacity: 1,
                        borderColor: '#fff',
                        borderWidth: 2
                    }
                },
                data: []
            }
        ]
    };
    /*整理数据*/
    let divId = data.div,divObj = data.divId;
    let backgroundColor = data.backgroundColor || [],defaultColor = util.getChartColors(),dataLength = 0;
    let title = data.title || '';
    let legend = data.legend || {};
    let reconsSeries = data.data,dataValue,out = [],inner = [];

    if(title.length > 0){
        chartOption.title.text = title;
    }else{
        chartOption.title.show = false;
    }
    if(reconsSeries.length > 0){
        /*组织数据*/
        if(backgroundColor.length > 0){
            chartOption.color = backgroundColor;
        }else{
            dataLength = reconsSeries.length;
            for(let i=0; i<dataLength; i++){
                backgroundColor[i] = defaultColor[i];
            }
            chartOption.color = backgroundColor;
        }
        if(!$.isEmptyObject(legend)){
            chartOption.legend = legend;
            chartOption.legend.show = true;
        }
        for(let i=0; i<reconsSeries.length; i++){
            dataValue = parseInt(reconsSeries[i].value);
            out = {value:dataValue*1.5};
            inner = {name:reconsSeries[i].name,value:dataValue};
            chartOption.series[0].data[i] = out;
            chartOption.series[1].data[i] = inner;
        }
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
exports.funnel = funnel;
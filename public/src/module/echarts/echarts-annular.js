/**
 * Created by AnThen on 2016-7-25.
 * 环型图
 */
function annular(data){
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
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
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
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius: ['35%', '55%'],
                startAngle:125,
                itemStyle:{
                    normal:{
                        borderColor:'#fff',
                        borderWidth:2,
                        borderType:'solid'
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
    let legend = data.legend || {};
    let seriesName = data.seriesName || '',reconsSeries = data.data || [];

    if(title.length > 0){
        chartOption.title.text = title;
    }else{
        chartOption.title.show = false;
    }
    if(reconsSeries.length > 0){
        /*组织数据*/
        if(backgroundColor.length > 0){
            chartOption.color = backgroundColor;
        }
        if(!$.isEmptyObject(legend)){
            chartOption.legend = legend;
            chartOption.legend.show = true;
        }
        if(seriesName.length > 0){
            chartOption.series[0].name = seriesName;
        }else{
            chartOption.series[0].name = title;
        }
        for(let i=0; i<reconsSeries.length; i++){
            chartOption.series[0].data[i] = {
                value: reconsSeries[i].value,
                name: reconsSeries[i].name,
                selected: false
            };
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

exports.annular = annular;
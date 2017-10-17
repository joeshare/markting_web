/**
 * Created by AnThen on 2016/12/8.
 * 漏斗图-单层
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
            trigger: 'item',
            formatter: "{b} <br/> {c}"
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
                type:'funnel',
                top: 48,
                bottom: '10%',
                left: '0.2%',
                width: '100%',
                height: '77%',
                minSize: '30%',
                maxSize: '70%',
                sort: 'descending',
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 1
                    }
                },
                data: []
            }
        ]
    };
    /*整理数据*/
    let divId,divObj;
    let backgroundColor,defaultColor = util.getChartColors(),dataLength = 0;
    let title;
    let legend;
    let tooltipFormatter;
    let reconsSeries = data.data;
    if(reconsSeries.length > 0){
        /****获取数据****/
        divId = data.div;
        backgroundColor = data.backgroundColor || [];
        title = data.title || '';
        legend = data.legend || {};
        tooltipFormatter = data.formatter || '';
        if(title.length > 0){
            chartOption.title.text = title;
        }else{
            chartOption.title.show = false;
        }
        /****组织数据****/
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
        if((tooltipFormatter.length > 0)||(!$.isEmptyObject(tooltipFormatter))){
            chartOption.tooltip.formatter = tooltipFormatter;
        }
        chartOption.series[0].data = reconsSeries;
        /*渲染echarts*/
        divId.hideLoading();
        divId.setOption(chartOption);
    }else{
        /****获取数据****/
        divId = data.div;divObj = data.divId;
        title = data.title || '';
        /****组织数据****/
        chartOption = "<div style='width:100%;height:100%;background:url(../../img/audience/filler.png) no-repeat center center;'><div style='float:left;width:100%;color:#666666;font-size:16px;'>"+title+"</div></div>";
        /*渲染echarts*/
        divId.hideLoading();
        divObj.empty().append(chartOption);
    }
}
exports.funnel = funnel;
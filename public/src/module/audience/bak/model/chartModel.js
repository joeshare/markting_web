/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
var barCfg={
    loading:false,
    title: {
        x: 'center',
        y: 0,
        text: ''
    },
    legend: {
        bottom: 10
    },
    grid: {
        top:'15%',
        left: '10%',
        right: '10%',
        bottom: 60,
        containLabel: true
    },
    series: [
        {
            type:'bar'
        }]
};
var funnelCfg={
    title: {
        //text: '漏斗图',
        //subtext: '纯属虚构'
    },
    calculable: true,
    color:util.getChartColors(),
    //hover提示
    tooltip: {
        formatter: "{a} <br/>{b} : {c}"
    },
    //图例按钮
    legend: {
        y: 'bottom',
        data:[]
    },
    series: [
        {
            name:'细分统计',
            type:'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 0,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                },
                emphasis: {
                    position:'inside',
                    formatter: '{c}',
                    textStyle: {
                        fontSize: 12
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 0
                }
            }

        }
    ]};
function  echartFun(renderTo,arg){
    var chart="";
    chart=echarts.init(document.querySelector(renderTo));
    chart.setOption(arg);
    return chart;
}
function model(view){
    this.view=view;
    this.objects={};
    this.cfgs={};
    this.create=function(arg){
         var cfg={};
         $.extend(true,arg,cfg);
         var params={};
         switch (arg.type){
             case 'bar':
                 params= $.extend(true,{},barCfg,arg);
                 break;
             case 'funnel':
                 params= $.extend(true,{},funnelCfg,arg);
                 break;
         }
        this.objects[arg.id]=echartFun(params.renderTo,params);
        this.cfgs[arg.id]=$.extend(true,{},arg);
        return this.objects[arg.id];
    };
    this.getChartById=function(id){
       return this.objects[id];
    };
    this.delChart=function(id){
       delete  this.objects[id];
    };
    this.disposeChart=function(id){
        this.objects[id]&&this.objects[id].dispose();
        this.delChart(id);
    };
    this.getCharts=function(){
        return $.extend(true,{},this.objects);_
    };

}
module.exports=model;
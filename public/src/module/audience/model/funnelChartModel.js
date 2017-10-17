/**
 * Created by AnThen on 2016-11-4.
 */
/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
'use strict';
let API={
    'queryFunnelChart':"?method=mkt.segment.filter.get"
};
let funnel_chart_data_arr=[];
let funnel_chart_data_map={};
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
        bottom: '15%',
        containLabel: true
    },
    series: [
        {
            type:'bar'
        }]
};

function createComptionFuntion(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
}
var funnelCfg={
    title: {
        //text: '漏斗图',
        //subtext: '纯属虚构'
    },
    calculable: true,
    color:['#ade9e3'],//util.getChartColors(),
    //hover提示
    tooltip: {
        formatter: "{c} 人"
    },
    //图例按钮
    legend: {
        show:false,
        y: 'bottom',
        data:[]
    },
    series: [
        {
            name:'细分统计',
            type:'funnel',
            left: '10%',
            top: 60,
            bottom:20,
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
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        position:'inside',
                        formatter: '{c}'
                    }
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
//回数是否有值
function notEmptyRespose(res){
    return res&&res.code==0&&res.data&&res.data.length;
}

function getData(num,data) {
    var obj={top:5,minSize: '30%'},total=0;//'40%'
    //[{"tag_count":"4","tag_name":"tester","tag_id":"1"}]
    if(num==3){
        obj.minSize= '35%';//'45%'
        //data = [{
        //    top: 5,
        //    minSize: '45%',
        //    data: [{value: 90, name: TMPConditionNames[0]},
        //        {value: 60, name: TMPConditionNames[1]},
        //        {value: 30, name: TMPConditionNames[2]}
        //    ]
        //}];
    }else if(num==0){
        obj = {data: []};
    }
    obj.data=[];
    data.forEach(function(itm,i){
        obj.data.push({value: itm.tag_count*1, name: itm.tag_name,itemStyle});
        total+=itm.tag_count*1;
    })
   // obj.data.sort(creatComationFuntion('value'));
    let itemStyle= {
        normal: { color: '#5bd4c7' }
    };
    if(Array.isArray( obj.data)&&obj.data.length){
        obj.data[obj.data.length-1].itemStyle=itemStyle
    }
    Array.isArray(obj.data)&&obj.data.forEach((d,i)=>{
        d.itemStyle={ color:'#ade9e3'};
        if(i==obj.data.length-1){
            d.itemStyle=itemStyle
        }
    })
    obj.max=total;
    return [obj];
}
function model(view){
    this.view=view;
    this.objects={};
    this.cfgs={};
    let _this=this;
    //延迟函数
    function deferredFun(gId,filter_groups){
        var dtd = $.Deferred();//在函数内部，新建一个Deferred对象
        _this.loadChartByGroup(gId,filter_groups,function(){ },dtd);
        return  dtd.promise();
    }

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
    this.getChartIdByGId=function(groupId){
        return `${groupId}-chart`;
    };
    /**
     *  查询漏斗数据
     * @param gId
     * @param conditions
     * @param callBack
     * @param deferred
     */
    this.queryFunnelChart=function(gId,conditions,callBack,deferred){
        let _this=this;
        this.delChartDataByGId(gId);
        util.api({
            url: API.queryFunnelChart,
            type: 'post',
            timeout:1000*120,
            data: {
                "conditions":conditions//conditions
            },
            success: function (res) {
                let chartData=null;
                if(deferred){
                    if (notEmptyRespose(res)) {
                        chartData={
                            gId:gId,
                            data:res.data,
                            callBack:callBack
                        };
                    }else{
                        chartData={
                            gId:gId,
                            data:[],
                            callBack:callBack
                        };
                    }
                    funnel_chart_data_arr.push(chartData);
                    funnel_chart_data_map[gId]=chartData;
                    deferred.resolve();
                    return;
                }

                if (notEmptyRespose(res)) {
                    // [ {"tag_id":101,"tag_name":"性别","tag_count":100},...]
                    chartData={
                        gId:gId,
                        data:res.data,
                        callBack:callBack
                    };
                    _this.setFunnelChart(gId,res.data)
                }else{
                    chartData={
                        gId:gId,
                        data:[],
                        callBack:callBack
                    };
                    _this.setFunnelChart(gId,[])
                }
                funnel_chart_data_map[gId]=chartData;
                callBack&&callBack(res);
            },
            error: function (res) {
                _this.setFunnelChart(gId,[]);
                if(deferred){
                    deferred.resolve();
                }
                let chartData={
                    gId:gId,
                    data:[],
                    callBack:callBack
                }
                funnel_chart_data_arr.push(chartData)
                funnel_chart_data_map[gId]=chartData;
                window.console&&console.log("数据获取失败",res)
                //errorAlertMsg();
            }
        })
    };
    /**
     *
     * @param gId 组ID
     * @param callBack 回调
     * @param isDeferred 是否延迟
     */
    this.loadChartByGroup = function (gId,filter_groups,callBack,isDeferred) {
        try{
            let    tag_list=[];
            if(filter_groups&&filter_groups.length){
                filter_groups.every(function(itm,i){
                    if(itm.group_id==gId){
                        tag_list=itm.tag_list;
                        return false;
                    }
                    return true;
                })
                let conditions=this.filterTagList(tag_list);
                if(conditions.length){
                    this.queryFunnelChart(gId,conditions,callBack,isDeferred);
                }else{
                    this.setFunnelChart(gId,[]);
                    funnel_chart_data_map[gId]={
                        gId:gId,
                        data:[],
                        callBack:callBack
                    };
                    callBack&&callBack({data:[]})
                }
            }
        }catch (e){
            window.console&&console.log(e)
        }
    };
    /**
     * 过滤没有标签值的空对象
     * @param tag_list
     */
    this.filterTagList=function(tag_list){
        let arr=JSON.parse(JSON.stringify(tag_list));
       return arr.filter((x,i)=>{
           return (Array.isArray(x.tag_value_list)&&!!x.tag_value_list.length);
        })
    }
    //漏斗查询过滤组中的无效数据
    this.filterGroup=function(groups){
        let _this=this;
        Array.isArray(groups)&&groups.forEach((g,i)=>{
            g.tag_list= _this.filterTagList(g.tag_list);
        })
    };
    //设置漏斗数据
    this.setFunnelChart=function(groupId,data,isStatic){
        var chartId = this.getChartIdByGId(groupId);
        if(isStatic){//是否静态数据加载
            let chartID='#'+groupId+"-chart";
            this.disposeChart(chartID);
            this.create({
                id: chartId,
                type: 'funnel',
                renderTo: '#' + chartId
            })
        }else if(!this.getChartById(chartId)){//正常数据加载
            this.create({
                id: chartId,
                type: 'funnel',
                renderTo: '#' + chartId
            })
        }
        var  xAxisData=[],xAxisNames=[];
        data.forEach(function (itm, i) {
            xAxisData.push(itm.tag_count);
            xAxisNames.push(itm.tag_name);
        })
        //TMPConditionNames = _this.getConditionNamesByGId(gId);
        var num = data.length;
        var chartData = getData(num >= 3 ? 3 : num,data);
        chartData[0].label = {
            normal: {
                position: 'inside',
                formatter: '{c}',
                textStyle: {
                    color: '#fff'
                }
            }

        };
        var arg = $.extend(true, {}, {
            legend: {
                data: xAxisNames
            },
            series: chartData
        })
        this.getChartById(chartId).setOption(arg);
    };
    //加载全部漏斗图（静态数据）
    this.loadStaticAllFunnelChart=function(filter_groups,callBack){
        for(let groupID in funnel_chart_data_map){
            let itm=funnel_chart_data_map[groupID];
            var data= itm.data,gId=itm.gId,itmCallBack=itm.callBack;
            _this.setFunnelChart(gId,data,true);
            //itmCallBack&&itmCallBack()
        }
        this.fetchFunnelCharts4Static(filter_groups,callBack)
        //funnel_chart_data_arr.forEach(function(itm,i){
        //    var data= itm.data,gId=itm.gId,itmCallBack=itm.callBack;
        //    _this.setFunnelChart(gId,data,true);
        //    //itmCallBack&&itmCallBack();
        //})
    }
    //加载全部漏斗图
    this.loadAllFunnelChart=function(data,callBack){
        funnel_chart_data_arr=[];
        funnel_chart_data_map={};
        var argLen=0;
        var arg=[];
        var _this=this;
        //
        //if(data&&Array.isArray(data.filter_groups)){
        //    data.filter_groups.forEach((x)=> arg.push(deferredFun(x.group_id,data.filter_groups)))
        //}
        //$.when.apply(null,arg).done(function(res){
        //    funnel_chart_data_arr.forEach(function(itm,i){
        //        var data= itm.data,gId=itm.gId,itmCallBack=itm.callBack;
        //        _this.setFunnelChart(gId,data);
        //        itmCallBack&&itmCallBack();
        //    })
        //    callBack&&callBack(funnel_chart_data_arr);
        //
        //});
        if(data&&Array.isArray(data.filter_groups)){
            data.filter_groups.forEach((x)=>{
                x.group_change=1;
            })
        }
        this.fetchFunnelCharts(data.filter_groups,callBack)

    };
    /**
     * 渲染chart图
     * @param res
     */
    this.renderCharts=function(res){
        let _this=this;
        if(!res.code&&res.data&&res.data.length){
            res.data.forEach((g,i)=>{
                if(g.group_change){//数据有变化的 1 ，没有变化的 0
                    funnel_chart_data_map[g.group_id]={
                        gId:g.group_id,
                        data:g.chart_data
                    };
                    _this.setFunnelChart(g.group_id,g.chart_data);
                }
            })
        }
    }
    this.fetchChartAction4Static=function(conditions,callBack){
        let _this=this;
        //排序
        if(Array.isArray(conditions)){
            conditions.forEach((g,i)=>{
                Array.isArray(g.tag_list)&&g.tag_list.sort(createComptionFuntion("tag_index"))
            })
        }
        util.api({
            url: API.queryFunnelChart,
            type: 'post',
            timeout:1000*120,
            data: {
                "filter_groups":conditions
            },
            success: function (res) {
                callBack&&callBack(res);
            },
            error: function (res) {
                errorAlertMsg('数据获取失败!');
                window.console&&console.log("数据获取失败",res)
                //errorAlertMsg();
            }
        })
    };
    this.fetchChartAction=function(conditions,callBack){
        let _this=this;
        //排序
        if(Array.isArray(conditions)){
            conditions.forEach((g,i)=>{
                Array.isArray(g.tag_list)&&g.tag_list.sort(createComptionFuntion("tag_index"))
            })
        }
        util.api({
            url: API.queryFunnelChart,
            type: 'post',
            timeout:1000*120,
            data: {
                "filter_groups":conditions
            },
            success: function (res) {
                _this.renderCharts(res);
                callBack&&callBack(res);
            },
            error: function (res) {
                errorAlertMsg('数据获取失败!');
                window.console&&console.log("数据获取失败",res)
                //errorAlertMsg();
            }
        })
    };
    this.fetchFunnelCharts=function(filter_groups,callBack){
        try{
            let groups=JSON.parse(JSON.stringify(filter_groups));
            if(groups&&groups.length){
                this.filterGroup(groups);
                this.fetchChartAction(groups,callBack)
            }
        }catch (e){
            window.console&&console.log(e)
        }
    };
    this.fetchFunnelCharts4Static=function(filter_groups,callBack){
        try{
            let groups=JSON.parse(JSON.stringify(filter_groups));
            if(groups&&groups.length){
                this.filterGroup(groups);
                this.fetchChartAction4Static(groups,callBack)
            }
        }catch (e){
            window.console&&console.log(e)
        }
    };
     this.resizeFunnelChart = function (chartId) {
            //var charts= this.charts.getCharts();
            var charts = this.getCharts();
            for (var k in charts) {
                if (k != chartId) {//Echart Bug  不能在setOption 之后立即resize ,否则漏斗不显示
                    charts[k].resize();
                }
            }
        };
     this.delChartDataByGId=function(groupId){
         delete funnel_chart_data_map[groupId];
         funnel_chart_data_arr= funnel_chart_data_arr.filter((x,i)=>{
            return  x.gId!=groupId;
         })
     }
    this.changeChartDataByGId=function(groupId,data){
        return !funnel_chart_data_arr.every((x,i)=>{
            if(x.gId!=groupId){
                x.data=data;
                return false;
            }
            return true;
        })
    }
    this.getFunnelChartDataArr=function(res){
        let arr=[];
        if(!res.code&&res.data&&res.data.length){
            res.data.forEach((g,i)=>{
                if(g.group_change){//数据有变化的 1 ，没有变化的 0
                    arr.push(g);
                }
            })
        }
        return arr;
    }
}
module.exports=model;
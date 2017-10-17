'use strict';
let Header= require('./header.js');
let Content= require('./content.js');
let Modals = require('component/modals.js');
let Formatter=require('../utils/formatter.js');
let FunnelModel=require('../model/funnelChartModel.js');
let DragModel=require('../model/dragModel.js');
let MainCtl=require('../controller/mainController');
//let MainCtl=require('../controller/mainController.js');
//组数限制
let GROUP_NUM_LIMIT=4;
//单个组的标签个数限制
let TAG_NUM_LIMIT=5;
let funnelChart=null;
let dragObject=null;
let mainController=null;
window.CURRENTSEGMENTID=null;
const API={
    //系统参数
    querySysArg:'?method=mkt.taggroup.limit.get',//{  "msg": "success","total": 0,"data": [group_limit:5,tag_limit:5],"date": "2016-10-19","total_count": 0,"col_names": []}
    //查询主数据
    queryBody:'?method=mkt.homepage.calendar.list&date=0',
    //保存数据
    querySave:'?method=mkt.contact.importkeylist.get',
    //修改状态
    updateStatus:'?method=mkt.contact.list.used',
    //漏斗
    queryFunnelChart:'?method=mkt.contact.list.tag.get',
    //柱状图
    qeuryBarChart:'?method=mkt.contact.list.tag'
};
function errorAlertMsg(msg="数据获取失败！") {
    new Modals.Alert(msg);
}
function successMsg(msg="保存成功！"){
    Materialize.toast(msg, 3000)
}
function random(n){
    let num="";
    for(let i=0;i<n;i++) {
        num+=Math.floor(Math.random()*10);
    }
    return num;
}
function getRandomStr(){
    let str=(Math.random()/+new Date()).toString(36).replace(/\d/g,'').slice(1)+random(16);
    return str.substr(0,16);
}
//延迟函数
function deferredFun(gId,fun){
    var dtd = $.Deferred();//在函数内部，新建一个Deferred对象
    return  dtd.promise();
}
function creatComaptionFuntion(propertyName) {
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
class Panel extends React.Component{
    constructor(props){
        super(props);
        let group_id=getRandomStr();
        let tag_id=group_id+"_temp_tag_"+getRandomStr();
        this.state = {
            "oper": "",
            "updatetime": "",
            tipsData:[],
            tipsDataCount:0,
            "segment_head_id": "",
            "segment_name": "",
            "publish_status": 0,
            "sengment_total":0,
            "filter_groups": [
                {
                    "group_id": group_id,
                    "group_name": "分组",
                    "group_index": 1,
                    "tag_list": [
                        {
                            "tag_id": tag_id,
                            "tag_name": "选择标签来筛选人群",
                            "tag_exclude": 0,
                            "tag_model": 0,
                            "tag_value_list": []
                        }
                    ]
                }
            ]
        };
        this.segmentData={
            title:'',
            status:'',
            segment_head_id:'',
            tipsData:[],
            groups:[]
        };
        funnelChart=new FunnelModel(this);
        dragObject=new DragModel(this);
        mainController=new MainCtl();
        this.createGroup=this.createGroup.bind(this);
        this.createTag=this.createTag.bind(this);
        this.getCurrentGroupNum=this.getCurrentGroupNum.bind(this);
        this.getCurrentTagNumByGroup=this.getCurrentTagNumByGroup.bind(this);
        this.delGroup=this.delGroup.bind(this);
        this.delTag=this.delTag.bind(this);
        this.changeGroupName=this.changeGroupName.bind(this);
        this.changeTagExclude=this.changeTagExclude.bind(this);
        this.changeTagText=this.changeTagText.bind(this);
        this.relateTagEdit=this.relateTagEdit.bind(this);
        this.changeFunnelChartData=this.changeFunnelChartData.bind(this);
        this.clickInput=this.clickInput.bind(this);
        this.editSegmentTitle=this.editSegmentTitle.bind(this);
        this.updateStatus=this.updateStatus.bind(this);
        this.saveHandler=this.saveHandler.bind(this);
        this.inputOnMouseEnter=this.inputOnMouseEnter.bind(this);
        this.setTipsPos=this.setTipsPos.bind(this);

    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));

        let _this=this;
        mainController.querySegmentSysParams(function(res){
             if(!res.code&&res.data&&res.data.length){

                 let r=res.data[0];
                 GROUP_NUM_LIMIT=r.group_limit;
                 TAG_NUM_LIMIT=r.tag_limit;
             }
            _this.init();
            _this.loadData();
        });

    }
    updateOriginalData(data){
        this.originalData=JSON.parse(JSON.stringify(data||this.state));
    }
    setTipsPos(groupId,tagId,e){
        let tipsData=[];
        this.state.filter_groups.every((g,i)=>{
            if(g.group_id==groupId){
                g.tag_list.every((tag,m)=>{
                    let re=true;
                    if(tag.tag_id==tagId){
                        tipsData=tag.tag_value_list;
                        re=false;
                    }
                    return re;
                })
                return false;
            }
          return true;
        })
        let count=Array.isArray(tipsData)?tipsData.length:0;
        let $tar=$(e.target);
        let $tarBox=$tar.parent();
        let cb=(tarBoxId)=>{
            let $tarBox=$('#'+tarBoxId);
            let $tar=$tarBox.find('.input');
            let tar=$tar[0];
            if(tar.classList.contains("close-icon")||
                tar.classList.contains("end-icon")||
                tar.classList.contains("first-icon")||
                tar.classList.contains("input")){
                tar=tar.parentNode;
            }
            $tar=$(tar);
            let tarDom=$tar[0];
            let $tips=$('.segment-tips');
            let rect=tarDom.getBoundingClientRect();
            let $groupBox=$tar.parents('.group-box');
            let groupBoxDom=$groupBox[0];
            let $inputBox=$tar.parent();
            let inputBoxDom=$inputBox[0];
            let gRect=$groupBox[0].getBoundingClientRect();
            let tipsDom=$tips.get(0);
            let $cc=$('#segment .content-center');
            let ccDom=$cc.get(0);
            let ccHeight=ccDom.scrollHeight+ccDom.offsetTop;
            let tarTop=inputBoxDom.offsetTop;
            let tipsDomHeight=$tips.height()+40;
            let diff=ccHeight-tarTop-70;
            let top=40+inputBoxDom.offsetTop-ccDom.scrollTop;
            if(diff<tipsDomHeight){
                top-=(tipsDomHeight+35);
            }
            $tips.css({
                top:top,
                left:inputBoxDom.offsetLeft
            }).show();
        }
        count&&this.setState({
            tipsData
        },()=>{
            cb($tarBox.attr('id'));
        })


    }
    inputOnMouseEnter(e){
        $('.segment-tips').hide();
    }
    cloneData(data){
        this.stateClone=JSON.parse(JSON.stringify(data||this.state));
    }
    //保存细分
    saveHandler(){
       mainController.saveSegmentInfo(window.CURRENTSEGMENTID,this.segmentData.publish_status,this);
    }
    //生效或失效
    updateStatus(status){
        mainController.updateSegmentInfo(window.CURRENTSEGMENTID,status,this);
    }
    //编辑title
    editSegmentTitle(){
        //id,name,status,callBack
        mainController.editSegmentTitle(window.CURRENTSEGMENTID,this.segmentData.publish_status,this)
    }
    getSegmentInfo(){
        return JSON.parse(JSON.stringify(this.segmentData));
    }
    getFilterGroupsData(){
        return JSON.parse(JSON.stringify(this.segmentData.filter_groups));
    }
    /**
     * 新建标签
     */
    createTag(groupId,e){
        if(this.segmentData.publish_status){
            return ;
        }
        let filter_groups=this.getFilterGroupsData();
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                if(!Array.isArray(r.tag_list)){
                    r.tag_list=[];
                }
                r.tag_list.push({
                    "tag_id": groupId+"_temp_tag_"+getRandomStr(),
                    "tag_name": "选择标签来筛选人群",
                    "tag_exclude": 0,
                    "tag_value_list": []
                })
                return false;
            }
            return true;
        })
        this.setState({
            filter_groups
        })

    }
    /**
     *删除组
     */
    delTag(groupId,tagId){
        let _this=this;
        let filter_groups=this.getFilterGroupsData();
        let flag=false;
        let oldGroupData=Formatter.getGroupData(groupId,filter_groups);
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                if(Array.isArray(r.tag_list)&&r.tag_list.length){
                    r.tag_list=r.tag_list.filter((t,i)=>{ return t.tag_id!=tagId;});
                    flag=true;
                }
                if(!r.tag_list||!r.tag_list.length){
                    r.tag_list.push(_this.getDefaultTagDataByGroug(groupId));
                }
                return false;
            }
            return true;
        })
        this.setState({
            filter_groups
        },()=>{
            let newGroupData=Formatter.getGroupData(groupId,filter_groups);
            let isSame=mainController.isSameGroupData(oldGroupData,newGroupData);
            !isSame&&this.changeFunnelChartData(groupId,filter_groups)
        })

    }
    //选择是否排除
    changeTagExclude(groupId,tagId,exclude){
        let filter_groups=this.getFilterGroupsData();
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                if(Array.isArray(r.tag_list)&&r.tag_list.length){
                    r.tag_list.every((t,i)=>{
                        if(t.tag_id==tagId){
                            t.tag_exclude=exclude?1:0;
                            return false;
                        }
                        return true;
                    });
                }
                return false;
            }
            return true;
        })
        let _this=this;
        this.setState({
            filter_groups
        },()=>{
            _this.changeFunnelChartData(groupId,filter_groups)
        });

    }
    //修改标签显示名称
    changeTagText(groupId,tagId,oldTagId,data){
        let filter_groups=this.getFilterGroupsData();
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                if(Array.isArray(r.tag_list)&&r.tag_list.length){
                    r.tag_list.every((t,i)=>{
                        if(t.tag_id==oldTagId){
                            Object.assign(t,data);
                            t.tag_value_list=JSON.parse(JSON.stringify(data.tag_value_list));
                            t.showText=Formatter.transformTagShowText(data);
                            if(!t.showText){
                                Object.assign(t,{
                                    "tag_id": r.group_id+"_temp_tag_"+getRandomStr(),
                                    "tag_name": "选择标签来筛选人群",
                                    "tag_exclude": 0,
                                    "tag_value_list": []
                                });
                                t.tag_value_list=[];
                            }

                            return false;
                        }
                        return true;
                    });
                }
                return false;
            }
            return true;
        })
        let _this=this;
        this.setState({
            filter_groups
        },()=>{
            _this.changeFunnelChartData(groupId,filter_groups);
        });

    }
    /**
     *新建组
     */
    createGroup(e){
        if(this.segmentData.publish_status){
            return ;
        }
        let filter_groups=this.getFilterGroupsData();
        filter_groups.push(this.getDefaultGroupData(getRandomStr()));
        this.setState({
            filter_groups
        })
    }
    /**
     *删除组
     */
    delGroup(groupId){
        if(this.segmentData.publish_status){
            return ;
        }
        let filter_groups=this.getFilterGroupsData();
        let _this=this;
        if(Array.isArray(filter_groups)&&filter_groups.length){
            filter_groups=filter_groups.filter((x,i)=>{ return x.group_id!=groupId;});
            if(!filter_groups.length){
                filter_groups.push(_this.getDefaultGroupData(getRandomStr()))
            }
            this.setState({
                filter_groups
            },()=>{
                let chartId=funnelChart.getChartIdByGId(groupId);
                funnelChart.disposeChart(chartId);
                funnelChart.resizeFunnelChart(chartId);
                funnelChart.delChartDataByGId(groupId);
                funnelChart.loadStaticAllFunnelChart(filter_groups,function(res){
                    let segment_total=res.segment_total;
                    _this.setState({segment_total});
                });
            })
        }


    }
    //修改组名称
    changeGroupName(groupId,name){
        let filter_groups=this.getFilterGroupsData();
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                r.group_name=name;
                return false;
            }
            return true;
        })
        this.setState({
            filter_groups
        })
    }

    queryBody(segmentId,cb){
        let _this=this;
        mainController.querySegmentInfo(segmentId,function(res){
            if (res && res.code == 0 && res.data && res.data.length) {
                window.CURRENTSEGMENTID = segmentId;
                let segmentData=res.data[0];
                Formatter.transformSegmentShowText(segmentData);
                cb&&cb(segmentData);
            }
        });
    }
    //获取当前组的个数
    getCurrentGroupNum(){
        return Array.isArray(this.segmentData.filter_groups)?this.segmentData.filter_groups.length:0;
    }
    //获取当前组的标签个数
    getCurrentTagNumByGroup(groupId){
       let groups=this.getFilterGroupsData();
       let group=groups.filter((x,i)=>{ return x.group_id==groupId });
        return Array.isArray(group)&&group.length?(Array.isArray(group[0].tag_list)?group[0].tag_list.length:0):0;
    }
    getDefaultTagDataByGroug(group_id){
        return {
            "tag_id": group_id+"_temp_tag_"+getRandomStr(),
            "tag_name": "选择标签来筛选人群",
            "tag_exclude": 0,
            "tag_value_list": []
        };
    }
    getDefaultGroupData(group_id){
        return {
            "group_id": group_id,
            "group_name": "分组",
            "group_index": 1,
            "tag_list": [
                {
                    "tag_id": group_id+"_temp_tag_"+getRandomStr(),
                    "tag_name": "选择标签来筛选人群",
                    "tag_exclude": 0,
                    "tag_value_list": []
                }
            ]
        };
    }
    init(){
        let group_id=getRandomStr();
        let segmentData=JSON.parse(JSON.stringify(this.state));
        Object.assign( segmentData, {GROUP_NUM_LIMIT, TAG_NUM_LIMIT});
        if(!segmentData.filter_groups||!this.segmentData.filter_groups.length){
            segmentData.filter_groups=[];
            segmentData.filter_groups.push(this.getDefaultGroupData(group_id));
        }
        this.setRetunIcon(segmentData,util.getLocationParams())
        this.setSysBase(segmentData)
        this.setState(segmentData)
    }

    changeSegmentData(){
        this.segmentData=JSON.parse(JSON.stringify(this.state));
        window.CURRENTSEGMENTID=this.segmentData.segment_head_id?this.segmentData.segment_head_id:window.CURRENTSEGMENTID;
    }
    //加载数据
    loadData() {
        var params = util.getLocationParams();//||{audienceId:124};
        let _this=this;
        if (!params) {
            return;
        } else if (params.audienceId) {
            window.CURRENTSEGMENTID = params.audienceId;
            this.queryBody(window.CURRENTSEGMENTID,function(data){
                _this.setState(data,()=>{
                    funnelChart.loadAllFunnelChart(data,function(res){
                        let arr=funnelChart.getFunnelChartDataArr(res);
                        let filter_groups= _this.setAllChartBodyClass(arr)
                        let segment_total=res.segment_total||0;
                        _this.setState({filter_groups,segment_total});
                    });
                });

            })
        }
    }
    //设置chart class and title 覆盖人数
    setChartBodyClassTitle(groupId,hasChartData,chartCount,filter_groups){
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                r.hasChartData=hasChartData;
                r.chartCount=chartCount;
                return false;
            }
            return true;
        })
    }
    //变化漏斗数据
    changeFunnelChartData(groupId,filter_groups){
        let _this=this;
        //funnelChart.loadChartByGroup(groupId,filter_groups,function(res){
        //   let hasChartData=res&&!!(Array.isArray(res.data)&&res.data.length);
        //    console.log('changeFunnelChartData',hasChartData)
        //    res&&res.data.sort(creatComaptionFuntion('tag_count'));
        //    let chartCount=hasChartData?res.data[0].tag_count:0;//hasChartData
        //    _this.setChartBodyClassTitle(groupId,hasChartData,chartCount,filter_groups);
        //    console.log('changeFunnelChartData',filter_groups)
        //    console.log('changeFunnelChartData setState')
        //    _this.setState({filter_groups});
        //});
        filter_groups.forEach((g,i)=>{
            g.group_change=g.group_id==groupId?1:0;
        })
        funnelChart.fetchFunnelCharts(filter_groups,function(res){
            let chartData=[];
            let hasChartData=false;
            if(!res.code&&res.data&&res.data.length){
                res.data.every((g,i)=>{
                    /*
                     {
                     "group_id": "group1",
                     "group_name": "fenzu",
                     "group_index": 1,
                     "group_change": 1,//0 表示不重算 1 重算
                     "chart_data": [
                     {
                     "tag_id": 101,
                     "tag_name": "性别",
                     "tag_count": 100
                     },
                     {
                     "tag_id": 102,
                     "tag_name": "年龄",
                     "tag_count": 90
                     }]
                     */
                    if(g.group_id==groupId&&g.group_change==1){
                        chartData=g.chart_data;
                        return false;
                    }
                    return true;
                })
                hasChartData=res&&!!(Array.isArray(chartData)&&chartData.length);
            }

            Array.isArray(chartData)&&chartData.sort(creatComaptionFuntion('tag_count'));
            let chartCount=( Array.isArray(chartData)&&chartData.length)?chartData[0].tag_count:0;//hasChartData
            _this.setChartBodyClassTitle(groupId,hasChartData,chartCount,filter_groups);
            let segment_total=res.segment_total;
            _this.setState({filter_groups,segment_total});

        })
    }
    /**
     * 设置全部的chart 样式
     * @param groups {}
     *{}gId,
     *{}data,
     *{}callBack
     */
    setAllChartBodyClass(groups){
        let filter_groups=this.getFilterGroupsData();
        let _this=this;
        groups.forEach((g,i)=>{
            let hasChartData=!!(Array.isArray(g.chart_data)&&g.chart_data.length);
            Array.isArray(g.chart_data)&&g.chart_data.sort(creatComaptionFuntion('tag_count'));
            let chartCount=hasChartData?g.chart_data[0].tag_count:0;//hasChartData
            _this.setChartBodyClassTitle(g.group_id,hasChartData,chartCount,filter_groups)
        })
        return filter_groups;
    }
    //设置返回Icon
    setRetunIcon(data,arg){
        let returnurl=(arg&&arg.returnurl)?arg.returnurl:'';
        if(arg&&arg.planId&&returnurl){
            returnurl+='?planId='+arg.planId;
        }
        Object.assign(data,{returnurl})
    }
    setSysBase(data){
        Object.assign( data, {GROUP_NUM_LIMIT, TAG_NUM_LIMIT});
    }
    //关联标签
    relateTagEdit(){
        if(window.CURRENTSEGMENTID){
            mainController.editRelateTag(window.CURRENTSEGMENTID);
        }
    }
    clickInput(groupId,tagId){
        let filter_groups=this.getFilterGroupsData();
        filter_groups.forEach((r,i)=>{
            if(r.group_id==groupId){
                if(Array.isArray(r.tag_list)&&r.tag_list.length){
                    r.tag_list.forEach((t,i)=>{
                        t.active=t.tag_id==tagId;
                    });
                }
            }else{
                if(Array.isArray(r.tag_list)&&r.tag_list.length){
                    r.tag_list.forEach((t,i)=>{
                        t.active=false;
                    });
                }
            }
        })
        this.setState({
            filter_groups
        });
    }

    /**
     * 拖拽结束
     * @param detTagId
     * @param tmpSpaceId
     * @param groupId
     */
    dragTagAfter(detTagId,tmpSpaceId,groupId){
        let _this=this;
        let filter_groups=this.getFilterGroupsData();
        let oldGroupData=Formatter.getGroupData(groupId,filter_groups);
        Formatter.transformerGroupDataByDrag(detTagId,tmpSpaceId,groupId,filter_groups);
        let newGroupData=Formatter.getGroupData(groupId,filter_groups);
        let isSame=mainController.isSameGroupData(oldGroupData,newGroupData);
        this.setState({
            filter_groups
        },()=>{
            !isSame&&_this.changeFunnelChartData(groupId,filter_groups);
        });

    }
    render(){
        this.changeSegmentData();
        return (
            <div className="segment" id="segment">
             <Header  data={this.segmentData}
                 saveHandler={this.saveHandler}
                 updateStatus={this.updateStatus}
                 relateTagEdit={this.relateTagEdit}
                 editSegmentTitle={this.editSegmentTitle}
             />
             <Content
                 data={this.segmentData}
                 getRandomStr={getRandomStr}
                 createTag={this.createTag}
                 createGroup={this.createGroup}
                 getCurrentGroupNum={this.getCurrentGroupNum}
                 getCurrentTagNumByGroup={this.getCurrentTagNumByGroup}
                 delGroup={this.delGroup}
                 delTag={this.delTag}
                 changeGroupName={this.changeGroupName}
                 changeTagExclude={this.changeTagExclude}
                 changeTagText={this.changeTagText}
                 clickInput={this.clickInput}
                 setTipsPos={this.setTipsPos}
                 inputOnMouseEnter={this.inputOnMouseEnter}
             />
            </div>
        )

    }
}
module.exports = Panel;
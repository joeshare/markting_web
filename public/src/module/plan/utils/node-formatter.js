/**
 * Author LLJ
 * Date 2016-5-10 9:53
 * 节点数据工具
 */
var dateTimer=require('./dateTime.js');
var constant=require('./constant.js');
function getTextByVal(val,arr){
    var text="";
    arr&&arr.length&&arr.every(function(rec,i){
        if(val=rec.val){
            text=rec.text;
            return false;
        }
        return true;
    })
    return text;
}
function normalData(){

}
var format= {
    timerTrigger:{
        //展示数据
        showData:function(nodeRec,info){
            var starArr=["",""],endArr=["",""];
            if(!info){
                nodeRec.info={
                    name:"",
                    startDate:"",
                    startTime:"",
                    endDate:"",
                    endTime:"",
                    start_time:"",
                    end_time:"",
                    desc: nodeRec.desc||''
                };
                return;
            }
            if(info.start_time){
                starArr=info.start_time.split(" ");
            }
            if(info.start_time){
                endArr=info.end_time.split(" ");
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.startDate=starArr[0];
            nodeRec.info.startTime=dateTimer.timeHourMin(starArr[1]);
            nodeRec.info.endDate=endArr[0];
            nodeRec.info.endTime=dateTimer.timeHourMin(endArr[1]);
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    eventTrigger:{
        //展示数据
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name:"",
                    event_id:"",
                    event_name:"",
                    event_code:"",
                    desc: nodeRec.desc||''
                };
                return;
            }

            nodeRec.info=$.extend(true,{},info);

            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    manualTrigger:{//手动
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    remark: "",
                    manual_type:  "",
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr
            nodeRec.info.BASEPATH=window.BASEPATH;
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    targetGroup:{//目标人群
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: "",
                    segmentation_id:  "",
                    segmentation_name:  "",
                    allowed_new:  "",
                    refresh_interval_type_arr: constant.refresh_interval_type_arr,
                    refresh_interval:  "",
                    refresh_interval_type:  "",
                    desc: nodeRec.desc||'',
                    BASEPATH: window.BASE_PATH
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr
            nodeRec.info.BASEPATH=window.BASEPATH;
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    separatedGroup:{//细分人群
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: "",
                    segmentation_id:  "",
                    segmentation_name:  "",
                    allowed_new:  "",
                    refresh_interval_type_arr: constant.refresh_interval_type_arr,
                    refresh_interval:  "",
                    refresh_interval_type:  "",
                    desc: nodeRec.desc||'',
                    BASEPATH: window.BASE_PATH
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr
            nodeRec.info.BASEPATH=window.BASEPATH;
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    attrComparison:{//关系人比较
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name:"",
                    prop_type: 0,
                    prop_typeText: "",
                    exclude:0,//0:不选中"不",1:选中“不”
                    date:"",
                    val:"",
                    num:"",
                    subSelectArr:constant.attr_comparsion,
                    subSelect:1,
                    subSelectText:"",
                    time:"",
                    desc: nodeRec.desc||'', //getSelectText(relSelectText),
                    rule:"",
                    refresh_interval_type_arr:constant.refresh_interval_type_arr,
                    rule_value:""
                };
                return;
            }
            var val='',num='',dataTimeArr=["",""],date="",time='',subSelectArr=constant.attr_comparsion;
            if(info.prop_type==0){//文本
                subSelectArr=[{val:0,text:"等于"},{val:1,text:"包含"},{val:2,text:"以特定文本开头"},{val:3,text:"以特定文本结尾"},{val:4,text:"为空"}];
                val=info.rule_value;
            }else if(info.prop_type==1){//数字
                subSelectArr=[{val:0,text:"等于"},{val:5,text:"大于"},{val:6,text:"小于"},{val:7,text:"大于等于"},{val:8,text:"小于等于"},{val:4,text:"为空"}];
                num=info.rule_value;
            }else if(info.prop_type==2){//日期
                subSelectArr=[{val:0,text:"等于"},{val:7,text:"早于"},{val:8,text:"晚于"},{val:4,text:"为空"}];
                dataTimeArr=info.rule_value?info.rule_value.split(" "):["",""];
                date=dataTimeArr[0];
                time=dateTimer.timeHourMin(dataTimeArr[1]);
            }
           var subSelect=info.rule;
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.val=val;
            nodeRec.info.prop_typeText=getTextByVal(info.prop_type,constant.refresh_interval_type_arr);
            nodeRec.info.num=num;
            nodeRec.info.date=date;
            nodeRec.info.time=time;
            nodeRec.info.subSelectArr=subSelectArr,
            nodeRec.info.subSelect=subSelect,
            nodeRec.info.subSelectText=getTextByVal(subSelect,subSelectArr),
            nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr;
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    wechatSend:{
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    refresh_interval_type_arr:constant.refresh_interval_type_arr,
                    name:'',
                    "asset_id":"",//公众号id
                    "asset_name":"",//公众号name
                    "img_text_asset_id":"",//图文id
                    "img_text_asset_name":"",//图文name
                    refresh_interval: '',
                    refresh_interval_type: '',
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr;
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    wechatCheck:{
         showData:function(nodeRec,info){
             if(!info){
                 nodeRec.info={
                     refresh_interval_type_arr:constant.refresh_interval_type_arr,
                     name: '',
                     "asset_id":"",//公众号id
                     "asset_name":"",//公众号name
                     "img_text_asset_id":"",//图文id
                     "img_text_asset_name":"",//图文name
                     read_time: '',//查看时长,0:不限,1:超一分钟,2:超三分钟,3:超五分钟,4:超十分钟
                     read_percent: '',
                     refresh_interval: '',
                     refresh_interval_type:'',
                     desc: nodeRec.desc||''
                 };
                 return;
             }
             nodeRec.info=$.extend(true,{},info);
             nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr;
             nodeRec.info.desc=nodeRec.desc||'';
         }
    },
    wechatForwarded:{
        showData:function(nodeRec,info){//图文转发
            if(!info){
                nodeRec.info={
                    name: '',
                    "asset_id":"",//公众号id
                    "asset_name":"",//公众号name
                    "img_text_asset_id":"",//图文id
                    "img_text_asset_name":"",//图文name
                    forward_times: '',
                    forward_times_text: '',
                    refresh_interval: '',
                    refresh_interval_type: '',
                    refresh_interval_type_arr:constant.refresh_interval_type_arr,
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr;
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    subscriberPublic:{//订阅公众号
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: '',
                    asset_id:'',
                    asset_name:'',
                    subscribe_time:'',
                    subscribe_time_text:'',
                    refresh_interval: '',
                    refresh_interval_type: '',
                    refresh_interval_type_arr:constant.refresh_interval_type_arr,
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr;
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    personalFriend:{//个人好友
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: '',
                    asset_id:'',
                    asset_name:'',
                    group_id:'',
                    group_name:'',
                    refresh_interval: '',
                    refresh_interval_type: '',
                    refresh_interval_type_arr: constant.refresh_interval_type_arr,
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr;
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    labelJudgment:{//标签判断
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: '',
                    rule: '',
                    ruleText: '',
                    tags: "",
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    waitSet:{//等待
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: '',
                    relative_value: '',
                    relative_type: '',
                    refresh2Text: '',
                    refresh_interval_type_arr:constant.refresh_interval_type_arr,
                    radio: '',
                    date: '',
                    setTime: '',
                    "specific_time":'',
                    type:'',
                    desc: nodeRec.desc||''
                };
                return;
            }
            var date ="",setTime="",radio="",time="";
            var newTime=new Date()-0;
            info.specific_time=info.specific_time?info.specific_time:dateTimer.getDateTimeStr(newTime);
            if(info.type==0){//相对时间
                radio = 'relative'
            }else if(info.type==1){//指定时间
                radio = 'specify';
            }
            var dateArr=info.specific_time.split(" ");
            date  =dateArr[0];
            time  =dateArr[1];
            setTime=dateTimer.timeHourMin(time);

            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.date=date;
            nodeRec.info.setTime=setTime;
            nodeRec.info.radio=radio;
            nodeRec.info.refresh2Text="";
            nodeRec.info.refresh_interval_type_arr=constant.refresh_interval_type_arr;
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    saveCurrentGroup:{//保存当前用户
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: '',
                    audience_id:'',
                    audience_name:'',
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    setTag:{//设置标签
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: '',
                    tag_names:'',
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    sendImg:{//发送图文
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name:'',
                    img_text_asset_id: '',
                    img_text_asset_name: '',
                    asset_id: '',
                    asset_name: '',
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    sendH5:{
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name:'',
                    img_text_asset_id: '',
                    img_text_asset_name: '',
                    pub_asset_id: '',
                    pub_asset_name: '',
                    prv_asset_id: '',
                    prv_asset_name: '',
                    group_id: '',
                    group_name: '',
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    sendMsg:{//发送消息
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: '',
                    asset_id: '',
                    asset_name: '',
                    group_id: '',
                    group_name: '',
                    text_info: '',
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    sendSMS:{//发送短信
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name: '',
                    sms_category_type: '',
                    sms_category_name: '',
                    sms_material_id: '',
                    sms_material_name: '',
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.desc=nodeRec.desc||'';
        }
    },
    segementGroup:{
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name:"",
                    segmentation_id: "",
                    segmentation_name: "",
                    allowed_new: "",//0:允许,1:不允许
                    refresh_interval_type_arr:[],
                    refresh_interval: 1,//v1.7 写死
                    refresh_interval_type: "",
                    desc: nodeRec.desc||'',
                    BASEPATH: BASE_PATH
                 };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.desc=nodeRec.desc||'';
        }

    },
    fixGroup:{
        showData:function(nodeRec,info){
            if(!info){
                nodeRec.info={
                    name:"",
                    "fix_group_id": "",
                    "fix_group_name": "",
                    desc: nodeRec.desc||''
                };
                return;
            }
            nodeRec.info=$.extend(true,{},info);
            nodeRec.info.desc=nodeRec.desc||'';
        }

    }
};
module.exports = format;

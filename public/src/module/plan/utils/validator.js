require('./jQuery.md5');
/**
 * Author LLJ
 * Date 2016-6-1 14:10
 */
function each(data,handler){
    for(var k in data){
        var node=data[k];
        if(handler.call(null,k,node,data)==false) {
            break;
        }
    }
}
function isEmpty(v){
    return isNaN(parseInt(v))&&(v==""||v==null||v==undefined);
}
var validator={
    //是否相等
    isSame:function(arg1,arg2){
        var s1=arg1.replace(/"|'/g,"").replace(/(:null,?|:0,?|BASEPATH:?,?)/g,"").replace(/(:|,)/g,""),
            s2=arg2.replace(/"|'/g,"").replace(/(:null,?|:0,?|BASEPATH:?,?)/g,"").replace(/(:|,)/g,"");
           // s1=arg1.replace(/(:null|:0|BASEPATH:?,?)/g,":");
           // s2=arg2.replace(/(:null|:0|BASEPATH:?,?)/g,":");
       return $.md5(s1)==$.md5(s2);
    },
    //节点是否在数组里
    isInArray:function(nodeId,arr){
      return !arr.every(function(itm,i){
            return !(itm.item_id==nodeId);
        });
    },
    isEmptyArr:function(data){
        return !data||!data.length;
    },
    //是否为空
    isEmptyObj:function(data){
        var flag=true;
        if(data){
            for(var k in data){
                flag=false;
                break;
            }
        }
        return flag;
    },
    //是否有基础节点 （触发，受众，行动）同时必须有个输出点 且必须只有一个开始节点
    hasBaseNode:function(data){
        if(!data){ return false;}
        var startNum=0,//开始节点数量
            audienceNum=0,//受众节点数量
            activeNum=0,//行动节点数量
            haseventnode=0;//是否有事件节点
        data.forEach(function(node,i){
            node.nodeType=='trigger'&& startNum++;
            node.nodeType=='audiences'&& audienceNum++;
            node.nodeType=='activity'&& activeNum++;
            if(node.itemType=='event-trigger')
            {
                haseventnode=1;
            }
        })

       if(haseventnode)
       {
           return {
               hasStart:startNum==1,
               startMsg:'活动必须且只能有一个触发节点，否则不能启动',
               hasAud:audienceNum==0,
               audMsg:'事件触发节点存在时不能有受众节点，否则不能启动',
               hasAct:activeNum>0,
               actMsg:'活动至少有一个行动节点，否则不能启动',
           };
       }
       else {
           return {
               hasStart:startNum==1,
               startMsg:'活动必须且只能有一个触发节点，否则不能启动',
               hasAud:audienceNum>0,
               audMsg:'非事件触发活动至少有一个受众节点，否则不能启动',
               hasAct:activeNum>0,
               actMsg:'活动至少有一个行动节点，否则不能启动',
           };
       }


    },
    //是否本节点有输入节点
    isInOthersEndSwitch:function(nodeId,data){
        var flag=false;
        data.every(function(node,i){
             if(node.item_id==nodeId){
                 return true;
             }else{
                 node.ends.every(function(end,i){
                     if(end&&typeof end =='object'){
                         flag=(nodeId==end.next_item_id);
                     }else{
                         flag=false;
                     }
                     return !flag;
                 });
                 if(flag){
                     return !flag;
                 }
                 node.switch.every(function(end,i){
                     if(end&&typeof end =='object'){
                         flag=(nodeId==end.next_item_id);
                     }else{
                         flag=false;
                     }
                     return !flag;
                 });
                 if(flag){
                     return !flag;
                 }
             }
             return !flag;
        })
        return flag;
    },
    //是否有输出节点
    hasOutput:function(nodeId,data){
        var flag=false,_this=this;
        data.every(function(node,i){
            if(nodeId=node.item_id){
                node.ends.every(function(end,i){
                    flag=false;
                    if(end&&typeof end =='object'){
                        flag=_this.isInArray(end.next_item_id,data);
                    }
                    return !flag;
                });
                if(flag){
                    return !flag;
                }
                node.switch.forEach(function(end,i){
                    flag=false;
                    if(end&&typeof end =='object') {
                        flag = _this.isInArray(end.next_item_id, data);
                    }
                    return !flag;
                });
                if(flag){
                    return !flag;
                }
            }
            return !flag;
        })
        return flag;
    },
    //是否每个节点都有出入（触发节点必须有输出）
    hasEveryNodeInputOutput:function(data){
        if(!data){ return false;}
        var _this=this,flag=false,msg="";
        data.every(function(node,i){
            var nodeId=node.item_id;
            if(node.nodeType=='trigger'){
                flag=_this.hasOutput(nodeId,data);
                msg="触发节必须有输出节点，否则不能启动";
                return flag;
            }else{
                flag=_this.isInOthersEndSwitch(nodeId,data);
                msg="除触发节点外，每个节点都要有输入节点，否则不能启动";
                return flag;
            }

        })
        return {
            has:flag,
            msg:msg
        };
    },
    //是否有手动触发活动编排
    isManualTriggerPlan:function(data){
        var flag=false;
        data.every(function(node,i){
            flag=(node.nodeType=='trigger'&&node.itemType=='manual-trigger');
            return !flag;
        })
        return flag;
    },
    //是否有事件触发活动编排
    isEventTriggerPlan:function(data){
        var flag=false;
        data.every(function(node,i){
            flag=(node.nodeType=='trigger'&&node.itemType=='event-trigger');
            return !flag;
        })
        return flag;
    },
    //节点数据合法性验证(对必填项进行验证)
    nodeDataValidity:function(data){
        var itemType=data.code,
            info=data.info||{},isValidity=true;
        if(itemType=="timer-trigger"){//定时触发
           if(!info.start_time||!info.end_time){
               isValidity=false;
           }
        }else if(itemType=="event-trigger"){//事件触发
            if(isEmpty(info.event_id)||isEmpty(info.event_name)){
                isValidity = false;
            }
        }else if(itemType=="target-group"){//目标人群
            isValidity=!isEmpty(info.segmentation_id);
        }else if(itemType=='segement-group'){//细分人群
            if(isEmpty(info.segmentation_id)||
                isEmpty(info.allowed_new)||
                isEmpty(info.refresh_interval)||
                isEmpty(info.refresh_interval_type)){
                isValidity=false;
            }
        }else if(itemType=='fix-group'){//固定人群
            isValidity=!isEmpty(info.fix_group_id);
        }else if(itemType=='attr-comparison'){//关系人比较

        }else if(itemType=='wechat-send'){//图文发送
            if(isEmpty(info.asset_id)||isEmpty(info.img_text_asset_id)){
                isValidity=false;
            }
        }else if(itemType=='wechat-check'){//图文查看
            if(isEmpty(info.asset_id)||isEmpty(info.img_text_asset_id)||isEmpty(info.read_time)||isEmpty(info.read_percent)){
                isValidity=false;
            }
        }else if(itemType=='wechat-forwarded'){//图文转发
            if(isEmpty(info.asset_id)||
                isEmpty(info.img_text_asset_id)||
                isEmpty(info.forward_times)||
                isEmpty(info.refresh_interval)){
                isValidity=false;
            }
        }else if(itemType=='subscriber-public'){//订阅公众号

        }else if(itemType=='personal-friend'){//个人好友

        }else if(itemType=='label-judgment'){//标签判断
            if(!info.tags||!info.tags.length){
                isValidity=false;
            }
        }else if(itemType=='wait-set'){//等待

            isValidity=!isEmpty(info.type);
        }else if(itemType=='save-current-group'){//保存当前用户
            isValidity=!!info.audience_id;
        }else if(itemType=='set-tag'){//设置标签
            if(!info.tag_names||!info.tag_names.length){
                isValidity=false;
            }
        }else if(itemType=='send-img'){//发送图文
            if(isEmpty(info.img_text_asset_id)||isEmpty(info.asset_id)){
                isValidity=false;
            }
        }else if(itemType=='send-h5'){//发送H5
            //V1 版不对个人号 ,群组号进行验证  ||isEmpty(info.prv_asset_id)||isEmpty(info.group_id)
            if(isEmpty(info.img_text_asset_id)||isEmpty(info.pub_asset_id)){
                isValidity=false;
            }
        }else if(itemType=='send-msg'){//发送消息
            if(isEmpty(info.asset_id)||isEmpty(info.text_info)){
                isValidity=false;
            }
        }else if(itemType=='send-sms'){//发送短信
            if(isEmpty(info.sms_category_type)||isEmpty(info.sms_material_id)||isEmpty(info.name)){
                isValidity=false;
            }
            if(isEmpty(info.name))
            {
                return {
                    isValidity:isValidity,
                    msg:'发送短信节点名称不能为空！'
                };
            }

        }
        return {
            isValidity:isValidity,
            msg:'请对有红色提示的节点进行编辑，否则不能启动'
        };
    },
    //是否有重复的素材 by 素材ID
    isRepeatMaterialById(data,id){
      return !data.every(function(node,i){
            if( node.code=='send-sms'&&node.info){
                if(node.info.sms_material_id==id){
                   return false;
                }
            }
            return true;
        })
    },
    //是否有重复的素材
    isRepeatMaterial:function(data){
        var smsMap={},flag=false,arr=[];
        data.forEach(function(node,i){
            if( node.code=='send-sms'&&node.info){
                if(smsMap[node.info.sms_material_id]){
                    smsMap[node.info.sms_material_id].push(node.info.sms_material_name);
                }else{
                    smsMap[node.info.sms_material_id]=[node.info.sms_material_name];
                }
                arr.push(node.item_id);
            }
        })
        $('.plan-node').removeClass('error');
        for(var id in smsMap){
            if(smsMap[id]&&smsMap[id].length>1){
                flag=true;
                arr.forEach(function(id,i){
                    $("#"+id).addClass('error')
                })
                break;
            }
        }
        return flag;

    },
    //获得合法性验证信息
    getValidityMsg:function(data){
        var hasBase=this.hasBaseNode(data),_this=this,msg="";
       if(!hasBase.hasStart){
           return hasBase.startMsg;
       }
        if(!hasBase.hasAud){
            return hasBase.audMsg;
        }
        if(!hasBase.hasAct){
            return hasBase.actMsg;
        }
        var node=this.hasEveryNodeInputOutput(data);
        if(!node.has){
            return node.msg;
        }
        var arr=[];
        data.forEach(function(itm,i){
            var res= _this.nodeDataValidity(itm);
            if(!res.isValidity){
                arr.push(itm.item_id);
                msg=res.msg;
            }
        })
        $('.plan-node').removeClass('error');
        arr.forEach(function(id,i){
            $("#"+id).addClass('error')
        })

        return msg;
    },
    getSaveMsg:function(data){
        if(typeof data =='object' &&!Array.isArray(data)){
              var f=false;
              for(var k in data){
                  f=true;
              }
            if(!f){
                return '启动状态修改，必须有活动节点';
            }
        }else if(Array.isArray(data)&&this.isEmptyArr(data)){
            return '启动状态修改，必须有活动节点';
        }

        return this.getValidityMsg(data);
    },
    getRelease:function(data){
        if(typeof data =='object' &&!Array.isArray(data)){
            var f=false;
            for(var k in data){
                f=true;
            }
            if(!f){
                return '启动状态修改，必须有活动节点';
            }
        }else if(Array.isArray(data)&&this.isEmptyArr(data)){
            return '必须有活动节点才能启动';
        }
        return this.getValidityMsg(data);
    }

};
module.exports= validator;

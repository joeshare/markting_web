/**
 * Author LLJ
 * Date 2016-6-1 14:10
 */

var nodeFormatter=require('./node-formatter.js');
var formatter={
    headerInfo:function(data){
        var opt={
            name:data["campaign_name"],
            release:data["publish_status"],
            oper:data["oper"],
            dateTime:data["updatetime"],
            id:data["id"]
        };
        return opt;
    },
    //强校验，删除多余节点数据
     foraceValidateNode:function(data){
        var nodes=[],res=[];
        $(".plan-node").each(function(e){
            nodes.push(this.id)
        })
         data.forEach(function(itm,i){
             if(nodes.indexOf(itm.item_id)>-1){
                 res.push(itm)
             }
         })
         return res;
    },
    //转换成提交数据
    planTransformSubmitData:function(data){
       // console.log('------data-------',data)
        var res=[],clone=JSON.parse(JSON.stringify(data));
        $.each(clone,function(nodeId,nodeData){
            var ends= nodeData.ends,arr=[];
            $.each(ends,function(i,itm){
                if(itm&&typeof itm=='object'){
                    itm.next_item_id=i+"";
                    itm.color=itm.drawColor;
                    itm.draw_type=0;
                    //delete itm.drawColor;
                    //delete itm.drawType;
                    delete itm.id;
                    arr.push(itm);
                }
            })
            nodeData.ends=arr;
            $.each(nodeData.switch,function(i,itm){
                if(itm&&typeof itm=='object'){
                    itm.next_item_id=itm.id+"";
                    itm.color=itm.drawColor;
                    itm.draw_type=0;
                    //delete itm.drawColor;
                    //delete itm.drawType;
                    delete itm.id;
                }
            })
            nodeData.item_id=nodeId;
            nodeData.code=nodeData.itemType;
            nodeData.info=$("#"+nodeData.id).data("data")||{};
            nodeData.desc= nodeData.info?nodeData.info.desc:"";
            delete nodeData.id;
            //delete nodeData.itemType;
            //delete nodeData.nodeType;
            //delete nodeData.url;
            res.push(nodeData);
        })
        return this.foraceValidateNode(res);
    },
    thousandbit(num) {
        return num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
    },
    //活动编排数据转换成展示数据
    planTransformShowData:function(data){
        var res={};
        data.forEach(function(rec,i) {
//            "campaign_node_chain": [{
//                "info":
//                {
////详细结构见下面
//                },
//                "item_id": "前端生成的item_id",
//                "item_type": 0,
            //     code:
            //     desc:
//                "node_type": 0,//0:
//                "x": "20.1",
//                "y": "25.6",
//                "z": "25.6",
//                "switch":
//                    [
//                        {
//                            "next_item_id":"abc",
//                            "drawType":0,//0:curveTriangle
//                            "color":"#sd37374"
//                        }
//                    ]
//                "ends":
//                    [
//                        {
//                            "next_item_id":"abc",
//                            "drawType":0,//0:curveTriangle
//                            "color":"#sd37374"
//                        }
//                    ]
//            }]
            var obj=$.extend(true,{},rec);
            res[obj.item_id]=obj;
            var nodeRec=res[obj.item_id],info=obj.info;
            if(obj.code=="timer-trigger"){//定时触发
                //"start_time":"yyyy-MM-dd HH:mm:ss", "end_time":"yyyy-MM-dd HH:mm:ss", "name":"name"
                //name: startDate:  startTime:  endDate endTime  "start_time": "end_time":   desc
                nodeFormatter.timerTrigger.showData(nodeRec,info);
            }else if(obj.code=="event-trigger"){
                nodeFormatter.eventTrigger.showData(nodeRec,info);
            }
            else if(obj.code=="target-group"){
                nodeFormatter.targetGroup.showData(nodeRec,info);
            }else if(obj.code=='attr-comparison'){//关系人比较
                nodeFormatter.attrComparison.showData(nodeRec,info);
            }else if(obj.code=='wechat-send'){//图文发送
                nodeFormatter.wechatSend.showData(nodeRec,info);
            }else if(obj.code=='wechat-check'){//图文查看
                nodeFormatter.wechatCheck.showData(nodeRec,info);
            }else if(obj.code=='wechat-forwarded'){//图文转发
                nodeFormatter.wechatForwarded.showData(nodeRec,info);
            }else if(obj.code=='subscriber-public'){//订阅公众号
                nodeFormatter.subscriberPublic.showData(nodeRec,info);
            }else if(obj.code=='personal-friend'){//个人好友
                nodeFormatter.personalFriend.showData(nodeRec,info);
            }else if(obj.code=='label-judgment'){//标签判断
                nodeFormatter.labelJudgment.showData(nodeRec,info);
            }else if(obj.code=='wait-set'){//等待
                nodeFormatter.waitSet.showData(nodeRec,info);
            }else if(obj.code=='save-current-group'){//保存当前用户
                nodeFormatter.saveCurrentGroup.showData(nodeRec,info);
            }else if(obj.code=='set-tag'){//设置标签
                nodeFormatter.setTag.showData(nodeRec,info);
            }else if(obj.code=='send-img'){//发送图文
                nodeFormatter.sendImg.showData(nodeRec,info);
            }else if(obj.code=='send-h5'){//发送H5
                nodeFormatter.sendH5.showData(nodeRec,info);
            }else if(obj.code=='send-msg'){//发送消息
                nodeFormatter.sendMsg.showData(nodeRec,info);
            }else if(obj.code=='send-sms'){//发送短信
                nodeFormatter.sendSMS.showData(nodeRec,info);
            }else if(obj.code=='segement-group'){//细分人群
                nodeFormatter.segementGroup.showData(nodeRec,info);
            }else if(obj.code=='fix-group'){//固定人群
                nodeFormatter.fixGroup.showData(nodeRec,info);
            }
            nodeRec.name=info?(info.name||rec.code_name):rec.code_name;
            nodeRec.id= obj.item_id;
            nodeRec.itemType= nodeRec.code;
            nodeRec.type= nodeRec.parent_code;
            nodeRec.nodeType= nodeRec.parent_code;
            nodeRec.num= nodeRec.audience_count;
            nodeRec.x*=1;
            nodeRec.y*=1;
            nodeRec.title=nodeRec.code_name;
            var newEnds={};
            if(nodeRec.ends&&nodeRec.ends.length){
                nodeRec.ends.forEach(function(endNode,index){
                    if(endNode&&(typeof endNode == 'object')){
                        var endNodeId=endNode.next_item_id;
                        newEnds[endNodeId]=endNode;
                        newEnds[endNodeId].id=endNode.next_item_id;
                        newEnds[endNodeId].drawColor=endNode.color;
                        newEnds[endNodeId].drawType='curveTriangle';
                    }

                })
            }
            nodeRec.ends=newEnds;
            if(nodeRec.switch&&nodeRec.switch.length){
                nodeRec.switch.forEach(function(switchNode,index){
                    if(switchNode&&(typeof switchNode == 'object')){
                        switchNode.id=switchNode.next_item_id;
                        switchNode.drawColor=switchNode.color;
                        switchNode.drawType='curveTriangle';
                    }

                })
            }
        })
        return res;
    }
};
module.exports= formatter;

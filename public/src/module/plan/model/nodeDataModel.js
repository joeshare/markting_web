/**
 * Author LLJ
 * Date 2016-5-6 9:59
 */
/* 数据格式
 {
 node-100":{
 "x":563,
 "y":29,
 "id":"node-100",
 item:{//节点项
    type:
    icon:
    title:
 }
 "nodeType":"start",//trigger audiences decisions  activity
 "switch":[{id:"node-101","drawType":"line"},{id:"node-102","drawType":"line"}],
 "info":{
     name  //名称
     startTime //开始时间
     endTIime //结束时间
     status //状态
     number //人数，
     desc //描述
 },
 "ends":{
     "node-101":{"drawType":"line" },
     "node-102":{"drawType":"line"}
  }
 },
 。。。
 很多个单元数据
 }
 */

//受众 节点项 （ target 目标人群 event 事件人群）
//
function model(){
    var nodes={};
    /**
     * 单个节点数据设置
     * @param data
     */
    this.setNode=function(data){
        if(data){
            if(!nodes[data.id]){
                nodes[data.id]={
                    switch:[],
                    ends:{}
                };
            }
            $.extend(true,nodes[data.id],data);
        }

    };
    /**
     * 所有节点数据设置
     * @param data
     * @returns {*}
     */
    this.setData=function(data){
        return $.extend(true,nodes,data);
    };
    this.getNode=function(id){
        return $.extend(true,{},nodes[id]);
    };
    this.getAll=function(){
        return $.extend(true,{},nodes);
    };
    this.delNode=function(id){
       delete nodes[id];
    };
}
module.exports=new model();
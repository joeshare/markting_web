/**
 * Author LLJ
 * Date 2016-4-14 13:50
 */
//private
function extend(target, src) {
    for (var k in src) {
        src.hasOwnProperty(k) && (target[k] = src[k]);
    }
    return target;
}
function forEach(obj,callBack){
    for (var k in obj) {
        if(callBack.apply(null,[k,obj[k],obj])==false) break;
    }
}
var defaults = {
    xOffset : 30,
    yOffset : 30,
    intervalX :60,
    intervalY:60
};
function layout(arg){
    this.opts=extend(defaults,arg);
    var _this=this;
    var container=document.querySelector(arg.canvasId);
    var xRules=[],yRules=[],rules=[];
    if(!container){
       return ;
    }
    function getRules(){
        var rows=getRows(),cols=getCols();
        for(var i=1;i<=rows;i++){
            for(var m=1;m<=cols;m++){
                 rules.push({
                     x:(m+0.5)*_this.opts.intervalX,
                     y:(i+0.5)*_this.opts.intervalY
                 });
             }
        }
        return rules;
    }
    function getAllChildren(){
        return container.querySelectorAll("c-flow-drag-node");
    }
    function getDom(id){
        return document.getElementById(id);
    }
    //总行数
    function getRows(){
        return Math.floor(container.offsetHeight/_this.opts.intervalY);

    }
    //总列数
    function getCols(){
        return Math.floor(container.offsetWidth/_this.opts.intervalX);

    }
    //根据目标ID ，中心坐标，获取dom坐标
    function getPosByCenter(tarId,centerX,centerY){
           var dom=getDom(tarId);
           return {
             x:centerX-dom.offsetWidth/2,
             y:centerY-dom.offsetHeight/2
           };
    }
    //根据目标ID ，获取dom中心坐标，
    function getCenterById(tarId){
        var dom=getDom(tarId);
        return {
            x:dom.offsetLeft+dom.offsetWidth/2,
            y:dom.offsetTop+dom.offsetHeight/2
        };
    }
    //水平布局
    function  horizontalLayout(data,callBack){
        layoutHandler(data,'h',callBack);

    }
    //vertical-align 垂直布局
    function verticalLayout(data,callBack){
        layoutHandler(data,'v',callBack);
    }
    //水平垂直布局
    function allLayout(data,callBack){
        layoutHandler(data,'hv',callBack);
    }
    function layoutHandler(data,type,callBack){
        var rules=getRules();
        forEach(rules,function(i,rule,arr){
            var flg=true;
            forEach(data,function(k,itm,thiz){

                var center=getCenterById(k);
                //垂直
                if(type.indexOf("v")>-1&&center.x>(rule.x-_this.opts.xOffset)&&center.x<(rule.x+_this.opts.xOffset)){
                    var pos=getPosByCenter(itm.id,rule.x,center.y)
                    callBack&&callBack.apply(this,[itm,pos.x,pos.y])
                }
                //水平
                if(type.indexOf("h")>-1&&center.y>(rule.y-_this.opts.yOffset)&&center.y<(rule.y+_this.opts.yOffset)){
                    var pos=getPosByCenter(itm.id,center.x,rule.y)
                    callBack&&callBack.apply(this,[itm,pos.x,pos.y])
                }
            })
        })
    }
    this.hLayout=horizontalLayout;
    this.vLayout=verticalLayout;
    this.allLayout=allLayout;
}

module.exports = layout;
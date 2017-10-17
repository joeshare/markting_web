/**
 * Author LLJ
 */
var EventEmitter=require('plugins/EventEmitter.js');
window.EventEmitter=EventEmitter;
var DOMDrag=require('plugins/DOMDrag.js');
var tpl=require('../tpl/tpl.js');
var flowChartModel=require('../model/flowChart.js');
var PAINTER=require('../utils/painter.js');
var LAYOUT=require('../utils/layout.js');
var conHtml=_.template(tpl.container);
var menuHtml=_.template(tpl.menu);




//mock
//window.MockData=flowChartModel;
window.MockData={};
var ID=100,PREFIX='node-';
var view = Backbone.View.extend({
    events:{
        'mouseup':'mouseup',
        'mousedown':'mousedown',
        'mousemove':'mousemove'
    },
    tmpDragTarOriginal:{},
    $nextNode:null,
    $praveNode:null,
    $tmpDragTar:null,
    tmpDragTar:null,
    isTmpDragTar:false,
    limitRect:null,
    painter:null,
    isDraw:false,
    isSelect:false,
    isShowSelect:false,
    drawType:'line',
    isAutoDraw:false,
    drawOriginal:{},
    selectOriginal:{},
    clickFlowNode:function(e){
      console.log(e)
    },
    //画布渲染
    renderCanvas:function(){
        this.painter.clearAll();
        for(var k in MockData){
            var node=MockData[k];
            if(node&&node.ends){
                for(var id in node.ends){
                    var end=MockData[id];
                    console.log(node.ends)
                    this.painter.draw({
                        type:node.ends[id].drawType,
                        startX: node.drawX,
                        startY: node.drawY,
                        endX: end.drawX,
                        endY: end.drawY
                    })
                }
            }
        }
    },
    //TODO::
    renderNodes:function(){
        for(var k in MockData){
            var node=MockData[k];
        }
    },
    getDrawPoint:function(id){
        var tar=$('#'+id)[0];
        return {
           x:tar.offsetLeft+tar.offsetWidth/2,
           y:tar.offsetTop+tar.offsetHeight/2
        };
    },
    //拖拽失效控制
    dragDisable:function(type){
        if(type){
            this.$el.find(".dom-dragable").addClass("dom-dragdisable")
        }else{
            this.$el.find(".dom-dragable").removeClass("dom-dragdisable")
        }

    },
    mouseup:function(e){
        console.log('mouseup',e);
        var $tar=$(e.target),cls=e.target.className;
        var menuMask=this.$el.find('.menu .mask');
        if(menuMask.is(':visible')){
           this.mouseupFlowNode(e,menuMask)
        }
        if(cls.indexOf('c-node')>-1&&$tar.parent().hasClass('dom-dragdisable')){
            var node=e.target.parentNode;
            var id= node.id;
            if(id!==this.drawOriginal.id){
                this.saveDrawPos(this.drawOriginal.id,id,this.drawType);
            }
        }else if(cls.indexOf('m-tmp-drag-node')>-1){
            var rect=e.target.getBoundingClientRect();
            var tar=this.$el.find(".menu .active");
            if(tar[0]&&DOMDrag.isEnterRect(tar[0].getBoundingClientRect(),rect.left,rect.top)){
                $tar.hide();
            }
        }
        this.renderCanvas();
        this.isDraw=false;
        this.hideSelect();
        this.isShowSelect=false;
        console.log(this.$el.find('#select'))
    },
    mousedown:function(e){
        var el=e.target,cls=el.className;
        var $tar=$(e.target),cls=$tar.attr('class');
        if(cls.indexOf('m-')>-1) {
            this.mousedownMenu(e);
        }else if(cls.indexOf('main-graph')>-1){
           this.hideNextNode();
            this.clearSelectNode();
        }
        if(this.isSelect){
            this.isShowSelect=true;
            var rect=this.el.querySelector('canvas').getBoundingClientRect();
            this.selectOriginal={
                x:e.clientX-rect.left,
                y:e.clientY-rect.top
            };
        }
        if(cls.indexOf('c-node')>-1&&$tar.parent().hasClass('dom-dragdisable')){
            this.isDraw=true;
            this.drawOriginal={
                x:e.target.parentNode.offsetLeft,
                y:e.target.parentNode.offsetTop,
                width:e.target.parentNode.offsetWidth,
                height:e.target.parentNode.offsetHeight,
                id:e.target.parentNode.id
            };
        }else if(cls.indexOf('close')>-1){
                var node=el.parentNode.parentNode,id=node.id;
                delete MockData[id];
                node.parentNode.removeChild(node);
                this.renderCanvas();
        }else{
            this.isDraw=false;
        }

    },
    mousemove:function(e){
        var _this=this;
        if(this.isDraw){
            var rect=this.el.querySelector('canvas').getBoundingClientRect();
            this.renderCanvas();
            this.painter.draw({
                type:_this.drawType,
                startX:_this.drawOriginal.x+_this.drawOriginal.width/2,
                startY:_this.drawOriginal.y+_this.drawOriginal.height/2,
                endX: e.clientX - rect.left,
                endY: e.clientY- rect.top
            })

        }else if(this.isSelect&&this.isShowSelect){
            var rect=this.el.querySelector('canvas').getBoundingClientRect();
            var sx=this.selectOriginal.x,
                sy=this.selectOriginal.y,
                ex=e.clientX-rect.left,
                ey=e.clientY- rect.top;
           this.$el.find('#select').css({
               display:'block',
               left:sx,
               top:sy,
               width:ex-sx,
               height:ey-sy
           });
            this.setSelectNode();

        }
    },
    mousedownMenu:function(e){
        this.$el.find('.menu .mask').show();
        var _this=this;
        var $tar=$(e.target),_this=this,cls=$tar.attr('class');
        this.nodeEdit(false);
        this.dragDisable(false);
        this.isSelect=false;
        if($tar.hasClass('m-flow-node')){
            $tar.addClass("active").parent().siblings("").find("a").removeClass("active");
            this.createTmpDrag(e);
            this.isDraw=false;
        }else if(cls.indexOf('m-draw')>-1){
            this.hideNextNode();
            if(!$tar.hasClass('active')){
                $tar.addClass("active").parent().siblings("").find("a").removeClass("active");
                this.dragDisable(true);
                this.drawType=$tar.attr('attr-type');
                console.log('this.drawType',this.drawType)
            }else{
                $tar.removeClass("active");
            }
        }else if($tar.hasClass('m-edit')){
            this.hideNextNode();
            if(!$tar.hasClass('active')){
                $tar.addClass("active").parent().siblings("").find("a").removeClass("active");
                this.nodeEdit(true);
            }else{
                $tar.removeClass("active");
            }
        }else if($tar.hasClass('m-select')){
            this.hideNextNode();
            if(!$tar.hasClass('active')){
                $tar.addClass("active").parent().siblings("").find("a").removeClass("active");
                this.dragDisable(true);
                this.isSelect=true;
            }else{
                $tar.removeClass("active");
            }
        }else if($tar.hasClass('m-copy')){
            this.hideNextNode();
            $tar.parent().siblings("").find("a").removeClass("active");
            this.dragDisable(false);
            this.$el.find('.node-shadow').each(function(i,item){
                var rect=item.getBoundingClientRect(),
                    x= rect.left+20,
                    y= rect.top+20;
                _this.createFlowDrag({
                    left:x,
                    top:y
                })
            })
        }else if($tar.hasClass('m-layout')){
            this.hideNextNode();
            var type=$tar.attr('attr-data');
            if(type=='h'){
                _this.layouter.hLayout(MockData,function(itm,newX,newY){
                    $("#"+itm.id).css({left:newX+"px",top:newY+"px"});
                    _this.saveFlowNodePos(itm.id,newX,newY);
                })
            }else if(type=='v'){
                _this.layouter.vLayout(MockData,function(itm,newX,newY){
                    $("#"+itm.id).css({left:newX+"px",top:newY+"px"});
                    _this.saveFlowNodePos(itm.id,newX,newY);
                })
            }
        }
    },
    mouseupFlowNode:function(e,mask){
        mask.hide();
    },
    hideSelect:function(){
        this.$el.find('#select').css({
            width:0,
            height:0,
            display:'none'
        })
    },
    setSelectNode:function(){
        console.log('setSelectNode')
        var  tar=this.$el.find('#select'),rect=tar[0].getBoundingClientRect();
        console.log(this.$el.find('.c-flow-drag-node'))
        this.$el.find('.c-flow-drag-node').each(function(i,item){
              console.log(i,item)
            var itemRect=item.getBoundingClientRect();
           if( DOMDrag.isEnterRect(rect,itemRect.left,itemRect.top)){
               item.classList.add('node-shadow');
           }else{
               item.classList.remove('node-shadow');
           }
        })
    },
    clearSelectNode:function(){
        this.$el.find('.c-flow-drag-node').removeClass('node-shadow');
    },
    getDistance:function(sPos,ePos){
        var _x = Math.abs(sPos.x - ePos.x),
            _y = Math.abs(sPos.y - ePos.y),
            sum = Math.pow(_x, 2) + Math.pow(_y, 2);
        return Math.sqrt(sum);
    },
    nodeEdit:function(type){
        if(type){
            this.$el.find(".dom-dragable .close").show();
        }else{
            this.$el.find(".dom-dragable .close").hide();
        }
    },
    //创建节点对象
    createFlowDrag:function(arg){
        var _this=this;
        var contanerRect=this.el.getBoundingClientRect();
        var relTop=arg.top-contanerRect.top;
        var relLeft=arg.left-contanerRect.left;
        var drag=$(tpl.flowNode).css({
            left:relLeft,
            top:relTop
        }).attr('id',PREFIX+ID);
        this.$el.append(drag);
        drag.show();
        this.setFlowNodePos(drag[0]);
        var tar=drag[0];
        ID++;
        return tar;

    },
    //创建临时拖拽对象
    createTmpDrag:function(e){
        if(!this.$tmpDragTar){
            this.$tmpDragTar=$('<div class="dom-dragable m-tmp-drag-node"></div>');
            this.$el.append(this.$tmpDragTar);
            this.tmpDragTar=this.$tmpDragTar.get(0);
        }
        var tarRect= e.target.getBoundingClientRect();
        var contanerRect=this.el.getBoundingClientRect();
        var relTop=tarRect.top-contanerRect.top;
        var relLeft=tarRect.left-contanerRect.left;
        this.tmpDragTarOriginal={
            x:relLeft,
            y:relTop
        };
        this.$tmpDragTar.css({
            left:relLeft,
            top:relTop
        }).show();
        this.isTmpDragTar=true;
    },
    createNextNode:function(drag){
        var _this=this;
        var next=$("#next-node");
        if(!next[0]){
            next= $(tpl.nextNode);
            this.$el.append(next);
        }
        next.css({
            left:drag.offsetLeft,
            top:drag.offsetTop+drag.offsetHeight*1.5
        }).removeClass('active').show();

        this.$nextNode=next;
        this.setFlowNodePos(next[0]);
        return next[0];
    },
    hideNextNode:function(){
        this.$nextNode&&this.$nextNode.is(':visible')&&this.$nextNode.hide();
    },
    loadMainGraph:function(){
        this.renderCanvas();
        this.hideNextNode();
    },
    drawLineToNextNode:function(flowNode,nextNode){
        var start=this.getDrawPoint(flowNode.id);
        var end=this.getDrawPoint(nextNode.id);
       this.painter.drawLine({
           startX:start.x,
           startY:start.y,
           endX:end.x,
           endY:end.y
       })
    },
    initialize: function () {
        this.render()
    },
    getMaxZindex:function(){
    },
    delay:function(callBack){
        var _this=this;
        var task=setTimeout(function(){
            var h=_this.el.clientHeight;
            if(h>0){
                callBack&&callBack.apply(_this,[]);
                clearTimeout(task);
                return;
            }else{
                _this.delay(callBack);
            }
        },50)
    },
    isActiveNextNode:function(next,source){
        var rect=source.getBoundingClientRect();
        return DOMDrag.isEnterRect(next.getBoundingClientRect(),rect.left,rect.top);
    },
    //设置节点位置
    setFlowNodePos:function(tar){
        var tarRect=tar.getBoundingClientRect();
        var top=tar.offsetTop
        var left=tar.offsetLeft;
        var height=this.el.querySelector('.main').offsetHeight;
        var width=this.el.querySelector('.main').offsetWidth;
        var limitMove={};
        top=Math.max(top,0);
        top=(tar.offsetHeight+top)>height?(height-tar.offsetHeight):top;
        left=Math.max(left,0);
        left=(tar.offsetWidth+left)>width?(width-tar.offsetWidth):left;
        //x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        tar.style.top=top+'px';
        tar.style.left=left+'px';
    },
    saveFlowNodePos:function(id,x,y){
        if( !MockData[id]){
            MockData[id]={};
        }
        MockData[id].x=x;
        MockData[id].y=y;
        MockData[id].id=id;
        var drawPonit=this.getDrawPoint(id);
        MockData[id].drawX=drawPonit.x;
        MockData[id].drawY=drawPonit.y;
    },
    saveDrawPos:function(startId,endId,drawType){
        console.log('saveDrawPos',[startId,endId,drawType].join(" "))
        if(MockData[startId]&&!MockData[startId].ends){
            MockData[startId].ends={};
            MockData[startId].ends[endId]={
                drawType:drawType
            };
        }else if(MockData[startId]&&MockData[startId].ends){
            //TODO::
            MockData[startId].ends[endId]={
                drawType:drawType
            };
        }
    },
    tmpDragBack:function(){
        var _this=this;
        _this.$tmpDragTar.stop(true).animate({
            left:_this.tmpDragTarOriginal.x+'px',
            top:_this.tmpDragTarOriginal.y+'px',
            opacity:'1'
        },"low",function(){
            _this.$tmpDragTar.hide();
        });
    },
    setZIndex:function(tar,zIndex){
        tar.style.zIndex=zIndex;
    },
    render: function () {
        var _this=this;
        _this.$el.html(conHtml);
        _this.$el.find('.menu').html(menuHtml);
        this.delay(function(){
            _this.painter=new PAINTER({
                id:'main-graph',
                renderTo:'#container .main',
                autoSize:true
            });
            _this.limitRect=_this.el.querySelector('.main').getBoundingClientRect();
            _this.layouter=new LAYOUT({
                intervalX :64,
                intervalY:64,
                xOffset:32,
                yOffset:32,
                canvasId:'#main-graph'
            });


            var myDrag = DOMDrag.create(_this.el, {
               // limitRect: _this.el.getBoundingClientRect()
            });
            myDrag.on('beforedrag',function(e){
                if(_this.isTmpDragTar){
                    e.target.dragTarget =_this.tmpDragTar;
                }
                _this.setZIndex(e.target.dragTarget,2);
            })
            myDrag.on('dragging',function(e){
                var tar=e.target.dragTarget,$tar=$(tar);
                if($tar.hasClass('c-flow-drag-node')){
                    _this.setFlowNodePos(tar);
                    _this.saveFlowNodePos(tar.id,tar.offsetLeft,tar.offsetTop);
                    _this.renderCanvas();
                    _this.hideNextNode();

                }else if( _this.isTmpDragTar){
                    if(_this.$nextNode&&_this.$nextNode[0]){
                        if(_this.isActiveNextNode(_this.$nextNode[0],tar)){
                            _this.$nextNode.addClass('active');
                        }else{
                            _this.$nextNode.removeClass('active');
                        }
                    }
                }

            })
            myDrag.on('drop',function(e){
                console.log('drop')
                var tmpRect=e.target.dragTarget.getBoundingClientRect();
                _this.isAutoDraw=false;
                if( _this.isTmpDragTar){
                    if( DOMDrag.isEnterRect(_this.el.querySelector('.main').getBoundingClientRect(),tmpRect.left+3,tmpRect.top+3)){
                        var drag=_this.createFlowDrag(tmpRect);
                        var x=drag.offsetLeft,y=drag.offsetTop;
                        if(_this.$nextNode&&_this.$nextNode.hasClass("active")){
                            drag.style.left=x=_this.$nextNode[0].offsetLeft+'px';
                            drag.style.top=y=_this.$nextNode[0].offsetTop+'px';
                            _this.saveDrawPos(_this.$praveNode.attr('id'),drag.id,_this.drawType);
                            _this.isAutoDraw=true;
                        }
                        _this.saveFlowNodePos(drag.id,x,y);
                        if( _this.isAutoDraw){
                            console.log(JSON.stringify(MockData))
                            _this.renderCanvas();
                        }
                        var next=_this.createNextNode(drag);
                        _this.drawLineToNextNode(drag,next);
                        _this.$tmpDragTar.hide();
                        _this.$praveNode=$(drag);
                    }else{
                        _this.tmpDragBack();
                    }
                }else{
                    _this.loadMainGraph();
                }
                _this.isTmpDragTar=false;
                _this.setZIndex(e.target.dragTarget,1);
            })
            _this.$el.find(".main").append(tpl.select)
        });


    }
});

module.exports=view;

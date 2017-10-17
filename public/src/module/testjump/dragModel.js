/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
var Drag=require('component/drag.js');

//拖动对象原始坐标
var dragTarOriginal={};
var TmpDrag=null;
var isEnter=false;
function model(view,_that){
    var _this=this;
    _this.view=view;
    _this.$content= view.find('.content');
    var cfg={
        root:_this.$content[0].id,
        listeners:{
            beforedrag:function(e){
                //_that.tlog();
                $('#plan-empty-msg').hide();
                var drag=this.getDragTarget(e),$drag=$(drag);
                //console.log($drag);
                drag.style.zIndex=_this.getMaxZIndex();
                var con=_this.view.find('.draw-box').get(0);
                isEnter=false;
                var top=con.scrollTop,
                    left=con.scrollLeft;

                if($drag.hasClass('menu-item')){
                    dragTarOriginal={
                        x:drag.offsetLeft-left,
                        y:drag.offsetTop-top
                    };
                    if(TmpDrag){
                        TmpDrag.remove();
                        TmpDrag=null;
                    }
                    $drag.removeClass("segment-drag");
                    var data=_this.view.controller.getMenuItemData(drag);
                    TmpDrag= _this.view.controller.createTmpNode(drag,data);
                    TmpDrag.addClass('segment-drag tmp-drag dragging');
                    TmpDrag.css({left: dragTarOriginal.x,
                        top:dragTarOriginal.y
                    })
                    TmpDrag[0].style.zIndex=_this.getMaxZIndex();
                    e.target.dragTarget=TmpDrag[0];
                }else{
                    dragTarOriginal={
                        x:drag.offsetLeft,
                        y:drag.offsetTop
                    };
                    $drag.addClass("dragging")
                }
            },
            dragging:function(e){
        /*       var drag=this.getDragTarget(e),$drag=$(drag),self=this;
                var pos=_this.view.controller.getDrawPosByEvent(e);
                if(TmpDrag){
                    _this.view.controller.limitTmpNodePos(drag)
                }else{
                    _this.view.controller.limitFlowNodePos(drag)
                    _this.view.controller.renderCanvas();
                }*/
            },
            drop:function(e){
          /*      var drag=this.getDragTarget(e),$drag=$(drag),self=this,group,gId;
                if(TmpDrag){
                    if(!self.isEnterElement($('#menubarTip-wrap')[0],drag)){
                        _this.view.controller.createFlowNode(drag);
                    }else{
                        if(_this.view.controller.setAutoPosNode(drag)){
                            _this.view.controller.createFlowNode(drag);
                        }
                    }
                    TmpDrag.remove();
                    TmpDrag=null;
                }else{
                    $drag.removeClass("dragging");
                    _this.view.controller.saveNodePos($drag);
                }
                //没有节点就显示提示
                _this.view.controller.planMsgShowHide();*/

            }
        }
    };
    this.getMaxZIndex=function(){
        var tmpZ=0;
        _this.view.find(".dom-dragable").each(function(i,item){
            var z=  $(this).css("z-Index");
            tmpZ= tmpZ<z?z:tmpZ;
        })
        return ++tmpZ;
    };
    this.dragDisable=function(type){
        if(type){
            _this.view.find(".dom-dragable").addClass("dom-dragdisable")
        }else{
            _this.view.find(".dom-dragable").removeClass("dom-dragdisable")
        }
    }
    new Drag.Base(cfg);

}

module.exports=model;
/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
'use strict';
let Drag=require('component/drag.js');

//拖动对象原始坐标
let dragTarOriginal={};
let TmpDrag=null;
let isEnter=false;
let tmpSpace=null;
let cloneDom=null;
let isAfter=null;
let $groupBox=null;
let tmpSpaceId=null;
let $clone=null;
let $tar_box=null;
function model(view){
    var _this=this;
    _this.view=view;
    _this.$content= $('#segment');
    _this.$container= $('#container');
    var cfg={
        root:'segment',
        listeners:{
            beforedrag:function(e){
                var dragIcon=this.getDragTarget(e),
                    $drag=$(dragIcon).parent(),
                    drag=$drag[0],
                    self=this;
                $clone=$drag.clone();
                drag.style.zIndex=10;
                if(!_this.$content[0]){
                    _this.$content= $('#segment');
                }
                var con= _this.$content.get(0);
                var top=con.scrollTop,
                    dragRect=drag.getBoundingClientRect(),
                    left=con.scrollLeft;
                isEnter=false;
                let groupBoxId=$drag.attr('data-ground-id');
                dragTarOriginal={
                    x:drag.offsetLeft-left,
                    y:drag.offsetTop-top,
                    code:$drag.attr('id'),
                    $tar:$drag,
                    top:dragRect.top,
                    left:dragRect.left,
                    id:drag.id,
                    groupId:groupBoxId
                };
                isAfter=true;
                tmpSpace=$('<div class="tmpSpace" />').css({
                    marginBottom:$drag.parent().css('marginBottom'),
                    width:dragRect.width,
                    height:dragRect.height,
                    display:'none',
                    top:dragRect.top,
                    left:dragRect.left

                })
                $groupBox=$('#'+groupBoxId+"-box");
                $clone.css({'zIndex':100});
                $clone.attr('id',drag.id+"-clone");
                console.log($groupBox)
                _this.$container.append($clone);
                cloneDom=$clone[0];
                self.changeDragTarget(e,cloneDom);
                 console.log("#"+dragTarOriginal.id+"-wrapper")
            },
            dragging:function(e,domDrag){
                var drag=this.getDragTarget(e),
                    dragRect=drag.getBoundingClientRect(),
                    groupBoxRect=$groupBox[0].getBoundingClientRect(),
                    groupLeftRect=$groupBox.parent()[0].getBoundingClientRect();
                if(isAfter){
                    $tar_box=$("#"+dragTarOriginal.id+"-wrapper");
                    tmpSpaceId="after-"+dragTarOriginal.id;
                    $tar_box.hide();
                    $("#"+tmpSpaceId).show();//必须在 $tar_box.hide();后面
                }
                isAfter=false;
                drag.style.left=dragTarOriginal.left+'px';
                drag.style.top=Math.max( groupBoxRect.top , dragRect.top )+'px';
                if( (groupLeftRect.top+groupLeftRect.height)<dragRect.top){
                    drag.style.top=(groupLeftRect.top+groupLeftRect.height)+'px';
                }
                _this.$content.find('.dom-dragable').each(function(i,itm){
                    var $tar=$(itm).parent(),
                        tar=$tar[0],
                        code=$tar.attr('id'),
                        dragRect=drag.getBoundingClientRect(),
                        tarRect=tar.getBoundingClientRect(),
                        groupId=$('#'+code).attr("data-ground-id"),
                        $wrapper=$('#'+code+"-wrapper");
                    if(dragTarOriginal.code!=code&&groupId==dragTarOriginal.groupId){
                        if( domDrag.isEnterRect(itm.getBoundingClientRect())){
                            if(dragRect.top<tarRect.top+10){
                                console.log('--|||||---')
                                $("#"+tmpSpaceId).hide();
                                let tmpSpace=$wrapper.parent().prev().children('.tmpSpace');
                                tmpSpace.show();
                                tmpSpaceId=tmpSpace[0].id;
                            }else if((dragRect.top+tarRect.height/2)>=tarRect.top){
                                console.log('-----')
                                $("#"+tmpSpaceId).hide();
                                tmpSpaceId=$wrapper.next()[0].id;
                                $wrapper.next().show();
                            }
                        }
                    }
                })
            },
            drop:function(e){
                $('.tmpSpace').hide();
                $tar_box.show();
                //$drag.remove();
                $clone.remove();
                var delTagId=$('#'+dragTarOriginal.id).attr("data-tag-id");
                _this.view.dragTagAfter(delTagId,tmpSpaceId,dragTarOriginal.groupId);
               // _this.view.dragSortTag($drag);
            }
        }
    };
    //拖拽失效
    this.dragDisable=function(type){
        if(type){
            _this.view.$el.find(".dom-dragable").addClass("dom-dragdisable")
        }else{
            _this.view.$el.find(".dom-dragable").removeClass("dom-dragdisable")
        }
    }
    new Drag.Base(cfg);

}

module.exports=model;
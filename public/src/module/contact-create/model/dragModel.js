/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
var Drag=require('component/drag.js');

//拖动对象原始坐标
var dragTarOriginal={};
var TmpDrag=null;
var isEnter=false;
var tmpSpace=null;
var isAfter=false;
var cloneDom=false;
function model(view){
    var $content=$('#form-body');
    var cfg={
        root:'form-body',
        listeners:{
            beforedrag:function(e){
                $('#form-body .input-block').removeClass("new");
                var drag=this.getDragTarget(e),
                    $drag=$(drag),
                    $clone=$drag.clone(),
                    self=this;
                drag.style.zIndex=10;
                var con=$content.get(0);
                var top=con.scrollTop,
                    left=con.scrollLeft;
                isEnter=false;
                dragTarOriginal={
                    x:drag.offsetLeft-left,
                    y:drag.offsetTop-top,
                    code:$drag.attr('data-code'),
                    $tar:$drag
                };
                isAfter=true;
                var dragRect=drag.getBoundingClientRect(),
                    conRect=con.getBoundingClientRect();
                tmpSpace=$('<div class="tmpSpace" />').css({
                    marginBottom:$drag.css('marginBottom'),
                    width:dragRect.width,
                    height:dragRect.height,
                    display:'none'

                })
                $clone.css({'zIndex':100})
                cloneDom=$clone[0];
                $content.append($clone);
                self.changeDragTarget(e,cloneDom);
                $drag.after(tmpSpace);
                $("#"+dragTarOriginal.code+"-wrapper").after(tmpSpace);
            },
            dragging:function(e,domDrag){
                var drag=this.getDragTarget(e),$drag=$(drag),content=$content.get(0),
                    self=this,$clone=$drag.clone();
                drag.style.left=0;
                var dragRect=drag.getBoundingClientRect(),
                    conRect=content.getBoundingClientRect();
                //if(dragRect.top-20<conRect.top){
                //   // drag.style.top='0 px';
                //}
                if(isAfter){
                    dragTarOriginal.$tar.remove();
                    tmpSpace.show();
                    //$drag.remove();
                }
                isAfter=false;
                // isEnter=self.isEnterElement(document.querySelector('.draw-box'),drag);
               // console.log($content.find('.dom-dragable'))
                $content.find('.dom-dragable').each(function(i,itm){
                    var $tar=$(itm),
                        tar=$tar[0],
                        code=$tar.attr('data-code'),
                        dragRect=drag.getBoundingClientRect(),
                        tarRect=tar.getBoundingClientRect(),
                        $wrapper=$('#'+code+"-wrapper");

                    if(dragTarOriginal.code!=code){
                       var isEnter=self.isEnterElement(itm,drag);
                        if( domDrag.isEnterRect(itm.getBoundingClientRect())){
                            if(dragRect.top<tarRect.top){
                                //$tar.before(tmpSpace);
                                $wrapper.before(tmpSpace);
                            }else if((dragRect.top+tarRect.height/2)>=tarRect.top){
                                $wrapper.after(tmpSpace);
                                //$tar.after(tmpSpace);
                            }
                        }
                        if(isEnter){
                            //console.log(code)


                        }
                    }
                })


            },
            drop:function(e){
                var drag=this.getDragTarget(e),$drag=$(drag),content=$content.get(0),self=this;
                tmpSpace.after(drag);
                $("#"+dragTarOriginal.code+'-wrapper').remove();
                $drag.wrap('<div id="'+dragTarOriginal.code+'-wrapper" class="input-block-wrapper " />');
                drag.style='';
                tmpSpace.remove();
                dragTarOriginal.$tar&&dragTarOriginal.$tar.remove();

            }
        }
    };

    this.dragDisable=function(type){
        if(type){
            $content.find(".dom-dragable").addClass("dom-dragdisable")
        }else{
            $content.find(".dom-dragable").removeClass("dom-dragdisable")
        }
    }
    new Drag.Base(cfg);
}

module.exports=model;
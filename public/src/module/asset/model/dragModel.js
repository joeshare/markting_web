/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
var Drag=require('component/drag.js');

//拖动对象原始坐标
var dragTarOriginal={};
var TmpDrag=null;
var isEnter=false;
function model(view){
    var _this=this;
    _this.view=view;
    _this.$content= view.$el.find('.content');
    var cfg={
        root:_this.$content[0].id,
        listeners:{
            beforedrag:function(e){
                var drag=this.getDragTarget(e),$drag=$(drag);
                TmpDrag=_this.view.controller.createTmpNode(drag,e);
                this.changeDragTarget(e,TmpDrag[0]);
                _this.view.controller.showBoxDragable(true);
                isEnter=false;
            },
            dragging:function(e){
                var drag=this.getDragTarget(e),$drag=$(drag),self=this;
                var $tar=_this.view.$el.find("#dispose-box");
                if(this.isEnterElement($tar[0],drag)){
                    _this.view.controller.showBoxEnter(true);
                    isEnter=true;
                }else{
                    _this.view.controller.showBoxEnter(false);
                }
            },
            drop:function(e){
                var drag=this.getDragTarget(e),$drag=$(drag),self=this,type=$drag.attr("attr-type"),url=$drag.children('.drag-text').text();
                var box=_this.view.$el.find("#dispose-box");
                if(isEnter){
                    //TODO Mock ajax====start
                    util.api({
                        url: "?method=mkt.asset.imgtext.host",
                        type: 'post',
                        data: {'asset_url': url},
                        beforeSend: function(){
                            _this.view.controller.showLoading();
                        },
                        success: function (res) {
                            if(res.msg == 'success'){
                                _this.view.controller.showBoxSuccess();
                                _this.view.controller.loadListData(type);
                                _this.view.controller.optionInputInit(type);
                            }
                        },
                        error: function(){
                            _this.view.controller.showBoxDefault();
                        }
                    });
                    //TODO Mock ajax====end
                }else{
                    _this.view.controller.showBoxDefault();
                }
                if(TmpDrag){
                    TmpDrag.remove();
                    TmpDrag=null;
                }

            }
        }
    };


    $('body').addClass('asset-graphic');
    new Drag.Base(cfg);

}

module.exports=model;
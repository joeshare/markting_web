/**
 * Author LLJ
 * Date 2016-4-26 11:36
 */
require('../component/index.js');

$(function(){

    var modals1=new RUI.Modals.Base({
        //renderTo:'body',
        //html:'Look At Me!',
        title:'细分信息编辑',
        triggerEl:'#modals1-trigger',
        content:document.querySelector("#tpl-modal1").innerHTML,
        height:296,
        width:384,
        listeners:{
            open:function(thiz){
                console.log(thiz.$triggerEl.attr("attr-tar"))
            },
            close:function(){
                //alert("Close Me")
            }
        }
    })
    var modals2=new RUI.Modals.Base({
        //renderTo:'body',
        //html:'Look At Me!',
        triggerEl:'#modals2-trigger',
        title:'细分人群标签',
        content:document.querySelector("#tpl-modal2").innerHTML,
        height:296,
        width:384,
        events:{
            click:function(e){
                if(e.$target.hasClass('rui-close')){
                    e.$target.parent().remove();
                }
            }
        },
        listeners:{
            open:function(thiz){
                //thiz.$el
                console.log(thiz.$triggerEl.attr("attr-tar"))
            },
            close:function(){
                //alert("Close Me")
            }
        }
    })

})
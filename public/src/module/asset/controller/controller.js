/**
 * Author LLJ
 * Date 2016-5-11 11:24
 */
var boxTpls=require('../tpl/box-tpl.html');
var optionpls=require('../tpl/option-tpl.html');
/*本页公用变量*/
var globalVar= {
    'managedTotal': 0,/*列表总个数*/
    'everyPageNum': 10,/*每页可展示列的数量。默认为10*/
    'pageNum': 0,/*总页数。公式为Math.ceil(managedTotal/everyPageNum)*/
    'nowPage': 1,/*当前分页值，默认从第一页开始*/
    'listType': 2,/*展示列类型，默认为2。0:微信图文,1:H5图文,2:全部*/
    'owner':''/*H5所属名称。默认为空*/
};
function renderTpl(tps,selector,data){
   return _.template($(tps).filter(selector).html())(data||{})

}
function controller(){
    //  <div class="preloader-wrapper big active">
    this.config=function(view,drag){
        this.view=view;
        this.drag=drag;
    };
    this.showLoading=function(){
        var box=this.view.$el.find("#dispose-box");
        box.attr("class","dispose-box mouseup").html(renderTpl(boxTpls,'#loading',{}));
    };
    this.showBoxSuccess=function(){
        var box=this.view.$el.find("#dispose-box");
        box.attr("class","dispose-box success").html(renderTpl(boxTpls,"#success",{}));
    };
    this.showBoxDefault=function(){
        var box=this.view.$el.find("#dispose-box");
        box.attr("class","dispose-box init").html(renderTpl(boxTpls,"#init",{}));
    };
    this.showBoxEnter=function(type){
        var box=this.view.$el.find("#dispose-box");
        if(type){
            box.addClass("hover").children("div").hide();;
        }else{
            box.removeClass("hover").children("div").show();
        }
    };
    this.showBoxDragable=function(type){
        var box=this.view.$el.find("#dispose-box");
            type?box.addClass("ongoing"):box.removeClass("ongoing");
    };
    /**
     *  数据加载
     * @param type
     */
    this.loadListData=function(type){
        //TODO::MOCK DATA
        var that = this,owner;
        if(type=="rabbitpre"){
            owner = "兔展";
            $('#headerText').html('全部 > H5 > 兔展');
        }else if(type=="eqxiu"){
            owner = "易企秀";
            $('#headerText').html('全部 > H5 > 易企秀');
        }else if(type=="maka"){
            owner = "MAKA";
            $('#headerText').html('全部 > H5 > MAKA');
        }
        /*重构左侧列表*/

        util.api({
            url: "?method=mkt.asset.imgtext.get",
            type: 'get',
            data: {"type": 1,"owner_name": owner,"index": globalVar.nowPage,"size":globalVar.everyPageNum},
            success: function (res) {
                that.view.managedRenew(res);
                that.showBoxDefault();
            }
        });

    };
    this.createTmpNode=function(itm){
        var outer= itm.outerHTML,_this=this,rect=itm.getBoundingClientRect();
        var tmp=$(outer).addClass("dom-dragable asset-graphic-drag tmp-drag draging")
            .css({
                left:rect.left,
                top:rect.top,
                width:rect.width,
                height:rect.height
            })
        this.view.$el.find(".content").append(tmp);
        return tmp;
    };
    this.optionInputInit=function(sel){
        this.view.$el.find('.option-area li[thistype="'+sel+'"] .context:first').html(renderTpl(optionpls,"#input-init",{}));
    }
}
module.exports=controller;

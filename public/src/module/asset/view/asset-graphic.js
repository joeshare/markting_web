/**
 * Created by AnThen on 2016-5-4.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/asset/graphic-tpl.html");
//组件
var Modals = require('component/modals.js');

var DragModel = require('module/asset/model/dragModel.js');
var Controller=require('module/asset/controller/controller.js');
/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName:'图文资产'
});

/*本页公用变量*/
var globalVar= {
    'managedTotal': 0,/*列表总个数*/
    'everyPageNum': 20,/*每页可展示列的数量。默认为10*/
    'pageNum': 0,/*总页数。公式为Math.ceil(managedTotal/everyPageNum)*/
    'nowPage': 1,/*当前分页值，默认从第一页开始*/
    'listType': 2,/*展示列类型，默认为2。0:微信图文,1:H5图文,2:全部*/
    'owner':''/*H5所属名称。默认为空*/
};

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template: {
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateSetuplist: _.template($(tpl).filter('#tpl-setuplist').html())
    },
    //设置响应事件
    events: {
        "click .qiehuanOption": "qiehuanOption",
        "click .managed-more": "setuplistShow",
        "click #phone-preview": "phonePreview",
        "click #delete-managed": "deleteManaged",
        "click #openOption": "openOption",
        "change #testUrl": "testUrl",
        "DOMMouseScroll #managed-parent": "moreManaged",
        "mousewheel #managed-parent": "moreManaged"
    },
    moreManaged: function(){
        var that = this;
        var contentH= $('#managed-box').get(0).scrollHeight + 8,
            scrollTop = $('#managed-parent').scrollTop(),
            viewH = $('#managed-parent').height();
        /*翻上一页*/
        /*
        if(scrollTop < 52){
            if(globalVar.nowPage > 1){
                console.log('翻上一页')
                util.api({
                    url: "?method=mkt.asset.imgtext.get",
                    type: 'get',
                    data: {"type": globalVar.listType,"index": globalVar.nowPage-1,"size":globalVar.everyPageNum,"owner_name":globalVar.owner},
                    success: function (res) {
                        if(res.msg == 'success'){
                            globalVar.nowPage = globalVar.nowPage - 1;
                            that.managedRenew(res);
                        }
                    }
                });
            }
        }
        */
        /*翻下一页*/
        if(scrollTop/(contentH - viewH) >= 0.66){
            if(globalVar.nowPage < globalVar.pageNum){
                util.api({
                    url: "?method=mkt.asset.imgtext.get",
                    type: 'get',
                    data: {"type": globalVar.listType,"index": globalVar.nowPage+1,"size":globalVar.everyPageNum,"owner_name":globalVar.owner},
                    success: function (res) {
                        if(res.msg == 'success'){
                            globalVar.nowPage = globalVar.nowPage + 1;
                            that.managedRenew(res);
                        }
                    }
                });
            }
        }
    },
    qiehuanOption: function(e){
        var that = this,
            thisType = $(e.currentTarget).attr('type'),
            thisTitle = $(e.currentTarget).attr('title'),
            thisName = $(e.currentTarget).attr('name') || '';
        $('#managed-box').empty();
        switch (thisType){
            case 'all':
                $('#headerText').html(thisTitle);
                that.refreshList(2);
                break;
            case 'weixin-all':
                $('#headerText').html(thisTitle);
                that.refreshList(0);
                break;
            case 'H5-all':
                $('#headerText').html(thisTitle);
                that.refreshList(1);
                break;
            default:
                $('#headerText').html(thisTitle);
                that.refreshList(thisType,thisName);
                break;
        }
    },
    refreshList: function(type,param){
        var that = this;
        var typep,name = param || '';
        if(typeof(type) == undefined){typep = 2}else{typep = type}
        util.api({
            url: "?method=mkt.asset.imgtext.get",
            type: 'get',
            data: {"type": typep,"owner_name":name,"index": 1,"size":globalVar.everyPageNum},
            success: function (res) {
                if(res.msg == 'success'){
                    globalVar.owner = name;
                    that.managedRenew(res);
                }
            }
        });
    },
    setuplistDropdown: function(){
        $('.dropdown-button-setuplist').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
    },
    menulistRenew: function(res){
        var data = res.data,total = res.total;
        var navlist,
            navlistWeixin = "",
            navlistH5 = "",
            navlistother1 = "<li><a href='javascript:void(0)' class='qiehuanOption' title='全部' type='all'>全部</a></li><li><a href='javascript:void(0)' class='qiehuanOption' title='全部 > 微信'  type='weixin-all'>全部 > 微信</a></li>",
            navlist1 = "<li><a href='javascript:void(0)' class='qiehuanOption' title='",
            navlist2 = "' type='",
            navlist3 = "' name='",
            navlist4 = "'>",
            navlist5 = "</a></li>",
            navlistother2 = "<li><a href='javascript:void(0)' class='qiehuanOption' title='全部 > H5' type='H5-all'>全部 > H5</a></li>";
        var thisType,H5Name = "全部 > H5 > ",H5Name1,weixinName = "全部 > 微信 > ",weixinName1;
        for(var i=0;i<total;i++){
            if(data){
                thisType = data[i].type;
                if(thisType == 1){
                    H5Name1 = H5Name + data[i].owner_name;
                    navlistH5 += navlist1 + H5Name1 + navlist2 + thisType + navlist3 + data[i].owner_name + navlist4 + H5Name1 + navlist5;
                }
                if(thisType == 0){
                    weixinName1 = weixinName + data[i].owner_name;
                    navlistWeixin += navlist1 + weixinName1 + navlist2 + thisType + navlist3 + data[i].owner_name + navlist4 + weixinName1 + navlist5;
                }
                navlist = navlistother1 + navlistWeixin + navlistother2 + navlistH5;
            }else{
                continue;
            }
        }
        $('#navlist').empty().append(navlist);
        this.setuplistDropdown();
    },
    managedMoreDropdown: function(){
        $('.managed-more').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: -100,
            belowOrigin: false
        });
    },
    managedRenew: function (res){
        var msg = res.msg,total = res.total,data = res.data;
        if(msg == 'success'){
            var managed = "",
                managed1 = "<li class='managed' id='",
                managed2 = "' imgtext-id='",
                managed3 = "'><div class='pic'>",
                managedImg = "",
                managed4 = "<img src='",
                managed5 = "'>",
                managed6 = "</div><div class='con-box'><div class='title'><div class='text' title='",
                managed7 = "'>",
                managed8 = "</div><div class='newico' style='display:none'>new</div></div><div class='text-box'>",
                managedIco = "",
                managed9 = "<span class='icon iconfont",
                managed10 = " icon-weixin",
                managed11 = "'></span>",
                managed12 = "<span class='text' title='",
                managed13 = "'>",
                managed14 = "</span></div></div><div class='more icon iconfont r-btn dropdown-button managed-more' data-activates='setuplist' data-constrainwidth='false' pcurl='",
                managed15 = "' mobileurl='",
                managed16 = "' imgtext-id='",
                managed17 = "'>&#xe61a;</div></li>";
            var id,title,thumbReady,imgurl,type,owner,time,pcurl,mobileurl;
            for(var i=0;i<total;i++){
                id = data[i].imgtext_id;title = data[i].imgtext_name;thumbReady = parseInt(data[i].thumb_ready);imgurl = data[i].imgfile_url;type = data[i].imgtext_type;owner = data[i].owner_name;time = data[i].create_time;pcurl = data[i].pc_preview_url;mobileurl = data[i].mobile_preview_url;
                if(thumbReady>0){managedImg = "";}else{managedImg = managed4 + imgurl + managed5;}
                switch (type){case 0:managedIco = managed9 + managed10 + managed11;break;case 1:managedIco = "";break;}
                time = util.formatDate(time,1);
                managed += managed1 + 'managed' + id + managed2 + id + managed3 + managedImg + managed6 + title + managed7 + title + managed8 + managedIco + managed12 + owner + '&nbsp;' + time + '&nbsp;创建' + managed13 + owner + '&nbsp;' + time + '&nbsp;创建' + managed14 + pcurl + managed15 + mobileurl + managed16 + id + managed17;
            }
            $('#managed-box').append(managed);
            $('#setuplist-box', this.$el).html(this.template.templateSetuplist(this.model.toJSON()));
            this.managedMoreDropdown();
        }
    },
    setuplistShow: function(e){
        var that = $(e.currentTarget),
            thatTrId = that.parents('.managed').attr('imgtext-id'),
            pcurl = that.attr('pcurl'),
            mobileurl = that.attr('mobileurl');
        $('#setuplist').attr('trigger',thatTrId);
        $('#pc-href').attr('href',pcurl);
        $('#phone-preview').attr('mobile',mobileurl);

    },
    phonePreview: function(e){
        var that = $(e.currentTarget),
            imgurl = that.attr('mobile');
        var clipboard = "<div id='qrcode' class='graphic-qrcode'></div>";
        new Modals.Window({
            title:"",
            content:clipboard,
            width:'210',//默认是auto
            height:'284'//默认是auto
        })
        $('#qrcode').qrcode({width: 164,height: 164,text: imgurl});
    },
    deleteManaged: function(e){
        var that = this;
        var imgtext_id = $(e.currentTarget).parents('#setuplist').attr('trigger');
        new Modals.Confirm({
            content:"您确实要删掉这条信息吗？",
            listeners:{
                close:function(type){
                    if(type){
                        util.api({
                            url: "?method=mkt.asset.imgtext.delete",
                            type: 'post',
                            data: {'imgtext_id':imgtext_id},
                            success: function (res) {
                                var msg = res.msg;
                                if(msg == 'success'){
                                    var deleteId = parseInt($('#setuplist').attr('trigger'));
                                    $('[imgtext-id='+ deleteId +']').empty().remove();
                                    $('#setuplist-box', that.$el).html(that.template.templateSetuplist(that.model.toJSON()));
                                    that.managedMoreDropdown();
                                }
                            }
                        });
                    }else{
                        //console.log("click cancel");
                    }
                }
            }
        });
    },
    openOption: function(e){
        var that= $(e.currentTarget),
            thisParents = that.parents('li.option'),
            optionContext = "<div class='change'><input type='text' class='validate' id='testUrl' placeholder='粘贴H5页面URL至此'/></div><div class='sign icon iconfont'></div><div class='tip'></div>";
        $('li.option').removeClass('hover');
        $('#optionContext').removeClass().addClass('context').html(optionContext);
        if(thisParents.hasClass('hover')){
            var thiscon = '<div class="change"><input type="text" class="validate" id="testUrl"/></div><div class="sign icon iconfont"></div><div class="tip"></div>';
            thisParents.removeClass('hover');
            thisParents.children('.con-box').children('.drag-box').children('.term:first').children('.context').empty().removeClass('wrong').removeClass('right').append(thiscon);
        }else{
            thisParents.addClass('hover');
        };

    },
    testUrl: function(e){
        var that = $(e.currentTarget),
            thisval = that.val(),
            type = that.parents('li.option').attr('thistype');

        switch (type){
            case "rabbitpre":
                test(thisval,'rabbitpre','com');
                break;
            case "eqxiu":
                test(thisval,'eqxiu','com');
                break;
            case "maka":
                test(thisval,'maka','im');
                break;
            default:
                break;
        };

        function test(url,field,suffix){
            var thisContextDiv = that.parents('.context'),
                thiscon = "";
            if(util.isFieldUrl(url,field,suffix)){
                var thiscon1 = "<div class='change'><div class='drag dom-dragable' attr-type='"+type+"'><div class='ico icon iconfont'>&#xe602;</div><div class='drag-text'>",
                    thiscon2 = "</div></div></div><div class='sign icon iconfont'>&#xe623;</div>";
                thisContextDiv.addClass('right');
                thisContextDiv.empty();
                thiscon = thiscon1 + url + thiscon2;
                thisContextDiv.append(thiscon);
            }else{
                thisContextDiv.addClass('wrong');
                thisContextDiv.children('.sign').html('&#xe604;');
                thisContextDiv.children('.tip').html('链接地址有误！');
            };
        };

    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
    },
    //组织完试图做的事情
    afterRender: function () {
        var that = this;
        /*初始化返回按钮*/
        var returnurl = util.geturlparam('returnurl'),planId = util.geturlparam('planId');
        if(returnurl){
            var thisHref;
            if(planId){
                thisHref = BASE_PATH + returnurl + '?planId=' + planId;
            }else{
                thisHref = BASE_PATH + returnurl;
            }
            $('#goBack').show().attr('href',thisHref);
        }else{
            $('#goBack').attr('href','javascript:void(0)');
        }
        /*初始化页面说明区域*/
        util.api({
            url: "?method=mkt.asset.imgtext.count.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.msg == 'success'){
                    var wechatTotal = res.data[0].wechat_count || 0,H5Total = res.data[0].h5_count || 0;
                    var managedTotal = parseInt(wechatTotal) + parseInt(H5Total);
                    $('#wechat-total').html(wechatTotal);
                    $('#H5-total').html(H5Total);
                    globalVar.managedTotal = managedTotal;
                    globalVar.pageNum = Math.ceil(managedTotal/globalVar.everyPageNum);
                }
            }
        });
        /*初始化左侧下拉菜单*/
        util.api({
            url: "?method=mkt.asset.imgtext.menulist.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.msg == "success"){
                    that.menulistRenew(res);
                }
            }
        });
        /*初始化左侧列表*/
        util.api({
            url: "?method=mkt.asset.imgtext.get",
            type: 'get',
            data: {"type": globalVar.listType,"index": globalVar.nowPage,"size":globalVar.everyPageNum},
            success: function (res) {
                if(res.code == 0){
                    that.managedRenew(res);
                }
            }
        });
    },
    //组织视图模板
    render: function () {
        //加载主模板
        $('#page-body', this.$el).html(this.template.templateMain(this.model.toJSON()));
        this.controller=new Controller();
        this.controller.config(this,new DragModel(this));
        this.afterRender();
        return this;
    }
});
module.exports=Container;

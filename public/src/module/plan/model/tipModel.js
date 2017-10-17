/**
 * Author LLJ
 * Date 2016-4-26 9:42 maket
 */
require('component/index.js');
var layer = require('plugins/layer.js');//弹窗插件
//var tps=require('../tpl/activity-tpl.html');
var decisionsTpl=require('../tpl/decisions-tpl.html');
var optionTpl=require('../tpl/option-tpl.html');
var activityTpl=require('../tpl/activity-tpl.html');
var audiencesTpl=require('../tpl/audiences-tpl.html');
var triggerTpl=require('../tpl/trigger-tpl.html');
var tipsUtils=require('../utils/tips-utils.js');
var sugTpls = require('../tpl/suggest-tpl.html');
var Mock=require('../mock/mock.js');
var AOP=require('../utils/aop.js');
var selectLoader=require('../utils/selectLoader.js');
var validator=require('../utils/validator.js');
var Modals = require('component/modals.js');
var SAVECURGROUP=[];

//自动消除提示
function popMsg(txt){
    Materialize.toast(txt, 3000)
}
//alert提示
function  alertMsg(txt){
    new Modals.Alert(txt);
}
function getTplsByNodeType(type){
    var tplsMap={
        decisions:decisionsTpl,
        trigger:triggerTpl,
        activity:activityTpl,
        audiences:audiencesTpl
    };
    return tplsMap[type];
}

function updateGroup(txt){
    if($.trim(txt)!=""){
        util.api({
            url: "?method=mkt.audience.list.get",//固定人群
            data: {
                size:30
            },
            success:function(res){
                var arr=[];
                if(res&&res.code==0&&res.data&&res.data.length){
                    res.data.forEach(function(rec,i){
                        arr.push({val:rec.audience_list_id,text:rec.audience_list_name});
                    });
                }
                var html= _.template($(optionTpl).filter("#select").html())({selectArr:arr,selected:""});
                $('#save-current-group-select').html(html);
                $('#save-current-group-select').material_select();
                $('#save-current-group-select').parent().hide();
            },
            error:function(){
                var tmp=[];
                var html= _.template($(optionTpl).filter("#select").html())({selectArr:tmp,selected:""});
                $('#save-current-group-select').html(html);
                $('#save-current-group-select').material_select();
                $('#save-current-group-select').parent().hide();
            }
        })


    }

}
function bindKeyup(type,$tar,callBack){
    if(type){
        $tar.on('keyup',function(e){

        })
    }else{
        $tar.off('keyup')
    }
}
function bindKeydown(type,callBack){
    if(type){
        document.onkeydown = function(e){
            e =e|| window.event;
            if((e.keyCode || e.which) == 13){
                callBack.call(null,null)
            }
        }
    }else{
        document.onkeydown=null;
    }
}
function getSuggestDataByKey(k){
    var res=[];
    Mock.tar.forEach(function(itm,i){
        if(itm.name.indexOf(k)>-1){
            res.push(itm);
        }
    })
    return res;
}
//设置标签设定
function setTag(val){
    if(!$.trim(val)){return;}
    var html = '<div class="set-tag" attr-name="'+val+'">' + val + '<i class="icon iconfont rui-close set-tag-tag-remove">&#xe608;</i></div>';
    var tempArr=[];
    $('#set-tag-content .set-tag').each(function(i){
          var $tar=$(this);
          tempArr.push($tar.attr('attr-name'));
    })
    if(tempArr.indexOf(val)<0){
        tempArr.length?$('#set-tag-content').append(html):$('#set-tag-content').html(html);
    }

}
//删除z轴坐标
function delNodeZ(data){
    if(!data) return;
    for(var id in data){
        delete data[id]['z'];
    }
}
//拖动对象原始坐标
function model(view){
    var _this=this;
    _this.view=view;
    _this.$content= view.$el.find('.content');
    var cfg={};
    //保存人群
    function saveAudience(name,callBack){
        if($.trim(name)==""){
            alertMsg("名称不能为空！");
            $('#save-current-group-add').removeClass("rui-disabled");
            return ;
        }
        //相同不增加
        if(!SAVECURGROUP.every(function(itm,i){
                return !(itm.text==name);
            })){
            popMsg("内容已经存在！");
            $('#save-current-group-add').removeClass("rui-disabled");
            return;
        }
        SAVECURGROUP.push({
            val:"",
            text:name
        })
        util.api({
            url: "?method=mkt.campaign.node.audience.save",
            type: 'post',
            data: {
                audience_name: name
            },
            success: function (res) {
                if (res && res.code == 0) {
                    popMsg("添加成功！")
                    callBack&&callBack(name);
                } else {
                    alertMsg("保存失败！");
                }
                $('#save-current-group-add').removeClass("rui-disabled");
            },
            error: function (res) {
                $('#save-current-group-add').removeClass("rui-disabled");
                alertMsg("保存失败！");
            }
        })
    }
    function page2MsgWin(handler){
        var NodeDataModel=_this.view.controller.NodeDataModel;
        var newDataStr=JSON.stringify(NodeDataModel.getAll());
        var tmpNodeData=JSON.parse(newDataStr),savedNodeData=null;
        if(window.saved_nodes_data_str){
            savedNodeData=JSON.parse(window.saved_nodes_data_str);
            delNodeZ(savedNodeData);
        }
        delNodeZ(tmpNodeData);
        if(!validator.isSame(JSON.stringify(savedNodeData),JSON.stringify(tmpNodeData))){
            layer.closeAll();
            _this.view.controller.setCurrentTipsType(null);
            new Modals.Confirm({
                content:"<div>编排内容未保存，是否离开该页面</div>",
                listeners: {//各种监听
                    close: function (type) {
                        if(type){
                            handler&&handler();
                        }else{
                           // alert("cancel")
                        }
                    }
                }
            });
        }else{
            handler&&handler();
        }
    }
    function addTag(val,name){
        if($.trim(val)){
            var html= '<div class="active-tag" attr-val="'+val+'" attr-name="'+name+'">'+name+'<i class="icon iconfont active-tag-close">&#xe608;</i></div>';
            var $tags = $("#label-judgment-tag-content .active-tag"),tempArr=[];
            if($tags[0]){
                $tags.each(function(i){
                    var $tar=$(this);
                    tempArr.push($tar.attr('attr-name'));
                })
                if(tempArr.indexOf(name)<0){
                    $('#label-judgment-tag-content').append(html);
                }
            }else{
                $('#label-judgment-tag-content').html(html);
            }

        }

    }
    function queryTpls(tps,sel){
        return $(tps).filter(sel).length?$(tps).filter(sel).html():"";
    }
    function  renderTpl(tps,sel,data){
       var tpl= queryTpls(tps,sel);

       return tpl?_.template(queryTpls(tps,sel))(data):"";
    }
    function getLagerCallBack(type,selector){
       return tipsUtils.getEventByType(type,selector);
    }
    this.showSuggest=function(v){
        var list=$("#label-judgment-tag-suggest");
        if(v){
            util.api({
                url:"?method=mkt.tag.search.grouptags.get",
                data:{tag_group_name:v},
                success:function(res){
                    if(res&&res.code==0&&res.data&&res.data.length){
                        //    {"tag_group_id":375,"tag_group_name":"性别","tag_list":[{"tag_id":11,"tag_name":"男"}]},
                        var tpl= _.template($(sugTpls).filter("#suggest").html())({
                            data:res.data
                        });
                        list.show();
                        list.html(tpl)
                       }
                },
                error:function(res){

                }
            })
        }else{
            list.hide();
        }
    };
    function setInput(sel,v){
       $(sel).val(v);
    }
    $('body').on("click.plan",function(e){

           var tar= e.target,$tar=$(tar),cls=tar.className;
            if($tar.hasClass("set-tag-tag-remove")){//设置标签（标签关闭 事件）
                $tar.parent().remove();
            }else if($tar.hasClass("active-tag-close")){//标签关闭 触发事件
                   $tar.parent().remove();
           }else if($tar.hasClass("plan-suggest-trigger")){//suggest 触发事件 (标签判断)
               var txt=$tar.text(),id=$tar[0].id;
               //setInput("#label-judgment-tag",txt);
               addTag(id,txt);
               _this.showSuggest(false)
           }else if(tar.id=='save-current-group-edit'){ //保存当前人群编辑
               var editNameInput=$('#save-current-group-edit-name');
                   //isDisplay=editNameInput.attr('attr-display');
               editNameInput.val("").show();
               $('#save-current-group-select').parent().hide();
               //editNameInput.attr('attr-display',isDisplay)
               $('#save-current-group-check').show();
               $('#save-current-group-add').show().siblings('.select-wrap').addClass("group2");
               $('#save-current-group-edit').hide();

           }else if(tar.id=='save-current-group-check'){//保存当前人群返回
               var editNameInput=$('#save-current-group-edit-name');
               editNameInput.hide();
               $('#save-current-group-select').parent().show();
               $('#save-current-group-check').hide();
               $('#save-current-group-add').hide().siblings('.select-wrap').removeClass("group2");
               $('#save-current-group-edit').show();

           }else if(tar.id=='save-current-group-add'){//保存当前人群增加
                var val=$('#save-current-group-edit-name').val();
                if($tar.hasClass("rui-disabled")){
                    return;
                }
                $tar.addClass("rui-disabled");
                saveAudience(val,updateGroup);
           }else if($tar.hasClass("target-group-edit")){//目标人群修改
                if($tar.hasClass("rui-disabled")){
                    return;
                }
                $tar.addClass("rui-disabled");
                var audienceId=$('#target-group-select').val();
                page2MsgWin(function(){
                    var urlArr=[
                        window.BASEPATH,
                        '/html/audience/segment.html',
                        '?audienceId='+audienceId,
                        '&returnurl=/html/activity/plan.html'
                    ];
                    if(window.CURRENT_CAMPAIGN_ID){
                        urlArr.push('&planId='+CURRENT_CAMPAIGN_ID)
                    }
                    window.location.href=urlArr.join("");
                })
           }else if($tar.hasClass("target-group-add")){//增加目标人群
                if($tar.hasClass("rui-disabled")){
                    return;
                }
                $tar.addClass("rui-disabled");
                page2MsgWin(function(){
                    var urlArr=[
                        window.BASEPATH,
                        '/html/audience/segment.html',
                        '?returnurl=/html/activity/plan.html'
                    ];
                    if(window.CURRENT_CAMPAIGN_ID){
                        urlArr.push('&planId='+CURRENT_CAMPAIGN_ID)
                    }
                    window.location.href=urlArr.join("");

                })
            }else if($tar.hasClass("segement-group-edit")){//细分人群编辑
                if($tar.hasClass("rui-disabled")){
                    return;
                }
                $tar.addClass("rui-disabled");
                var audienceId=$('#segement-group-select-val').val();

                page2MsgWin(function(){
                    var urlArr=[
                        window.BASEPATH,
                        '/html/audience/segment.html',
                        '?audienceId='+audienceId,
                        '&returnurl=/html/activity/plan.html'
                    ];
                    if(window.CURRENT_CAMPAIGN_ID){
                        urlArr.push('&planId='+CURRENT_CAMPAIGN_ID)
                    }
                    window.location.href=urlArr.join("");
                })

            }else if($tar.hasClass("send-img-add")){//图文发送的
                if($tar.hasClass("rui-disabled")){
                    return;
                }
                $tar.addClass("rui-disabled");
                page2MsgWin(function(){
                    var urlArr=[
                        window.BASEPATH,
                        '/html/asset/wechat.html',
                        '?returnurl=/html/activity/plan.html'
                    ];
                    if(window.CURRENT_CAMPAIGN_ID){
                        urlArr.push('&planId='+CURRENT_CAMPAIGN_ID)
                    }
                    window.location.href=urlArr.join("");
                })
           }
    }).on("keyup.plan",function(e){
        var tar= e.target,$tat=$(tar);
        if(tar.id=='label-judgment-tag'){
            var v=$tat.val(),vTrim= $.trim(v);
            _this.showSuggest(vTrim)
        }
    })
    //双击编辑节点事件
    _this.view.$el.on('dblclick', '.plan-node', function (e) {




        var me = this,$tar=$(me),title=$tar.attr('attr-title');
        if($tar.hasClass("dom-dragdisable")){
            return;
        }
        var data=_this.view.controller.getMenuItemData(me);
        if(data.itemType=="manual-trigger"){//手动触发不可编辑
            return;
        }
        var tipsData=tipsUtils.getDataByType(data.itemType,"#"+data.itemType+"-tips");

        if(!tipsData){
            return;
        }
        tipsData.title=title;
        _this.view.controller.setCurrentTipsType(data.itemType);
        _this.view.controller.setCurrentNodeId(me.id);

        var nodeData=$tar.data("data");
        window.CURRENT_NODE_JQ=$tar;

        $.extend(true,tipsData,nodeData);

        function createLayer(selData) {
            var tps = getTplsByNodeType(data.type);

            $.extend(true,tipsData,selData);
            var content =renderTpl(tps, data.itemType ? "#" + data.itemType : '#target-group',tipsData);

            if (content) {
                var opts = {
                    //area: '500px',//宽高area: ['500px', '300px']
                    shade: 0,//不要遮罩
                    closeBtn: 0,//不要关闭按钮
                    type: 4,//tip类型
                    shift: 5,//动画类型0-6 默认0
                    end:function(){
                        _this.view.controller.setCurrentTipsType(null);
                        window.LAYERINDEX=null;
                        window.CURRENT_NODE_JQ=null;
                    },
                    //tips: [4, '#fff'],//方向1-4，背景色
                    content: [content, me]
                };

                var callBack = getLagerCallBack(data.itemType, "#" + data.itemType + "-tips");
 
                for (var cb in callBack) {
                    opts[cb] = callBack[cb];
                }
                var meRect = me.getBoundingClientRect();
                if ((window.innerHeight - meRect.top) < 424) {
                    opts['tips'] = 1;
                }
                if (data.itemType == 'set-tag') {
                    AOP.before(opts, "success", function () {
                        bindKeydown(true, function () {
                            var editNameInput = $('#set-tag-textarea');
                            setTag(editNameInput.val());
                        });
                    })
                    AOP.before(opts, "end", function () {
                        bindKeydown(false);
                    })
                }
                window.LAYERINDEX = layer.open(opts);
            }
        }
        //下拉框数据加载
        selectLoader.queryData(data.itemType,createLayer);

        e.stopPropagation();
    });

}

module.exports=model;
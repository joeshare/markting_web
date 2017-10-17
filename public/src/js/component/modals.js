/**
 * Author LLJ
 * Date 2016-4-26 10:01
 */

var tpl = require('./modals/tpl.html');
var RUI=require('./core.js');

//基类、
RUI.namespace('Modals.Base');

RUI.Modals.Base=function(arg){
    var defaultCfg={
        id:'rui-modals',
        triggerCls:".modal-trigger",
        renderTo:'body',
        bgOpacity:0.1,
        title:'',
        content:"",
        cls:'',
        listeners:{
            close:null,
            open:null
        }
    };
    this.opts= $.extend(true,defaultCfg,arg);
    this.initialize(this.opts)
};

RUI.Modals.Base.prototype.initialize=function(arg){

    var _this=this;
    _this.$el=$("#"+arg.id);
    if(!_this.$el[0]){
        _this.$el=$(_.template(RUI.queryTpl(tpl,"#tpl-modal"))({id:arg.id,buttons:arg.buttons}));
        $(arg.renderTo).append(_this.$el);
    }


    _this.$el.css({
        height:arg.height,
        width:arg.width
    });
    var content=_this.$el.find(".modal-content").css({
        height:arg.height-52
    });
    this.$triggerEl=$(arg.triggerEl);
    for(var eType in _this.opts.events){
        _this.bind(eType,_this.opts.events[eType]);
    }
    $(_this.opts.triggerEl).leanModal({
        dismissible: arg.dismissible||true, // Modal can be dismissed by clicking outside of the modal
        opacity: arg.bgOpacity, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        ready: function() {
            _this.$el.find(".title").html(arg.title);
            _this.$el.find(".content").html(arg.content);
            arg.listeners.open&&arg.listeners.open.call(_this,_this);
        },
        complete: function() {
            arg.listeners.close&&arg.listeners.close.call(_this,false);
            _this.$el.find(".title").html("");
            _this.$el.find(".content").html("");
        }
    })
    //bind buttons handler
    if(_this.opts.buttons&&_this.opts.buttons.length){
        _this.opts.buttons.forEach(function(itm,i){
            _this.bind("click "+".modal-"+itm.type,itm.handler);
        })

    }
    return this.modals;
};

RUI.Modals.Base.prototype.close=function(arg){

};
RUI.Modals.Base.prototype.bind=function(tpye,callBack){
    var _this=this;
    _this.$el.on(tpye,function(e){
        e.$target=$(e.target);
        callBack&&callBack.call(_this,e)
    })
};

// Window
RUI.namespace('Modals.Window');
RUI.Modals.Window=function(arg){
    var defaultCfg={
        id:'rui-window',
        renderTo:'body',
        bgOpacity:0.5,
        title:'',
        content:"",
        height:'auto',
        width:'auto',
        buttons:[],
        cls:'',
        listeners:{
            close:null,
            open:null,
            beforeRender:null,
            afterRender:null,
            complete:null
        }
    };
    this.opts= $.extend(true,defaultCfg,arg);
    this.initialize(this.opts)
};
RUI.Modals.Window.prototype.initialize=function(arg){

    var _this=this;
    _this.$el=$("#"+arg.id);
    if(!_this.$el[0]){
        var html=_.template($(tpl).filter("#tpl-window").html())(arg);
        _this.$el=$(html);
    }
    //12-5 修复页面多个不同样式弹窗总是同一高宽 （liuzhao）
    _this.$el.css({
        height:arg.height,
        width:arg.width
    });

    this.setContent(arg.content)
    this.setTitle(arg.title)
    $(arg.renderTo).append(_this.$el);

    this.bind()

    //bind buttons handler
    arg.listeners.beforeRender&&arg.listeners.beforeRender.call(_this,_this);
    //bind buttons handler
    if(arg.buttons&&arg.buttons.length){
        arg.buttons.forEach(function(itm,i){
            //_this.bind("click "+".modal-footer",itm.handler);
        })

    }
    this.show();
    return this.modals;
};
RUI.Modals.Window.prototype.setContent=function(con){
    con&&this.$el.find(".content").html(con);
};
RUI.Modals.Window.prototype.setTitle=function(text){
    text&&this.$el.find(".title").html(text);
};
RUI.Modals.Window.prototype.close=function(arg){
    var _this=this;
    this.$el&&this.$el.closeModal();
    this.opts.listeners.close&& this.opts.listeners.close.call(_this,arg,_this);
};

RUI.Modals.Window.prototype.show=function(){
    var _this=this;
    $("#"+this.opts.id).openModal({
        dismissible:false,
        opacity: .1, // 背景透明度
        ready: function() {
            _this.opts.listeners.open&&_this.opts.listeners.open.call(_this,_this);
            _this.opts.listeners.afterRender&&_this.opts.listeners.afterRender.call(_this,_this);
          //  $("#"+_this.opts.id).css({"zIndex":40000000})
        }, // Callback for Modal open
        complete: function() {
            _this.opts.listeners.close&& _this.opts.listeners.close.call(_this,false);
        } // Callback for Modal close
    })
};
RUI.Modals.Window.prototype.bind=function(i){
    var _this=this;
    _this.$el.off().on("click",function(e){
        var tar= e.target,id=tar.id
        if(_this.opts.buttons&&_this.opts.buttons.length){
            if(tar.id.indexOf("window-btn-")>-1){
                _this.opts.buttons.every(function(itm,i){
                    if(id.indexOf(i+"")>-1){
                        itm.handler&& itm.handler.call(_this,_this,tar);
                        return false;
                    }else{
                        return true;
                    }
                })
            }
        }
    })
    function bindEvt(tpye,callBack){
        _this.$el.on(tpye,function(e){
             e.$target=$(e.target);
            callBack&&callBack.call(_this,e)
        })
    }
    for(var eType in _this.opts.events){
        bindEvt(eType,_this.opts.events[eType]);
    }
};
// ALERT
RUI.namespace('Modals.Alert');
RUI.Modals.Alert=function(arg){
    var defaultCfg={
        id:'rui-alert',
        renderTo:'body',
        cls:'',
        bgOpacity:0.5,
        title:'提示',
        content:"",
        height: "auto",
        width: 384,
        buttons:[{text:"确认",cls:"accept",handler:function(thiz){thiz.close();}}],
        listeners:{
            close:null,
            open:null,
            beforeRender:null,
            afterRender:null,
            complete:null
        }
    },tmp={};
    typeof arg=='string'?tmp.content=arg:tmp=arg;
    this.opts= $.extend(true,defaultCfg,tmp);
    this.initialize(this.opts)
};
RUI.inherits(RUI.Modals.Alert,RUI.Modals.Window);

RUI.Modals.Alert.prototype.setContent=function(con){
    con&&this.$el.find(".content").html('<div style="text-align: center;height:"auto";line-height: 34px;">'+con+'</div>')
};

// Confirm
RUI.namespace('Modals.Confirm');
RUI.Modals.Confirm=function(arg){
    var defaultCfg={
        id:'rui-confirm',
        renderTo:'body',
        cls:'',
        bgOpacity:0.5,
        title:'提示',
        content:"",
        height: "auto",
         width: 384,
        buttons:[{text:"确认",cls:"accept",handler:function(thiz){thiz.close(true)}},{text:"取消",cls:"decline",handler:function(thiz){thiz.close(false)}}],
        listeners:{
            close:null,
            open:null,
            beforeRender:null,
            afterRender:null,
            complete:null
        }
    },tmp={};
    typeof arg=='string'?tmp.content=arg:tmp=arg;
    this.opts= $.extend(true,defaultCfg,tmp);
    this.opts= $.extend(true,defaultCfg,arg);
    this.initialize(this.opts)
};
RUI.inherits(RUI.Modals.Confirm,RUI.Modals.Window);

RUI.Modals.Confirm.prototype.setContent=function(con){
    con&&this.$el.find(".content").html('<div style="text-align: center;height:34px;line-height: 34px;">'+con+'</div>')
};

module.exports=RUI.Modals;
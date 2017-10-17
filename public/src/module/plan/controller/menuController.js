/**
 * Author LLJ
 * Date 2016-5-3 9:33
 */

var menuTpl=require('../tpl/menu-tpl.html');
var DEFAULTURL=BASE_PATH+'/html/activity/plan-iframe.html';
var GROUPURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
var TRIGGERURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';
var MOCK=require('../mock/mock.js');
var triggerURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';
var audiencesURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
//比较函数
function creatComationFuntion(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName],value2 = object2[propertyName];
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
}
//排序
function sort(data){
    data.sort(creatComationFuntion('index'));
}
function controller(view){
    this.view=view;
    this.menuData={};
    var _this=this;
    //查询菜单数据
    function queryMenuData(){

        //TODO::
       /* var data=[{"type":0,"index":0,"name":"触发","code":"trigger","icon":null,"url":null,"color":null,"children":[{"type":0,"index":0,"name":"预约触发","code":"timer-trigger","icon":"&#xe63f;","url":null,"color":null},{"type":2,"index":2,"name":"手动触发","code":"manual-trigger","icon":"&#xe63e;","url":null,"color":null}
            ,{"type":3,"index":3,"name":"事件触发","code":"event-trigger","icon":"&#xe62b;","url":null,"color":null}]},
            {"type":1,"index":1,"name":"受众","code":"audiences","icon":null,"url":null,"color":null,
                "children":[{"type":0,"index":0,"name":"目标人群","code":"target-group","icon":"&#xe639;","url":null,"color":null},
                    {"type":0,"index":1,"name":"细分人群","code":"separated-group","icon":"&#xe639;","url":null,"color":null},
                    {"type":0,"index":2,"name":"固定人群","code":"fixed-group","icon":"&#xe639;","url":null,"color":null}
                ]},
            {"type":2,"index":2,"name":"决策","code":"decisions","icon":null,"url":null,"color":null,"children":[{"type":2,"index":2,"name":"微信图文是否查看","code":"wechat-check","icon":"&#xe66c;","url":null,"color":null},{"type":3,"index":3,"name":"微信图文是否转发","code":"wechat-forwarded","icon":"&#xe673;","url":null,"color":null},{"type":4,"index":4,"name":"是否订阅公众号","code":"subscriber-public","icon":"&#xe66b;","url":null,"color":null},{"type":5,"index":5,"name":"是否个人号好友","code":"personal-friend","icon":"&#xe66a;","url":null,"color":null},{"type":6,"index":6,"name":"标签判断","code":"label-judgment","icon":"&#xe671;","url":null,"color":null}]},{"type":3,"index":3,"name":"行动","code":"activity","icon":null,"url":null,"color":null,"children":[{"type":0,"index":0,"name":"等待","code":"wait-set","icon":"&#xe670;","url":null,"color":null},{"type":1,"index":1,"name":"保存当前人群","code":"save-current-group","icon":"&#xe669;","url":null,"color":null},{"type":2,"index":2,"name":"设置标签","code":"set-tag","icon":"&#xe668;","url":null,"color":null},{"type":5,"index":5,"name":"发送微信图文","code":"send-img","icon":"&#xe63a;","url":null,"color":null},{"type":6,"index":6,"name":"发送h5活动","code":"send-h5","icon":"&#xe63c;","url":null,"color":null},{"type":7,"index":7,"name":"发送个人号消息","code":"send-msg","icon":"&#xe665;","url":null,"color":null}]}];
        sort(data);
        _this.renderMainMenu(data);
        _this.setComponent();*/
       // return ;

        util.api({
            url: "?method=mkt.campaign.nodeitem.list.get",
            type: 'get',
            success: function (res) {
                if(res&&res.code==0&&res.data&&res.data.length){
                    sort(res.data);
                    _this.renderMainMenu(res.data);
                    _this.setComponent();
                }
            },
            error:function(res){
            }
        })
    }
    //转化成展示数据
    function transformShowData(data){
        data.forEach(function(itm,i){
            var children=[];
            if(itm.children&&itm.children.length){
                sort(itm.children);
                itm.children.forEach(function(sub,idx){
                    children.push({
                        icon:sub.icon,
                        name:sub.name,
                        nodeType:itm.code,
                        itemType:sub.code,
                        node_type:itm.type,
                        item_type:sub.type,
                        url:(function(){
                            var url="";
                            if(itm.code=='trigger'){
                                url=triggerURL;
                            }else if(itm.code=='audiences'){
                                url=audiencesURL;
                            }
                            return url;
                        })(),
                        color:sub.color
                    });
                })

            }
            _this.menuData[itm.code]={
                nodeType:itm.code,
                "node_type": 0,
                "index": 0,
                "name": itm.name,
                "code":  itm.code,
                "icon": null,
                "url": null,
                "color": null,
                children:children
            };
        })
    }
    this.renderMainMenu=function(data){
        //[{"type":0,"index":0,"name":"触发","code":"trigger","icon":null,"url":null,"color":null,"children":[{"type":0,"index":0,"name":"预约触发","code":"timer-trigger","icon":"&#xe63f;","url":null,"color":null},{"type":2,"index":2,"name":"手动触发","code":"manual-trigger","icon":"&#xe63e;","url":null,"color":null}]},{"type":1,"index":1,"name":"受众","code":"audiences","icon":null,"url":null,"color":null,"children":[{"type":0,"index":0,"name":"目标人群","code":"target-group","icon":"&#xe639;","url":null,"color":null},{"type":0,"index":1,"name":"细分人群","code":"separated-group","icon":"&#xe639;","url":null,"color":null}]},{"type":2,"index":2,"name":"决策","code":"decisions","icon":null,"url":null,"color":null,"children":[{"type":2,"index":2,"name":"微信图文是否查看","code":"wechat-check","icon":"&#xe66c;","url":null,"color":null},{"type":3,"index":3,"name":"微信图文是否转发","code":"wechat-forwarded","icon":"&#xe673;","url":null,"color":null},{"type":4,"index":4,"name":"是否订阅公众号","code":"subscriber-public","icon":"&#xe66b;","url":null,"color":null},{"type":5,"index":5,"name":"是否个人号好友","code":"personal-friend","icon":"&#xe66a;","url":null,"color":null},{"type":6,"index":6,"name":"标签判断","code":"label-judgment","icon":"&#xe671;","url":null,"color":null}]},{"type":3,"index":3,"name":"行动","code":"activity","icon":null,"url":null,"color":null,"children":[{"type":0,"index":0,"name":"等待","code":"wait-set","icon":"&#xe670;","url":null,"color":null},{"type":1,"index":1,"name":"保存当前人群","code":"save-current-group","icon":"&#xe669;","url":null,"color":null},{"type":2,"index":2,"name":"设置标签","code":"set-tag","icon":"&#xe668;","url":null,"color":null},{"type":5,"index":5,"name":"发送微信图文","code":"send-img","icon":"&#xe63a;","url":null,"color":null},{"type":6,"index":6,"name":"发送H5活动","code":"send-h5","icon":"&#xe63c;","url":null,"color":null},{"type":7,"index":7,"name":"发送个人号消息","code":"send-msg","icon":"&#xe665;","url":null,"color":null}]}]
        //console.log('renderMainMenu',JSON.stringify(data))
        transformShowData(data);
        var html=  _.template($(menuTpl).filter("#main-menu").html())({data:data});
        view.$el.find('.menubar').html(html);
    }
    //设置
    this.setComponent=function(){
        var menubarTipTpl = _.template($(menuTpl).filter("#sub-menu").html());
        this.view.$el.on('click', '.menubar .btn-floating', function (e) {
            var me = this,
                cls=$.trim($(me).attr('class').replace(/btn-floating  waves-effect waves-light/, ""));
            //if ($(me).is('.trigger')) {
            //    cls = 'trigger';
            //}else if ($(me).is('.audiences')) {
            //    cls = 'audiences';
            //}else if ($(me).is('.decisions')) {
            //    cls = 'decisions';
            //}else if ($(me).is('.activity')) {
            //    cls = 'activity';
            //}
            var menubarTipData = {
                listType : cls,
                listData : _this.menuData[cls].children
            };
            layer.open({
                //area: '500px',//宽高area: ['500px', '300px']
                shade: 0,//不要遮罩
                closeBtn: 0,//不要关闭按钮
                type: 4,//tip类型
                shift: 5,//动画类型0-6 默认0
                //tips: [4, '#fff'],//方向1-4，背景色
                content: [menubarTipTpl(menubarTipData), me], //数组第二项即吸附元素选择器或者DOM
                success: function (layero, index) {
                }
            });
            e.stopPropagation();
        });
    }
    this.init=function(){
        queryMenuData();
    };
    this.init();

}

module.exports=controller;
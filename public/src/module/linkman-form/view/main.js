/*
 * @Author: UEC
 * @Date:   2016-08-10 16:41:56
 * @Last Modified by:   UEC
 * @Last Modified time: 2016-09-01 15:36:29
 */

'use strict';
let Header = require('./header.js');
let Count = require('./count.js');
let Search = require('./search.js');
let Modals = require('component/modals.js');
let ListTable = require('./list-table.js');
let Pager = require('./pager.js');
let pagination = require('plugins/pagination')($); //分页插件
let current_contact_id=null;
let current_commit_time=0;
let page_index=1;
let page_size=6;
let netErrorAlertMsg="网络问题，请联系管理员！";
let PrimaryData = require('../tpl/primaryData.html');
let API = {
    getListArray: '?method=mkt.contacts.commit.get', //查询用户反馈数据
    getDataCount: '?method=mkt.contacts.commit.count', //统计反馈数据
    delUserData: '?method=mkt.contacts.commit.del', //删除用户反馈数据
    keySaveData: '?method=mkt.contact.list.keys.save', //保存主键
    keyListData: '?method=mkt.contact.list.key.list' //查询主键
};
function successMsg(msg){
    Materialize.toast(msg||"保存成功！", 3000);
}
function errorAlertMsg(msg) {
    new Modals.Alert(msg || "数据获取失败！");
}
class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: {},
            list: {}
        };
        let _this = this;
        this.loadList = this.loadList.bind(this);
        this.loadCount = this.loadCount.bind(this);
        this.delListData = this.delListData.bind(this);
        this.openMainKeyWin = this.openMainKeyWin.bind(this);
        this.saveMainKeyAction = this.saveMainKeyAction.bind(this);
        this.queryMainKey = this.queryMainKey.bind(this);
    }
    loadCount(contactId) {
        var params = util.getLocationParams();
        let _this = this;
        util.api({
            url: API.getDataCount,
            type: 'get',
            data: {
                contact_id: params.contact_id
            },
            success: function(res) {

                if (res.code == 0) {
                    _this.setState({
                        count: {
                            "data": [{
                                "commit_count": res.data[0].commit_count,
                                "today_count": res.data[0].today_count,
                                "page_views": res.data[0].page_views,
                                "md_count": res.data[0].md_count,
                                "nonmd_count": res.data[0].nonmd_count
                            }]
                        }

                    })
                }
            },
            error: function(err) {
                errorAlertMsg(netErrorAlertMsg)
            }
        })
    }
    setPagination() {
        var that = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items:0, //条数
                itemsOnPage: page_size, //最多显示页数
                onPageClick: function(pageNumber, event) {
                    page_index=pageNumber;
                    that.loadList(current_commit_time, page_index);
                }
            });
        }
    }
    loadList(id, pn) {
        var params = util.getLocationParams();
        let _this = this;
        let partAttr = {
            val: id == undefined ? '' : id,
            arr: [],
            arrHead: [],
            main: {},
            byHead: []

        }
        util.api({
            url: API.getListArray,
            type: 'get',
            async: false,
            data: {
                commit_time: id,
                contact_id: params.contact_id,
                index: pn,
                size: page_size
            },
            success: function(res) {
                if (res.code == 0) {
                    if(!res.data.length&&pn>1){
                        _this.setPagination();
                        _this.loadList(id,1)
                        //$('.pagination-wrap').pagination('updateItems', res.total_count);
                    }else{
                        $('.pagination-wrap').pagination('updateItems', res.total_count);
                        for (var i = 0; i < res.data.length; i++) {
                            partAttr.arr.push(res.data[i]);
                        }
                        for (var i = 0; i < res.col_names[0].length; i++) {
                            partAttr.arrHead.push(res.col_names[0][i]);
                        }
                        partAttr.main['head'] = partAttr.arrHead;
                        partAttr.main['body'] = partAttr.arr;
                        _this.setState({
                            list: partAttr.main
                        })
                    }


                }
            },
            error: function(err) {
                errorAlertMsg(netErrorAlertMsg)
            }
        });

    }
    renderTpl(tps, selector, data) {
        return _.template($(tps).filter(selector).html())(data || {})

    }
    componentDidMount() {
        var params = util.getLocationParams();
        if (params != null) {
            current_contact_id=params.contact_id
            this.loadCount(params.contact_id);
        }
        this.$el = $(React.findDOMNode(this));
        this.setPagination();

        this.loadList(current_commit_time, 1);
    }
    queryMainKey(){
        let con = {
            checkArray: [],
            tplArray: []
        };

        let _this = this;
        util.api({
            url: API.keyListData,
            type: 'get',
            data: {
                contact_id:current_contact_id
            },
            success: function (res) {
                if (res.code == 0) {
                    if (res.show_keylist_window_status == 1) {
                        for (var i = 0; i < res.data.length; i++) {
                            con.tplArray.push(res.data[i]);
                        }
                        _this.openMainKeyWin(con)
                    } else {
                        successMsg();
                        _this.loadCount(current_contact_id)
                    }
                }
            },
            error: function (err) {
            }
        });
    }
    openMainKeyWin(content){
        let _this = this;
        new Modals.Window({
            id: 'showIndata',
            title: "设置数据主键",
            content: _this.renderTpl(PrimaryData, "#pdShow", {tpA:content.tplArray}),
            width: '500',//默认是auto
            height: "auto",
            cls: 'showIndata',
            listeners: {
                afterRender: function () {
                }
            },
            buttons:[{text:"确认",cls:"accept",handler:function(thiz) {
                let member = 0;
                content.checkArray.length = 0;
                $('#tplPage .tplMain input[type="checkbox"]').each(function () {
                    if ($(this).is(':checked')) {
                        //把选中的项存到数组里
                        content.checkArray.push({'field_name': $(this).attr('fname')});
                    }

                });
                if (content.checkArray.length == 0) {
                    $('.warning').show();
                } else {
                    $('.warning').hide();
                    if ($('.rember input[type="checkbox"]').is(':checked')) {
                        //记住选择
                        member = 1;
                    }
                    _this.saveMainKeyAction(member,content.checkArray,function(){
                        _this.loadCount(current_contact_id)
                    });
                    thiz.close();
                }
            }
            }, {
                text: "取消", cls: "accept", handler: function (thiz) {
                    thiz.close();
                }
            }]
        })
    }

    /**
     *
     * @param save_flag 1 表示记住 0表示不记住
     * @param field_list
     */
    saveMainKeyAction(save_flag,field_list,callBack){
        util.api({
            url: API.keySaveData,
            type: 'post',
            async: false,
            data: {
                contact_id: current_contact_id,
                save_flag: save_flag,
                field_list: field_list
            },
            success: function (res) {
                if (res.code == 0) {
                    successMsg();
                    callBack&&callBack(res);
                } else {
                    errorAlertMsg('操作失败');
                }
            },
            error: function (err) {
                errorAlertMsg(netErrorAlertMsg)
            }
        })
    }
    delAction(val1){
        var _this=this;
        util.api({
            url: API.delUserData,
            type: 'post',
            data: {
                commit_id: val1,
                contact_id: current_contact_id
            },
            success: function(res) {
                if (res.code == 0) {
                    _this.loadList(current_commit_time,page_index);
                    _this.loadCount(current_contact_id)
                    successMsg('删除成功');
                } else {
                   errorAlertMsg("删除失败")
                }
            },
            error: function(err) {
                errorAlertMsg(netErrorAlertMsg)
            }
        });
    }
    delListData(val1){
        let _this=this;
        new Modals.Window({
            id:'delListData',
            title:"提示",
            content:'<div class="isDel">确定删除吗？</div>',
            width:'500',//默认是auto
            height: "auto",
            cls:'delListData',
            listeners:{
                afterRender:function(){}
            },
            buttons:[{text:"确认",cls:"accept",handler:function(thiz){
                _this.delAction(val1)
                thiz.close();
            }},{text:"取消",cls:"accept",handler:function(thiz){thiz.close();}}],
        })
    }
    render() {
        let countData = this.state.count.data && this.state.count.data.length ? this.state.count.data[0] : {};
        let listData = this.state.list ? this.state.list : [];
        let params = util.getLocationParams();
        let header={
            contact_name:params?params.contact_name:''
        };
        return ( < div className = "contact-form-linkmanForm" >
            < Header data={header}/>
            < Count loadCount = { this.loadCount }
                    current_contact_id={current_contact_id}
                    data = { countData }
                    queryMainKey={this.queryMainKey}
            /><Search loadList={this.loadList}/>
            < ListTable data = {listData}

                delListData={this.delListData}
            /><Pager/>
            </div>
        )

    }
}
module.exports = Panel;

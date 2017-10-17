/**
 * Created by AnThen on 2016/11/1.
 * 短信素材-列表 es6+react版
 */

//构造页面
import Layout from 'module/layout/layout';

//先创建布局
const layout = new Layout({
    index: 2,
    leftMenuCurName:'模板管理'
});

//插件
//弹层
let Modals = require('component/modals.js');
//分页
let pagination = require('plugins/pagination')($);

//集成模块
//table loading
import TbodyLoading from 'module/table-common/table-loading';
//table 暂无数据
import TbodyFalse from 'module/table-common/table-false';

//编写页面模块
//二级头部
class SubHead extends React.Component{
    render() {
        let newHref;
        switch (this.props.channel){
            case 0:
                newHref = BASE_PATH+"message-mould-new-marketing.html";
                break;
            case 1:
                newHref = BASE_PATH+"message-mould-new-serve.html";
                break;
        }
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">模板管理</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" title="新建模板" href={newHref}>
                        <span className="icon iconfont">&#xe63b;</span>
                        <span className="text">新建模板</span>
                    </a>
                </div>
            </header>
        )
    }
}
//表格
class TbodyTrue extends React.Component{
    editGo(status,id){
        let href = BASE_PATH+"message-mould-edit.html?id="+id;
        if(status == ''){
            window.location.href = href;
        }
    }
    delete(status,id){
        let that = this;
        if(status == ''){
            new Modals.Confirm({
                content:"您确定要删除这个模板吗？",
                listeners:{
                    close:function(type){
                        if(type == true){
                            util.api({
                                url: "?method=mkt.sms.smstemplet.del",
                                type: 'post',
                                data: {id:id},
                                success: function (res) {
                                    if(res.code == 0){
                                        that.props.resetTabsSecondNum();
                                        that.props.resetTbody();
                                    }
                                }
                            });
                        }else{
                            //console.log("click cancel");
                        }
                    }
                }
            });
        }
    }
    render() {
        return (
            <tbody className="uat-msgmould-tbody">
            {this.props.data.map((m,i)=> {
                return (
                    <tr data-listid={m.id}>
                        <td className="first uat-msgmould-td">{m.id}</td>
                        <td className="single-text uat-msgmould-td">{m.name}</td>
                        <td className="uat-msgmould-td">{m.typeStr}</td>
                        <td className="uat-msgmould-td">{m.createTime}</td>
                        <td className="uat-msgmould-td">{m.auditStatus}</td>
                        <td className="operation">
                            <a href={BASE_PATH+"message-mould-check.html?id="+m.id}>查看</a>
                            <a className={m.editStatus} href="javascript:void(0)" onClick={this.editGo.bind(this,m.editStatus,m.id)}>编辑</a>
                            <ico className="pointer icon iconfont r-btn dropdown-button moreico" data-activates={"morelist"+m.id} data-constrainwidth="false">&#xe675;</ico>
                            <ul id={"morelist"+m.id} className="dropdown-content setuplist">
                                <li className={m.deleteStatus}>
                                    <i className="icon iconfont">&#xe674;</i>
                                    <a href="javascript:void(0)" onClick={this.delete.bind(this,m.deleteStatus,m.id)}>删除</a>
                                </li>
                            </ul>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        )
    }
}

//组织页面模块
class Manage extends React.Component {
    resetTbody(){
        let indexNum = this.state.index,
            sizeNum = this.state.size,
            searchText = this.state.search,
            channel = this.state.channel,
            mould = this.state.mould,
            audit = this.state.audit;
        this.fetchTableData(indexNum,sizeNum,searchText,channel,mould,audit);
        this.setPagination();
    }
    channelChange(type){
        let sizeNum = this.state.size,
            audit = this.state.audit;
        $('#search-input').val('');
        $('#second-layer').children('.indicator').css({left:'300px',right:0});
        this.setState({tabsSecond:['','','active'],channel:type,search:'',mould:-1});
        this.fetchTabsSecondNum(type);
        this.fetchTableData(1,sizeNum,'',type,-1,audit);
        this.setPagination();
    }
    typeChange(type){
        let sizeNum = this.state.size,
            channel = this.state.channel,
            audit = this.state.audit;
        let tabsSecond = ['','','active'];
        $('#search-input').val('');
        switch (type){
            case 0:
                tabsSecond = ['active','',''];
                break;
            case 1:
                tabsSecond = ['','active',''];
                break;
            case -1:
                tabsSecond = ['','','active'];
                break;
        }
        this.setState({tabsSecond:tabsSecond,mould:type});
        this.fetchTableData(1,sizeNum,'',channel,type,audit);
        this.setPagination();
    }
    searchTbodyKeyUp(e){
        let searchText = $('#search-input').val().trim();
        let sizeNum = this.state.size,
            channel = this.state.channel,
            mould = this.state.mould,
            audit = this.state.audit;
        if(e.keyCode == 13){
            this.setState({index:1,search:searchText});
            this.fetchTableData(1,sizeNum,searchText,channel,mould,audit);
            this.setPagination();
        }
    }
    searchTbodyClick(){
        let searchText = $('#search-input').val().trim();
        let sizeNum = this.state.size,
            channel = this.state.channel,
            mould = this.state.mould,
            audit = this.state.audit;
        this.setState({index:1,search:searchText});
        this.fetchTableData(1,sizeNum,searchText,channel,mould,audit);
        this.setPagination();
    }
    resetTabsSecondNum(){
        let channelType = this.state.channel;
        this.fetchTabsSecondNum(channelType);
    }
    fetchTabsSecondNum(channelType){
        let that = this;
        let thisData,fixed,variable,all;

        util.api({
            data: {
                method: 'mkt.sms.smstemplet.count.get',
                channel_type: channelType
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    fixed = thisData.fixed;
                    variable = thisData.variable;
                    all = parseInt(fixed) + parseInt(variable);
                    that.setState({tabsSecondNum:[fixed,variable,all]});
                }
            }
        });
    }
    fetchTableData(indexNum,sizeNum,searchText,channelType,mouldType,auditType){
        let that = this;
        let total=0,total_count=0,thisData=[];

        util.api({
            data: {
                method: 'mkt.sms.smstemplet.list.get',
                index:indexNum,
                size:sizeNum,
                name:searchText,
                channel_type:channelType,
                type:mouldType,
                audit:auditType
            },
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={6} tbodyClassName={'uat-msgmould-tbody'}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); total_count = res.total_count; thisData = res.data;
                    that.setState({tbodyTotalCount:total_count});
                    if(total>0){
                        that.setState({
                            tabsThirdNum:[res.auditStatusPassCount]
                        });
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-msgmould-tbody'}/>});
                    }
                }else{
                    total_count = 0;
                    that.setState({tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-msgmould-tbody'}/>});
                }
                $('.pagination-wrap').pagination('updateItems', total_count);
            },
            error: function () {
                that.setState({tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-msgmould-tbody'}/>});
            }
        });
    }
    formatTbodyData(total,data){
        let thisData = data;
        let audit,edit_status,delete_status,tbodyData = [];
        for(let i=0; i<total; i++){
            switch (thisData[i].auditStatus){
                case 0:
                    audit = "未审核";
                    break;
                case 1:
                    audit = "审核通过";
                    break;
                case 2:
                    audit = "审核不通过";
                    break;
            }
            switch (thisData[i].editCheck){
                case true:
                    edit_status = "";
                    break;
                case false:
                    edit_status = "close";
                    break;
            }
            switch (thisData[i].deleteCheck){
                case true:
                    delete_status = "";
                    break;
                case false:
                    delete_status = "close";
                    break;
            }
            tbodyData[i] = {
                id:thisData[i].id,
                name:thisData[i].name,
                typeStr:thisData[i].typeStr,
                createTime:thisData[i].createTimeStr,
                auditStatus:audit,
                editStatus:edit_status,
                deleteStatus:delete_status
            };
        }
        this.setState({
            tbodyModule:<TbodyTrue data={tbodyData} resetTbody={this.resetTbody} resetTabsSecondNum={this.resetTabsSecondNum}/>
        });
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
    }
    setPagination(){
        let that = this;
        let thisSize = this.state.size,searchText,channel,mould,audit;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    searchText = that.state.search;
                    channel = that.state.channel;
                    mould = that.state.mould;
                    audit = that.state.audit;
                    that.setState({index:pageNumber});
                    that.fetchTableData(pageNumber,thisSize,searchText,channel,mould,audit);
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            tabsSecond:['','','active'],
            tabsSecondNum:[0,0,0],
            tabsThirdNum:[0],
            channel:0,mould:-1,audit:0,
            index: 1, size: 10, search: '',
            tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-msgmould-tbody'}/>,
            tbodyTotalCount:0
        };
        this.resetTabsSecondNum = this.resetTabsSecondNum.bind(this);
        this.resetTbody = this.resetTbody.bind(this);
    }
    componentDidMount(){
        this.fetchTabsSecondNum(0);
        this.fetchTableData(1,10,'',0,-1,0);
        this.setPagination();
    }
    render() {
        return (
            <div className="message-mould">
                <SubHead channel={this.state.channel}/>
                <div className="content">
                    <div className="tabs-first-layer">
                        <div className="tabs-box">
                            <ul id="first-layer" className="tabs">
                                <li className="tab"><a className="active" href="javascript:void(0)" onClick={this.channelChange.bind(this,0)}>营销短信模版</a></li>
                                <li className="tab"><a href="javascript:void(0)" onClick={this.channelChange.bind(this,1)}>服务通知模版</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="content-body">
                        <div className="tabs-second-layer">
                            <div className="tabs-box">
                                <ul id="second-layer" className="tabs tabs2">
                                    <li className="tab"><a className={this.state.tabsSecond[0]} href="javascript:void(0)" onClick={this.typeChange.bind(this,0)}>固定模板（{this.state.tabsSecondNum[0]}）</a></li>
                                    <li className="tab"><a className={this.state.tabsSecond[1]} href="javascript:void(0)" onClick={this.typeChange.bind(this,1)}>变量模板（{this.state.tabsSecondNum[1]}）</a></li>
                                    <li className="tab"><a className={this.state.tabsSecond[2]} href="javascript:void(0)" onClick={this.typeChange.bind(this,-1)}>全部（{this.state.tabsSecondNum[2]}）</a></li>
                                </ul>
                            </div>
                            <div className="search-area">
                                <div className="search-box">
                                    <input id="search-input" className="input" maxLength="20" placeholder="模板名称关键字" onKeyUp={this.searchTbodyKeyUp.bind(this)}/>
                                    <div className="icon iconfont" onClick={this.searchTbodyClick.bind(this)}>&#xe668;</div>
                                </div>
                            </div>
                        </div>
                        <div className="point-out-area">
                            <div className="point-out-box">
                                <div className="point-out-title"><div className="icon iconfont">&#xe63a;</div></div>
                                <div className="point-out-content">
                                    因运营商要求，短信内容需审核。模板审核通过后，您可以直接使用，或通过API调用的形式发送。
                                </div>
                            </div>
                        </div>
                        <div className="tabs-third-layer">
                            <div className="title">模板列表</div>
                            <div className="tabs-area">
                                <div className="tabs-box">
                                    <ul className="tabs">
                                        <li className="tab"><a className="active" href="javascript:void(0)">审核通过（{this.state.tabsThirdNum[0]}）</a></li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                        <div className="table-area">
                            <table className="page-table-box uat-msgmould-table">
                                <thead>
                                <tr>
                                    <th className="first">模板ID</th>
                                    <th>模板名称</th>
                                    <th>模板类型</th>
                                    <th>提交时间</th>
                                    <th>审核状态</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                {this.state.tbodyModule}
                            </table>
                            <div className="total-count">共<span id="tbodyTotalCount">{this.state.tbodyTotalCount}</span>条</div>
                            <div className="pagination-wrap pagination"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//渲染页面
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
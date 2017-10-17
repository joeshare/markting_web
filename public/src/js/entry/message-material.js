/**
 * Created by AnThen on 2016/11/1.
 * 短信素材-列表 es6+react版
 */

//构造页面
import Layout from 'module/layout/layout';

//先创建布局
const layout = new Layout({
    index: 2,
    leftMenuCurName:'短信素材'
});

//插件
//弹层插件
let Modals = require('component/modals.js');
//分页插件
let pagination = require('plugins/pagination')($);

//集成模块
//table loading
import TbodyLoading from 'module/table-common/table-loading';
///table 暂无数据
import TbodyFalse from 'module/table-common/table-false';

//编写页面模块
//二级头部
class SubHead extends React.Component{
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">素材管理</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" title="新建素材" href={BASE_PATH+"message-material-new.html"}>
                        <span className="icon iconfont">&#xe63b;</span>
                        <span className="text">新建素材</span>
                    </a>
                </div>
            </header>
        )
    }
}
//表格
class TbodyTrue extends React.Component{
    editGo(status,id){
        let href = BASE_PATH+"message-material-edit.html?id="+id;
        if(status == ''){
            window.location.href = href;
        }
    }
    delete(status,id){
        let that = this;
        if(status == ''){
            new Modals.Confirm({
                content:"您确定要删除这个素材吗？",
                listeners:{
                    close:function(type){
                        if(type == true){
                            util.api({
                                url: "?method=mkt.sms.smsmaterial.delete",
                                type: 'post',
                                data: {id:id},
                                success: function (res) {
                                    if(res.code == 0){
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
            <tbody className="uat-msgmaterial-tbody">
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td className="first uat-msgmaterial-td">{m.id}</td>
                        <td className="single-text uat-msgmaterial-td">{m.materialName}</td>
                        <td className="single-text uat-msgmaterial-td">{m.templateName}</td>
                        <td className="uat-msgmaterial-td">{m.smsType}</td>
                        <td className="uat-msgmaterial-td">{m.foundTime}</td>
                        <td className="operation">
                            <a href={BASE_PATH+"message-material-check.html?id="+m.id}>查看</a>
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
            mould = this.state.mould;
        this.fetchTableData(indexNum,sizeNum,searchText,channel,mould);
    }
    searchTbodyKeyUp(e){
        let channel = this.state.channel,
            mould = this.state.mould;
        let searchText = $('#search-input').val().trim();
        let sizeNum = this.state.size;
        if(e.keyCode == 13){
            this.setState({index:1,search:searchText});
            this.fetchTableData(1,sizeNum,searchText,channel,mould);
            this.setPagination();
        }
    }
    searchTbodyClick(){
        let channel = this.state.channel,
            mould = this.state.mould;
        let searchText = $('#search-input').val().trim();
        let sizeNum = this.state.size;
        this.setState({index:1,search:searchText});
        this.fetchTableData(1,sizeNum,searchText,channel,mould);
        this.setPagination();
    }
    channelChange(type){
        let sizeNum = this.state.size;
        $('#search-input').val('');
        $('#second-layer').children('.indicator').css({left:'300px',right:0});
        this.setState({tabsSecond:['','','active'],channel:type,search:'',mould:-1});
        this.fetchTabsSecondNum(type);
        this.fetchTableData(1,sizeNum,'',type,-1);
        this.setPagination();
    }
    typeChange(type){
        let sizeNum = this.state.size,
            channel = this.state.channel;
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
        this.setState({tabsSecond:tabsSecond,mould:type,search:''});
        this.fetchTableData(1,sizeNum,'',channel,type);
        this.setPagination();
    }
    fetchTabsSecondNum(channelType){
        let that = this;
        let thisData,fixed,variable,all;

        util.api({
            data: {
                method: 'mkt.sms.smsmaterial.count.get',
                channel_type: channelType
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<thisData.length; i++){
                        if(thisData[i].sms_type == 0){fixed = parseInt(thisData[i].sms_count)}
                        if(thisData[i].sms_type == 1){variable = parseInt(thisData[i].sms_count)}
                    }
                    all = fixed + variable;
                    that.setState({tabsSecondNum:[fixed,variable,all]});
                }
            }
        });
    }
    fetchTableData(indexNum,sizeNum,searchText,channelType,mouldType){
        let that = this;
        let total=0,total_count=0,thisData=[];

        util.api({
            data: {
                method: 'mkt.sms.smsmaterial.getlist',
                index:indexNum,
                size:sizeNum,
                search_word:searchText,
                channel_type:channelType,
                sms_type:mouldType
            },
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={6} tbodyClassName={'uat-msgmaterial-tbody'}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); total_count = res.total_count; thisData = res.data;
                    if(total>0){
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-msgmaterial-tbody'}/>});
                    }
                }else{
                    total_count = 0;
                    that.setState({tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-msgmaterial-tbody'}/>});
                }
                that.setState({tbodyTotalCount:total_count});
                $('.pagination-wrap').pagination('updateItems', total_count);
            },
            error: function () {
                that.setState({});
                that.setState({
                    tbodyTotalCount:0,
                    tbodyModule:<TbodyFalse colspan={5} tbodyClassName={'uat-eventaction-tbody'}/>
                });
            }
        });
    }
    formatTbodyData(total,data){
        let thisData = data;
        let sms_type,edit_status,delete_status,tbodyData = [];
        for(let i=0; i<total; i++){
            switch (thisData[i].sms_type){
                case 0:
                    sms_type = "固定类型";
                    break;
                case 1:
                    sms_type = "变量类型";
                    break;
            }
            switch (thisData[i].edit_status){
                case 0:
                    edit_status = "";
                    break;
                case 1:
                    edit_status = "close";
                    break;
            }
            switch (thisData[i].delete_status){
                case 0:
                    delete_status = "";
                    break;
                case 1:
                    delete_status = "close";
                    break;
            }
            tbodyData[i] = {
                id:thisData[i].id,
                material_id:thisData[i].material_id,
                materialName:thisData[i].material_name,
                templateName:thisData[i].sms_template_name,
                smsType:sms_type,
                foundTime:thisData[i].create_time,
                editStatus:edit_status,
                deleteStatus:delete_status
            };
        }
        this.setState({
            tbodyModule:<TbodyTrue data={tbodyData} resetTbody={this.resetTbody}/>
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
    constructor(props){
        super(props);
        this.state = {
            tabsSecond:['','','active'],
            tabsSecondNum:[0,0,0],
            index: 1, size: 10, search: '',channel:0,mould:-1,
            tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-msgmaterial-tbody'}/>,
            tbodyTotalCount:0
        };
        this.resetTbody = this.resetTbody.bind(this);
    }
    setPagination(){
        let that = this;
        let thisSize=this.state.size,searchText,channel,mould;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    searchText = that.state.search;
                    channel = that.state.channel;
                    mould = that.state.mould;
                    that.setState({index:pageNumber});
                    that.fetchTableData(pageNumber,thisSize,searchText,channel,mould);
                }
            });
        }
    }
    componentDidMount(){
        this.fetchTabsSecondNum(0);
        this.fetchTableData(1,10,'',0,-1);
        this.setPagination();
    }
    render() {
        return (
            <div className="material">
                <SubHead />
                <div className="content">
                    <div className="content-header">
                        <div className="tabs-box-one">
                            <div className="tabs-box">
                                <ul id="first-layer" className="tabs">
                                    <li className="tab"><a className="active" href="javascript:void(0)" onClick={this.channelChange.bind(this,0)}>营销短信</a></li>
                                    <li className="tab"><a href="javascript:void(0)" onClick={this.channelChange.bind(this,1)}>服务通知短信</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="tabs-box-two">
                            <div className="tabs-box">
                                <ul id="second-layer" className="tabs tabs2">
                                    <li className="tab"><a className={this.state.tabsSecond[0]} href="javascript:void(0)" onClick={this.typeChange.bind(this,0)}>固定模板（{this.state.tabsSecondNum[0]}）</a></li>
                                    <li className="tab"><a className={this.state.tabsSecond[1]} href="javascript:void(0)" onClick={this.typeChange.bind(this,1)}>变量模板（{this.state.tabsSecondNum[1]}）</a></li>
                                    <li className="tab"><a className={this.state.tabsSecond[2]} href="javascript:void(0)" onClick={this.typeChange.bind(this,-1)}>全部（{this.state.tabsSecondNum[2]}）</a></li>
                                </ul>
                            </div>
                            <div className="search-area">
                                <div className="search-box">
                                    <input id="search-input" className="input" placeholder="素材名称关键字" onKeyUp={this.searchTbodyKeyUp.bind(this)}/>
                                    <div className="icon iconfont" onClick={this.searchTbodyClick.bind(this)}>&#xe668;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-area">
                        <table className="page-table-box uat-msgmaterial-table">
                            <thead>
                            <tr>
                                <th className="first">素材ID</th>
                                <th>素材名称</th>
                                <th>已选模板</th>
                                <th>模板类型</th>
                                <th>创建时间</th>
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
        )
    }
}

//渲染页面
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
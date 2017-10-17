/**
 * Created by AnThen on 2016-8-4.
 * 微信二维码-列表 es6+react版
 */
'use strict';//严格模式

//构造页面
import Layout from 'module/layout/layout';

//先创建布局
const layout = new Layout({
    index: 2,
    leftMenuCurName:'微信二维码'
});

//插件
//模态窗
let Modals = require('component/modals.js');
//分页插件
let pagination = require('plugins/pagination')($);

//集成模块
//table loading
import TbodyLoading from 'module/table-common/table-loading';
//table 暂无数据
import TbodyFalse from 'module/table-common/table-false';

//二级头部
class SubHead extends React.Component{
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">微信二维码</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" id="goIndex" href={BASE_PATH+'/html/asset/qrcode-new-mass.html'} title="批量新建">
                        <span className="icon iconfont">&#xe64a;</span>
                        <span className="text">批量新建</span>
                    </a>
                    <a className="a keyong" id="goIndex" href={BASE_PATH+'/html/asset/qrcode-new.html'} title="新建二维码">
                        <span className="icon iconfont">&#xe612;</span>
                        <span className="text">新建二维码</span>
                    </a>
                    <a className="a keyong" id="goIndex" href={BASE_PATH+'/html/asset/qrcode-analyze.html'} title="分析">
                        <span className="icon iconfont">&#xe624;</span>
                        <span className="text">分析</span>
                    </a>
                </div>
            </header>
        )
    }
}
//切换项
class SearchHead extends React.Component{
    dropdownButton(){
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
    }
    fetch(){
        let that = this;
        let subscription = [];
        let thisData;
        util.api({
            data: {method: 'mkt.weixin.register.list'},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<res.total; i++){
                        subscription[i] = {
                            name: thisData[i].name,
                            acct:thisData[i].wx_acct,
                            id:thisData[i].wxmp_id,
                            img:thisData[i].head_image
                        };
                    }
                    subscription[res.total] = {id:0,acct:0,name:'全部',
                        img:IMG_PATH+'/img/asset/default-company-logo.png'
                    };
                    that.setState({subscription:subscription});
                }
            }
        });
    }
    subscription(id,acct,text){
        this.setState({subscriptionText: {id: id, acct: acct, text: text}});
    }
    invalid(id,text){
        this.setState({invalidText: {id: id, text: text}});
    }
    status(id,text){
        this.setState({statusText: {id: id, text: text}});
    }
    screen(){
        $('#search-input').val('');
        let subscriptionId = this.state.subscriptionText.acct,
            invalidId = this.state.invalidText.id,
            statusId = this.state.statusText.id;
        this.props.resetTbody(subscriptionId,invalidId,statusId,'',1,10);
    }
    inputSearch(){
        let search = $.trim($('#search-input').val());
        this.setState({
            subscriptionText: {id: 0, acct: 0, text: '全部'},
            invalidText: {id: 0, text: '全部'},
            statusText: {id: 0, text: '全部'}
        });
        this.props.resetTbody(0,0,0,search,1,10);
    }
    constructor(props){
        super(props);
        this.state = {
            subscriptionText: {id: 0, acct: 0, text: '全部'},
            invalidText: {id: 0, text: '全部'},
            statusText: {id: 0, text: '全部'},
            subscription: []
        };
        this.dropdownButton(this);
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="search-head">
                <div className="dropdown-area">
                    <div className="selectbtn-box">
                        <div className="title">公众号</div>
                        <div className="r-btn dropdown-button selectbtn" data-beloworigin="true" data-activates="subscription-list" data-constrainwidth="false" data-id={this.state.subscriptionText.id} id="subscriptionText">{this.state.subscriptionText.text}</div>
                    </div>
                    <ul id="subscription-list" className="dropdown-content subscription-list" style={{"width":"auto"}}>
                        {this.state.subscription.map((m,i)=> {
                            return(
                                <li onClick={this.subscription.bind(this,m.id,m.acct,m.name)}><div className="img"><img src={m.img}/></div><a href="javascript:void(0)">{m.name}</a></li>
                            )
                        })}
                    </ul>
                    <div className="selectbtn-box">
                        <div className="title">失效时间</div>
                        <div className="r-btn dropdown-button selectbtn" data-beloworigin="true" data-activates="invalid-list" data-id={this.state.invalidText.id} id="invalidText">{this.state.invalidText.text}</div>
                    </div>
                    <ul id="invalid-list" className="dropdown-content" style={{"width":"auto"}}>
                        <li onClick={this.invalid.bind(this,1,'三日内')}><a href="javascript:void(0)">三日内</a></li>
                        <li onClick={this.invalid.bind(this,2,'七日内')}><a href="javascript:void(0)">七日内</a></li>
                        <li onClick={this.invalid.bind(this,3,'一个月内')}><a href="javascript:void(0)">一个月内</a></li>
                        <li onClick={this.invalid.bind(this,4,'三个月内')}><a href="javascript:void(0)">三个月内</a></li>
                        <li onClick={this.invalid.bind(this,5,'六个月内')}><a href="javascript:void(0)">六个月内</a></li>
                        <li onClick={this.invalid.bind(this,6,'一年内')}><a href="javascript:void(0)">一年内</a></li>
                        <li onClick={this.invalid.bind(this,7,'三年内')}><a href="javascript:void(0)">三年内</a></li>
                        <li onClick={this.invalid.bind(this,8,'永久')}><a href="javascript:void(0)">永久</a></li>
                        <li onClick={this.invalid.bind(this,0,'全部')}><a href="javascript:void(0)">全部</a></li>
                    </ul>
                    <div className="selectbtn-box">
                        <div className="title">使用状态</div>
                        <div className="r-btn dropdown-button selectbtn" data-beloworigin="true" data-activates="state-list" data-id={this.state.statusText.id} id="statusText">{this.state.statusText.text}</div>
                    </div>
                    <ul id="state-list" className="dropdown-content" style={{"width":"auto"}}>
                        <li onClick={this.status.bind(this,1,'使用中')}><a href="javascript:void(0)">使用中</a></li>
                        <li onClick={this.status.bind(this,3,'已失效')}><a href="javascript:void(0)">已失效</a></li>
                        <li onClick={this.status.bind(this,0,'全部')}><a href="javascript:void(0)">全部</a></li>
                    </ul>
                    <div className="button-main-3 but" onClick={this.screen.bind(this)}>筛选</div>
                </div>
                <div className="search-area">
                    <div className="search-box">
                        <input id="search-input" className="input" placeholder="二维码名称" onChange={this.inputSearch.bind(this)}/>
                        <div className="icon iconfont">&#xe668;</div>
                    </div>
                </div>
            </div>
        )
    }
}
//表格
class TbodyTrue extends React.Component{
    dropdownButton(){
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
    }
    qrcodePreviewBlock(e){
        let thisDiv = $(e.currentTarget),previewBox = thisDiv.next('.qrcode-preview');
        let X = thisDiv.offset().left - 163, Y = thisDiv.offset().top - 258;

        previewBox.css({
            display: 'block',
            top: Y,
            left: X
        });
    }
    qrcodePreviewNone(e){
        let thisDiv = $(e.currentTarget),previewBox = thisDiv.next('.qrcode-preview');

        previewBox.css({
            display: 'none'
        });
    }
    hrefTo(url){
        window.location.href = url;
    }
    deleteTr(id){
        let that = this;
        let subscriptionAcct=this.props.param.subscriptionAcct,
            invalidId=this.props.param.invalidId,
            statusId=this.props.param.statusId,
            search=this.props.param.search,
            index=this.props.param.index,
            size=this.props.param.size;
        new Modals.Confirm({
            content: "您确实要删掉这条信息吗？",
            listeners: {
                close: function (type) {
                    if (type) {
                        util.api({
                            url: "?method=mkt.weixin.qrcode.del",
                            type: 'post',
                            data: {id:id},
                            success: function (res) {
                                if(res.code == 0){
                                    that.props.resetTbody(subscriptionAcct,invalidId,statusId,search,index,size);
                                }
                            }
                        });
                    } else {
                        //console.log("click cancel");
                    }
                }
            }
        });
    }
    componentDidMount(){
        this.dropdownButton();
    }
    render() {
        return (
            <tbody className="uat-qrcode-tbody">
            {this.props.data.map((m,i)=> {
                return (
                <tr data-listid={m.id}>
                    <td className="first uat-qrcode-td">
                        <div className="qrcode-img" onMouseOver={this.qrcodePreviewBlock.bind(this)} onMouseOut={this.qrcodePreviewNone.bind(this)}><img src={m.imgUrl}/></div>
                        <div className="qrcode-preview"><div className="image"><img src={m.imgPreviewUrl}/></div></div>
                    </td>
                    <td className="uat-qrname-td">{m.name}</td>
                    <td className="uat-wechat-td">{m.wxName}</td>
                    <td className="uat-channel-td">{m.ditch}</td>
                    <td className="uat-invalidtime-td">{m.invalidTime}</td>
                    <td className="uat-status-td">{m.condition}</td>
                    <td className="uat-qrcodetag-td">{m.associate}</td>
                    <td className="uat-focuscount-td">{m.attention}</td>
                    <td className="ico">
                        <ico className="pointer icon iconfont r-btn dropdown-button moreico" data-activates={"morelist"+m.id} data-constrainwidth="false">&#xe675;</ico>
                        <ul id={"morelist"+m.id} className="dropdown-content setuplist">
                            <li onClick={this.hrefTo.bind(this,BASE_PATH+'/html/asset/qrcode-edit.html?id='+m.id)}>
                                <i className="icon iconfont">&#xe609;</i>
                                <a href="javascript:void(0)">编辑</a>
                            </li>
                            <li onClick={this.hrefTo.bind(this,BASE_PATH+'/html/asset/qrcode-detail.html?id='+m.id)}>
                                <i className="icon iconfont">&#xe646;</i>
                                <a href="javascript:void(0)">详情</a>
                            </li>
                            <li onClick={this.deleteTr.bind(this,m.id)}>
                                <i className="icon iconfont">&#xe674;</i>
                                <a href="javascript:void(0)">删除</a>
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
    resetTbody(subscriptionAcct,invalidId,statusId,search,index,size){
        this.setState({
            subscriptionAcct: subscriptionAcct,
            invalidId: invalidId,
            statusId: statusId,
            search: search,
            index: index,
            size: size
        });
        this.fetch(subscriptionAcct,invalidId,statusId,search,index,size);
        this.setPagination();
    }
    fetch(subscriptionAcct,invalidId,statusId,searchText,index,size){
        let that = this;
        let thisIndex = index || this.state.index,
            thisSize = size || this.state.size;
        let total=0,total_count=0,thisData=[];
        if(searchText.length>0){
            util.api({
                data: {
                    method: 'mkt.weixin.qrcode.list.qrname',
                    qrcode_name:searchText,
                    index: thisIndex,size: thisSize
                },
                beforeSend: function () {
                    that.setState({tbodyModule:<TbodyLoading colspan={9} tbodyClassName={'uat-qrcode-tbody'}/>});
                },
                success: function (res) {
                    if(res.code == 0){
                        total = parseInt(res.total); total_count = res.total_count; thisData = res.data;
                        that.setState({tbodyTotalCount:total_count});
                        if(total>0){
                            that.formatTbodyData(total,thisData);
                        }else{
                            that.setState({tbodyModule:<TbodyFalse colspan={9} tbodyClassName={'uat-qrcode-tbody'}/>});
                        }
                    }else{
                        total_count = 0;
                        that.setState({tbodyModule:<TbodyFalse colspan={9} tbodyClassName={'uat-qrcode-tbody'}/>});
                    }
                    that.setState({tbodyTotalCount:total_count});
                    $('.pagination-wrap').pagination('updateItems', total_count);
                },
                error: function () {
                    that.setState({
                        tbodyTotalCount:0,
                        tbodyModule:<TbodyFalse colspan={9} tbodyClassName={'uat-qrcode-tbody'}/>
                    });
                }
            });
        }else{
            util.api({
                data: {
                    method: 'mkt.weixin.qrcode.list',
                    wxmp_name: subscriptionAcct,
                    expiration_time: invalidId,
                    qrcode_status: statusId,
                    index: thisIndex,size: thisSize
                },
                beforeSend: function () {
                    that.setState({tbodyModule:<TbodyLoading colspan={9} tbodyClassName={'uat-qrcode-tbody'}/>});
                },
                success: function (res) {
                    if(res.code == 0){
                        total = parseInt(res.total); total_count = res.total_count; thisData = res.data;
                        that.setState({tbodyTotalCount:total_count});
                        if(total>0){
                            that.formatTbodyData(total,thisData);
                        }else{
                            that.setState({tbodyModule:<TbodyFalse colspan={9} tbodyClassName={'uat-qrcode-tbody'}/>});
                        }
                    }else{
                        total_count = 0;
                        that.setState({tbodyModule:<TbodyFalse colspan={9} tbodyClassName={'uat-qrcode-tbody'}/>});
                    }
                    that.setState({tbodyTotalCount:total_count});
                    $('.pagination-wrap').pagination('updateItems', total_count);
                },
                error: function () {
                    that.setState({
                        tbodyTotalCount:0,
                        tbodyModule:<TbodyFalse colspan={9} tbodyClassName={'uat-qrcode-tbody'}/>
                    });
                }
            });
        }
    }
    formatTbodyData(total,data){
        let thisData = data;
        let invalidTime='',attention,tbodyData = [];
        let resetTbodyParam={
            subscriptionAcct:this.state.subscriptionAcct,
            invalidId:this.state.invalidId,
            statusId:this.state.statusId,
            search:this.state.search,
            index:this.state.index,
            size:this.state.size
        };
        for(let i=0; i<total; i++){
            if(thisData[i].expiration_time){
                invalidTime =  thisData[i].expiration_time;
            }else{
                invalidTime = <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--</span>
            }
            attention = parseInt(thisData[i].qrcode_attention);
            tbodyData[i] = {
                id: thisData[i].id,
                imgUrl: FILE_PATH+thisData[i].qrcode_pic,
                imgPreviewUrl: FILE_PATH+thisData[i].qrcode_pic,
                name: thisData[i].qrcode_name,
                wxName: thisData[i].wx_name,
                ditch: thisData[i].ch_name,
                invalidTime: invalidTime,
                condition: thisData[i].qrcode_status,
                associate: thisData[i].qrcode_tag,
                attention: thisData[i].focus_count
            };
        }

        this.setState({
            tbodyModule:<TbodyTrue data={tbodyData} resetTbody={this.resetTbody} param={resetTbodyParam}/>
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
        let thisSize=this.state.size;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    let subscription = that.state.subscriptionId,
                        invalid = that.state.invalidId,
                        status = that.state.statusId,
                        search = that.state.search;
                    that.setState({index:pageNumber});
                    that.fetch(subscription,invalid,status,search,pageNumber,thisSize);
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            subscriptionAcct: 0, invalidId: 0, statusId: 0, search: '', index: 1, size: 10,
            tbodyModule: <TbodyFalse colspan={9} tbodyClassName={'uat-qrcode-tbody'}/>,
            tbodyTotalCount: 0,
            moreList: ''
        };
        this.resetTbody = this.resetTbody.bind(this);
    }
    componentDidMount(){
        this.fetch(0,0,0,'',1,10);
        this.setPagination();
    }
    render() {
        return (
            <div className="qrcode-list">
                <SubHead />
                <div className="content">
                    <SearchHead resetTbody={this.resetTbody}/>
                    <div className="table-area">
                        <table className="page-table-box uat-qrcode-table">
                            <thead>
                            <tr>
                                <th className="first">二维码</th>
                                <th>二维码名称</th>
                                <th>公众号</th>
                                <th>渠道</th>
                                <th>失效时间</th>
                                <th>使用状态</th>
                                <th>关联标签</th>
                                <th>关注人数</th>
                                <th className="ico">操作</th>
                            </tr>
                            </thead>
                            {this.state.tbodyModule}
                        </table>
                        <div className="total-count">共{this.state.tbodyTotalCount}条</div>
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
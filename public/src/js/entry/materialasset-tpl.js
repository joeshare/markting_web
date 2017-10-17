/**
 * Created by richard on 2016-10-12.
 * 物料资产-模板管理
 */
'use strict';
import Layout from 'module/layout/layout';
let Modals = require('component/modals.js');
let pagination = require('plugins/pagination')($);//分页插件

const layout = new Layout({
    index: 2,
    leftMenuCurName: '模板管理'
});

//tab菜单
class TabBtnWrap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{name: '营销短信模版',code:0}, {name: '服务通知模版',code:1}]
        }
    }

    onSelectType(param){
        this.props.onSelecttype(param);
    }
    render() {
        let that = this;
        return (
            <div className="tab-btnwrap">
                <ul className="tabs">
                    {this.state.data.map((m, i)=> {
                        return <li className="tab">
                            <a href="#0" onClick={this.onSelectType.bind(this,m.code)} className={(i===3)?'active':''}>{m.name}</a>
                        </li>
                    })}
                </ul>
            </div>
        )
    }
}


/*搜索条件框*/
class ConSearch extends React.Component {
    searchList(){
        let searchValue = $('#search-input').val();
        this.props.onSearch(searchValue);
    }
    searchInputList(event){
        if(event.keyCode == 13){
            let searchValue = $('#search-input').val();
            this.props.onSearch(searchValue);
        }
    }

    onTypeclick(param,text){
        $('#select-mode-type').text(text);
        this.props.onSelect(param);
    }

    render() {
        return (
            <div className="tab-box">
                <div className="search-tpltype">
                    <span  className="search-tpltype-span">模版类型</span>
                    <a className='selectbtn dropdown-button' id="select-mode-type" data-beloworigin="true" href='#' data-activates='select-tpltype'>固定模版</a>
                    <ul id='select-tpltype' className='dropdown-content'>
                        <li onClick={this.onTypeclick.bind(this,100,'全部')}><a >全部</a></li>
                        <li onClick={this.onTypeclick.bind(this,0,'固定模版')}><a>固定模版</a></li>
                    </ul>
                </div>
                <div className="search-area">
                    <div className="search-box">
                        <input id="search-input" className="input" type="text" onKeyUp={this.searchInputList.bind(this)} placeholder="请输入模版关健字" />
                        <div className="icon iconfont" onClick={this.searchList.bind(this)} >&#xe668;</div>
                    </div>
                </div>
            </div>
        )
    }
}


//数据列表tab
class DataListTab extends React.Component{
    constructor(props) {
        super(props);
    }
    componentDidMount() {
            $(".list-box-tab").width(this.props.state.titleData.length*160);

    }
    render() {
        return(
            <div className="list-box">
                <div className="text-box">
                    <span className="title">模版列表</span>
                </div>
                <div className="list-box-tab">
                    <ul className="tabs">
                        {this.props.state.titleData.map((m, i)=> {
                            return <li className="tab">
                                <a href="#0" className={(i===0)?'active':''}>{m.name}({m.count})</a>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

//数据列表
class DataList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let that = this;
        return (
            <table className="page-table-box">
                <thead>
                <tr>
                    {this.props.colName.map(m=> {
                        return (
                            <th>
                                <span className="tit-text">{m.col_name}</span>
                            </th>
                        )
                    })}

                </tr>
                </thead>
                <tbody id="tbody-box">
                {this.props.listData.map((m, i)=> {
                    return (
                        <tr>
                            <td>{m.id}</td>
                            <td className="smsconttd"> <p className="smscont">{m.content}</p></td>
                            <td>{m.createTimeStr}</td>
                            <td>{m.auditStatusStr}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }
}

//弹出模版
class AddWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.onTypeclickwin = this.onTypeclickwin.bind(this);
    }

    componentDidMount() {
        $('#select-win-type').dropdown();
    }

    onInputSms(){
        $('.txtleft').hide();
        $('.txtright').text($('.smscontent').val().length);

        var $smstxt = $('.smscontent');
        var dh = $smstxt.attr('defaultHeight') || 0;
        if (!dh) {
            dh = $smstxt[0].clientHeight;
            $smstxt.attr('defaultHeight', dh);
        }
        $smstxt.height(dh);
        var clientHeight = $smstxt[0].clientHeight;
        var scrollHeight = $smstxt[0].scrollHeight;
        if (clientHeight !== scrollHeight) {
            $smstxt.height(scrollHeight);
        }
    }

    onTypeclickwin(param,text){
        $('#select-win-type').text(text);
        this.props.onSelect(param);
    }

    render() {
        return (
            <div className="wincontent">
                <div className="line-box">
                    <div className="line-title">
                        <span>模版类型</span>
                    </div>
                    <div className="line">
                        <div className="qrcode-name">
                            <div className="input-box">
                                <a className='selectbtn dropdown-button' id="select-win-type" data-beloworigin="true" href='#' data-activates='select-tpltype-win'>固定模版</a>
                                <ul id='select-tpltype-win' className='dropdown-content'>
                                    <li onClick={this.onTypeclickwin.bind(this,100,'全部')}><a >全部</a></li>
                                    <li onClick={this.onTypeclickwin.bind(this,0,'固定模版')}><a>固定模版</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="line-box">
                    <div className="line-title">
                        <span>模版内容</span>
                    </div>
                    <div className="line">
                        <div className="qrcode-name">
                            <div className="input-box">
                                <textarea onKeyUp={this.onInputSms.bind(this)}  className="smscontent" multiple="multiple" type="text"/>
                            </div>
                            <div className="msg"><span className="txtleft">模版内容不能为空</span><span className="txtright">0</span></div>
                        </div>
                    </div>
                </div>

                <div className="line-box">
                    <div className="line-title">
                    </div>
                    <div className="line">
                        <div className="intro-box">
                            <p>* 短信内容必须合法，不能发送房产、发票等国家法律法规严令禁止的内容。</p>
                            <p>* 如有链接，请将链接地址写于短信内容中，便于核实。</p>
                            <p>* 短信字数&lt;=70个字，按照70个字一条短信计算,变量短信根据所变换的内容长度计算。</p>
                            <p>* 短信字数>70个字，即为长短信，按照67个字记为一条短信计算。</p>
                            <p>* 短信内容无需添加签名，内容首尾不能加【】。</p>
                            <p>* 变量均用&#123;s&#125;代替，短信发送时根据顺序依次替换为变量内容。</p>
                            <p>* 短信内容中每个变量&#123;s&#125;按6个字计算短信长度，发送时每条短信按实际变量内容长度计算字数。</p>
                            <p>* 短信字数统计由签名+短信内容+退订回复（营销短信需要）组成，请预留字数避免发送长短信。</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


class MaterialAssetTpl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 10,
            index: 1,
            content:'',
            channel_type:0,
            type:0,
            listData: [],
            colName: [],
            titleData: [{
                /*  {name: '审核通过',count:2000},*/
                /* {name: '审核驳回',count:2000},*/
                /* {name: '审核中',count:2000},*/
                name: '全部',count:0}
            ],
            typewin:0
        };

        this.postList = this.postList.bind(this);
        this.onSelectchannel = this.onSelectchannel.bind(this);
        this.onSelectType = this.onSelectType.bind(this);
        this.onSearchContent = this.onSearchContent.bind(this);
        this.onSelectTypeWin =  this.onSelectTypeWin.bind(this);

    }
    componentDidMount() {
        this.postList();
        this.setPagination();
    }

    //获取列表数据
    postList(opts) {
        let that = this;
        let defOpts = _.extend(this.state, opts || {});
        util.api({
            type: 'get',
            data: {
                method: "mkt.sms.smstemplet.list.get",
                size: defOpts.size,
                index: defOpts.index,
                content:defOpts.content,
                channel_type:defOpts.channel_type,
                type:defOpts.type
            },
            success: function (res) {
                that.setState({
                    listData: res.data,
                    colName: res.col_names,
                    titleData: [{
                        name: '全部',count:res.total_count}
                    ]
                });
                $('.pagination-wrap').pagination('updateItems', res.total_count);

            }
        });
    }
    //渠道类型
    onSelectchannel(param){
        //重置条件框内容
        $('#select-mode-type').text('固定模版');
        $('#search-input').val('');
        this.setState({channel_type:param,index:1 });
        this.setState({content:'',type:0});
        this.postList({channel_type:param,content:'',type:0,index:1});
        this.setPagination();
    }

    //模版类型
    onSelectType(param)
    {
        if(param==100)
        {
            param=null;
        }

        let searchValue = $('#search-input').val();
        this.setState({type:param,index:1,content:searchValue});
        this.postList({type:param,index:1,content:searchValue});
        this.setPagination();
    }

    //模版类型窗口
    onSelectTypeWin(param)
    {
        if(param==100)
        {
            param=null;
        }
        this.setState({typewin:param});
    }

    //查询字符
    onSearchContent(param)
    {
        this.setState({content:param,index:1});
        this.postList({content:param,index:1});
        this.setPagination();
    }
    //模版创建
    addtpl() {
        let that = this;

        let mdtData = [];

        $(".smscontent").val('');
        if (this.customViewModals) {
            this.customViewModals.show();
        } else {
            this.customViewModals = new Modals.Window({
                width:800,
                title: "模板创建",
                content: '<div class="con-body"/>',
                buttons: [
                    {
                        text: '提交模版',
                        cls: 'accept',
                        handler: function (self) {

                            let $smscon =  $('.smscontent');
                            if($smscon.val().trim().length<1)
                            {
                                $('.txtleft').text("模版内容不能为空！");
                                $('.txtleft').show();
                            }
                            else {

                                util.api({
                                    url: "?method=mkt.sms.smstemplet.save",
                                    type: 'post',
                                    data: {
                                        channel_type: that.state.channel_type,
                                        type: that.state.typewin,
                                        content: $smscon.val(),
                                        creator: USER_ID,
                                        update_user: null
                                    },
                                    success: function (res) {
                                        if(res.code ==0)
                                        {
                                            self.close();
                                            that.postList();
                                        }
                                        else {
                                            $('.txtleft').show();
                                            $('.txtleft').text("提交失败");
                                        }

                                    }
                                });
                            }
                        }
                    },
                    {
                        text: '取消',
                        cls: 'decline',
                        handler: function (self) {
                            self.close();
                        }
                    }
                ],
                listeners: {
                    beforeRender: function () {
                        this.addtpl = ReactDOM.render(
                            <AddWindow onSelect={that.onSelectTypeWin}/>,
                            $('.con-body', this.$el)[0]
                        );
                    }
                }
            })
        }
    }

    //实例化分页插件
    setPagination() {
        var that = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: this.state.size,//最多显示页数
                onPageClick: function (pageNumber, event) {
                    that.postList({
                        index: pageNumber
                    });
                }
            });
        }
    }

    render() {
        return (
            <div className="materialasset-tpl">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">模版管理</span>
                    </div>
                    <div  className="button-box">

                        <div className="button-box icon iconfont" >
                            <a href="javascript:window.history.go(-1);" className="a keyong fnbtn-customview"   title="返回">&#xe621;</a>
                        </div>

                        <div className="button-box icon iconfont" >
                            <a className="a keyong fnbtn-customview"  onClick={this.addtpl.bind(this)} title="添加">&#xe63b;</a>
                        </div>
                    </div>
                </header>
                <div className="content">
                    <div className="tab-box">
                        <TabBtnWrap onSelecttype={this.onSelectchannel} />
                    </div>

                    <ConSearch onSearch={this.onSearchContent} onSelect={this.onSelectType} subState={this.state}/>

                    <div className="list-content">
                        <DataListTab state={this.state}/>

                        <DataList colName={this.state.colName} listData={this.state.listData}/>

                        <div className="pagination-wrap pagination"></div>
                    </div>
                </div>
            </div>
        )
    }
}


//渲染
const materialAssetTpl = ReactDOM.render(
    <MaterialAssetTpl />,
    document.getElementById('page-body')
);

module.exports = MaterialAssetTpl;
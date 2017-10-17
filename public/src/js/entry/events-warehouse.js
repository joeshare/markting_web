/**
 * Created by AnThen on 2017/1/12.
 * 事件中心-事件库列表 es6+react版
 */

//构造页面
import Layout from 'module/layout/layout';

//先创建布局
const layout = new Layout({
    index: 2,
    leftMenuCurName:'事件库'
});

//插件
//分页插件
let pagination = require('plugins/pagination')($);

//集成模块
//table loading
import TbodyLoading from 'module/table-common/table-loading';
//table 暂无数据
import TbodyFalse from 'module/table-common/table-false';
//整行提示
import PointOut from 'module/point-out/point-out';

//编写页面模块
class SubHead extends React.Component{
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">事件库</span>
                    <span className="text">
                        共包含事件<span className="variable">{this.props.eventAll}</span>个
                    </span>
                </div>
            </header>
        )
    }
}
//表格
class TbodyTrue extends React.Component{
    examine(id){
        window.location.href = BASE_PATH+'/html/events/action.html?id='+id;
    }
    render() {
        return (
            <tbody className="uat-eventwarehouse-tbody">
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td className="first uat-eventwarehouse-td" title={m.name}>{m.name}</td>
                        <td className="uat-eventwarehouse-td">{m.channel}</td>
                        <td className="uat-eventwarehouse-td">{m.platform}</td>
                        <td className="uat-eventwarehouse-td">{m.source}</td>
                        <td className="uat-eventwarehouse-td">{m.system_event}</td>
                        <td className="bind uat-eventwarehouse-td">{m.bind_count}</td>
                        <td>
                            <div className="switch">
                                <label>
                                    <input disabled={m.subscribedDo} checked={m.subscribed} type="checkbox" onClick={()=>{
                                        let newRadios = _.clone(this.props.data);
                                        let thisSubscribed;
                                        m.subscribed ? thisSubscribed=false : thisSubscribed=true;
                                        newRadios.map((item) => {
                                            if(item.id == m.id){item.subscribed=thisSubscribed}
                                        });
                                        this.props.resetSubscribed({
                                            newRadios:newRadios,
                                            objt:m
                                        });
                                    }}/>
                                    <span className="lever"></span>
                                </label>
                            </div>
                        </td>
                        <td className="operation">
                            <ico className="pointer icon iconfont r-btn dropdown-button moreico" data-activates={"morelist"+m.id} data-constrainwidth="false">&#xe675;</ico>
                            <ul id={"morelist"+m.id} className="dropdown-content setuplist">
                                <li onClick={this.examine.bind(this,m.id)}>
                                    <i className="icon iconfont">&#xe651;</i>
                                    <a href="javascript:void(0)">查看行为记录</a>
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
class Manage extends React.Component{
    dropdownButton(){
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: true,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
    }
    tabChange(tab){
        let events = this.state.events;
        events[0].classname = '';
        events[1].classname = '';
        events[2].classname = '';
        switch (tab){
            case 'channel1':
                events[0].classname = ' active';
                break;
            case 'channel2':
                events[1].classname = ' active';
                break;
            case 'channel3':
                events[2].classname = ' active';
                break;
        }
        $('#search-input').val('');
        this.setState({events:events,index:1});
        this.fetchSource(tab);
    }
    resetChannel(id,name){
        $('#search-input').val('');
        let source = {id:id,name:name};
        let tableParam = this.getParam();
        tableParam.source = source;
        this.setState({source:source,index:1});
        tableParam.index = 1;
        this.fetchTable(tableParam);
        this.setPagination();
    }
    resetSubscribed(param){
        let that = this;
        util.api({
            surl: EVENT_PATH+"?method=mkt.event.subscribe",
            type: 'post',
            data: {
                event_id:param.objt.id,
                subscribe:param.objt.subscribed
            },
            success: function (res) {
                if(res.code == 0){
                    that.setState({tbodyModule:<TbodyTrue data={param.newRadios} resetSubscribed={that.resetSubscribed}/>});
                }else{
                    Materialize.toast('订阅操作失败！', 2000);
                }
            },error: function () {
                Materialize.toast('订阅操作失败！', 2000);
            }
        });
    }
    searchInput(){
        let param = this.getParam();
        this.fetchTable(param);
    }
    fetchEventCount(){
        let that = this;
        let thisData,event1st,event2st,event3st,eventAll;
        let stateEvents = this.state.events;

        util.api({
            surl: EVENT_PATH,
            data: {
                method: 'mkt.event.eventModel.count'
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    eventAll = util.numberFormat(thisData.event_total_count);
                    event1st = util.numberFormat(thisData.event_1st_channel_count);
                    event2st = util.numberFormat(thisData.event_2nd_channel_count);
                    event3st = util.numberFormat(thisData.event_3rd_channel_count);
                    stateEvents[0].num = event1st;
                    stateEvents[1].num = event2st;
                    stateEvents[2].num = event3st;
                    that.setState({
                        eventAll:eventAll,
                        events:stateEvents
                    });
                }
            }
        });
    }
    fetchSource(channel){
        let that = this;
        let total,thisData;
        let sourceName,sourceSelect = [];
        let tableParam,size = this.state.size;
        util.api({
            surl: EVENT_PATH,
            data: {
                method: 'mkt.event.source.list',
                channel: channel
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    total = res.total;
                    if(total > 0){
                        for(let i=0;i<total;i++){
                            if(i == 0){sourceName = {id:thisData[i].id,name:thisData[i].name}}
                            sourceSelect[i] = {id:thisData[i].id,name:thisData[i].name};
                        }
                        that.setState({
                            source:sourceName,
                            sourceSelect:sourceSelect
                        });
                        tableParam = {channel:channel,source:sourceName,index:1,size:size,searchText:''};
                        that.fetchTable(tableParam);
                    }else{
                        that.setState({
                            source:{id:'',name:'暂无数据'},
                            sourceSelect:[],
                            tbodyModule:<TbodyFalse colspan={8} tbodyClassName={'uat-eventwarehouse-tbody'}/>
                        });
                    }
                    that.setPagination();
                }else{
                    that.setState({
                        source:{id:'',name:'暂无数据'},
                        sourceSelect:[],
                        tbodyModule:<TbodyFalse colspan={8} tbodyClassName={'uat-eventwarehouse-tbody'}/>
                    });
                }
            },error: function () {
                that.setState({
                    source:{id:'',name:'暂无数据'},
                    sourceSelect:[],
                    tbodyModule:<TbodyFalse colspan={8} tbodyClassName={'uat-eventwarehouse-tbody'}/>
                });
            }
        });
    }
    fetchTable(param){
        let that = this;
        let total=0,totalCount=0,thisData=[];
        util.api({
            surl: EVENT_PATH,
            data: {
                method: 'mkt.event.eventModel.list',
                channel:param.channel,
                source_id:param.source.id,event_name:param.searchText,
                index:param.index,size:param.size
            },
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={8} tbodyClassName={'uat-eventwarehouse-tbody'}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    total = res.total;
                    totalCount = res.total_count;
                    that.setState({tbodyTotalCount:totalCount});
                    if(total > 0){
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyModule:<TbodyFalse colspan={8} tbodyClassName={'uat-eventwarehouse-tbody'}/>});
                    }
                    $('.pagination-wrap').pagination('updateItems', totalCount);
                }else{
                    that.setState({tbodyTotalCount:0});
                    that.setState({tbodyModule:<TbodyFalse colspan={8} tbodyClassName={'uat-eventwarehouse-tbody'}/>});
                }
            },error: function () {
                that.setState({tbodyTotalCount:0});
                that.setState({tbodyModule:<TbodyFalse colspan={8} tbodyClassName={'uat-eventwarehouse-tbody'}/>});
            }
        });
    }
    formatTbodyData(total,thisData){
        let tbodyData = [],channel,systemEvent,bindCount;
        for(let i=0; i<total; i++){
            switch (thisData[i].channel){
                case 'channel1':
                    channel = '一方事件';
                    break;
                case 'channel2':
                    channel = '二方事件';
                    break;
                case 'channel3':
                    channel = '三方事件';
                    break;
            }
            if(thisData[i].system_event){systemEvent='是'}else{systemEvent='否'}
            bindCount = util.numberFormat(thisData[i].bind_count);
            tbodyData[i] = {
                id:thisData[i].id,
                name:thisData[i].name,
                channel:channel,
                platform:thisData[i].platform,
                source:thisData[i].source,
                system_event:systemEvent,
                bind_count:bindCount,
                subscribed:thisData[i].subscribed,
                subscribedDo:!(thisData[i].unsubscribable)
            };
        }
        this.setState({tbodyModule:<TbodyTrue data={tbodyData} resetSubscribed={this.resetSubscribed}/>});
        this.dropdownButton();
    }
    setPagination(){
        let that = this;
        let tableParam;
        let thisSize = this.state.size;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    that.setState({index:pageNumber});
                    tableParam = that.getParam();
                    tableParam.index = pageNumber;
                    that.fetchTable(tableParam);
                }
            });
        }
    }
    getParam(){
        let events = this.state.events,channel;
        let source = this.state.source;
        let searchText = $('#search-input').val().trim(),
            index = this.state.index,
            size = this.state.size;
        let tableParam;
        for(let i=0; i<3; i++){
            if(events[i].classname == ' active'){
                channel = 'channel'+(i+1);
                break;
            }
        }
        tableParam = {
            channel:channel,source:source,
            searchText:searchText,
            index:index,size:size
        };
        return tableParam;
    }
    constructor(props){
        super(props);
        this.state = {
            eventAll:0,
            events: [
                {num:0,classname:' active'},
                {num:0,classname:''},
                {num:0,classname:''}
            ],
            source:{id:'',name:''},
            sourceSelect:[{id:'',name:''}],
            pointOut:{
                icon:'',back:'',
                text:'本页包含所有被注册的合法事件，您可以针对感兴趣的事件进行订阅，订阅后将对事件进行监听，追踪用户行为。'
            },
            index:1,size:10,search:'',
            tbodyModule:<TbodyFalse colspan={8} tbodyClassName={'uat-eventwarehouse-tbody'}/>,
            tbodyTotalCount:0
        };
        this.resetSubscribed = this.resetSubscribed.bind(this);
    }
    componentDidMount(){
        this.fetchEventCount();
        this.fetchSource('channel1');
        this.setPagination();
        this.dropdownButton();
    }
    render() {
        return (
            <div className="warehouse">
                <SubHead eventAll={this.state.eventAll}/>
                <div className="content">
                    <div className="tabs-box">
                        <div className={"tab"+this.state.events[0].classname} onClick={this.tabChange.bind(this,'channel1')}>
                            <div className="iconfont icon">&#xe656;</div>
                            <div className="info">
                                <div className="num">{this.state.events[0].num}</div>
                                <div className="tit">一方事件</div>
                            </div>
                        </div>
                        <div className={"tab"+this.state.events[1].classname} onClick={this.tabChange.bind(this,'channel2')}>
                            <div className="iconfont icon">&#xe630;</div>
                            <div className="info">
                                <div className="num">{this.state.events[1].num}</div>
                                <div className="tit">二方事件</div>
                            </div>
                        </div>
                        <div className={"tab"+this.state.events[2].classname} onClick={this.tabChange.bind(this,'channel3')}>
                            <div className="iconfont icon">&#xe6b7;</div>
                            <div className="info">
                                <div className="num">{this.state.events[2].num}</div>
                                <div className="tit">三方事件</div>
                            </div>
                        </div>
                    </div>
                    <div className="condition">
                        <div className="channel">
                            <div className="title">事件来源</div>
                            <div className="r-btn dropdown-button selectbtn" data-activates="sourcelist" data-constrainwidth="false">{this.state.source.name}</div>
                            <ul id="sourcelist" className="dropdown-content" style={{"width":"auto"}}>
                                {this.state.sourceSelect.map((m,i)=> {
                                    return(
                                        <li onClick={this.resetChannel.bind(this,m.id,m.name)}>{m.name}</li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="search-area">
                            <div className="search-box">
                                <input id="search-input" type="text" className="input" maxLength="50" placeholder="请输入事件名称" onChange={this.searchInput.bind(this)}/>
                                <div className="iconfont icon">&#xe668;</div>
                            </div>
                        </div>
                    </div>
                    <div className="point-out-box">
                        <PointOut param={this.state.pointOut}/>
                    </div>
                    <div className="table-area">
                        <table className="page-table-box uat-eventwarehouse-table">
                            <thead>
                            <tr>
                                <th className="first">事件名称</th>
                                <th>事件途径</th>
                                <th>事件平台</th>
                                <th>事件来源</th>
                                <th>预置事件</th>
                                <th>营销事件绑定</th>
                                <th>事件订阅</th>
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
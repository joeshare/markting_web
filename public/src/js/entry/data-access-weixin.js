/**
 * Created by AnThen on 2016-7-20.
 * 微信接入 es6+react版
 */
'use strict';//严格模式

/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'微信接入'
});

/********插件********/
let Modals = require('component/modals.js');
var EChartsAxis = require('module/echarts/echarts-axis.js');/*加载echarts*/

/********本页公用function********/
function modalsWeixinHtml(modalsTitle,num,modalsList){
    /*初始化变量*/
    let contentHtml;
    let contentHtml1 = "<div class='modals-preview-html'><div class='preview-title'>共同接入";
    let contentHtml2 = "个：</div><div class='list-box'>";
    let contentHtml3 = "";
    let contentHtml4 = "</div></div>";
    /*整理modals数据*/
    for(let i=0; i<num; i++){
        contentHtml3 += "<div class='li'><div class='ico'></div><div class='text'>" + modalsList[i].name + "</div><div class='num'>(" + modalsList[i].count + "人)</div></div>";
    }
    contentHtml = contentHtml1 + modalsTitle + num + contentHtml2 + contentHtml3 + contentHtml4;
    /*输出*/
    new Modals.Window({
        id: "modalsWeixinHtml",
        title: modalsTitle,
        content: contentHtml,
        width: 450,
        height: 320,
        buttons: [],
        listeners: {//window监听事件事件
            open: function () {
                //console.log("open");
            },
            close: function (type) {
                //console.log("close");
            },
            beforeRender: function () {
                //console.log("beforeRender");
            },
            afterRender: function () {
                //console.log("afterRender");
            }
        }
    });
}

/********编写页面模块********/
/****二级头部****/
class SubHead extends React.Component{
    render(){
        return(
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">微信接入</span>
                    <span className="text">
                        已对接公众号<span className="variable">{this.props.data.service + this.props.data.subscribe}</span>个，个人号<span className="variable">{this.props.data.someone}</span>个
                    </span>
                </div>
            </header>
        );
    }
}
/****公共号接入 and 个人号接入****/
class Access extends React.Component{
    render(){
        return(
            <div className="con-top">
                <Mass />
                <Someone />
            </div>
        )
    }
}
/*公共号接入*/
class Mass extends React.Component{
    fetch(){
        let that = this;
        util.api({
            url: "?method=mkt.data.inbound.wechat.public.auth",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.code == 0){
                    that.setState({href:res.data[0].url});
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            ul:[
                '粉丝管理及细分——达到精准触达及营销',
                '公众号监控——查看并分析粉丝轨迹，深度了解粉丝行为'
            ],
            href:''
        };
    }
    componentDidMount(){
        this.fetch();
    }
    render(){
        return(
            <div className="mass">
                <div className="thiscon">
                    <div className="title">接入公众号</div>
                    <ul>
                        {this.state.ul.map((m,i)=> {
                            return (<li className="li">&bull;&nbsp;{m}</li>)
                        })}
                    </ul>
                </div>
                <div className="butorqr-box">
                    <div className="left"></div>
                    <div className="middle">
                        <div className="header">
                            You will know who they are
                        </div>
                        <div className="mid">
                            <div className="border">
                                <div className="left-bor">授权接入</div>
                                <div className="right-bor">标签分析</div>
                            </div>
                            <div className="icon"></div>
                        </div>
                        <div className="but-box">
                            <a className="button-main-2 but" href={this.state.href} target="_blank">授权接入</a>
                        </div>
                    </div>
                    <div className="right"></div>
                </div>
            </div>
        )
    }
}
/*个人号接入*/
class Someone extends React.Component{
    fetch(){
        let obj;
        /*生成二维码13942093706徐宁*/
        h5Persona.login().then(function(obj) {
            obj = obj.data;
            $('#qrcode').qrcode({width: 112,height: 112,text: obj.qrstring});
            //.checklogin方法检查二维码是否被扫描并登录
            h5Persona.checkLogin(function(result) {
                util.api({
                    url: "?method=mkt.data.inbound.wechat.personal.auth",
                    type: 'post',
                    data: {'uuid': obj.uuid,'uin': result},
                    success: function (res) {
                        if(res.code == 0){location.reload() }
                    }
                });
            });
        });
    }
    render(){
        return(
            <div className="someone">
                <div className="thiscon">
                    <div className="title">接入个人号</div>
                </div>
                <div className="robot-box"><img src={IMG_PATH+"/img/data-access/robot.png"}/></div>
                <div className="butorqr-box">
                    <div className="h1">敬请期待，小V的上线！</div>
                    <div className="text">它是有自己风格及魅力的机器人！</div>
                </div>
            </div>
        )
    }
}

/****微信接入监测****/
class Monitor extends React.Component{
    render(){
        let serviceNum = this.props.states.num.service;
        let serviceList = this.props.states.serviceList;
        let subscribeNum = this.props.states.num.subscribe;
        let subscribeList = this.props.states.subscribeList;
        let someoneNum = this.props.states.num.someone;
        let someoneList = this.props.states.someoneList;
        return(
            <div className="con-bottom">
                <div className="title">微信接入监测</div>
                <div className="monitor-area">
                    <Echarts />
                    <div className="list-area">
                        <ListService num={serviceNum} list={serviceList}/>
                        <ListSubscribe num={subscribeNum} list={subscribeList}/>
                        <ListSomeone num={someoneNum} list={someoneList}/>
                    </div>
                </div>
            </div>
        )
    }
}
/*echarts*/
class Echarts extends React.Component{
    fetch(){
        let myChart = echarts.init(document.getElementById('chartstop'));
        myChart.showLoading();
        let data;
        let xAxis,series=new Array(),j=0;
        let chartsData = {
            div:myChart,
            divId:$('#chartstop'),
            title:'',
            backgroundColor: ['#5bd4c7', '#8bc34a', '#64b5f6'],
            xAxis:[],
            yAxisUnit:'{value} 人',
            series:[]
        };
        util.api({
            data: {method: 'mkt.wechat.user.list'},
            success: function (res) {
                if(res.code == 0){
                    data = res.data;
                    if(data.length > 0){
                        for(let i=0; i<data.length; i++){
                            if(data[i].name == 'date'){
                                xAxis = data[i].value_data;
                            }else{
                                series[j] = {name:data[i].name,data:data[i].value_data};
                                j++;
                            }
                        }
                        chartsData.xAxis = xAxis;
                        chartsData.series = series;
                    }
                    EChartsAxis.axis(chartsData);
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {};
    }
    componentDidMount(){
        this.fetch();
    }
    render(){
        return(
            <div className="monitor-box" id="chartstop"></div>
        )
    }
}
/*微信接入列表-服务号*/
class ListService extends React.Component{
    modalsPreview(){
        let num = this.props.num;
        let modalsList = this.props.list;
        let modalsTitle = '服务号';
        modalsWeixinHtml(modalsTitle,num,modalsList);
    }
    render(){
        let num = this.props.num,display = (num > 3)? ' show':'';
        let modalsList = this.props.list,modalsListLength = modalsList.length;
        let showList = [];
        if(modalsListLength>0){
            modalsListLength = (modalsListLength > 3)? 3 : modalsListLength;
            for(let i=0; i<modalsListLength; i++){
                showList[i] = {name:modalsList[i].name,count:modalsList[i].count};
            }
        }
        return(
            <div className="list-box">
                <div className="type-title-box">
                    <div className="type-title">服务号({num})</div>
                    <div className={"selectbtn"+display} onClick={this.modalsPreview.bind(this)}>查看全部</div>
                </div>

                <div className="ul">
                    {showList.map((m,i)=> {
                        return (
                            <div className="li">
                                <div className="ico"></div>
                                <div className="text">{m.name}</div>
                                <div className="num">({m.count}人)</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
/*微信接入列表-订阅号*/
class ListSubscribe extends React.Component{
    modalsPreview(){
        let num = this.props.num;
        let modalsList = this.props.list;
        let modalsTitle = '订阅号';
        modalsWeixinHtml(modalsTitle,num,modalsList);
    }
    render(){
        let num = this.props.num,display = (num > 3)? ' show':'';
        let modalsList = this.props.list,modalsListLength = modalsList.length;
        let showList = [];
        if(modalsListLength>0){
            modalsListLength = (modalsListLength > 3)? 3 : modalsListLength;
            for(let i=0; i<modalsListLength; i++){
                showList[i] = {name:modalsList[i].name,count:modalsList[i].count};
            }
        }
        return(
            <div className="list-box mid">
                <div className="type-title-box">
                    <div className="type-title">订阅号({num})</div>
                    <div className={"selectbtn"+display} onClick={this.modalsPreview.bind(this)}>查看全部</div>
                </div>
                <div className="ul">
                    {showList.map((m,i)=> {
                        return (
                            <div className="li">
                                <div className="ico"></div>
                                <div className="text">{m.name}</div>
                                <div className="num">({m.count}人)</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
/*微信接入列表-个人号*/
class ListSomeone extends React.Component{
    modalsPreview(){
        let num = this.props.num;
        let modalsList = this.props.list;
        let modalsTitle = '订阅号';
        modalsWeixinHtml(modalsTitle,num,modalsList);
    }
    render(){
        let num = this.props.num,display = (num > 3)? ' show':'';
        let modalsList = this.props.list,modalsListLength = modalsList.length;
        let showList = [];
        if(modalsListLength>0){
            modalsListLength = (modalsListLength > 3)? 3 : modalsListLength;
            for(let i=0; i<modalsListLength; i++){
                showList[i] = {name:modalsList[i].name,count:modalsList[i].count};
            }
        }
        return(
            <div className="list-box">
                <div className="type-title-box">
                    <div className="type-title">个人号({num})</div>
                    <div className={"selectbtn"+display} onClick={this.modalsPreview.bind(this)}>查看全部</div>
                </div>
                <div className="ul">
                    {showList.map((m,i)=> {
                        return (
                            <div className="li">
                                <div className="ico"></div>
                                <div className="text">{m.name}</div>
                                <div className="num">({m.count}人)</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
class List extends React.Component{
    render(){
        return(
            <div className="list-area">
            </div>
        )
    }
}

/********组织页面模块********/
class Manage extends React.Component {
    fetchService(size){
        let that = this;
        let listData =  new Array();
        util.api({
            url: "?method=mkt.asset.wechat.type.list.get",
            type: 'get',
            data: {'asset_type':2,'index':1,'size':size},
            success: function (res) {
                if(res.code == 0){
                    for(let i=0; i<res.total; i++){
                        listData[i]={
                            name:res.data[i].asset_name || '',
                            count:res.data[i].follower_count || 0
                        };
                    }
                    that.setState({serviceList:listData});
                }
            }
        });
    }
    fetchSubscribe(size){
        let that = this;
        let listData =  new Array();
        util.api({
            url: "?method=mkt.asset.wechat.type.list.get",
            type: 'get',
            data: {'asset_type':1,'index':1,'size':size},
            success: function (res) {
                if(res.code == 0){
                    for(let i=0; i<res.total; i++){
                        listData[i]={
                            name:res.data[i].asset_name || '',
                            count:res.data[i].follower_count || 0
                        };
                    }
                    that.setState({subscribeList:listData});
                }
            }
        });
    }
    fetchSomeone(size){
        let that = this;
        let listData =  new Array();
        util.api({
            url: "?method=mkt.asset.wechat.type.list.get",
            type: 'get',
            data: {'asset_type':0,'index':1,'size':size},
            success: function (res) {
                if(res.code == 0){
                    for(let i=0; i<res.total; i++){
                        listData[i]={
                            name:res.data[i].asset_name || '',
                            count:res.data[i].follower_count || 0
                        };
                    }
                    that.setState({someoneList:listData});
                }
            }
        });
    }
    fetch(){
        let that = this;
        let serviceNum,subscribeNum,someoneNum;
        util.api({
            url: "?method=mkt.asset.wechat.type.count.get",
            type: 'get',
            async:true,
            data: {},
            success: function (res) {
                if(res.code == 0){
                    for(var i=0;i<res.total; i++){
                        //是个人号 asset_type": 0
                        //服务号的 asset_type": 2
                        //订阅号的 asset_type": 1
                        if(res.data[i].asset_type == '2'){serviceNum = res.data[i].count}
                        if(res.data[i].asset_type == '0'){someoneNum = res.data[i].count}
                        if(res.data[i].asset_type == '1'){subscribeNum = res.data[i].count}
                    }
                    that.setState({
                        num:{
                            service: serviceNum,
                            someone: someoneNum,
                            subscribe: subscribeNum
                        }
                    });
                    that.fetchService(serviceNum);
                    that.fetchSubscribe(subscribeNum);
                    that.fetchSomeone(someoneNum);
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            num:{service:0,someone:0,subscribe:0},
            serviceList:[],someoneList:[],subscribeList:[]
        };
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="weixin">
                <SubHead data={this.state.num}/>
                <div className="content">
                    <Access />
                    <Monitor states={this.state}/>
                </div>
            </div>
        )
    }
}
/********渲染页面********/
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
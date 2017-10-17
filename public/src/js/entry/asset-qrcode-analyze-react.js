/**
 * Created by AnThen on 2016-8-8.
 * 微信二维码-分析 es6+react版
 */

/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName: '微信二维码'
});

/********插件********/
import TbodyLoading from 'module/table-common/table-loading';
/****table 暂无数据****/
import TbodyFalse from 'module/table-common/table-false';
/*时间插件*/
let dateTime = require('module/plan/utils/dateTime.js');
/*echarts*/
let EChartsAxis = require('module/echarts/echarts-axis-datazoom.js');
/*分页插件*/
let pagination = require('plugins/pagination')($);

/********编写页面模块********/
class SubHead extends React.Component{
    gotoLast(){
        window.history.go(-1);
    }
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">微信二维码-分析</span>
                    <span className="text">
                        <span className="variable">
                            {this.props.data.name=='全部'?"":this.props.data.name}
                        </span>
                    </span>
                </div>
                <div className="button-box icon iconfont">
                    <a className="a keyong" title="返回" onClick={this.gotoLast.bind(this)}>
                        <span className="icon iconfont">&#xe621;</span>
                        <span className="text">返回</span>
                    </a>
                </div>
            </header>
        )
    }
}

/****表格Tbody****/
class TbodyTrue extends React.Component{
    render() {
        return (
            <tbody>
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td>{m.subscription}</td>
                        <td>{m.channel}</td>
                        <td>{m.scan_code}</td>
                        <td>{m.scan_code_number}</td>
                        <td>{m.total_attention}</td>
                        <td>{m.new_attention}</td>
                        <td>{m.net_interest}</td>
                        <td>{m.drain_attention}</td>
                    </tr>
                )
            })}
            </tbody>
        )
    }
}
/********组织页面模块********/
class Manage extends React.Component {
    resetExactType(type){
        let thisStartTime,thisEndTime;
        let today = {time:this.state.today.time,classname:''};
        let yesterday = {time:this.state.yesterday.time,classname:''};
        let last7 = {time:[this.state.last7.time[0],this.state.last7.time[1]],classname:''};
        let last30 = {time:[this.state.last30.time[0],this.state.last30.time[1]],classname:''};
        switch (type){
            case 'today':
                thisStartTime = this.state.today.time;
                thisEndTime = this.state.today.time;
                today.classname = 'active';
                break;
            case 'yesterday':
                thisStartTime = this.state.yesterday.time;
                thisEndTime = this.state.yesterday.time;
                yesterday.classname = 'active';
                break;
            case 'last7':
                thisStartTime = this.state.last7.time[0];
                thisEndTime = this.state.last7.time[1];
                last7.classname = 'active';
                break;
            case 'last30':
                thisStartTime = this.state.last30.time[0];
                thisEndTime = this.state.last30.time[1];
                last30.classname = 'active';
                break;
        }
        this.setState({
            today:today,
            yesterday:yesterday,
            last7:last7,
            last30:last30,
            startTime:thisStartTime,
            endTime:thisEndTime,
            timeType:type
        });
        this.fetcTbody(this.state.subscription.acct,this.state.channel.id,thisStartTime,thisEndTime);
        this.fetcTfoot(this.state.subscription.acct,this.state.channel.id,thisStartTime,thisEndTime);
        this.fetcEcharts(this.state.subscription.acct,this.state.channel.id,thisStartTime,thisEndTime,type);
    }
    resetStartDate(){
        let that = this;
        let startTime = this.state.startTime;
        let nowTime = this.state.nowTime,todateNowTime;
        let endTime = this.state.endTime,todateEndTime;
        let maxDate,endDate;
        let thisDate,thisStartTime;
        let $input,picker;
        todateNowTime = util.toDate(nowTime);
        todateEndTime = util.toDate(endTime);
        todateNowTime > todateEndTime ? endDate = todateNowTime : endDate = todateEndTime;
        maxDate = util.formatDate(endDate,3);
        $input = $('#start_date').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 5,
            clear: false,
            onOpen: function () {
                this.set({
                    max: new Date(maxDate)
                });
            },
            onClose: function(){
                endTime = that.state.endTime;
                thisDate = this.get('value');
                thisDate = util.toDate(thisDate);
                thisStartTime = util.formatDate(thisDate,3);
                that.reckonDiffDate(thisStartTime,endTime,nowTime);
            }
        });
        picker = $input.pickadate('picker');
        picker.set('select', new Date(startTime));
    }
    resetEndDate(){
        let that =this;
        let endTime = this.state.endTime;
        let nowTime = this.state.nowTime;
        let startTime = this.state.startTime;
        let thisDate;
        let $input,picker;
        $input = $('#end_date').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 5,
            clear: false,
            max: new Date(nowTime),
            onClose: function(){
                startTime = that.state.startTime;
                thisDate = this.get('value');
                that.reckonDiffDate(startTime,thisDate,nowTime);
            }
        });
        picker = $input.pickadate('picker');
        picker.set({
            'min': new Date(startTime),
            'select': new Date(endTime)
        });
    }
    reckonDiffDate(startTime,endTime,nowTime){
        let diffDate,timeType;
        let today = this.state.today,
            yesterday = this.state.yesterday,
            last7 = this.state.last7,
            last30 = this.state.last30;
        let subscription = this.state.subscription.acct,
            channel = this.state.channel.id;
        today.classname = '';
        yesterday.classname = '';
        last7.classname = '';
        last30.classname = '';
        if(startTime == endTime){
            timeType = "intervalHours";
            diffDate = util.dateDiff(startTime,nowTime);
            switch (diffDate){
                case 0:
                    today.classname = 'active';
                    break;
                case 1:
                    yesterday.classname = 'active';
                    break;
            }
        }else{
            timeType = "intervalDay";
            diffDate = util.dateDiff(startTime,endTime);
            switch (diffDate){
                case 7:
                    last7.classname = 'active';
                    break;
                case 30:
                    last30.classname = 'active';
                    break;
            }
            if(startTime > endTime){
                endTime = startTime;
                today.classname = 'active';
                timeType = "intervalHours";
            }
        }
        this.setState({
            timeType: timeType,
            startTime: startTime,endTime: endTime,
            today: today,yesterday: yesterday,last7: last7,last30: last30
        });
        this.fetcTbody(subscription,channel,startTime,endTime);
        this.fetcTfoot(subscription,channel,startTime,endTime);
        this.fetcEcharts(subscription,channel,startTime,endTime,timeType);
    }
    resetSubscription(acct,name){
        let subscription = {acct:acct,name:name};
        this.setState({subscription:subscription});
        this.fetcTbody(acct,this.state.channel.id,this.state.startTime,this.state.endTime);
        this.fetcTfoot(acct,this.state.channel.id,this.state.startTime,this.state.endTime);
        this.fetcEcharts(acct,this.state.channel.id,this.state.startTime,this.state.endTime,this.state.timeType);
    }
    resetChannel(id,name){
        let channel = {id:id,name:name};
        this.setState({channel:channel});
        this.fetcTbody(this.state.subscription.acct,id,this.state.startTime,this.state.endTime);
        this.fetcTfoot(this.state.subscription.acct,id,this.state.startTime,this.state.endTime);
        this.fetcEcharts(this.state.subscription.acct,id,this.state.startTime,this.state.endTime,this.state.timeType);
    }
    fetchNowTime(){
        let that = this;
        let time,nowTime;
        util.api({
            data: {method: 'mkt.material.coupon.systemtime'},
            success: function (res) {
                if(res.code == 0){
                    time = (res.data[0].time)/1000;
                    nowTime = util.formatDate(time,3);
                    that.setState({nowTime:nowTime});
                }
            }
        });
    }
    fetchTime(){
        let id = util.geturlparam('id');
        let that = this;
        let thisData,today,yesterday,last7,last30,subscription={acct:0,name:'全部'},channel={id: 0,name:'全部'};

        util.api({
            data: {method:'mkt.weixin.analysis.date',qrcode_id:id},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    today = {time:thisData.Today.Today,classname:''};
                    yesterday = {time:thisData.Yestoday.Yestoday,classname:''};
                    last7 = {time:[thisData.Day7.StarDate,thisData.Day7.EndDate],classname:'active'};
                    last30 = {time:[thisData.Day30.StarDate,thisData.Day30.EndDate],classname:''};
                    if(thisData.wx_acct != ''){
                        subscription={acct:thisData.wx_acct,name:thisData.wxmp_name};
                    }
                    if(thisData.ch_code != ''){
                        channel={id:thisData.ch_code,name:thisData.ch_name};
                    }
                    that.setState({
                        id: id,
                        today: today,
                        yesterday: yesterday,
                        last7: last7,
                        last30: last30,
                        startDate: thisData.RecordScope.StarDate,
                        endDate: thisData.RecordScope.EndDate,
                        timeType:"last7",
                        startTime: last7.time[0],
                        endTime: last7.time[1],
                        subscription:subscription,
                        channel:channel
                    });
                    that.fetcTbody(subscription.acct,channel.id,last7.time[0],last7.time[1]);
                    that.fetcTfoot(subscription.acct,channel.id,last7.time[0],last7.time[1]);
                    that.fetcEcharts(subscription.acct,channel.id,last7.time[0],last7.time[1],"last7");
                }
            }
        });
    }
    fetchSubscription(){
        let that = this;
        let subscription = [];
        let thisData;

        util.api({
            data: {method: 'mkt.weixin.register.list'},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<res.total; i++){
                        subscription[i] = {name: thisData[i].name, acct:thisData[i].wx_acct}
                    }
                    subscription[res.total] = {acct:0,name:'全部'};
                    that.setState({subscriptionList:subscription});
                }
            }
        });
    }
    fetchChannel(){
        let that = this;
        let channel = [],trueI=0,channelFalse=[],channelLast=[],falseI=0;
        let thisData,thisSystem=false;

        let subscription = this.state.subscription.acct,
            stateChannel = this.state.channel.id,
            startTime = this.state.startTime,
            endTime = this.state.endTime;

        util.api({
            data: {method: 'mkt.weixin.channel.list'},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<thisData.length; i++){
                        if(thisData[i].channel_type == 0){
                            thisSystem=true;
                            channel[trueI] = {
                                id: thisData[i].channel_id,
                                name:thisData[i].channel_name
                            };
                            trueI++;
                        }else{
                            thisSystem=false;
                            channelFalse[falseI] = {
                                id: thisData[i].channel_id,
                                name:thisData[i].channel_name
                            };
                            falseI++;
                        }
                    }
                    channelLast[falseI++] = {id:0,name: '全部'};
                    channelFalse = channelFalse.concat(channelLast);
                    channel = channel.concat(channelFalse);
                    that.setState({channelList:channel,update:true});
                }
            }
        });
    }
    formatEchartsData(data){
        let myChart = echarts.init(document.getElementById('echarts-box'));
        myChart.showLoading();

        let resData,remainder,xAxisNum;
        let legendData=[];
        let chartsData = {
            div: myChart,
            divId:$('#echarts-box'),
            title: '每日关注量分布',
            legend: {
                y: 'top',x: 'right',orient: 'horizontal',
                data: []
            },
            xAxis: [],
            series: []
        };
        if(data){
            resData = data;
            for(let i=0; i<resData.series.length; i++){
                legendData[i] = resData.series[i].name;
            }
            chartsData.legend.data = legendData;
            chartsData.xAxis = resData.date;
            chartsData.series = resData.series;
        }
        EChartsAxis.axis(chartsData);
    }
    fetcEcharts(subscription,channel,startTime,endTime,timeType){
        let that = this;
        if(startTime == endTime){
            util.api({
                data: {
                    method: "mkt.weixin.analysis.hours.list",
                    date: startTime,
                    wx_name: subscription,
                    ch_code: channel,
                    days_type: timeType
                },
                success: function (res) {
                    if(res.code == 0){
                        that.formatEchartsData(res.data[0])
                    }
                }
            });
        }else{
            util.api({
                data: {
                    method: "mkt.weixin.analysis.days.list",
                    start_date: startTime,
                    end_date: endTime,
                    wx_name: subscription,
                    ch_code: channel,
                    days_type: timeType
                },
                success: function (res) {
                    if(res.code == 0){
                        that.formatEchartsData(res.data[0])
                    }
                }
            });
        }
    }
    formatTbodyData(total,data){
        let thisData = data;
        let tbodyData = [];
        for(let i=0; i<total; i++){
            tbodyData[i] = {
                subscription:thisData[i].wx_name,
                channel:thisData[i].ch_name,
                scan_code:thisData[i].total_scan,
                scan_code_number:thisData[i].total_scan_user,
                total_attention:thisData[i].total_focus,
                new_attention:thisData[i].new_focus,
                net_interest:thisData[i].add_focus,
                drain_attention:thisData[i].lost_focus
            };
        }
        this.setState({
            tbodyTbodyModule:<TbodyTrue data={tbodyData}/>
        });
    }
    fetcTbody(subscription,channel,startTime,endTime){
        let that = this;
        let total=0,thisData=[];

        util.api({
            data: {
                method: 'mkt.weixin.analysis.chdata.list',
                wx_name: subscription,
                ch_code: channel,
                start_date: startTime,
                end_date: endTime
            },
            beforeSend: function () {
                that.setState({tbodyTbodyModule:<TbodyLoading colspan={8}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total);
                    thisData = res.data;
                    if(total>0){
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyTbodyModule:<TbodyFalse colspan={8}/>});
                    }
                }else{
                    that.setState({tbodyTbodyModule:<TbodyFalse colspan={8}/>});
                }
            },
            error: function () {
                that.setState({tbodyTbodyModule:<TbodyFalse colspan={8}/>});
            }
        });
    }
    fetcTfoot(subscription,channel,startTime,endTime){
        let that = this;
        let thisData = [],average,sum,max;
        util.api({
            data: {
                method: 'mkt.weixin.analysis.chdata.summary',
                wx_name: subscription,
                ch_code: channel,
                start_date: startTime,
                end_date: endTime
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    average = thisData.average;
                    sum = thisData.sum;
                    max = thisData.max;
                    that.setState({average:average,sum:sum,max:max});
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            today:{time:'',classname:''},
            yesterday:{time:'',classname:''},
            last7:{time:['',''],classname:'active'},
            last30:{time:['',''],classname:''},
            startDate:'',
            endDate:'',
            startTime:'',
            endTime:'',
            timeType:"last7",
            nowTime:'',
            subscription:{acct:0,name:'全部'},
            subscriptionList:[],
            channel:{id:0,name:'全部'},
            channelList:[],
            index: 1, size: 3,
            tbodyTbodyModule:<TbodyFalse colspan={8}/>,
            average:{amount_focus:0,lost_focus:0,amount_scan:0,new_focus:0,add_focus:0,amount_scan_user:0},
            sum:{amount_focus:0,lost_focus:0,amount_scan:0,new_focus:0,add_focus:0,amount_scan_user:0},
            max:{new_focus_date:"",amount_focus:"",lost_focus:"",amount_scan_user_date:"",amount_scan:"",new_focus:"",lost_focus_date:"",amount_focus_date:"",add_focus:"",amount_scan_date:"",amount_scan_user:"",add_focus_date:""}
        };
    }
    componentDidMount(){
        this.fetchNowTime();
        this.fetchTime();
        this.fetchSubscription();
        this.fetchChannel();
    }
    render(){
        return (
            <div className="qrcode-analyze">
                <SubHead data={this.state.subscription}/>
                <div className="content">
                    <div className="search-head">
                        <div className="time-area">
                            <div className="exact-area">
                                <div className={"exact-box "+this.state.today.classname} onClick={this.resetExactType.bind(this,'today')}>今日</div>
                                <div className={"exact-box "+this.state.yesterday.classname} onClick={this.resetExactType.bind(this,'yesterday')}>昨日</div>
                                <div className={"exact-box "+this.state.last7.classname} onClick={this.resetExactType.bind(this,'last7')}>最近7日</div>
                                <div className={"exact-box "+this.state.last30.classname} onClick={this.resetExactType.bind(this,'last30')}>最近30天</div>
                            </div>
                            <div className="period-area">
                                <div className="period-box" onClick={this.resetStartDate.bind(this)}>
                                    <input type="text" readOnly value={this.state.startTime} className="input" id="start_date"/>
                                    <div className="icon iconfont">&#xe6ae;</div>
                                </div>
                                <div className="zhi">至</div>
                                <div className="period-box" onClick={this.resetEndDate.bind(this)}>
                                    <input type="text" readOnly value={this.state.endTime} className="input" id="end_date"/>
                                    <div className="icon iconfont">&#xe6ae;</div>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown-area">
                            <div className="selectbtn-box">
                                <div className="title">渠道分类</div>
                                <div className="dropdown-button selectbtn" data-constrainwidth="false" data-activates="channel-list" data-beloworigin="true">{this.state.channel.name}</div>
                                <ul id="channel-list" className="dropdown-content" style={{'width':'auto'}}>
                                    {this.state.channelList.map((m,i)=> {
                                        return (
                                            <li onClick={this.resetChannel.bind(this,m.id,m.name)}>{m.name}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="selectbtn-box">
                                <div className="title">公众号</div>
                                <div className="dropdown-button selectbtn" data-constrainwidth="false" data-activates="subscription-list" data-beloworigin="true">{this.state.subscription.name}</div>
                                <ul id="subscription-list" className="dropdown-content" style={{'width':'auto'}}>
                                    {this.state.subscriptionList.map((m,i)=> {
                                        return(
                                            <li onClick={this.resetSubscription.bind(this,m.acct,m.name)}>{m.name}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="echarts-area">
                        <div className="echarts-box" id="echarts-box"></div>
                    </div>
                    <div className="table-area">
                        <div className="table-box">
                            <table className="page-table-box">
                                <thead>
                                <tr>
                                    <th className="first">公众号</th>
                                    <th>渠道</th>
                                    <th>总扫码次数</th>
                                    <th>总扫码人数</th>
                                    <th>总关注数</th>
                                    <th>新增关注</th>
                                    <th>净增关注</th>
                                    <th>流失关注</th>
                                </tr>
                                </thead>
                                {this.state.tbodyTbodyModule}
                                <tfoot className="tfoot-box">
                                <tr>
                                    <td>平均</td>
                                    <td>&minus;&minus;</td>
                                    <td>{this.state.average.amount_scan}</td>
                                    <td>{this.state.average.amount_scan_user}</td>
                                    <td>{this.state.average.amount_focus}</td>
                                    <td>{this.state.average.new_focus}</td>
                                    <td>{this.state.average.add_focus}</td>
                                    <td>{this.state.average.lost_focus}</td>
                                </tr>
                                <tr>
                                    <td>汇总</td>
                                    <td>&minus;&minus;</td>
                                    <td>{this.state.sum.amount_scan}</td>
                                    <td>{this.state.sum.amount_scan_user}</td>
                                    <td>{this.state.sum.amount_focus}</td>
                                    <td>{this.state.sum.new_focus}</td>
                                    <td>{this.state.sum.add_focus}</td>
                                    <td>{this.state.sum.lost_focus}</td>
                                </tr>
                                <tr>
                                    <td>历史最高</td>
                                    <td>&minus;&minus;</td>
                                    <td>{this.state.max.amount_scan}<br/>
                                        {this.state.max.amount_scan_date}
                                    </td>
                                    <td>{this.state.max.amount_scan_user}<br/>
                                        {this.state.max.amount_scan_user_date}
                                    </td>
                                    <td>{this.state.max.amount_focus}<br/>
                                        {this.state.max.amount_focus_date}
                                    </td>
                                    <td>{this.state.max.new_focus}<br/>
                                        {this.state.max.new_focus_date}
                                    </td>
                                    <td>{this.state.max.add_focus}<br/>
                                        {this.state.max.add_focus_date}
                                    </td>
                                    <td>{this.state.max.lost_focus}<br/>
                                        {this.state.max.lost_focus_date}
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
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

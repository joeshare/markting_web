/**
 * Created by AnThen on 2016/10/17.
 * 微信二维码-列表 es6+react版
 */
/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'任务中心'
});

/********插件********/
/*echarts插件*/
var EChartsLadder = require('module/echarts/echarts-ladder.js');
/*弹层插件*/
let Modals = require('component/modals.js');
/*分页插件*/
let pagination = require('plugins/pagination')($);

/********编写页面模块********/
/****二级头部****/
class SubHead extends React.Component{
    gotoLast(){
        window.history.go(-1);
    }
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">任务详情</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" id="goIndex" title="返回" onClick={this.gotoLast.bind(this)}>
                        <span className="icon iconfont">&#xe621;</span>
                        <span className="text">返回</span>
                    </a>
                    <a className="a keyong" style={{display:'none'}} href={BASE_PATH+'/html/message-app/message-marketingmessage.html'} title="新建短信任务">
                        <span className="icon iconfont">&#xe63b;</span>
                        <span className="text">新建任务</span>
                    </a>
                </div>
            </header>
        )
    }
}
/****短信测试****/
class MsgTest extends React.Component{
    render() {
        return (
            <div className="modals-test-html">
                <div className='line'>
                    <div className='test-title'>收信号码：</div>
                    <div className='test-cont'>
                        <div className="input-box">
                            <input type="text" id="test-phone-val" className="input" placeholder="多个手机号码中间用“,”隔开（最多测试5个手机号）"/>
                        </div>
                        <div className="hint" id="test-phone-hint">
                            <span className="iconfont">&#xe60a;</span>
                            <span id="huitPhoneText"></span>
                        </div>
                    </div>
                </div>
                <div className='line'>
                    <div className='test-title'>短信内容：</div>
                    <div className='test-cont test-cont-msg'>
                        <div className='line'>
                            <textarea id="test-msg-val" className="msg" placeholder="请编辑测试短信内容，字数最多70个" maxLength="70"></textarea>
                            <div className="hint" id="test-msg-hint">
                                <span className="iconfont">&#xe60a;</span>
                                <span id="huitMsgText"></span>
                            </div>
                        </div>
                        <div className='line'>短信内容为任务创建时配置内容</div>
                    </div>
                </div>
            </div>
        )
    }
}
/****表格****/
class TbodyFalse extends React.Component{
    render() {
        return (
            <tbody>
            <tr>
                <td style={{textAlign:'center',width:'100%'}} colSpan='6'>暂无数据</td>
            </tr>
            </tbody>
        )
    }
}
class TbodyTrue extends React.Component{
    view(id,number,phone_number,msg,time){
        /*初始化变量*/
        let contentHtml;
        /*组织modals数据*/
        contentHtml = "<div class='modals-view-html'><div class='line'><div class='view-title'>发信号码：</div><div class='view-cont'>"+number+"</div></div><div class='line'><div class='view-title'>收信号码：</div><div class='view-cont'>"+phone_number+"</div></div><div class='line'><div class='view-title'>短信内容：</div><div class='view-cont view-cont-msg'><div class='line msg'>"+msg+"</div><div class='line'>"+time+"&nbsp;发送</div></div></div></div>";
        /*输出*/
        new Modals.Window({
            id: "modalsViewHtml",
            title: '短信详情',
            content: contentHtml,
            width: 706,//默认是auto
            height: 296,//默认是auto
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
    render() {
        return (
            <tbody>
            {this.props.data.map((m,i)=> {
                return (
                <tr>
                    <td className="first" style={{'text-indent':m.number.style}}>{m.number.text}</td>
                    <td>{m.phone_number}</td>
                    <td className="td-msg">{m.msg}</td>
                    <td>{m.time}</td>
                    <td style={{color:m.statusColor}}>{m.thisStatus}</td>
                    <td><a href="javascript:void(0)" onClick={this.view.bind(this,m.id,m.number.text,m.phone_number,m.msg,m.time)}>查看</a></td>
                </tr>
                )
            })}
            </tbody>
        )
    }
}

/********组织页面模块********/
class Manage extends React.Component {
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
    fetchTask(id,time,taskState,name,totalcovernum){
        /*初始化数据*/
        let classname = '',text = '',play = '',del = '';
        /*整理数据*/
        time = util.formatDate(time);
        switch (taskState){
            case 0:
                classname = 'statu-gray';
                text = '未启动';
                del = 'keyong';
                totalcovernum > 0 ? play = ' keyong' : play = ' bukeyong';
                break;
            case 1:
                classname = 'statu-purple';
                text = '已预约';
                del = 'keyong';
                totalcovernum > 0 ? play = ' keyong' : play = ' bukeyong';
                break;
            case 2:
                classname = 'statu-cyan';
                text = '执行中';
                play = ' bukeyong';
                del = 'bukeyong';
                break;
            case 3:
                classname = 'statu-yellow';
                text = '暂停中';
                del = 'keyong';
                totalcovernum > 0 ? play = ' keyong' : play = ' bukeyong';
                break;
            case 4:
                classname = 'statu-dark-gray';
                text = '已结束';
                play = ' bukeyong';
                del = 'keyong';
                break;
        }
        /*run*/
        this.setState({
            task:{
                id:id,
                time:time,
                name:name,
                taskState:{classname:classname,text:text}
            },
            play:play,
            del:del
        });
    }
    EchartsDataLadder(i,num){
        let re;
        let upNumSum=0;
        if(i==0){
            re = 0;
        }else{
            for(let j=i; j>0; j--){
                upNumSum = upNumSum + num[j];
            }
            re = num[0] - upNumSum;
        }
        return re;
    }
    formatEchartsData(data){
        let myChart = echarts.init(document.getElementById('echarts-box'));
        myChart.showLoading();

        let resData,data1Data=[],data2,data2Data=[];
        let chartsData = {
            div: myChart,
            divId:$('#echarts-box'),
            title: '短信任务发送状态监测',
            xAxis: [],
            series: []
        };

        resData = data;
        chartsData.xAxis = resData.xAxis;
        for(let i=0; i<resData.data.length; i++){
            data2Data[i] = resData.data[i];
            data1Data[i] = this.EchartsDataLadder(i,resData.data);
        }
        data2 = {
            name: '条数',
            data:data2Data
        };
        chartsData.series = {data1:data1Data,data2:data2};
        EChartsLadder.ladder(chartsData);
    }
    fetchEcharts(totalcovernum,sendingsuccessnum,sendingfailnum,waitingnum){
        this.setState({
            echarts:{
                totalCover:totalcovernum,
                successNum:sendingsuccessnum,
                failnum:sendingfailnum,
                waitingnum:waitingnum
            }
        });
        let data = {
            "data":[totalcovernum,sendingsuccessnum,sendingfailnum,waitingnum],
            "xAxis":["总覆盖","发送成功","发送失败","等待处理"]
        };
        this.formatEchartsData(data);
    }
    startUp(id){
        let that = this;
        if(!$('#play-task').hasClass('bukeyong')){
            util.api({
                url: "?method=mkt.sms.smstaskhead.publish",
                type: 'post',
                data: {sms_task_head_id: id},
                success: function (res) {
                    if(res.code == 0){
                        that.setState({
                            play:'bukeyong',
                            del:'bukeyong'
                        });
                    }else{
                        new Modals.Alert(res.msg);
                    }
                }
            });
        }
    }
    delete(id){
        if(!$('#del-task').hasClass('bukeyong')){
            util.api({
                url: "?method=mkt.sms.task.delete",
                type: 'post',
                data: {id: id},
                success: function (res) {
                    if(res.code == 0){
                        window.location.href = BASE_PATH+"/html/message-app/message-taskcenter.html";
                    }else{
                        new Modals.Alert(res.msg);
                    }
                }
            });
        }
    }
    msgTest(){
        new Modals.Window({
            id: "modalsTestHtml",
            title: '短信白名单测试',
            content: "<div class='con-body'/>",
            width: 706,//默认是auto
            height: 444,//默认是auto
            buttons: [
                {
                    text: '发送',
                    cls: 'accept',
                    handler: function (self) {
                        let phone = $.trim($('#test-phone-val').val()),playPhone = [];
                        let phoneLength;
                        let phoneRule = new RegExp("1[3|4|5|7|8][0-9]{9}$");
                        let huitPhone = false,huitPhoneText,huitMsg = false,huitMsgText;

                        let msg = $.trim($('#test-msg-val').val());

                        phone = phone.split(",");
                        phoneLength = phone.length > 5 ? 5:phone.length;
                        if(phoneLength > 0){
                            for(let i=0; i<phoneLength; i++){
                                if(phoneRule.test(phone[i])){
                                    huitPhone = true;
                                    playPhone[i] = phone[i];
                                }else{huitPhone = false;break;}
                            }
                            if(!huitPhone){
                                huitPhoneText = '手机号格式不正确';
                            }
                            playPhone = playPhone.toString(',')
                        }else{
                            huitPhoneText = '请填写测试手机号';
                        }

                        if(msg.length > 0){
                            huitMsg = true;
                        }else{
                            huitMsgText = '测试短信能容不能为空';
                        }

                        if(huitPhone&&huitMsg){
                            //测试ajax
                            util.api({
                                url: "?method=mkt.sms.message.send.test",
                                type: 'post',
                                data: {
                                    receive_mobiles: playPhone,
                                    send_message:msg
                                },
                                success: function (res) {
                                    if(res.code == 0){
                                        self.close();
                                    }else{
                                        new Modals.Alert(res.msg);
                                    }
                                }
                            });
                        }else{
                            if(huitPhone){
                                $('#test-phone-hint').removeClass('show');
                                $('#huitPhoneText').text('');
                            }else{
                                $('#test-phone-hint').addClass('show');
                                $('#huitPhoneText').text(huitPhoneText);
                            }
                            if(huitMsg){
                                $('#test-msg-hint').removeClass('show');
                                $('#huitMsgText').text('');
                            }else{
                                $('#test-msg-hint').addClass('show');
                                $('#huitMsgText').text(huitMsgText);
                            }
                        }
                    }
                }
            ],
            listeners: {
                beforeRender: function () {
                    this.customView = ReactDOM.render(
                        <MsgTest />,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        });
    }
    formatTbodyData(total,data){
        let number={},numberDefault={style:'16px',text:'——'},thisStatus,statusColor,tbodyData=[];
        for(let i=0; i<total; i++){
            switch (parseInt(data[i].sms_task_send_status)){
                case 0:
                    thisStatus = "等待处理";
                    statusColor="";
                    break;
                case 1:
                    thisStatus = "发送成功";
                    statusColor="";
                    break;
                case 2:
                    thisStatus = "发送失败";
                    statusColor="#fd7979";
                    break;
            }
            if(data[i].send_mobile == ''){
                number = numberDefault;
            }else{
                number = {style:'0px',text:data[i].send_mobile};
            }
            tbodyData[i] = {
                id: data[i].id,
                number: number,
                phone_number: data[i].receive_mobile,
                msg: data[i].send_message,
                time: data[i].send_time,
                thisStatus: thisStatus,
                statusColor: statusColor
            };
        }
        this.setState({
            tbodyModule:<TbodyTrue data={tbodyData} />
        });
    }
    fetchTable(indexNum,sizeNum,searchText){
        /*
         发送成功:1
         发送失败:2
         等待处理:3
         */
        let id = util.geturlparam('id');
        let that = this;
        let total=0,total_count=0,thisData=[];
        util.api({
            data: {
                method:'mkt.sms.message.send.record.get',
                sms_task_head_id:id,
                index:indexNum,
                size:sizeNum,
                receive_mobile:searchText
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); total_count = parseInt(res.total_count); thisData = res.data;
                    that.setState({tbodyTotalCount:total_count});
                    if(total>0){
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyModule:<TbodyFalse />});
                    }
                }else{
                    total_count = 0;
                    that.setState({tbodyModule:<TbodyFalse />});
                }
                $('.pagination-wrap').pagination('updateItems', total_count);
            }
        });
    }
    searchTableKeyup(e){
        let thisVal = '';
        if(e.keyCode == 13){
            thisVal = $.trim($('#searchTable').val());
            this.setState({index: 1, size: 10, search: thisVal});
            this.fetchTable(1,10,thisVal);
        }
    }
    searchTableClick(){
        let thisVal = $.trim($('#searchTable').val());
        this.setState({index: 1, size: 10, search: thisVal});
        this.fetchTable(1,10,thisVal);
    }
    fetchParam(){
        //mkt.sms.smstaskhead.get
        let id = util.geturlparam('id');
        let time,taskState,name,totalcovernum;
        let sendingsuccessnum,sendingfailnum,waitingnum;
        let that = this;
        let thisData=[];
        util.api({
            data: {
                method:'mkt.sms.smstaskhead.get',
                sms_task_head_id:id
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    time = thisData.createTime/1000;
                    taskState = parseInt(thisData.smsTaskStatus);
                    name = thisData.smsTaskName;
                    totalcovernum = parseInt(thisData.totalCoverNum);
                    sendingsuccessnum = thisData.sendingSuccessNum;
                    sendingfailnum = thisData.sendingFailNum;
                    waitingnum = thisData.waitingNum;
                    that.fetchTask(id,time,taskState,name,totalcovernum);
                    that.fetchEcharts(totalcovernum,sendingsuccessnum,sendingfailnum,waitingnum);
                }
            }
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
                    let search = that.state.search;
                    that.setState({index:pageNumber});
                    that.fetchTable(pageNumber,thisSize,search);
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            echarts:{
                totalCover:0,
                successNum:0,
                failnum:0,
                waitingnum:0
            },
            task:{
                id:'', time:'', name:'', taskState:{classname:'',text:''}
            },
            play:'bukeyong',
            del:'bukeyong',
            index: 1, size: 10, search: '',
            tbodyModule: <TbodyFalse />,
            tbodyTotalCount: 0
        };
    }
    componentDidMount(){
        this.fetchParam();
        this.fetchEcharts();
        this.fetchTask();
        this.fetchTable(1,10,'');
        this.setPagination();
        this.dropdownButton();
    }
    render(){
        return(
            <div className="msgdetail">
                <SubHead />
                <div className="content">
                    <div className="uparea">
                        <div className="echarts-area" id="echarts-box"></div>
                        <div className="msg-test">
                            <div className="msg-test-header">
                                <div className="statu-box">
                                    <div className={this.state.task.taskState.classname}>
                                        <div className="statu-text">{this.state.task.taskState.text}</div>
                                        <div className="statu-horn"></div>
                                    </div>
                                </div>
                                <div className="operation">
                                    <a href="javascript:void(0)" className="a iconfont dropdown-button" data-constrainwidth="false" data-activates="more" title="更多">&#xe675;</a>
                                    <ul id="more" className="dropdown-content morelist">
                                        <li id="del-task" className={this.state.del} onClick={this.delete.bind(this,this.state.task.id)}>
                                            <i className="icon iconfont">&#xe674;</i>
                                            <a href="javascript:void(0)">删除</a>
                                        </li>
                                    </ul>
                                    <a id="play-task" href="javascript:void(0)" className={"a iconfont"+this.state.play} onClick={this.startUp.bind(this,this.state.task.id)}>&#xe633;</a>
                                </div>
                            </div>
                            <div className="msg-test-content">
                                <div className="line test-title">{this.state.task.name}</div>
                                <div className="line test-time">
                                    <span className="iconfont">&#xe632;</span>
                                    <span className="time">{this.state.task.time}</span>
                                </div>
                                <div className="line">
                                    <div className="but-box">
                                        <div className="button default" onClick={this.msgTest.bind(this)}>短信预测试</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="downarea">
                        <div className="table-area">
                            <div className="downarea-title-area">
                                <div className="downarea-title">信息发送记录</div>
                                <div className="search-box">
                                    <input id="searchTable" onKeyUp={this.searchTableKeyup.bind(this)} className="input" placeholder="请输入手机号" type="text"/>
                                    <div className="icon iconfont" onClick={this.searchTableClick.bind(this)}>&#xe668;</div>
                                </div>
                            </div>
                            <table className="page-table-box">
                                <thead>
                                <tr>
                                    <th className="first">发信号码</th>
                                    <th>收信号码</th>
                                    <th>短信</th>
                                    <th>发送时间</th>
                                    <th>状态</th>
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

/********渲染页面********/
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
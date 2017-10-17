/**
 * Created by AnThen on 2016/12/1.
 * Modify by lxf on 2016/12/19
 */

/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName: '优惠券'
});

/********插件********/
let EChartsFunnelAlone = require('module/echarts/echarts-funnel-alone.js');

/********编写页面模块********/
/****二级头部****/
class SubHead extends React.Component {
    gotoLast() {
        window.history.go(-1);
    }

    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">优惠券详情</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" title="返回" onClick={this.gotoLast.bind(this)}>
                        <span className="icon iconfont">&#xe621;</span>
                        <span className="text">返回</span>
                    </a>
                </div>
            </header>
        )
    }
}
/********组织页面模块********/
class Manage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            type: '代金券', source: '平台生成码', state: '投放中', channel: '短信渠道',
            msn: {name: '短信任务名称', link: '#', style: 'none'},
            already: {succeed: 0, fail: 0},
            surplus: 0,
            verify: {hasBeen: 0, haveNot: 0},
            verifyButtonClass: ' disable'
        };
    }

    fetchID() {
        let id = util.geturlparam('id');
        this.setState({id: id});
        return id;
    }

    reconciliation() {
        let thisClass = this.state.verifyButtonClass;
        let url = BASE_PATH + '/html/coupon/reconciliation.html?id=' + this.state.id;
        if (thisClass == '') {
            window.location.href = url
        }
    }

    fetchName() {
        let that = this;
        let grantId = this.fetchID();
        let name, type, source, state, channel, taskId, taskName;
        let thisData, msn, verifyButtonClass = '';
        //mkt.material.coupon.get
        //coupon-detail-name.json
        util.api({
            data: {
                method: 'mkt.material.coupon.get',
                id: grantId
            },
            success: function (res) {
                if (res.code == 0) {
                    thisData = res.data[0];
                    name = thisData.title;
                    switch (thisData.type) {
                        case 'voucher':
                            type = '代金券';
                            break;
                    }
                    switch (thisData.source_code) {
                        case 'common':
                            source = '通用码';
                            break;
                        case 'generate':
                            source = '平台生成码';
                            break;
                        case 'own':
                            source = '自有码';
                            break;
                    }
                    switch (thisData.coupon_status) {
                        case 'unused':
                            state = '未使用';
                            verifyButtonClass = ' disable';
                            break;
                        case 'used':
                            state = '已占用';
                            break;
                        case 'releasing':
                            state = '投放中';
                            break;
                        case 'released':
                            state = '已投放';
                            break;
                    }
                    switch (thisData.channel_code) {
                        case 'sms':
                            channel = '短信';
                            break;
                        case 'wechat':
                            channel = '微信';
                            break;
                    }
                    taskId = thisData.task_id || 0;
                    taskName = thisData.task_name || '';
                    if (taskId && taskName) {
                        msn = {
                            name: taskName,
                            link: BASE_PATH + '/html/message-app/message-taskdetail.html?id=' + taskId,
                            style: 'block'
                        };
                    } else {
                        msn = {name: '短信任务名称', link: '#', style: 'none'};
                    }
                    that.setState({
                        name: name,
                        type: type, source: source, state: state, channel: channel,
                        msn: msn,
                        verifyButtonClass: verifyButtonClass
                    });
                }

            }
        });

    }

    fetchNum() {
        let that = this;
        let grantId = this.fetchID();
        let thisData, succeed, fail, surplus, hasBeen, haveNot;
        //mkt.material.coupon.putInGeneral
        util.api({
            data: {
                method: 'mkt.material.coupon.putInGeneral',
                id: grantId
            },
            success: function (res) {

                if (res.code == 0) {
                    thisData = res.data[0];
                    succeed = _.str.numberFormat(thisData.release_success_count);
                    fail = _.str.numberFormat(thisData.release_fail_count);
                    surplus = _.str.numberFormat(thisData.rest_count);
                    hasBeen = _.str.numberFormat(thisData.verify_amount);
                    haveNot = _.str.numberFormat(thisData.unverify_amount);
                    that.setState({
                        already: {succeed: succeed, fail: fail},
                        surplus: surplus,
                        verify: {hasBeen: hasBeen, haveNot: haveNot}
                    });
                }
            }
        })

    }

    fetchGrantECharts() {
        //mkt.material.coupon.releaseGeneral
        //coupon-detail-grant-echart
        let echartData = [
            {value: 0, name: '预期投放'},
            {value: 0, name: '真实投放'},
            {value: 0, name: '真实触达'},
            {value: 0, name: '真实核销'}
        ];
        let grantId = this.fetchID();
        let thisData;
        let myChart = echarts.init(document.getElementById('grant-echart-box'));
        let chartsData = {
            div: myChart,
            divId: $('#grant-echart-box'),
            title: '',
            legend: {
                y: 'bottom', orient: 'horizontal',
                data: ['预期投放', '真实投放', '真实触达', '真实核销']
            },
            data: []
        };

        util.api({
            data: {
                method: 'mkt.material.coupon.releaseGeneral',
                id: grantId
            },
            success: function (res) {
                if (res.code == 0) {
                    myChart.showLoading();

                    thisData = res.data[0];
                    echartData[0].value = thisData.expect_release;
                    echartData[1].value = thisData.actual_release;
                    echartData[2].value = thisData.actual_reached;
                    echartData[3].value = thisData.actual_verify;

                    chartsData.data = echartData;

                    EChartsFunnelAlone.funnel(chartsData);
                } else {
                    EChartsFunnelAlone.funnel(chartsData);
                }
            }
        });

    }

    fetchVerifyECharts() {
        //mkt.material.coupon.verifyGeneral
        //coupon-detail-verify-echart
        let echartData = [
            {value: 0, name: '预期目标价值'},
            {value: 0, name: '预期投放价值'},
            {value: 0, name: '实际触达价值'},
            {value: 0, name: '实际核销价值'}
        ];
        let grantId = this.fetchID();
        let thisData;
        let myChart = echarts.init(document.getElementById('verify-echart-box'));
        let chartsData = {
            div: myChart,
            divId: $('#verify-echart-box'),
            title: '',
            legend: {
                y: 'bottom', orient: 'horizontal',
                data: ['预期目标价值', '预期投放价值', '实际触达价值', '实际核销价值']
            },
            data: []
        };
        util.api({
            data: {
                method: 'mkt.material.coupon.verifyGeneral',
                id: grantId
            },
            success: function (res) {
                if (res.code == 0) {
                    myChart.showLoading();
                    thisData = res.data[0];
                    echartData[0].value = thisData.expect_release_amount;
                    echartData[1].value = thisData.actual_release_amount;
                    echartData[2].value = thisData.actual_reached_amount;
                    echartData[3].value = thisData.actual_verify_amount;
                    chartsData.data = echartData;
                    EChartsFunnelAlone.funnel(chartsData);
                } else {
                    EChartsFunnelAlone.funnel(chartsData);
                }
            }
        })

    }

    componentDidMount() {
        this.fetchName();
        this.fetchNum();
        this.fetchGrantECharts();
        this.fetchVerifyECharts();
    }

    fetchDetail() {
        let that = this;
        util.api({
            data: {
                method: 'mkt.material.coupon.releaseGeneral',
                id: util.geturlparam('id')
            },
            success: function (response) {
                console.info(response);
                // that.setState({
                //     totalCount: response.total_count || 0,
                //     listData: response.data
                // });

            }
        });
    }

    render() {
        return (
            <div className="coupon-detail">
                <SubHead />
                <div className="content">
                    <div className="basic-area">
                        <div className="name-area">
                            <div className="name-header">
                                <div className="statu-cyan">
                                    <div className="statu-text">优惠券名称</div>
                                    <div className="statu-horn"></div>
                                </div>
                                <div className="name-title">{this.state.name}</div>
                            </div>
                            <div className="name-content">
                                <div className="name-body">
                                    <div className="name-box">
                                        <div className="title">券码类型：</div>
                                        <div className="text">{this.state.type}</div>
                                    </div>
                                    <div className="name-box">
                                        <div className="title">券码来源：</div>
                                        <div className="text">{this.state.source}</div>
                                    </div>
                                    <div className="name-box">
                                        <div className="title">券码状态：</div>
                                        <div className="text">{this.state.state}</div>
                                    </div>
                                    <div className="name-box">
                                        <div className="title">场景渠道：</div>
                                        <div className="text">{this.state.channel}</div>
                                    </div>
                                </div>
                                <div className="name-link" style={{'display': this.state.msn.style}}>&#8722;&nbsp;<a
                                    className="a" href={BASE_PATH + this.state.msn.link}>{this.state.msn.name}</a></div>
                            </div>
                        </div>
                    </div>
                    <div className="grant-area">
                        <div className="grant-header">发放统计</div>
                        <div className="grant-content">
                            <div className="grant-block">
                                <div className="grant-title">已投放券码</div>
                                <div className="grant-body">
                                    <div className="grant-box">
                                        <div className="money">{this.state.already.succeed}</div>
                                        <div className="state green">投放成功</div>
                                    </div>
                                    <div className="grant-box">
                                        <div className="money">{this.state.already.fail}</div>
                                        <div className="state red">投放失败</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grant-block">
                                <div className="grant-title">剩余券码总量</div>
                                <div className="grant-body">
                                    <div className="grant-box">
                                        <div className="money">{this.state.surplus}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="verify-area">
                        <div className="verify-header">核销统计</div>
                        <div className="verify-content">
                            <div className="verify-block">
                                <div className="verify-title">核销券码金额</div>
                                <div className="verify-body">
                                    <div className="verify-box">
                                        <div className="money">&#165;{this.state.verify.hasBeen}</div>
                                        <div className="state green">已核销</div>
                                    </div>
                                    <div className="verify-box">
                                        <div className="money">&#165;{this.state.verify.haveNot}</div>
                                        <div className="state red">未核销</div>
                                    </div>
                                </div>
                            </div>
                            <div className="verify-block">
                                <div className="verify-title"></div>
                                <div className="verify-body">
                                    <div className="verify-box"></div>
                                    <div className="button-box">
                                        <div className={"button-main-2 button" + this.state.verifyButtonClass}
                                             onClick={this.reconciliation.bind(this)}>核销对账
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="echart-area">
                        <div className="echart-header">
                            <div className="hint-box">
                                <div className="icon-box iconfont">&#xe63a;</div>
                                <div className="text">
                                    建议您保证券码剩余始终充足状态，因为券码不足将直接影响券码发送能否进行
                                </div>
                            </div>
                        </div>
                        <div className="echart-content">
                            <div className="echart-grant-area">
                                <div className="echart-grant-header">券码投放流失概览</div>
                                <div className="echart-grant-content">
                                    <div id="grant-echart-box" className="echart-box"></div>
                                </div>
                            </div>
                            <div className="echart-verify-area">
                                <div className="echart-verify-header">券码核销流失概览</div>
                                <div className="echart-verify-content">
                                    <div id="verify-echart-box" className="echart-box"></div>
                                </div>
                            </div>
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
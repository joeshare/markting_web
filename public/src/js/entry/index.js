/**
 * Creaated by 刘晓帆 on 2016-4-11.
 * 首页1
 */
'use strict';
import Layout from 'module/layout/layout';
import Lcalendar from 'module/lcalendar/lcalendar';
let EChartsAxis = require('module/echarts/echarts-axis.js');//累计趋势
let EChartsAnnular = require('module/echarts/echarts-annular.js');//用户来源

const layout = new Layout({
    index: 0,
    leftMenuCurName: ''
});

class Index extends React.Component {
    mainDataSource() {
        let myChart = echarts.init(document.getElementById('main-data-source'));
        myChart.showLoading();
        let resData;
        let data = [];
        let chartsData = {
            div: myChart,
            divId: $('#main-data-source'),
            title: '用户来源',
            data: []
        };
        util.api({
            data: {method: 'mkt.homepage.datasource.list'},
            success: function (res) {
                if (res.code == 0) {
                    resData = res.data[0];
                    for (let i = 0; i < resData.length; i++) {
                        data[i] = {value: resData[i].source_count, name: resData[i].source};
                    }

                    let formatSortData = _.sortBy(data, 'value').reverse();//把数据按照从大到小的顺序排序
                    let newData = [];//处理后的数据
                    let otherData = {
                        name: '其他',
                        value: 0
                    };
                    formatSortData.map((m, i)=> {
                        if (i < 9) {
                            newData.push(m);
                        } else {
                            otherData.value += m.value;
                        }
                    });
                    newData.push(otherData);

                    chartsData.data = newData;
                    EChartsAnnular.annular(chartsData);
                }
            }
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            tabVal: [],
            datainfo: [
                {
                    "id": 1,
                    "name": "接入数据",
                    "count": 0,
                    "link_name": "数据接入"
                },
                {
                    "id": 2,
                    "name": "标签",
                    "count": 0,
                    "link_name": "标签管理"
                },
                {
                    "id": 3,
                    "name": "可触达用户",
                    "count": 0,
                    "link_name": "数据洞察"
                },
                {
                    "id": 4,
                    "name": "细分人群",
                    "count": 0,
                    "link_name": "细分管理"
                },
                {
                    "id": 5,
                    "name": "已结束活动",
                    "count": 0,
                    "link_name": "活动管理"
                },
                {
                    "id": 6,
                    "name": "进行活动",
                    "count": 0,
                    "link_name": "活动编排"
                }
            ]
        };
        this.obejArr = {
            0: {
                div: '',
                divId: $('#eser-expanding-trend-chart'),
                title: ' ',
                backgroundColor: ['#5bd4c7'],
                formatter: '{b}：{c}人',
                xAxis: [],
                yAxisUnit: '{value} 人',
                series: []
            },
            7: {
                div: '',
                divId: $('#eser-expanding-trend-chart'),
                title: ' ',
                backgroundColor: ['#5bd4c7'],
                formatter: '{b}：{c}人',
                xAxis: [],
                yAxisUnit: '{value} 人',
                series: []
            },
            30: {
                div: '',
                divId: $('#eser-expanding-trend-chart'),
                title: ' ',
                backgroundColor: ['#5bd4c7'],
                formatter: '{b}：{c}人',
                xAxis: [],
                yAxisUnit: '{value} 人',
                series: []
            }
        };
        // this.setTotal = this.setTotal.bind(this)
    }

    showWelcomTip() {

        if (localStorage.getItem('showWelcomTip') == 0) {
            $('.user-name-tip').show();
            setTimeout(function () {
                $('.user-name-tip').fadeOut();
                localStorage.setItem('showWelcomTip', 1);
            }, 3000);
        }

    }

    loadDataInfo() {
        let that = this;
        util.api({
            data: {
                method: 'mkt.homepage.datacount.list'
            },
            success(response){
                if (response.code == 0) {
                    that.setState({
                        datainfo: response.data[0]
                    })
                }
            }
        })
    }

    componentDidMount() {
        let that = this;
        this.loadDataInfo();
        this.changeYhljqzData(0);
        this.mainDataSource();
        this.showWelcomTip();
        $('#page-body').on('click', '.refresh-btn', function (e) {
            let val = $(this).data('val');
            that.changeYhljqzData(val, null, true);
        })
    }

    //改变用户累计趋势的数据
    changeYhljqzData(val = 0, e, refresh) {
        let that = this;
        let timeoutNum = 60000;
        if (e) {
            let $me = $(e.currentTarget);
            let $allBtn = $('.tabmenu-wrap .datebtn-box .left-box');
            $allBtn.removeClass('active');
            $me.addClass('active');
        }
        let myChart = echarts.init(document.getElementById('eser-expanding-trend-chart'));
        that.obejArr[val].div = myChart;
        let timeoutStr = '<div class="timeout-tip clearfix" data-type="' + val + '"><div class="left"><img src="/img/index/timeout.png" alt=""></div><div class="r"><div class="tit"><span class="big">数据加载超时！</span><span class="small">可能原因为：数据量过大，网络慢。</span></div><div><span class="refresh-btn" data-val="' + val + '">重新加载数据</a></div></div></div>';
        let data;
        let xAxis = [], series = [], seriesData = [];
        //一开始就写的不合理（没考虑到后期的扩展性），然后需求变更了导致不能用合理的方式去扩展代码，又不想重构，结果就导致了屎一样的代码出现，后期改动越多，屎越大。
        if (this.state.tabVal.indexOf(val) == -1) {
            if (this.state.tabVal.indexOf(val) == -1) {
                this.state.tabVal.push(val);
            }

            myChart.showLoading();
            util.api({
                data: {
                    method: 'mkt.homepage.usercount.list',
                    date_type: val
                },
                timeout: timeoutNum,
                error: function (jqXHR, textStatus) {
                    $(('#eser-expanding-trend-chart')).html(timeoutStr)
                },
                success: function (res) {
                    if (res.code == 0) {
                        data = res.data[0];
                        if (data) {
                            data.date_array.map((m, i)=> {
                                xAxis[i] = m;
                            });
                            data.count_array.map((m, i)=> {
                                seriesData[i] = m;
                            });
                            if (val == 30) {
                                that.obejArr[val].xAxisFormatter = function (value, index) {
                                    if (index % 7 == 0) {
                                        return value;
                                    }
                                    if (index == 59) {
                                        return value;
                                    }
                                };
                            } else {
                                that.obejArr[val].xAxisFormatter = {}
                            }
                            series[0] = {name: '', data: seriesData};
                            that.obejArr[val].xAxis = xAxis;
                            that.obejArr[val].series = series;
                        }
                        EChartsAxis.axis(that.obejArr[val]);
                    }
                }
            });

        } else {
            if (_.isEmpty(that.obejArr[val].series)) {
                if (refresh) {
                    util.api({
                        data: {
                            method: 'mkt.homepage.usercount.list',
                            date_type: val
                        },
                        timeout: timeoutNum,
                        error: function (jqXHR, textStatus) {
                            $(('#eser-expanding-trend-chart')).html(timeoutStr)
                        },
                        success: function (res) {
                            if (res.code == 0) {
                                data = res.data[0];
                                if (data) {
                                    data.date_array.map((m, i)=> {
                                        xAxis[i] = m;
                                    });
                                    data.count_array.map((m, i)=> {
                                        seriesData[i] = m;
                                    });
                                    if (val == 30) {
                                        that.obejArr[val].xAxisFormatter = function (value, index) {
                                            if (index % 7 == 0) {
                                                return value;
                                            }
                                            if (index == 59) {
                                                return value;
                                            }
                                        };
                                    } else {
                                        that.obejArr[val].xAxisFormatter = {}
                                    }
                                    series[0] = {name: '', data: seriesData};
                                    that.obejArr[val].xAxis = xAxis;
                                    that.obejArr[val].series = series;
                                }
                                EChartsAxis.axis(that.obejArr[val]);
                            }
                        }
                    });
                } else {
                    $(('#eser-expanding-trend-chart')).html(timeoutStr)
                }

            } else {
                EChartsAxis.axis(that.obejArr[val]);
            }
        }

    }

    render() {
        let datainfo = this.state.datainfo;

        return (
            <div className="index">
                <div className="row">
                    <div className="col s9 posi-r">
                        <div className="block mr10 h280" style={{padding:'24px 20px;'}}
                             id="eser-expanding-trend-chart">

                        </div>
                        <div className="tabmenu-wrap">
                            <div className="tit-wrap">
                                <span className="title">用户累计趋势</span>
                                <span className="tit-icon dropdown-button"
                                      data-activates="tip-yhljqs"
                                      data-constrainwidth="false"
                                      data-hover="true"
                                    // data-beloworigin="true"
                                ></span>
                                <ul id="tip-yhljqs" className="dropdown-content width-auto">
                                    <li className="nohover">接入系统的数据中可触达用户的变化</li>
                                </ul>
                            </div>
                            <ul className="datebtn-box">
                                <li className="left-box" onClick={this.changeYhljqzData.bind(this,30)}>
                                    <div className="text-box">最近30天</div>
                                </li>
                                <li className="left-box" onClick={this.changeYhljqzData.bind(this,7)}>
                                    <div className="text-box">最近7天</div>
                                </li>
                                <li className="left-box active" onClick={this.changeYhljqzData.bind(this,0)}>
                                    <div className="text-box">今天</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col s3">
                        <div className="block ml10 wrap-rt">
                            <div className="info-box-r">
                                <div className="hd clearfix">
                                    <div className="left">{datainfo[0].name}</div>
                                    <div className="right"><a href="/html/data-access/file.html">数据接入</a></div>
                                </div>
                                <div className="bd clearfix">
                                    <div className="left txt">{_.str.numberFormat(datainfo[0].count)}</div>
                                    <div className="right">
                                        <img src="/img/index/zs-b.png" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block ml10 wrap-rb">
                            <div className="info-box-r">
                                <div className="hd clearfix">
                                    <div className="left">{datainfo[1].name}</div>
                                    <div className="right"><a href="/html/label-management/system.html"
                                                              className="bg-green">标签管理</a></div>
                                </div>
                                <div className="bd clearfix">
                                    <div className="left txt">{_.str.numberFormat(datainfo[1].count)}</div>
                                    <div className="right"><img src="/img/index/zs-g.png" alt=""/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s3">
                        <div className="block mr10 h100">
                            <div className="info-box bg-green">
                                <div className="hd clearfix">
                                    <div className="left">{datainfo[2].name}</div>
                                    <div className="right"><a href="/html/data-supervise/master-data.html">主数据</a></div>
                                </div>
                                <div className="bd clearfix">
                                    <div className="left txt">{_.str.numberFormat(datainfo[2].count)}</div>
                                    <div className="right"><img src="/img/index/zs.png" alt=""/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col s3">
                        <div className="block mr10 ml10 h100">
                            <div className="info-box bg-purple">
                                <div className="hd clearfix">
                                    <div className="left">{datainfo[3].name}</div>
                                    <div className="right"><a href="/html/audience/manage.html">细分管理</a></div>
                                </div>
                                <div className="bd clearfix">
                                    <div className="left txt">{_.str.numberFormat(datainfo[3].count)}</div>
                                    <div className="right"><img src="/img/index/zs.png" alt=""/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col s3">
                        <div className="block mr10 ml10 h100">
                            <div className="info-box bg-yellow">
                                <div className="hd clearfix">
                                    <div className="left">{datainfo[4].name}</div>
                                    <div className="right"><a href="/html/activity/supervise.html?type=3">活动管理</a></div>
                                </div>
                                <div className="bd clearfix">
                                    <div className="left txt">{_.str.numberFormat(datainfo[4].count)}</div>
                                    <div className="right"><img src="/img/index/zs.png" alt=""/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col s3">
                        <div className="block ml10 h100">
                            <div className="info-box bg-blue">
                                <div className="hd clearfix">
                                    <div className="left">{datainfo[5].name}</div>
                                    <div className="right"><a href="/html/activity/supervise.html?type=2">活动管理</a></div>
                                </div>
                                <div className="bd clearfix">
                                    <div className="left txt">{_.str.numberFormat(datainfo[5].count)}</div>
                                    <div className="right"><img src="/img/index/zs.png" alt=""/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s4">
                        <div className="block mr10 h346" style={{padding:'24px 20px;'}} id="main-data-source"></div>
                    </div>
                    <div className="col s8">
                        <div className="block ml10 h346">
                            <div className="title">活动日历</div>
                            <Lcalendar/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


//渲染
const index = ReactDOM.render(
    <Index />,
    document.getElementById('page-body')
);


module.exports = Index;
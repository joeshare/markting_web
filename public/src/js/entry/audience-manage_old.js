/**
 * Created by liuxiaofan on 2016-5-4.
 * 细分管理 es6+react版
 */
'use strict';//严格模式

import Layout from 'module/layout/layout';
let EventEmitter = require('plugins/EventEmitter.js');
//先创建布局
const layout = new Layout({
    index: 1,
    leftMenuCurName: '细分管理'
});
const pubSub = new EventEmitter();//观察者

/*加载echarts模块*/
let EChartsAxis = require('module/echarts/echarts-axis.js');
let EChartsAnnular = require('module/echarts/echarts-annular.js');
let EChartsMap = require('module/echarts/echarts-map.js');

//subhead
class SubHead extends React.Component {
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box"><span className="title">细分管理</span><span
                    className="text">受众细分共计<span className="variable">{this.props.totalCount}</span>个</span>
                </div>
                <div className="button-box icon iconfont"><a
                    className="a keyong" href={BASE_PATH+'/html/audience/segment.html'} title="新增细分人群">&#xe63c;</a>
                </div>
            </header>
        )
    }
}

//tab菜单
class TabBtnWrap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{name: '未生效', count: 0}, {name: '已生效', count: 0}, {name: '全部', count: 0}]
        }

    }

    componentDidMount() {
        this.fetch();
        let that = this;
        pubSub.on('refresh', function () {
            that.fetch();
        });
    }

    fetch() {
        let that = this;
        util.api({
            data: {
                method: 'mkt.segment.publishstatus.count.get'
            },
            success(res){
                if (res.code === 0) {
                    res.data.map((m, i)=> {
                        m.name = that.state.data[i].name
                    });
                    that.setState({
                        data: res.data
                    });
                    that.props.setTotal(res.data[2].count)
                }
            }
        })
    }

    render() {
        let that = this;
        return (
            <div className="tab-btnwrap">
                <ul className="tabs">
                    {this.state.data.map((m, i)=> {
                        return <li className="tab"><a href="#0" className={(i===3)?'active':''}
                                                      onClick={that.props.tabBtn.bind(that,m.publish_status)}>{m.name}
                            ({m.count})</a>
                        </li>
                    })}
                </ul>
            </div>
        )
    }
}
//地图列表
class MapList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageNum: 1,
            pageSize: 11
        };
    }

    translateHtmlCharater(html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent;
    }

    pagePrevious() {

        if (this.state.pageNum == 1)return;

        this.setState({
            pageNum: this.state.pageNum - 1
        });
    }

    pageNext() {
        if (this.state.pageNum >= this.props.data.length / this.state.pageSize)return;
        this.setState({
            pageNum: this.state.pageNum + 1
        });
    }

    //变更地图数据
    changeMapData(type, e) {
        let $me = $(e.currentTarget);
        let fData = this.props.leftListData;
        let mIds = [];
        fData.map(m=> {
            if (m.isChecked) {
                mIds.push(m.segment_head_id)
            }
        });

        this.props.fetchMapChartsData(mIds, type);
        $('.maplist-btnwrap .right').removeClass('cur');
        $me.addClass('cur');
    }

    render() {
        let rDis = (this.state.pageNum >= this.props.data.length / this.state.pageSize) ? 'disabled' : '';
        let lDis = this.state.pageNum == 1 ? 'disabled' : '';
        return (
            <div className="map-list">
                <div className="maplist-btnwrap clearfix">
                    <div className="right" onClick={this.changeMapData.bind(this,2)}>业务活动区域</div>
                    <div className="right cur" onClick={this.changeMapData.bind(this,1)}>用户所在区域</div>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th width="110">地域</th>
                        <th width="100">用户数</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>

                    {this.props.data && this.props.data.map((m, i)=> {
                        let bgClass = '';
                        if (i % 2 == 0) {
                            bgClass = 'bg-gray';
                        }
                        if ((i < this.state.pageSize * this.state.pageNum) && i >= this.state.pageSize * (this.state.pageNum - 1)) {
                            return (
                                <tr className={bgClass}>
                                    <td>{m.dimension_name}</td>
                                    <td>{_.str.numberFormat(m.population_count)}</td>
                                    <td><span className={m.colorStyle} style={{'width':m.spanWidth+'%'}}> </span></td>
                                </tr>
                            )
                        }
                    })}

                    </tbody>
                </table>
                <div className="paginationwrap">
                    <div className={"btn-r right "+rDis}
                         onClick={this.pageNext.bind(this)}>{this.translateHtmlCharater('>')}</div>
                    <div className={"btn-l right "+lDis}
                         onClick={this.pagePrevious.bind(this)}>{this.translateHtmlCharater('<')}</div>

                </div>
            </div>

        )
    }
}
//内容区
class Content extends React.Component {
    //初始化
    constructor(props) {
        super(props);
        this.state = {
            publish_status: 0,
            mapData: {
                china_population_count: 0,
                foreign_population_count: 0,
                population_count: []
            },//地图数据
            isCheckedAll: false,//全选按钮状态
            data: []
        };
        this.mapListType = 1;//地图列表类型
        this.fetchMapChartsData = this.fetchMapChartsData.bind(this);
    }

    componentDidUpdate() {
        $('.dropdown-button').dropdown({});

    }

    //搜索列表
    searchFeed(e) {
        let val = $(e.currentTarget).val().trim();

        this.fetch({
            publish_status: this.state.publish_status,
            keyword: val
        })
    }

    //请求地图图表数据
    fetchMapChartsData(segment_head_ids, type) {
        let that = this;
        if (type) this.mapListType = type;
        // let myChart = echarts.init(document.getElementById('charts-map'));

        util.api({
            url: "?method=mkt.segment.provincecount.list",
            type: 'post',
            timeout: 1000 * 120,
            data: {
                segment_head_ids: segment_head_ids,
                type: this.mapListType //1:用户所在区域；2:用户活动区域
            },
            beforeSend: function () {
               that.chartsMap.myCharts.showLoading();
            },
            success: function (res) {
                // myChart.hideLoading();
                let colorStyle = '';
                if (res.code == 0) {

                    if (_.isEmpty(res.data)) {
                        that.setState({
                            mapData: {
                                population_count: []
                            }
                        });
                        that.chartsMap.setOption([]);
                    } else {
                        let spanWidth = 0;
                        let pcArr = res.data[0].population_count;
                        let uniqArr = _.uniq(_.pluck(res.data[0].population_count, 'population_count'));//去重后的用户数组
                        if (uniqArr.length <= 3) {
                            pcArr.map((m, i)=> {
                                m.colorStyle = 'bg-1';
                                m.spanWidth = util.Percentage(m.population_count, res.data[0].population_count[0].population_count);
                            });
                        } else if (uniqArr.length <= 6) {
                            pcArr.map((m, i)=> {
                                if (i < 3) {
                                    m.colorStyle = 'bg-1'
                                } else if (i < 6 && i >= 3) {
                                    m.colorStyle = 'bg-2'

                                }
                                m.spanWidth = util.Percentage(m.population_count, res.data[0].population_count[0].population_count);
                            });
                        } else {
                            pcArr.map((m, i)=> {
                                if (i < 3) {
                                    m.colorStyle = 'bg-1'
                                } else if (i < 6 && i >= 3) {
                                    m.colorStyle = 'bg-2'
                                } else {
                                    m.colorStyle = 'bg-3'
                                }
                                m.spanWidth = util.Percentage(m.population_count, res.data[0].population_count[0].population_count);
                            });
                        }

                        that.setState({
                            mapData: res.data[0]
                        });

                        that.chartsMap.setOption(res.data[0].population_count);

                    }

                }
            }
        });
    }

    //设置图表数据
    setCharts() {
        let fData = this.state.data;
        //let mIds = _.pluck(fData,'segment_head_id');//全摘
        let mIds = [];
        fData.map(m=> {
            if (m.isChecked) {
                mIds.push(m.segment_head_id)
            }
        });
        if (_.isEmpty(mIds)) {
            $('.manage .havedata').hide();
            $('.manage .nodata').show();
        } else {
            $('.manage .havedata').show();
            $('.manage .nodata').hide();
        }
        this.fetchMapChartsData(mIds);//请求地图数据
        this.genderDistribution(mIds);//请求用户性别分布数据
        this.receivingFrequency(mIds);//用户接收图文频率
        this.chartsMap.resize();
    }

    //全选/全不选
    toggleAll() {
        let fData = this.state.data;
        if (!this.state.isCheckedAll) {
            fData.map(m=> {
                m.isChecked = true
            })
        } else {
            fData.map(m=> {
                m.isChecked = false
            })
        }
        this.formatResData(fData);
    }

    //全选
    selectAll(fData, publish_status) {
        // fData.map(m=> {
        //     m.isChecked = true
        // });
        this.formatResData(fData, publish_status);
    }

    //格式化数据
    formatResData(fData, publish_status) {
        let isCheckedAll = fData.every(function (m) {
            return m.isChecked;
        });

        this.setState({
            publish_status: publish_status,
            isCheckedAll: isCheckedAll,
            data: fData
        });
        this.setCharts();
    }

    //请求列表数据
    fetch(data) {
        let that = this;
        let oData = _.extend({
            method: 'mkt.segment.publishstatus.list.get',
            publish_status: this.state.publish_status,
            index: 1,
            size: 100,
            keyword: ''
        }, data || {});
        util.api({
            data: oData,
            success(res){
                if (res.code === 0) {
                    that.selectAll(res.data, oData.publish_status)
                }
            }
        })
    }

    //tab切换
    tabBtn(publish_status) {
        $('.manage .search-input').val('');
        this.fetch({
            publish_status: publish_status
        })

    }

    //单条状态改变
    itemChanged(id) {
        let fdata = this.state.data;
        fdata.map(m=> {
            if (m.segment_head_id === id) {
                m.isChecked ? m.isChecked = false : m.isChecked = true;
            }
        });
        this.formatResData(fdata)
    }

    //用户性别分布 echart
    genderDistribution(mIds) {
        let myChart = echarts.init(document.getElementById('gender-distribution'));
        myChart.showLoading();
        let resData;
        let legendData = ['男', '女', '未知'], data = [];
        let chartsData = {
            div: myChart,
            divId: $('#gender-distribution'),
            title: '用户性别分布',
            legend: {
                y: 'bottom', orient: 'horizontal',
                data: []
            },
            data: []
        };
        util.api({
            url: "?method=mkt.segment.gendercount.list",
            type: 'post',
            timeout: 1000 * 60,
            data: {segment_head_ids: mIds},
            success: function (res) {
                if (res.code == 0) {
                    resData = res.data;
                    for (let i = 0; i < resData.length; i++) {
                        data[i] = {value: resData[i].population_count, name: resData[i].dimension_name};
                    }
                    chartsData.legend.data = legendData;
                    chartsData.data = data;
                    EChartsAnnular.annular(chartsData);
                }
            }
        });
    }

    //用户接收图文频率 echart
    receivingFrequency(mIds) {
        let myChart = echarts.init(document.getElementById('receiving-frequency'));
        myChart.showLoading();
        let resData;
        let xAxis = [], series = [], seriesData = [];
        let chartsData = {
            div: myChart,
            divId: $('#receiving-frequency'),
            title: '用户交互次数',
            formatter: '{b}：{c}人',
            xAxis: [],
            yAxisUnit: '{value} 人',
            series: []
        };
        util.api({
            url: "?method=mkt.segment.receivecount.list",
            type: 'post',
            timeout: 1000 * 60,
            data: {segment_head_ids: mIds},
            success: function (res) {
                if (res.code == 0) {
                    resData = res.data;
                    if (resData.length > 0) {
                        for (let i = 0; i < resData.length; i++) {
                            xAxis[i] = resData[i].dimension_name;
                            seriesData[i] = resData[i].population_count;
                        }
                        series[0] = {name: '', data: seriesData};
                        chartsData.xAxis = xAxis;
                        chartsData.series = series;
                    }
                    EChartsAxis.axis(chartsData);
                }
            }
        });
    }

    //挂载后
    componentDidMount() {
        this.fetch();
        this.chartsMap = new EChartsMap({
            el: 'charts-map'
        });
    }

    //删除
    delItems(id, e) {
        let that = this;
        let meEl = $(e.currentTarget);
        if (meEl.is('.disabled'))return;
        util.api({
            url: "?method=mkt.segment.header.delete",
            type: 'post',
            data: {
                segment_head_id: id
            },
            success(res){
                let newData = [];
                if (res.code == 0) {
                    that.fetch();
                    pubSub.trigger('refresh');
                    Materialize.toast('删除成功！', 1000);
                } else {
                    Materialize.toast('删除失败！', 1000);
                }


            }
        })

    }

    donwloadGroup(id) {
        util.api({
            data: {
                method: 'mkt.segment.search.download',
                head_id: id
            },
            success(res){
                if (res.code == 0) {
                    if (res.data.length > 0) {
                        location.href = FILE_PATH + res.data[0].download_url;
                    } else {
                        Materialize.toast('无人群数据', 1000);
                    }

                } else {
                    Materialize.toast(res.msg, 1000);
                }


            }
        })

    }

//在人群中查找
    showgrouplist(headId, e) {

        layout.showgrouplist(e, {
            data: {
                method: "mkt.segment.search.get",
                head_id: headId,//人群id
            },
            // total_count: crowdNum//总数，如果没有总数就注释掉这行
        });
    }

    //渲染
    render() {
        let data = this.state.data;
        let cc = this.state.mapData.china_population_count;
        let fc = this.state.mapData.foreign_population_count;
        let tc = cc + fc;
        return (
            <div className="content">
                <TabBtnWrap setTotal={this.props.setTotal} tabBtn={this.tabBtn.bind(this)}/>
                <div className="main-con">
                    <div className="main-l">
                        <div className="search-wrap">
                            <input type="text" className="validate search-input" placeholder="筛选关键字"
                                   onKeyUp={this.searchFeed.bind(this)} ref="seachInput"/>
                            <span className="icon iconfont">&#xe668;</span>
                        </div>
                        <div className="tabs-listwrap">

                            <div className="select-all">
                                <input type="checkbox" className="filled-in" id="group-all"
                                       checked={this.state.isCheckedAll} onChange={this.toggleAll.bind(this)}/>
                                <label htmlFor="group-all">全选</label>
                            </div>
                            <ul className="itemlist-wrap">
                                {this.state.data.map((m, i)=> {
                                    if (m.refer_campaign_count > 0) {
                                        m.cantDel = 'disabled'
                                    } else {
                                        m.cantDel = ''
                                    }
                                    return (
                                        <li className="liitem">
                                            <input type="checkbox"
                                                   className="filled-in checkitem" id={'xfitem'+m.segment_head_id}
                                                   checked={m.isChecked}
                                                   onChange={this.itemChanged.bind(this,m.segment_head_id)}/>
                                            <label htmlFor={'xfitem'+m.segment_head_id}>{m.segment_name}</label>
                                            <span className="icon iconfont right dropdown-button"
                                                  style={{fontSize: 20, marginTop: '-2px',cursor:'pointer'}}
                                                  data-activates={"itemlist-more-list-"+m.segment_head_id}
                                                  data-gutter="-110"
                                                  data-constrainwidth="false"
                                                  data-beloworigin="true"
                                            >&#xe675;</span>

                                            <ul id={"itemlist-more-list-"+m.segment_head_id}
                                                className="dropdown-content temlist-more-list">
                                                <li onClick={function(){
                                                window.location.href=BASE_PATH+'/html/audience/segment.html?returnurl='+BASE_PATH+'/html/audience/manage.html&audienceId='+m.segment_head_id
                                                }}>
                                                    <i className="icon iconfont">&#xe653;</i>编辑
                                                </li>
                                                <li className=''
                                                    onClick={this.showgrouplist.bind(this,m.segment_head_id)}><i
                                                    className="icon iconfont">&#xe668;</i>人群中查找
                                                </li>
                                                <li className=''
                                                    onClick={this.donwloadGroup.bind(this,m.segment_head_id)}><i
                                                    className="icon iconfont">&#xe643;
                                                </i>下载人群
                                                </li>
                                                <li className={m.cantDel}
                                                    onClick={this.delItems.bind(this,m.segment_head_id)}><i
                                                    className="icon iconfont">&#xe674;
                                                </i>删除
                                                </li>
                                            </ul>


                                        </li>
                                    )
                                })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="main-r">

                        <div className="havedata">
                            <div className="row chartswrap-t">
                                <div className="col s7">
                                    <div className="charts-map-title">
                                        <div className="title">细分人群总计：<span
                                            className="fc-blue">{tc}</span>人
                                        </div>
                                        <div className="title">区域分析</div>
                                        <div className="subtitle">
                                            <span>中国用户：{cc}人</span> <span
                                            className="ml60">其他及未知区域用户：{fc}人</span>
                                        </div>
                                    </div>
                                    <div id="charts-map"
                                         style={{width:'100%',height:'420px;',padding:'0 24px 24px;'}}></div>

                                </div>
                                <div className="col s5">
                                    <MapList data={this.state.mapData.population_count}
                                             fetchMapChartsData={this.fetchMapChartsData}
                                             leftListData={this.state.data}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s6 chartswrap-l">
                                    <div id="gender-distribution"
                                         style={{float:'left',width:'100%',height:'335px;',overflow:'hidden',padding:'24px;'}}></div>
                                </div>
                                <div className="col s6">
                                    <div id="receiving-frequency"
                                         style={{float:'left',width:'100%',height:'335px;',overflow:'hidden',padding:'24px;'}}></div>
                                </div>
                            </div>
                        </div>

                        <div className="nodata">
                            <img src="/img/common/nochartdata.jpg"/>
                        </div>

                    </div>
                </div>
            </div>
        )


    }
}

//root
class Manage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0//受众细分总数
        };
        this.setTotal = this.setTotal.bind(this)
    }

    setTotal(totalCount) {
        this.setState({
            totalCount: totalCount
        })
    }

    render() {
        return (
            <div className="manage">
                <SubHead totalCount={this.state.totalCount}/>
                <Content setTotal={this.setTotal}/>
            </div>
        )
    }
}

//渲染
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);

module.exports = Manage;

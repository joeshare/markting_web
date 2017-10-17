/**
 * Created by 刘晓帆 on 2016-4-11.
 * 主数据管理
 */
'use strict';

let Layout = require('module/layout/layout');
let Modals = require('component/modals.js');
let pagination = require('plugins/pagination')($);//分页插件

//先创建布局
const layout = new Layout({
    index: 1,
    leftMenuCurName: '主数据管理'
});

//自定义视图
class CustomView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            md_type: 0
        }
    }

    componentDidMount() {
        this.fecth()
    }

    fecth(md_type = 0) {
        let that = this;
        util.api({

            data: {
                method: "mkt.data.view.list.get",
                md_type: md_type
            },
            success: function (res) {
                that.setState({
                    mdType: md_type,
                    listData: res.data
                });
            }
        });


    }

    componentDidUpdate() {
        $('ul.tabs').tabs();
    }

    eventTab(md_type) {
        this.fecth(md_type);
    }

    itemChanged(id, event) {
        let fdata = this.state.listData;
        fdata.map((m, i)=> {
            if (i === id) {
                m.selected ? m.selected = false : m.selected = true;
            }
        });
        this.setState({
            listData: fdata
        });
    }

    render() {
        let mainCount = this.props.mainCount || [];
        return (
            <div>
                <div className="tabheader">
                    <ul className="tabs">
                        {mainCount.map(m=> {
                            return (
                                <li className="tab" onClick={this.eventTab.bind(this,m.md_type)}><a
                                    href="#">{m.tag_name}</a></li>
                            )

                        })}
                    </ul>
                </div>
                <ul className="sxlist-wrap clearfix" id="customlist0">
                    {this.state.listData.map((m, i)=> {
                        return (
                            <li>
                                <input type="checkbox" className="filled-in" id={"col-"+i} checked={m.selected}
                                       onChange={this.itemChanged.bind(this,i)}/>
                                <label htmlFor={"col-"+i}>{m.field_name}</label>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }
}


//数据列表
class DataList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        $('.dropdown-button').dropdown();

    }

    render() {
        let that = this;
        return (
            <table className="page-table-box uat-masterdata-table">
                <thead>
                <tr>

                    {this.props.colName.map(m=> {
                        return (
                            <th>{m.col_name}</th>
                        )
                    })}
                    <th/>
                </tr>
                </thead>
                <tbody id="tbody-box uat-masterdata-tbody">
                {this.props.listData.map((m, i)=> {
                    return (
                        <tr>

                            {this.props.colName.map(mm=> {
                                return (
                                    <td className="uat-masterdata-td">{m[mm.col_code]}</td>
                                )
                            })}
                            <td className="ico">
                                <ico className="pointer icon iconfont r-btn dropdown-button dropdown-button-more"
                                     data-activates={"morelist-"+m.id} data-constrainwidth="false" title="更多操作"
                                     listid>&#xe675;</ico>
                                <ul id={"morelist-"+m.id} className="dropdown-content dropdown-button">
                                    <li><i className="icon iconfont">&#xe61e;</i>
                                        <a href="javascript:;" data-contactid={m.id}
                                           className="js-showuserfile">联系人档案</a>
                                    </li>
                                    {/* <li><i className="icon iconfont">&#xe61d;</i><a href="#!">删除</a></li>*/}
                                </ul>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }
}

//主数据页面类
class MasterData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_source_count: 0,//覆盖了多少数据源
            mdType: 0,
            mainData: {},
            size: 7,
            mainDataCount: 0,
            index: 1,
            isShowSubMenu: false,//是否显示2级菜单
            listData: [],
            colName: [],
            mainCount: [
                {
                    "md_type": 0,
                    "tag_name": "主数据",
                    "count_rows": 0
                },
                {
                    "md_type": 1,
                    "tag_name": "人口属性",
                    "count_rows": 0
                },
                {
                    "md_type": 2,
                    "tag_name": "客户标签",
                    "count_rows": 0
                },
                {
                    "md_type": 3,
                    "tag_name": "埋点统计",
                    "count_rows": 0
                },
                {
                    "md_type": 4,
                    "tag_name": "会员卡记录",
                    "count_rows": 0
                },
                {
                    "md_type": 5,
                    "tag_name": "登录行为",
                    "count_rows": 0
                },
                {
                    "md_type": 6,
                    "tag_name": "支付记录",
                    "count_rows": 0
                },
                {
                    "md_type": 7,
                    "tag_name": "购物记录",
                    "count_rows": 0
                },
                {
                    "md_type": 8,
                    "tag_name": "微信",
                    "count_rows": 0
                }
            ]//主数据条数
        };
        //接口默认请求参数
        this.defOpts = {
            md_type: 0,
            size: 7,
            index: 1,
            time_condition: 0,
            contact_wayList: 0,
            contactIds: [],
            md_types: [1, 2, 3, 4, 5, 6, 7],
            taskIds: [],
            customViews: []
        };
        this.canClick = true;//用于控制滚动动画过程中不许连点
    }


    componentDidMount() {
        let that = this;
        util.api({
            data: {
                "method": "mkt.data.main.count.get"
            },
            success: function (resData) {
                let mainData = [], mainDataCount = 0;
                if (!_.isEmpty(resData.data)) {
                    mainData = _.where(resData.data, {md_type: 0})[0];
                    mainDataCount = mainData.count_rows;
                }
                that.setState({
                    data_source_count: resData.data_source_count || 0,
                    mainData: mainData,
                    mainDataCount: mainDataCount
                })
            }
        });
        this.postList();
        this.setPagination();
        $('.selectdataype-wrap .checkitem').eq(0).click();
        // bodyClose($('.dataypetip'), function () {
        //     $('.dataypetip').hide();
        // });
    }

    //获取列表数据
    postList(opts) {
        let that = this;
        let defOpts = _.extend(this.defOpts, opts || {});
        util.api({
            url: "?method=mkt.data.filter.audiences.get",
            type: 'post',
            data: {
                md_type: defOpts.md_type,
                size: defOpts.size,
                contact_wayList: defOpts.contact_wayList,
                md_types: defOpts.md_types,
                time_condition: defOpts.time_condition,
                index: defOpts.index,
                contact_ids: defOpts.contactIds,
                task_ids: defOpts.taskIds,
                customize_views: defOpts.customViews
            },
            success: function (res) {
                let tag_name = '主数据';
                switch (defOpts.md_type) {
                    case 0:
                        tag_name = '主数据';
                        break;
                    case 1:
                        tag_name = '人口属性';
                        break;
                    case 2:
                        tag_name = '客户标签';
                        break;
                    case 3:
                        tag_name = '埋点统计';
                        break;
                    case 4:
                        tag_name = '会员卡记录';
                        break;
                    case 5:
                        tag_name = '登录行为';
                        break;
                    case 6:
                        tag_name = '支付记录';
                        break;
                    case 7:
                        tag_name = '购物记录';
                        break;
                }
                that.setState({
                    listData: res.data,
                    colName: res.col_names,
                    mdType: defOpts.md_type,
                    mainData: {
                        count_rows: res.total_count,
                        tag_name: tag_name
                    },
                    mainCount: res.countList,
                    isShowSubMenu: false
                });
                $('.pagination-wrap').pagination('updateItems', res.total_count);
            }
        });

    }


    //快捷筛选弹框
    screen() {
        let that = this;
        if (this.screenModals) {
            this.screenModals.show();
        } else {
            this.screenModals = new ScreenModals({
                title: '快速筛选',
                id: 'quick-screen',
                content: `<div class="subtitle">您可以在此选择不同的筛选方式来定位数据</div>
    <div class="con-body">
        <div class="swrap clearfix">
            <span class="left">筛选</span>
                <span class="left" style="width: 120px;margin-top: -4px;">
                <select id="select-recenttask">
                    <option value="h">近1小时之内</option>
                    <option value="d">近1天之内</option>
                    <option value="w">近1周之内</option>
                </select>
                    </span>
            <span class="left">接入数据</span>
        </div>
        <div class="data-wrap"></div>
    </div>`,
                buttons: [
                    {
                        text: '确定',
                        cls: 'accept',
                        handler: function (self) {
                            self.close();
                            let taskArr = [];
                            let contactArr = [];
                            $('#tasklistwrap input:checked', self.$el).each(function (i, m) {
                                let idStr = $(m).attr('id');
                                taskArr.push(Number(idStr.slice(idStr.indexOf('-') + 1)));
                            });
                            $('#contactlistwrap input:checked', self.$el).each(function (i, m) {
                                let idStr = $(m).attr('id');
                                contactArr.push(Number(idStr.slice(idStr.indexOf('-') + 1)));
                            });
                            //设置分页时 index 要重新设置
                            that.defOpts.index = 1;
                            that.postList({
                                contactIds: contactArr,
                                taskIds: taskArr
                            });
                            that.setPagination();

                        }
                    },
                    {
                        text: '取消',
                        cls: 'decline',
                        handler: function (self) {
                            self.close();
                        }
                    }
                ]
            })
        }
    }

    //自定义视图
    customView() {
        let that = this;
        let mdtData = [];
        if (this.customViewModals) {
            this.customViewModals.show();
        } else {
            this.customViewModals = new Modals.Window({
                title: "自定义视图",
                width:1000,
                content: '<div class="subtitle">您可以在此定义不同数据源的显示属性，组织自己的视图</div><div class="con-body"/>',
                id: 'rui-window-customview',
                buttons: [
                    {
                        text: '确定',
                        cls: 'accept',
                        handler: function (self) {
                            self.close();
                            //设置分页时 index 要重新设置
                            that.defOpts.index = 1;
                            that.postList({
                                customViews: self.customView.state.listData,
                                md_type: self.customView.state.mdType
                            });
                            that.setPagination();
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
                        this.customView = ReactDOM.render(
                            <CustomView mainCount={that.state.mainCount}/>,
                            $('.con-body', this.$el)[0]
                        );
                    }
                }
            })
        }
    }

    //数据源切换
    handleChangeData(m, e) {
        let meEl = $(e.currentTarget);
        $('.itemlistwrap li').removeClass('cur');
        meEl.addClass('cur');
        this.setState({
            mainData: m
        });
        //设置分页时 index 要重新设置
        this.defOpts.index = 1;
        this.postList({
            md_type: m.md_type
        });
        this.setPagination();
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
                        md_type: that.state.mdType,
                        index: pageNumber
                    });
                }
            });
        }
    }

    //数据下载
    handDonwloadData() {
        util.api({
            timeout: 1000 * 60,
            data: {
                method: "mkt.data.main.list.download",
                md_type: this.state.mdType
            },
            success: function (res) {
                if (res.code == 0) {
                    location.href = FILE_PATH + res.data[0].download_file_name;
                } else {
                    Materialize.toast(res.msg, 1000);
                }
            }
        });
    }

    //左右滚动
    leftScroll(condition) {
        let that = this;
        let nwrapW = $('.nwrap').width();
        let itemlistwrapEl = $('.itemlistwrap');
        let liW = $('.itemlistwrap li').width();
        let ml = Number(itemlistwrapEl.css('margin-left').replace('px', ''));
        let scrollNum = 1;//一次滚个
        let scrollspeed = 200;//滚动速度
        if (!this.canClick)return;
        if (condition) {
            that.canClick = false;
            if (nwrapW - ml > liW * 8 - 50) {
                that.canClick = true;
            } else {
                itemlistwrapEl.animate({"margin-left": ml - liW * scrollNum + "px"}, scrollspeed, function () {
                    that.canClick = true;
                });
            }

        } else {
            that.canClick = false;
            if (ml < 0) {
                itemlistwrapEl.animate({"margin-left": ml + liW * scrollNum + "px"}, scrollspeed, function () {
                    that.canClick = true;
                });
            } else {
                that.canClick = true;
            }
        }
    }

    //选中数据类型
    dataTypeSelect(e) {

        e.stopPropagation();
        // e.preventDefault();
    }

    //文件上传时间的模拟select
    selectFileUpTime(num, txt) {
        $('.fileupdatetime-btn').text(txt);
        this.postList({
            time_condition: num
        });
    }

    //联系方式模拟select
    selectContactway(num, txt) {
        $('.contactway-btn').text(txt);
        // console.info(num)
        this.postList({
            contact_wayList: num
        });
    }

    //数据类型弹层的checkbox
    changesmdl(mdType, e) {
        let itemEl = $('.selectdataype-wrap .checkitem');
        if (mdType == 0) {
            if ($(e.currentTarget).prop('checked')) {
                itemEl.prop('checked', true);
            } else {
                itemEl.prop('checked', false);
            }
        } else {
            let isAll = true;
            itemEl.each((i, m)=> {
                if (i > 0) {
                    if ($(m).prop('checked') == false) {
                        isAll = false;
                    }
                }

            });
            if (isAll) {
                itemEl.eq(0).prop('checked', true);
            } else {
                itemEl.eq(0).prop('checked', false);
            }
        }
    }

    datatypeBtn() {
        $('.selectdataype-wrap').fadeIn();
    }

    selectcancel() {
        $('.selectdataype-wrap').fadeOut();
    }

    selectsubmit() {
        let itemEl = $('.selectdataype-wrap .checkitem');
        let arr = [];
        let nameArr = [];
        itemEl.each((i, m)=> {
            if (i > 0) {
                if ($(m).prop('checked')) {
                    arr.push(Number($(m).attr('id').replace('smdl-', '')));
                    nameArr.push($(m).attr('data-txt'))
                }
            }

        });
        this.postList({
            md_types: arr
        });
        if (_.isEmpty(nameArr)) {
            nameArr = '请选择'
        }
        if (nameArr.length >= 7) {
            nameArr = '全部'
        }
        $('.datatype-btn').text(nameArr);
        $('.selectdataype-wrap').fadeOut();
    }

    //渲染
    render() {
        let data = this.state.mainCount;
        return (
            <div className="masterdata">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">主数据管理</span>
                        <span className="text">
                        联系人主数据总计
                            <span className="variable">{_.str.numberFormat(this.state.mainDataCount)}</span>
                            条，覆盖
                            <span className="variable">{this.state.data_source_count}</span>
                            个数据源
                            <a href="/html/data-supervise/quality-report.html" className="a variable">查看数据质量报告</a>
                        </span>
                    </div>

                    <div className="button-box icon iconfont">
                        <a href="javascript:;" className="a keyong" title="下载当前数据" onClick={this.handDonwloadData.bind(this)}>
                            <span className="icon iconfont">&#xe643;</span>
                            <span className="text">下载</span>
                        </a>
                        <a className="a keyong fnbtn-customview" title="自定义视图" onClick={this.customView.bind(this)}>
                            <span className="icon iconfont">&#xe60f;</span>
                            <span className="text">自定义</span>
                        </a>
                    </div>
                </header>

                <div className="content">
                    <div className="con-topwrap clearfix">
                        <span className="tit">数据类型</span> <span className="selectbtn datatype-btn"
                                                                onClick={this.datatypeBtn.bind(this)}>全部</span> <span
                        className="tit">文件上传时间</span>
                        <span className="selectbtn dropdown-button fileupdatetime-btn"
                              data-activates="fileupdatetime-list"
                              data-beloworigin="true">全部</span> <span className="tit">联系方式</span> <span
                        className="selectbtn dropdown-button contactway-btn" data-activates="contactway-list"
                        data-beloworigin="true">全部</span>
                        <div className="selectdataype-wrap">
                            <ul>

                                {data.map(m=> {
                                    m.name = m.tag_name;
                                    if (m.tag_name == '主数据')m.name = '全部';
                                    return (
                                        <li>
                                            <input type="checkbox"
                                                   data-txt={m.name}
                                                   className="filled-in checkitem" id={"smdl-"+m.md_type}
                                                   onChange={this.changesmdl.bind(this,m.md_type)}/>
                                            <label htmlFor={"smdl-"+m.md_type} className="mylabel">{m.name}</label>
                                        </li>
                                    )

                                })}

                            </ul>
                            <div className="btn-wrap">
                                <div className="btn mr10" onClick={this.selectsubmit.bind(this)}>确定</div>
                                <div className="btn btn-cl" onClick={this.selectcancel.bind(this)}>取消</div>
                            </div>
                        </div>
                        <ul id="fileupdatetime-list" className="dropdown-content">
                            <li onClick={this.selectFileUpTime.bind(this,0,'全部')}>全部</li>
                            <li onClick={this.selectFileUpTime.bind(this,1,'一小时之内')}>一小时之内</li>
                            <li onClick={this.selectFileUpTime.bind(this,2,'一天之内')}>一天之内</li>
                            <li onClick={this.selectFileUpTime.bind(this,2,'一周之内')}>一周之内</li>
                        </ul>
                        <ul id="contactway-list" className="dropdown-content">
                            <li onClick={this.selectContactway.bind(this,0,'全部')}>全部</li>
                            <li onClick={this.selectContactway.bind(this,1,'手机')}>手机</li>
                            <li onClick={this.selectContactway.bind(this,2,'电子邮箱')}>电子邮箱</li>
                        </ul>

                    </div>
                    <div className="lrwrap">
                        <div className="btn-wrap">
                            <div className="btn-l icon iconfont" onClick={this.leftScroll.bind(this,0)}>&#xe66a;</div>
                            <div className="btn-r icon iconfont" onClick={this.leftScroll.bind(this,1)}>&#xe669;</div>
                        </div>
                        <div className="nwrap">
                            <ul className="itemlistwrap clearfix">
                                {data.map((m, i)=> {
                                    let cur = '';
                                    if (i == 0) {
                                        cur = 'cur'
                                    }
                                    return (
                                        <li onClick={this.handleChangeData.bind(this,m)} className={cur}>
                                            <div className="logo left">
                                                <img src={"/img/masterdata/"+m.md_type+".png"}/>
                                            </div>
                                            <div className="info left">
                                                <div className="num">{m.count_rows}</div>
                                                <div className="tit">{m.tag_name}</div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>


                    <div className="table-list-wrap ">
                        <DataList colName={this.state.colName} listData={this.state.listData}
                                  mdType={this.state.mdType}/>
                    </div>

                    <div className="pagination-wrap pagination"></div>
                </div>
            </div>
        )

    }
}

//渲染
const masterData = ReactDOM.render(
    <MasterData />,
    document.getElementById('page-body')
);

//显示左右按钮
let shBtn = function () {
    let nwarpW = $('.lrwrap .nwrap').width();
    let liW = 186;
    if (nwarpW >= 1488) {
        $('.lrwrap .btn-wrap').hide()
    } else {
        $('.lrwrap .btn-wrap').show()
    }
};
shBtn();
util.onResize(shBtn);//注册事件


export default MasterData;



/**
 * Created by lxf on 2016/12/1.
 * 优惠券列表页
 */
'use strict';
import Layout from 'module/layout/layout';
let pagination = require('plugins/pagination')($);//分页插件
let Modals = require('component/modals.js');
const layout = new Layout({
    index: 2,
    leftMenuCurName: '优惠券'
});


class CouponList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            couponCount: {
                unrelease_count: 0,
                occupy_count: 0,
                releasing_count: 0,
                released_count: 0,
                total: 0
            },
            pageSize: 12,
            pageIndex: 1,
            keyword: '',
            channelCode: 'sms',//渠道编码；msm:短信渠道,wechat:微信
            couponStatus: '',//状态编码;unused:未投放，used:已占用，released：已投放 releasing：投放中,全部则不需要传递此参数
            listData: [],
            colNames: []
        }

    }

    //实例化之后
    componentDidMount() {
        this.getCouponCount();
        this.fetch();
        this.setPagination();
    }

    //渲染后
    componentDidUpdate() {
        $('ul.tabs').tabs();
        $('.dropdown-button').dropdown();
    }

    //选择任务状态
    selectTaskStatus(val, e) {
        $('.subtab-wrap .tab').removeClass('active');
        $(e.currentTarget).addClass('active');
        let keyword=this.state.keyword;
        this.setState({
            pageIndex: 1,
            keyword,
            couponStatus: val
        }, () => {
            this.fetch()
        });

    }


    //搜索
    searchTask(e) {
        if (e.keyCode == 13) {
          this.fetchSearch();
        }
    }
    fetchSearch(){
        let pageIndex=1;
        this.setState({
            pageIndex
        },()=>{
            this.getCouponCount();
            $('.pagination-wrap').pagination('selectPage', 1);

            //this.fetch();

        })
    }
    //删除任务
    delTask(id, e) {
        let that = this;
        if ($(e.currentTarget).hasClass('disable')) {
            return
        }

        new Modals.Confirm({
            title: '提示',
            content: "您确实要删掉这条信息吗？",
            buttons: [{
                text: "确认", type: "ok", handler: function (thiz) {
                    util.api({
                        url: "?method=mkt.material.coupon.delete",
                        type: 'post',
                        data: {
                            id: id
                        },
                        success: function (response) {
                            if (response.code == 0) {
                                that.fetch();
                            } else {
                                thiz.close(true);
                                new Modals.Alert({
                                    title: '错误',
                                    content: response.msg,
                                })
                            }
                        }
                    });
                    thiz.close(true)
                }
            }, {
                text: "取消", type: "cancel", handler: function (thiz) {
                    thiz.close(false)
                }
            }],
        });
    }

    getCouponCount() {
        let that = this;
        util.api({
            data: {
                method: 'mkt.material.coupon.counts',
                channel_code: this.state.channelCode,
                keyword: this.state.keyword
            },
            success: function (response) {
                if (response.code != 0)return;
                that.setState({
                    couponCount: {
                        unrelease_count: response.data[0].unrelease_count,
                        occupy_count: response.data[0].occupy_count,
                        releasing_count: response.data[0].releasing_count,
                        released_count: response.data[0].released_count,
                        total: response.data[0].total
                    }
                });
            }
        });
    }

    fetch() {
        let that = this;
        console.log('fetch', this.state.pageIndex)
        util.api({
            data: {
                method: 'mkt.material.coupon.list',
                index: this.state.pageIndex,
                size: this.state.pageSize,
                channel_code: this.state.channelCode,
                coupon_status: this.state.couponStatus,
                keyword: this.state.keyword
            },
            success: function (response) {
                if (response.code != 0)return;
                that.setState({
                    totalCount: response.total_count || 0,
                    listData: response.data,
                    colNames: response.col_names
                });
                $('.pagination-wrap').pagination('updateItems', response.total_count);
            }
        });

    }

    //实例化分页插件
    setPagination() {
        var that = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: this.state.pageSize,
                onPageClick: function (pageNumber, event) {
                    that.setState({
                        pageIndex: pageNumber
                    }, () => {
                        that.fetch();
                    });

                }
            });
        }
    }

    render() {
        let that = this;
        let colNames = this.state.colNames;
        let listData = this.state.listData;
        return (
            <div className="coupon-list">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">优惠券</span>
                    </div>
                    <div className="button-box">
                        <a className="a keyong" title="新建优惠券" href="/html/coupon/new.html">
                            <span className="icon iconfont">&#xe63b;</span>
                            <span className="text">新建优惠券</span>
                        </a>
                    </div>
                </header>
                <div className="content">
                    <div className="filterbar clearfix">
                        <div className="tab-btnwrap">
                            <ul className="tabs">
                                <li className="tab"><a href="" className="active">短信渠道</a></li>
                            </ul>
                        </div>
                        <div className="search-area">
                            <div className="search-box">
                                <input id="search-input" className="input" value={this.state.keyword}

                                       maxLength="10"
                                       placeholder="请输入名称关键字"
                                       onKeyUp={this.searchTask.bind(this)}
                                       onChange={function (e) {
                                           let val = $.trim(e.target.value) || '';
                                           that.setState({
                                               keyword: val
                                           });
                                       }
                                       }
                                />
                                <div onClick={this.fetchSearch.bind(this)} style={{cursor:'pointer'}} className="icon iconfont"></div>
                            </div>
                        </div>
                    </div>
                    <div className="tip-infobox">
                        <div className="text-box clearfix">
                            <div className="ico-wrap left">
                                <div className="icon iconfont">&#xe63a;</div>
                            </div>
                            <div className="txt left">所有已生成的优惠码，您可以直接接入各渠道使用，在线核销目前支持短信平台</div>
                        </div>
                    </div>
                    <div className="subtab-wrap">
                        <div className="title">优惠券列表</div>
                        <ul className="tabs-wrap">
                            <li onClick={this.selectTaskStatus.bind(this, 'unused')} className="tab">
                                未投放({this.state.couponCount.unrelease_count})
                            </li>
                            <li onClick={this.selectTaskStatus.bind(this, 'used')} className="tab">
                                已占用({this.state.couponCount.occupy_count})
                            </li>
                            <li onClick={this.selectTaskStatus.bind(this, 'released')} className="tab">
                                已投放({this.state.couponCount.released_count})
                            </li>
                            <li onClick={this.selectTaskStatus.bind(this, 'releasing')} className="tab">
                                投放中({this.state.couponCount.releasing_count})
                            </li>
                            <li onClick={this.selectTaskStatus.bind(this, '')} className="tab active">
                                全部({this.state.couponCount.total})
                            </li>
                        </ul>
                    </div>
                    <div className="table-area">
                        <ul className="row task-list-wrap">
                            {listData.map((m, index) => {
                                let taskStatus = m.coupono_status;//状态枚举;unused:未投放，used:已占用，released：已投放releasing：投放中
                                let statuClass = '';
                                let statusName = '';
                                let disableClass = '';
                                let delDisableClass = '';
                                let editHref = '';
                                switch (taskStatus) {
                                    case 'unused':
                                        statuClass = 'statu-gray';
                                        statusName = '未投放';
                                        break;
                                    case 'released':
                                        statuClass = 'statu-purple';
                                        statusName = '已投放';
                                        break;
                                    case 'releasing':
                                        statuClass = 'statu-cyan';
                                        statusName = '投放中';
                                        disableClass = 'disable';
                                        break;
                                    case 'used':
                                        statuClass = 'statu-dark-gray';
                                        statusName = '已占用';
                                        disableClass = 'disable';
                                        break;
                                }
                                m.statusName = statusName;

                                if (taskStatus != 'unused') {
                                    delDisableClass = 'disable';
                                    editHref = 'javascript:;'
                                } else {
                                    editHref = "/html/coupon/edit.html?id=" + m.id + "&amount=" + m.amount
                                }
                                return (
                                    <li className="col s3">
                                        <div className="block">
                                            <div className="item-header clearfix">
                                                <div className="status-ico">
                                                    <div className={statuClass}><span
                                                        className="statu-text">{m.statusName}</span><span
                                                        className="statu-horn"></span></div>
                                                </div>
                                                <div title="操作" className="icon iconfont dropdown-button"
                                                     data-activates={"deltask-droplist" + m.id}
                                                     data-constrainwidth="false"
                                                     data-beloworigin="true"
                                                >&#xe675;</div>

                                                <a title="详情" className="icon iconfont"
                                                   href={'/html/coupon/detail.html?id=' + m.id}>&#xe627;</a>
                                                <ul id={"deltask-droplist" + m.id} className="dropdown-content"
                                                    style={{width: '100px;'}}>
                                                    <li className={delDisableClass}>
                                                        <a href={editHref}>
                                                            <i
                                                                className="icon iconfont "
                                                                style={{
                                                                    float: 'left',
                                                                    margin: '2px 10px 0 0;'
                                                                }}>&#xe609;</i><span
                                                            className="">编辑</span>
                                                        </a>
                                                    </li>
                                                    <li className={delDisableClass}
                                                        onClick={this.delTask.bind(this, m.id)}>
                                                        <i
                                                            className="icon iconfont "
                                                            style={{
                                                                float: 'left',
                                                                margin: '2px 10px 0 0;'
                                                            }}>&#xe674;</i><span
                                                        className="">删除</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="task-bg"></div>
                                            <div className="item-body">

                                                <div className="task-name">
                                                    {m.title}
                                                </div>
                                                <div className="item-timer"><span
                                                    className="subt">创建于</span> <span
                                                    className="txt">{util.formatDate(m.create_time)}</span>
                                                </div>
                                                <div className="ft clearfix">
                                                    <div className="left">库存 <span
                                                        className="fc-blue">{_.str.numberFormat(m.stock_rest)}</span>/{_.str.numberFormat(m.stock_total)}
                                                    </div>
                                                    <div className="right">短信渠道</div>
                                                </div>
                                            </div>

                                        </div>
                                    </li>
                                )
                            })}


                        </ul>
                        <div className="rui-total-count">共<span id="tbodyTotalCount">{this.state.totalCount}</span>条</div><div className="pagination-wrap pagination">...</div>
                    </div>
                </div>
            </div>
        )
    }
}


//渲染
const couponList = ReactDOM.render(
    <CouponList />,
    document.getElementById('page-body')
);


module.exports = CouponList;
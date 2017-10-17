/**
 * Created by lxf on 2016/12/1.
 * 核销对账
 */
import Layout from 'module/layout/layout';
let pagination = require('plugins/pagination')($);//分页插件
let Modals = require('component/modals.js');
const layout = new Layout({
    index: 2,
    leftMenuCurName: '优惠券'
});
//状态码转换文字
let translateStatus = (statusCode) => {
    switch (statusCode) {
        case 'verified':
            return '使用成功';
            break;
        case 'unverify':
            return '未使用';
            break;
        case 'fail':
            return '使用异常';
            break;
    }
};
class CreateCrowd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showErr: false,
            name: '',
            receive_status: '',
            verify_status: '',
            expire_status: ''
        };
    }

    submit(self, cb) {
        let that = this;
        let val = $.trim(this.state.name);
        if (val == '') {
            this.setState({
                showErr: true
            });
        } else {
            this.setState({
                showErr: false
            });
            let queryString = this.props.fdata.queryString;
            util.api({
                url: "?method=mkt.material.coupon.audience.create",
                type: 'post',
                data: {
                    name: val,
                    id: queryString.id,
                    blur_search: queryString.blur_search,
                    receive_status: queryString.receive_status,
                    verify_status: queryString.verify_status,
                    expire_status: queryString.expire_status
                },
                success: function (res) {
                    if (res.code == 0) {
                        new Modals.Alert({
                            title: '新建人群成功',
                            content: '请稍后去往人群管理中查看'
                        });
                        cb();
                        //  window.location.href = '/html/audience/crowd.html';
                    }
                }
            });
        }
    }

    render() {
        let fData = Object.assign({
            totalCount: 0,
            selectNames: {
                receive: '',
                verify: '',
                expire: ''
            }
        }, this.props.fdata);

        return (
            <div>
                <h6>固定人群名称</h6>
                <input type="text" placeholder="请填写一个人群名称" value={this.state.name}
                       onChange={(e) => {
                           {/*let val = $.trim(e.target.value) || '';*/
                           }

                           this.setState({
                               name: e.target.value
                           })
                       }}
                />
                <div className={this.state.showErr ? 'err-tip' : 'fn-hide'}>固定人群名称不能为空</div>
                <h6 className="mt40">筛选目标人群</h6>
                <h6 className="fc-666">[覆盖用户{fData.totalCount}]</h6>
                <ul className="select-itemwrap clearfix">
                    <li>
                        <div className="left">{fData.selectNames.receive}</div>
                        <div className="right">
                            <span className="icon iconfont">&#xe610;</span>
                        </div>
                    </li>
                    <li>
                        <div className="left">{fData.selectNames.verify}</div>
                        <div className="right">
                            <span className="icon iconfont">&#xe610;</span>
                        </div>
                    </li>
                    <li>
                        <div className="left">{fData.selectNames.expire}</div>
                        <div className="right">
                            <span className="icon iconfont">&#xe610;</span>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}
class Reconciliation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: true,
            queryString: {
                method: 'mkt.material.coupon.verify.list',
                id: util.getLocationParams().id,//优惠券主键
                blur_search: '',//查询关键字
                receive_status: 'received',//收到状态(received-收到 unreceived-未收到)
                verify_status: 'verified',//使用状态（verified -使用成功 unverify -未使用 fail -使用异常）
                expire_status: 'unexpired',//过期状态(expired - 过期 unexpired-未过期))
                index: 1,
                size: 10
            },
            selectNames: {
                receive: '已收到',
                verify: '已使用',
                expire: '未过期'
            },
            expiredStatus: [],
            receivedStatus: [],
            verifyStatus: [],
            listData: []
        }

    }

    //实例化之后
    componentDidMount() {
        this.getCouponDict();
        this.fetch();
        this.setPagination();
    }

    //渲染后
    componentDidUpdate() {
        $('ul.tabs').tabs();
        $('.dropdown-button').dropdown();
    }

    //搜索
    searchTask(e) {


        if (e.keyCode != 13) return;
        this.setState({
            queryString: Object.assign(this.state.queryString, {
                index: 1
            })
        }, () => {

            this.fetch();
            $('.pagination-wrap li').eq(1).find('a').click();
        })

    }

    //选择
    selectBar(key, value, name) {
        let _this = this;
        this.setState({
            queryString: Object.assign(this.state.queryString, {
                [key + '_status']: value
            }),
            selectNames: Object.assign(this.state.selectNames, {
                [key]: name
            })
        }, () => {
            _this.fetch();
        });

    }

    //核销对账数据字典
    getCouponDict(opts) {
        let that = this;
        util.api({
            data: {
                method: 'mkt.material.coupon.dictionary'
            },
            success: function (response) {
                let data = response.data[0];
                that.setState({
                    expiredStatus: data.expiredStatus,
                    receivedStatus: data.receivedStatus,
                    verifyStatus: data.verifyStatus
                });

            }
        });
    }

    //请求数据
    fetch(opts) {
        let that = this;
        util.api({
            data: this.state.queryString,
            success: function (response) {
                that.setState({
                    totalCount: response.total_count || 0,
                    listData: response.data
                });
                $('.pagination-wrap').pagination('updateItems', response.total_count);
            }
        });
    }

    //实例化分页插件
    setPagination() {
        let that = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: this.state.queryString.size,
                onPageClick: function (pageNumber, event) {
                    that.setState({
                        queryString: Object.assign(that.state.queryString, {
                            index: pageNumber
                        })
                    }, () => {
                        that.fetch();
                    });

                }
            });
        }
    }

    //新建固定人群
    showCreateCrowd() {
        let that = this;
        new Modals.Window({
            title: "新建固定人群",
            width: 500,
            content: '<div class="subtitle"></div><div class="con-body"></div>',
            id: 'rui-window-newcrowd',
            buttons: [
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {

                        this.createCrowd.submit(self, function () {
                            self.close();
                        })
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
                    this.createCrowd = ReactDOM.render(
                        <CreateCrowd fdata={that.state}/>,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        })
    }

    //渲染
    render() {
        let that = this;
        let listData = this.state.listData;
        let tbodyStr = '';
        if (this.state.showLoading) {
            tbodyStr = <tbody>
            <tr>
                <td colSpan="7" className="t-c loadding-wrap"><img src="/img/loading.gif" alt=""/></td>
            </tr>
            </tbody>
        }
        if (_.isEmpty(listData)) {
            tbodyStr = <tbody>
            <tr>
                <td colSpan="7" className="t-c">暂无数据</td>
            </tr>
            </tbody>
        } else {
            tbodyStr = <tbody>
            {listData.map((m, i) => {
                return (
                    <tr>
                        <td>{m.id}</td>
                        <td>{m.code}</td>
                        <td>{m.user}</td>
                        <td className="t-r">{util.numberFormat(m.amount)}</td>
                        <td>{translateStatus(m.status)}</td>
                        <td>{m.verify_time ? util.formatDate(m.verify_time / 1000) : ''}</td>
                        <td>{m.channel_code == 'sms' && '短信渠道'}</td>
                    </tr>
                )
            })}
            </tbody>
        }
        let createCrowdClass = _.isEmpty(listData) ? 'disable' : '';
        return (
            <div className="reconciliation">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">优惠券</span>
                    </div>
                    <div className="button-box icon iconfont"><a className="a keyong" title="返回"
                                                                 href=""
                                                                 onClick={() => {
                                                                     window.history.back();
                                                                 }}
                    ></a>
                    </div>
                </header>
                <div className="content">
                    <div className="subtitle">券码核销</div>
                    <div className="filterbar clearfix">
                        <span className="tit">收到状态</span>
                        <span className="selectbtn datatype-btn dropdown-button"
                              data-activates="receive-droplist"
                              data-beloworigin="true"
                        >{this.state.selectNames.receive}</span>
                        <span className="tit">使用状态</span>
                        <span className="selectbtn datatype-btn dropdown-button"
                              data-activates="verify-droplist"
                              data-beloworigin="true"
                        >{this.state.selectNames.verify}</span>
                        <span className="tit">过期状态</span>
                        <span className="selectbtn datatype-btn dropdown-button"
                              data-activates="expire-droplist"
                              data-beloworigin="true"
                        >{this.state.selectNames.expire}</span>
                        <ul id="receive-droplist" className="dropdown-content">
                            {this.state.receivedStatus.map((m) => {
                                return (
                                    <li onClick={this.selectBar.bind(this, 'receive', m.code, m.desc)}>{m.desc}</li>
                                )
                            })}
                        </ul>
                        <ul id="verify-droplist" className="dropdown-content">
                            {this.state.verifyStatus.map((m) => {
                                return (
                                    <li onClick={this.selectBar.bind(this, 'verify', m.code, m.desc)}>{m.desc}</li>
                                )
                            })}
                        </ul>
                        <ul id="expire-droplist" className="dropdown-content">
                            {this.state.expiredStatus.map((m) => {
                                return (
                                    <li onClick={this.selectBar.bind(this, 'expire', m.code, m.desc)}>{m.desc}</li>
                                )
                            })}
                        </ul>
                        <div className={"button-main-2 right " + createCrowdClass} onClick={() => {
                            if (createCrowdClass == 'disable')return;
                            this.showCreateCrowd()
                        }}>新建固定人群
                        </div>
                    </div>
                    <div className="search-area clearfix">
                        <div className="search-box">
                            <input id="search-input" className="input" value={this.state.queryString.blur_search}
                                   placeholder="请输入领取用户"
                                   onKeyUp={this.searchTask.bind(this)}
                                   onChange={function (e) {
                                       let val = $.trim(e.target.value) || '';
                                       that.setState({
                                           queryString: Object.assign(that.state.queryString, {
                                               blur_search: val
                                           })

                                       });
                                   }
                                   }
                            />
                            <div className="icon iconfont"></div>
                        </div>
                    </div>
                    <div className="table-area">
                        <div className="table-list-wrap">
                            <table className="page-table-box">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>券码</th>
                                    <th>领取用户</th>
                                    <th>核销内容(&#165;)</th>
                                    <th>状态</th>
                                    <th>核销时间</th>
                                    <th>渠道</th>
                                </tr>
                                </thead>
                                {tbodyStr}
                            </table>
                        </div>
                        <div className="rui-total-count">共<span id="tbodyTotalCount">{this.state.totalCount}</span>条
                        </div>
                        <div className="pagination-wrap pagination">...</div>
                    </div>
                </div>
            </div>
        )
    }
}

//渲染
const reconciliation = ReactDOM.render(
    <Reconciliation />,
    document.getElementById('page-body')
);


module.exports = Reconciliation;
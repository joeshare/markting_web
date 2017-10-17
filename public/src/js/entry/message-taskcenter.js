/**
 * Created by richard on 2016-10-12.
 * 短信应用 - 任务中心
 */
'use strict';
import Layout from 'module/layout/layout';
let pagination = require('plugins/pagination')($);//分页插件
let Modals = require('component/modals.js');
const layout = new Layout({
    index: 2,
    leftMenuCurName: '任务中心'
});


class MessageTaskcenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectTaskStatusBtnTxt: '全部',
            selectSmsTypeBtnTxt: '全部',
            pageSize: 12,
            pageIndex: 1,
            taskName: '',
            taskStatus: '',//任务状态: 0:未启动、1:已预约、2:执行中、3:暂停中、4:已结束
            smsType: '',//渠道类型：0:营销短信模板,1:服务通知模板,2：短信验证码模板
            listData: [],
            colNames: []
        }

    }

    //实例化之后
    componentDidMount() {
        this.fetch();
        this.setPagination();
    }

    //渲染后
    componentDidUpdate() {
        $('ul.tabs').tabs();
        $('.dropdown-button').dropdown();
    }

    //选择任务状态
    selectTaskStatus(val, txt) {
        this.setState({
            selectTaskStatusBtnTxt: txt,
            taskStatus: val
        });
        // this.fetch({
        //     taskStatus: val
        // });
    }

    //选择渠道类型
    selectSmsType(val, txt) {
        this.setState({
            selectSmsTypeBtnTxt: txt,
            smsType: val
        });
        // this.fetch({
        //     smsType: val
        // });
    }

    //筛选
    filterData(e) {

        this.fetch({
            taskName: ''
        });
    }

    //搜索
    searchTask(e) {
        if (e.keyCode == 13) {
            this.setState({
                selectTaskStatusBtnTxt: '全部',
                selectSmsTypeBtnTxt: '全部',
                taskStatus: '',//任务状态: 0:未启动、1:已预约、2:执行中、3:暂停中、4:已结束
                smsType: '',//渠道类型：0:营销短信模板,1:服务通知模板,2：短信验证码模板
            });
            this.fetch()
        }
    }

    //发布任务
    publishTask(id, e) {
        let that = this;
        if ($(e.currentTarget).hasClass('disable')) {
            return
        }

        new Modals.Confirm({
            title: '提示',
            content: "确认发布当前任务？",
            buttons: [{
                text: "确认", type: "ok", handler: function (thiz) {
                    util.api({
                        data: {
                            method: 'mkt.sms.smstaskhead.publish',
                            sms_task_head_id: id,

                        },
                        success: function (response) {
                            if (response.code == 0) {
                                that.fetch();
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

    //删除任务
    delTask(id, e) {
        let that = this;
        if ($(e.currentTarget).hasClass('disable')) {
            return
        }

        new Modals.Confirm({
            title: '提示',
            content: "确认删除当前任务？",
            buttons: [{
                text: "确认", type: "ok", handler: function (thiz) {
                    util.api({
                        url: "?method=mkt.sms.task.delete",
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

    fetch(opts) {
        let that = this;
        let defOpts = _.extend(this.state, opts || {});

        util.api({
            data: {
                method: 'mkt.sms.smstaskhead.list.get',
                index: defOpts.pageIndex,
                size: defOpts.pageSize,
                sms_task_name: defOpts.taskName,
                sms_task_app_type: defOpts.smsType,
                sms_task_status: defOpts.taskStatus
            },
            success: function (response) {
                that.setState({
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
                    that.fetch({
                        pageIndex: pageNumber
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
            <div className="message-taskcenter">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">任务中心</span>
                    </div>
                    <div className="button-box">
                        <a className="a keyong" title="新建短信任务"
                                                                 href="/html/message-app/message-marketingmessage.html">
                            <span className="icon iconfont">&#xe63b;</span>
                            <span className="text">新建任务</span>
                        </a>
                    </div>
                </header>
                <div className="content">
                    <div className="filterbar clearfix">
                        <span className="tit">任务状态</span>
                        <span className="selectbtn datatype-btn dropdown-button"
                              data-activates="selecttasstatus-droplist"
                              data-beloworigin="true"
                        >{this.state.selectTaskStatusBtnTxt}</span>
                        <span className="tit">短信类型</span>
                        <span className="selectbtn datatype-btn dropdown-button"
                              data-activates="selectsmstype-droplist"
                              data-beloworigin="true"
                        >{this.state.selectSmsTypeBtnTxt}</span>
                        <span className="button-main-3"
                              onClick={this.filterData.bind(this)}>筛选</span>
                        <div className="search-area">
                            <div className="search-box">
                                <input id="search-input" className="input" value={this.state.taskName}
                                       placeholder="请输入名称关键字"
                                       onKeyUp={this.searchTask.bind(this)}
                                       onChange={function(e) {
                                          let val = $.trim(e.target.value) || '';
                                            that.setState({
                                                taskName: val
                                            });
                                       }
                                       }
                                />
                                <div className="icon iconfont"></div>
                            </div>
                        </div>
                        <ul id="selecttasstatus-droplist" className="dropdown-content">
                            <li onClick={this.selectTaskStatus.bind(this,'','全部')}>全部</li>
                            <li onClick={this.selectTaskStatus.bind(this,0,'未启动')}>未启动</li>
                            <li onClick={this.selectTaskStatus.bind(this,2,'执行中')}>执行中</li>
                            <li onClick={this.selectTaskStatus.bind(this,4,'已结束')}>已结束</li>
                        </ul>
                        <ul id="selectsmstype-droplist" className="dropdown-content">
                            <li onClick={this.selectSmsType.bind(this,'','全部')}>全部</li>
                            <li onClick={this.selectSmsType.bind(this,0,'营销短信模板')}>营销短信模板</li>
                            <li onClick={this.selectSmsType.bind(this,1,'服务通知模板')}>服务通知模板</li>

                        </ul>
                    </div>
                    <div className="table-area">
                        <ul className="row task-list-wrap uat-msgtaskcenter-ul">
                            {listData.map((m, index)=> {
                                let taskStatus = m.smsTaskStatus;//任务状态: 0:未启动、1:已预约、2:执行中、3:暂停中、4:已结束
                                let statuClass = '';
                                let disableClass = '';
                                let delDisableClass = '';
                                switch (taskStatus) {
                                    case 0:
                                        statuClass = 'statu-gray';
                                        break;
                                    case 1:
                                        statuClass = 'statu-purple';
                                        break;
                                    case 2:
                                        statuClass = 'statu-cyan';
                                        disableClass = 'disable';
                                        break;
                                    case 3:
                                        statuClass = 'statu-cyan';
                                        break;
                                    case 4:
                                        statuClass = 'statu-dark-gray';
                                        disableClass = 'disable';
                                        break;
                                }
                                if (m.totalCoverNum == 0) {
                                    disableClass = 'disable';
                                }
                                if (taskStatus == 2) {
                                    delDisableClass = 'disable';
                                }
                                console.info(delDisableClass)
                                return (
                                    <li className="col s3 uat-msgtaskcenter-li">
                                        <div className="block">
                                            <div className="item-header clearfix">
                                                <div className="status-ico">
                                                    <div className={statuClass}><span
                                                        className="statu-text">{m.smsTaskStatusStr}</span><span
                                                        className="statu-horn"></span></div>
                                                </div>
                                                <div title="操作" className="icon iconfont dropdown-button"
                                                     data-activates={"deltask-droplist"+m.id}
                                                     data-constrainwidth="false"
                                                     data-beloworigin="true"
                                                >&#xe675;</div>
                                                <div title="启动" className={"icon iconfont "+disableClass}
                                                     onClick={this.publishTask.bind(this,m.id)}
                                                >&#xe633;</div>
                                                <a title="详情" className="icon iconfont"
                                                   href={'/html/message-app/message-taskdetail.html?id='+m.id}>&#xe627;</a>
                                                <ul id={"deltask-droplist"+m.id} className="dropdown-content"
                                                    style={{width:'100px;'}}>
                                                    <li className={delDisableClass}
                                                        onClick={this.delTask.bind(this,m.id)}><i href="#"
                                                                                                  className="icon iconfont "
                                                                                                  style={{
                                                    float: 'left',
    margin: '2px 10px 0 0;'
                                                    }}>&#xe674;</i><span className="">删除</span></li>
                                                </ul>
                                            </div>
                                            <div className="item-body">
                                                <div className="task-name">
                                                    {m.smsTaskName}
                                                </div>
                                                <div className="item-timer"><span
                                                    className="icon iconfont">&#xe632;</span> <span
                                                    className="txt">{m.createTimeStr}</span>
                                                </div>
                                                <ul className="rate-wrap">
                                                    <li>
                                                        <div className="clearfix">
                                                            <div className="label-name">总覆盖</div>
                                                            <div className="rate">
                                                                <span className=""
                                                                      style={{border:'solid 1px #ececec',width:m.totalCoverNumPer+'%'}}></span>
                                                            </div>
                                                        </div>
                                                        <div className="countnum">{m.totalCoverNum}</div>
                                                    </li>
                                                    <li>
                                                        <div className="clearfix">
                                                            <div className="label-name">已成功</div>
                                                            <div className="rate">
                                                                <span className="bg-blue"
                                                                      style={{width:m.sendingSuccessNumPer+'%'}}></span>
                                                            </div>
                                                        </div>
                                                        <div className="countnum">{m.sendingSuccessNum}</div>
                                                    </li>
                                                    <li>
                                                        <div className="clearfix">
                                                            <div className="label-name">已失败</div>
                                                            <div className="rate">
                                                                <span className="bg-red"
                                                                      style={{width:m.sendingFailNumPer+'%'}}></span>
                                                            </div>
                                                        </div>
                                                        <div className="countnum">{m.sendingFailNum}</div>
                                                    </li>
                                                    <li>
                                                        <div className="clearfix">
                                                            <div className="label-name">等待中</div>
                                                            <div className="rate">
                                                                <span className="bg-yellow"
                                                                      style={{width:m.waitingNumPer+'%'}}></span>
                                                            </div>
                                                        </div>
                                                        <div className="countnum">{m.waitingNum}</div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="item-footer clearfix">
                                                <div className="message-name right">{m.smsTaskAppTypeStr}</div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}


                        </ul>
                        <div className="pagination-wrap pagination">...</div>
                    </div>
                </div>
            </div>
        )
    }
}


//渲染
const messageTaskcenter = ReactDOM.render(
    <MessageTaskcenter />,
    document.getElementById('page-body')
);


module.exports = MessageTaskcenter;
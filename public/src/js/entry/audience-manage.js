/**
 * Created by liuxiaofan on 2016/12/12.
 * 细分管理
 */
'use strict';//严格模式

//构造页面
import Layout from 'module/layout/layout';

//先创建布局
const layout = new Layout({
    index: 1,
    leftMenuCurName: '细分管理'
});

//插件
//分页插件
let pagination = require('plugins/pagination')($);

//集成模块
//table loading
import TbodyLoading from 'module/table-common/table-loading';
//table 暂无数据
import TbodyFalse from 'module/table-common/table-false';

class TbodyTrue extends React.Component{
    showgrouplist(headId, e) {
        layout.showgrouplist(e, {
            data: {
                method: "mkt.segment.search.get",
                head_id: headId,//人群id
            },
            // total_count: crowdNum//总数，如果没有总数就注释掉这行
        });
    }
    donwloadGroup(id) {
        let that = this;
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
        });
    }
    delItems(id, e) {
        let that = this;
        let meEl = $(e.currentTarget);
        if (meEl.hasClass('disable')) return;
        util.api({
            url: "?method=mkt.segment.header.delete",
            type: 'post',
            data: {
                segment_head_id: id
            },
            success(res){
                if (res.code == 0) {
                    that.props.resetTabTbody();
                    Materialize.toast('删除成功！', 1000);
                } else {
                    Materialize.toast('删除失败！', 1000);
                }


            }
        });
    }
    render(){
        return(
            <tbody className="uat-subdividedmanage-tbody">
            {this.props.listData.map((m, i) => {
                let delDisableClass = '';
                let editHref = '';
                if (m.compile_status == 1) {
                    delDisableClass = 'disable';
                    editHref = 'javascript:void(0)'
                } else {
                    editHref = BASE_PATH + '/html/audience/segment.html?returnurl=' + BASE_PATH + '/html/audience/manage.html&audienceId=' + m.segment_head_id;
                }
                return (
                    <tr>
                        <td className="first uat-subdividedmanage-td">{m.segment_name}</td>
                        <td className="uat-subdividedmanage-td">{m.tag_names.join(',')}</td>
                        <td className="uat-subdividedmanage-td">{_.str.numberFormat(m.cover_count)}</td>
                        <td className="ico">
                            <ico
                                className="icon iconfont dropdown-button"
                                data-activates={"morelist" + m.segment_head_id}
                                data-constrainwidth="false"
                                title="更多操作">&#xe675;
                            </ico>
                            <ul id={"morelist" + m.segment_head_id}
                                className="dropdown-content setuplist">
                                <li className={delDisableClass}
                                    onClick={function () {
                                        window.location.href = editHref
                                    }}>
                                    <i className="icon iconfont">&#xe605;</i>
                                    <a href="javascript:void(0)">编辑</a>
                                </li>
                                <li onClick={() => {

                                    window.location.href = '/html/audience/analyze.html?segmentheadid=' + m.segment_head_id
                                }}>
                                    <i className="icon iconfont">&#xe624;</i>
                                    <a href="javascript:void(0)">分析</a>
                                </li>

                                <li onClick={this.showgrouplist.bind(this, m.segment_head_id)}>
                                    <i className="icon iconfont">&#xe668;</i>
                                    <a href="javascript:void(0)">人群中查找</a>
                                </li>
                                <li onClick={this.donwloadGroup.bind(this, m.segment_head_id)}>
                                    <i className="icon iconfont">&#xe643;
                                    </i>
                                    <a href="javascript:void(0)">下载人群</a>
                                </li>
                                <li className={delDisableClass}
                                    onClick={this.delItems.bind(this, m.segment_head_id)}>
                                    <i className="icon iconfont">&#xe674;</i>
                                    <a href="javascript:void(0)">删除</a>
                                </li>
                            </ul>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        )
    }
}

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
    resetTabTbody(){
        this.load();
        this.fetch();
    }
    tabBtn(publish_status) {
        $('.manage .search-input').val('');
        this.setState({
            keyword:'',
            publish_status: publish_status
        });
        this.fetch({
            keyword:'',
            publish_status: publish_status
        })

    }
    searchTask(e) {
        if (e.keyCode == 13) {
            this.fetch()
        }
    }
    load() {
        let that = this;
        util.api({
            data: {
                method: 'mkt.segment.publishstatus.count.get'
            },
            success(res){
                if (res.code === 0) {
                    res.data.map((m, i) => {
                        m.name = that.state.tabMenuData[i].name
                    });
                    that.setState({
                        tabMenuData: res.data
                    });
                }
            }
        })
    }
    fetch(opts) {
        let that = this;
        let total=0,total_count=0,thisData=[];
        let oData = Object.assign({
            method: 'mkt.segment.publishstatus.list.get',
            publish_status: this.state.publish_status,
            index: this.state.pageIndex,
            size: this.state.pageSize,
            keyword: this.state.keyword
        }, opts || {});
        util.api({
            data: oData,
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={4} tbodyClassName={'uat-subdividedmanage-tbody'}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); total_count = parseInt(res.total_count); thisData = res.data;
                    if(total>0){
                        that.setState({
                            totalCount: total_count,
                            listData: res.data,
                            colNames: res.col_names,
                            tbodyModule:<TbodyTrue listData={res.data} resetTabTbody={that.resetTabTbody}/>
                        });
                        that.dropdownButton();
                    }else{
                        total_count = 0;
                        that.setState({tbodyModule:<TbodyFalse colspan={4} tbodyClassName={'uat-subdividedmanage-tbody'}/>});
                    }
                }else{
                    total_count = 0;
                    that.setState({tbodyModule:<TbodyFalse colspan={4} tbodyClassName={'uat-subdividedmanage-tbody'}/>});
                }
                that.setState({totalCount: total_count});
                $('.pagination-wrap').pagination('updateItems', total_count);
            }
        });

    }
    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0,
            keyword: '',
            pageIndex: 1,
            pageSize: 10,
            publish_status: 0,//发布状态（0:未发布 1: 已发布 3：全部)
            tabMenuData: [
                {name: '未生效', count: 0},
                {name: '已生效', count: 0},
                {name: '全部', count: 0}
            ],
            listData: [],
            tbodyModule:<TbodyFalse colspan={4} tbodyClassName={'uat-subdividedmanage-tbody'}/>,
        };
        this.resetTabTbody = this.resetTabTbody.bind(this);
    }
    setPagination() {
        let that = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: this.state.pageSize,
                onPageClick: function (pageNumber, event) {
                    that.fetch({
                        index: pageNumber
                    });
                }
            });
        }
    }
    componentDidMount() {
        this.load();
        this.fetch();
        this.setPagination();
        this.dropdownButton();
    }
    render() {
        return (
            <div className="manage">
                <header className="page-body-header">
                    <div className="text-box"><span className="title">细分管理</span><span
                        className="text">其他信息受众细分共计<span className="variable">{_.str.numberFormat(this.state.tabMenuData[2].count)}</span>个</span>
                    </div>
                    <div className="button-box">
                        <a className="a keyong" href={BASE_PATH + '/html/audience/segment.html'}
                        title="新增细分人群">
                            <span className="icon iconfont">&#xe63c;</span>
                            <span className="text">新增</span>
                        </a>
                    </div>
                </header>
                <div className="content">
                    <div className="clearfix filterbar-wrap">
                        <div className="tab-btnwrap">
                            <ul className="tabs">
                                {this.state.tabMenuData.map((m, i) => {
                                    return <li className="tab"><a href="#0" className={(i === 3) ? 'active' : ''}
                                                                  onClick={this.tabBtn.bind(this, m.publish_status)}>{m.name}
                                        ({m.count})</a>
                                    </li>
                                })}
                            </ul>
                        </div>
                        <div className="search-area">
                            <div className="search-box">
                                <input id="search-input" className="input" value={this.state.keyword}
                                       placeholder="可搜索当前页面细分人群关键字"
                                       onKeyUp={this.searchTask.bind(this)}
                                       onChange={(e) => {
                                           let val = $.trim(e.target.value) || '';
                                           this.setState({
                                               keyword: val
                                           });
                                       }
                                       }
                                />
                                <div className="icon iconfont"></div>
                            </div>
                        </div>
                    </div>

                    <div className="table-area">
                        <div className="table-list-wrap">
                            <table className="page-table-box uat-subdividedmanage-table">
                                <thead>
                                <tr>
                                    <th className="first">细分人群名称</th>
                                    <th>包含标签</th>
                                    <th>覆盖人群</th>
                                    <th className="ico">操作</th>
                                </tr>
                                </thead>
                                {this.state.tbodyModule}
                            </table>
                        </div>
                        <div className="pagination-wrap pagination">...</div>
                    </div>
                </div>
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
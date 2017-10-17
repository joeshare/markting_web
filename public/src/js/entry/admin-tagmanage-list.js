/**
 * Created by joeliu on 2016-10-13.
 * 标签管理
 */
'use strict';

let Layout = require('module/layout/layout');
let Modals = require('component/modals.js');
let pagination = require('plugins/pagination')($);//分页插件

//先创建布局
const layout = new Layout({
    index: 999,
    leftMenuCurName: '标签管理'
});

/*搜索框*/
class Search extends React.Component {
    searchList(){
        let searchValue = $('#search-input').val();
        this.props.onSearch({"searchText":searchValue});
    }
    searchInputList(event){
        if(event.keyCode == 13){
            let searchValue = $('#search-input').val();
            this.props.onSearch({"searchText":searchValue});
        }
    }
    render() {
        return (
            <div className="search-box">
            <input id="search-input" className="input" type="text" placeholder="标签名称" onKeyUp={this.searchInputList.bind(this)}/>
            <div className="icon iconfont" onClick={this.searchList.bind(this)}>&#xe668;</div>
            </div>
        )
    }
}

//数据列表
class DataList extends React.Component {
    constructor(props) {
        super(props);
    }
    //启用
    setEnable(sid){
        console.log(sid);
    }
    //关闭
    setDisabled(sid){

    }
    //刷新
    toRefresh(sid){

    }

    render() {
        let that = this;
        return (
            <table className="page-table-box">
                    <thead>
                    <tr>
                        {this.props.colName.map(m=> {
                            if(m.col_code<2)
                            {
                                return (
                                    <th>
                                        <span className="tit-text">{m.name}</span>
                                        <span className="tit-icon"></span>
                                    </th>
                                )
                            }
                            else
                            {
                                return (
                                    <th>
                                        <span className="tit-text">{m.name}</span>
                                    </th>
                                )
                            }

                        })}
                    </tr>
                </thead>
                <tbody id="tbody-box">
                {this.props.listData.map((m, i)=> {
                    return (
                        <tr>
                        {((mt) => {
                            switch(mt.status){
                            case '异常':
                               return <td className="tbody-box-red">{mt.status}</td>
                            break;
                            case '正常':
                                return <td>{mt.status}</td>
                            break;
                            case '待处理':
                                return  <td>{mt.status}</td>
                            break;
                        }
                        })(m)}

                        {((mt) => {
                            switch(mt.devstatus){
                                case '未确认':
                                    return    <td  className="tbody-box-red">{m.devstatus}</td>
                                    break;
                                case '已确认':
                                    return    <td>{m.devstatus}</td>
                                    break;
                                case '未开始':
                                    return    <td  className="tbody-box-yellow">{m.devstatus}</td>
                                    break;
                            }
                        })(m)}

                        <td>{m.name}</td>
                        <td>{m.classtye}</td>
                        <td>{m.updatime}</td>
                        <td>
                            <a title="启用" href="javascript:void(0)" onClick={this.setEnable.bind(this,m.sid)} className="tbody-link-button">启用</a>
                            <a title="刷新" href="javascript:void(0)" onClick={this.toRefresh.bind(this,m.sid)} className="tbody-link-button">刷新</a>
                            <a title="详情" href="javascript:void(0)"  href={BASE_PATH+'/html/admin/tag-factory/tagedit.html'} className="tbody-link-button">详情</a>
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
            size: 7,
            index: 1,
            listData: [],
            colName: []
        };
        //接口默认请求参数
        this.defOpts = {
            size: 7,
            index: 1,
            searchText:''
        };
        this.postList = this.postList.bind(this);
    }

    //初始化
    componentDidMount() {
        this.postList();
        this.setPagination();
    }

    //获取列表数据
    postList(opts) {
        let that = this;
        let defOpts = _.extend(this.defOpts, opts || {});
        console.log(defOpts);
        util.api({
            surl: "/apidata/tab-manage.json",
            type: 'get',
            data: {
                size: defOpts.size,
                index: defOpts.index,
                searchText:defOpts.searchText
            },
            success: function (res) {
                that.setState({
                    listData: res.data,
                    colName: res.col_names
                });
                $('.pagination-wrap').pagination('updateItems', res.total);
            }
        });
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
                        index: pageNumber
                    });
                }
            });
        }
    }



    //渲染
    render() {
        let data = this.state.mainCount;
        return (
            <div className="tagmanagelist">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">标签管理</span>
                        <span className="text">同步日期：<span className="variable">2016-10-13</span></span>
                        <div className="button-box icon iconfont" ><span
                        className="a keyong fnbtn-customview"
                        title="刷新">&#xe658;</span>
                        </div>
                    </div>
                    <div  className="button-box">
                        <div className="button-box"><a href={BASE_PATH+'/html/admin/tag-factory/tagadd.html'}>新建标签</a></div>
                        <div className="button-box icon iconfont" >
                            <a className="a keyong fnbtn-customview"   href={BASE_PATH+'/html/admin/tag-factory/tagadd.html'} title="新建标签">&#xe66e;</a>
                        </div>
                    </div>
                </header>

                <div className="content">
                    <div className="search-area">
                        <Search onSearch={this.postList}/>
                    </div>
                    <div className="table-list-wrap ">
                        <DataList colName={this.state.colName} listData={this.state.listData}/>
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

export default MasterData;


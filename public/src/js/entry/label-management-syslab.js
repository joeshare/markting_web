'use strict';
import Layout from 'module/layout/layout';
let pagination = require('plugins/pagination')($);//分页插件

import TbodyLoading from 'module/table-common/table-loading';

//创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'系统标签'
});

class SysLab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 7,
            index: 1,
            content:'',
            lab_count:0,
            last_time:'',
            Lab_class_list:[],
            Lab_list:[],
            lab_groupid:''
        };
    }
    initTitle(){
        let _this =this;
        util.api({
            url: "?method=mkt.tag.system.tagcount.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.msg == 'success'){
                    _this.setState({
                        lab_count:res.data[0].tag_count,
                        last_time:res.data[0].sync_time
                    });
                }
            }
        });
    }
    initLabClass(){
        let _this = this;
        util.api({
            url: '?method=mkt.taggroup.system.menulist.get',
            type: 'get',
            data: {},
            success: function (res) {
                if(res.code == 0){
                   $('#selectTtxt').text(res.data[0].select_name);

                    _this.getLablist({'index':1,'id':res.data[0].id});
                    _this.setState({
                        Lab_class_list:res.data,
                        lab_groupid:res.data[0].id
                    });
                }
            }
        });
    }
    componentDidMount() {
        this.initTitle();
        this.initLabClass();
        this.setPagination();
    }
    onTitleClick(params){
        this.setState({
            lab_groupid:params.id
        });
        $('#selectTtxt').text(params.select_name);
        this.getLablist({'index':1,'id':params.id});
    }

    setPagination() {
        var _this = this;
        if($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: 7,//最多显示页数
                onPageClick: function (pageNumber, event) {
                    _this.getLablist({'index':pageNumber,'id':_this.state.lab_groupid});
                }
            });
        }
    }
    getLablist(params){
        let _this=this;
        util.api({
            url: '?method=mkt.taggroup.system.list.get',
            type: 'get',
            data: {
                tag_group_id: params.id,
                index: params.index,
                size: _this.state.size
            },
            beforeSend: function () {
              $('#loading').show();
                $('#tbody-box').hide();
            },
            success: function (res) {
                if(res.code == 0){
                    _this.setState({
                        Lab_list:res.data
                    });
                    $('#loading').hide();
                    $('#tbody-box').show();
                    $('.pagination-wrap').pagination('updateItems', res.total_count);
                    $('.dropdown-button').dropdown();
                }
            }
        });
    }

    onRecommand(params){
        let _this = this;
        let event = event || arguments[1];
        let targ = event.target?event.target:event.srcElement;
        let $target = $(targ);
        
        util.api({
            url: '?method=mkt.tag.system.flag.set',
            type: 'post',
            data: {
                'tag_id' :params.tag_group_id,
                'flag' : !params.flag
            },
            success: function (res) {
                if($target.hasClass('choose'))
                {
                    $target.addClass('nochoose').removeClass('choose');
                }
                else {
                    $target.addClass('choose').removeClass('nochoose');
                }
                if(res.code == 0){
                    Materialize.toast('操作成功！',2000,'toast');
                }
                else{
                    Materialize.toast('操作失败！',2000,'toast');
                }
            }
        });
    }
    onRefresh(){
        $('.synchere').addClass('sync');
        setTimeout(function () {
            $('.synchere').removeClass('sync');
            Materialize.toast('标签已更新！',2000,'toast');
        },3000);
        this.initTitle();
        this.initLabClass();
    }
    render() {
        return (
            <div className="system">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">系统标签</span>
                        <span className="text">
                            系统标签<span className="variable" >{this.state.lab_count}</span>个，最后一次同步时间<span className="variable" id="sync-time">{this.state.last_time}</span>
                        </span>
                    </div>
                    <div className="button-box icon iconfont">
                        <a className="a keyong synchere" onClick={this.onRefresh.bind(this)} href="javascript:void(0)" title="更新">&#xe658;</a>
                    </div>
                </header>
                <div className="content">
                    <header className="header">
                        <div className="title">系统标签</div>
                        <div className="h2">系统标签是系统根据已有数据自动生成的标签及分类</div>
                    </header>
                    <div className="lab-type">标签分类&nbsp;&nbsp;&#62;&nbsp;&nbsp;
                        <span className="select r-btn dropdown-button lablelist" data-activates="lablelist" data-constrainwidth="false" data-gutter="0">
                            <span id="selectTtxt"></span>
                            <i className="icon iconfont">&#xe648;</i>
                        </span>
                        <ul id="lablelist" className="dropdown-content lablelist" style={{width:'190px'}}>
                            {this.state.Lab_class_list.map((m, i)=> {
                                return  <li onClick={this.onTitleClick.bind(this,m)} class="groupid">{m.select_name}</li>
                            })}
                        </ul>

                    </div>
                    <div className="list-box" id="list-box">
                        <table className="page-table-box">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="setcommn">设置推荐</div>
                                        <div className="iconfont dropdown-button tipbut"  data-hover="true" data-activates="hovertipid" data-constrainwidth="false">&#xe66f;</div>
                                        <ul id="hovertipid" className="dropdown-content">
                                            <li className="hovertip"><p>推荐的标签将出现在受众细分处，便于快捷使用</p></li>
                                        </ul>
                                    </th>
                                    <th>标签名称</th>
                                    <th>标签描述</th>
                                    <th>标签值数量</th>
                                    <th>覆盖率</th>
                                    <th className="ico"></th>
                                </tr>
                            </thead>
                            <tbody id="tbody-box">
                                    {this.state.Lab_list.map((m, i)=> {
                                        if(m.flag)
                                        {
                                            return  (
                                                <tr>
                                                    <td className="first"><a onClick={this.onRecommand.bind(this,m)} className="icon iconfont choose">&#xe6af;</a></td>
                                                    <td className="first">{m.tag_group_name}</td>
                                                    <td className="lable-num">{m.tag_desc}</td>
                                                    <td className="lable-num">{m.tag_count}</td>
                                                    <td className="lable-num">{m.tag_cover}</td>
                                                    <td className="ico">
                                                        <ico className="pointer icon iconfont r-btn dropdown-button" data-activates={m.tag_group_id} data-constrainwidth="false" title="查看详情">&#xe646;</ico>
                                                        <ul className="dropdown-content" id={m.tag_group_id}>
                                                            {m.tag_list.map((fm,i)=>{
                                                                return(
                                                                    <li><a href="javascript:void(0);">{fm}</a></li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        else
                                        {
                                            return  (
                                                <tr>
                                                    <td className="first"><a onClick={this.onRecommand.bind(this,m)} className="icon iconfont nochoose">&#xe6af;</a></td>
                                                    <td className="first">{m.tag_group_name}</td>
                                                    <td className="lable-num">{m.tag_desc}</td>
                                                    <td className="lable-num">{m.tag_count}</td>
                                                    <td className="lable-num">{m.tag_cover}</td>
                                                    <td className="ico">
                                                        <ico className="pointer icon iconfont r-btn dropdown-button" data-activates={m.tag_group_id} data-constrainwidth="false" title="查看详情">&#xe646;</ico>
                                                        <ul className="dropdown-content"  id={m.tag_group_id}>
                                                            {m.tag_list.map((fm,i)=>{
                                                                return(
                                                                <li><a href="javascript:void(0);">{fm}</a></li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}
                            </tbody>
                            <TbodyLoading  colspan={5}/>
                        </table>
                        <div className="pagination-wrap pagination light-theme simple-pagination"></div>
                    </div>
                </div>
            </div>
        )
    }
}

//渲染
const domSysLab = ReactDOM.render(
    <SysLab />,
    document.getElementById('page-body')
);

module.exports = domSysLab;
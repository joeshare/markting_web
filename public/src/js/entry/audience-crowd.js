/**
 * Created by AnThen on 2016-5-9.
 */
//构造页面
import Layout from 'module/layout/layout';

//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName: '人群管理'
});

//插件
//弹层
let Modals = require('component/modals.js');
//分页
let pagination = require('plugins/pagination')($);

//集成模块
//table loading
import TbodyLoading from 'module/table-common/table-loading';
//table 暂无数据
import TbodyFalse from 'module/table-common/table-false';

//编写页面模块
//二级头部
class SubHead extends React.Component{
    fetch(){
        let that = this;
        let audienceCount,audiencePeopleCount;
        util.api({
            data: {
                method: 'mkt.audience.count.get',
            },
            success: function (res) {
                if(res.code == 0){
                    audienceCount = res.data[0].audienceCount;
                    audiencePeopleCount = res.data[0].audiencePeopleCount;
                    that.setState({
                        audienceNum:util.numberFormat(audienceCount),
                        audiencePeopleNum:util.numberFormat(audiencePeopleCount)
                    });
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            audienceNum:0,
            audiencePeopleNum:0
        };
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">人群管理</span>
                    <span className="text">
                        人群<span className="variable">{this.state.audienceNum}</span>个，共计<span className="variable">{this.state.audiencePeopleNum}</span>个联系人
                    </span>
                </div>
            </header>
        )
    }
}
//表格
class TbodyTrue extends React.Component{
    downloadFile(id){
        let downloadFile;
        util.api({
            data: {
                method: 'mkt.audience.search.download',
                'audience_id':id
            },
            success: function (res) {
                if(res.code == 0){
                    downloadFile = FILE_PATH+res.data[0].download_file_name;
                    window.location.href = downloadFile;
                }
            }
        });
    }
    showgrouplist(id,count,e){
        layout.showgrouplist(e, {
            data:{
                method: "mkt.audience.search.get",
                audience_type: 1,//0全局，1人群，2自定义标签
                audience_id: id,//人群id
            },
            total_count: count//总数，如果没有总数就注释掉这行
        });
    }
    delete(id){
        let that = this;
        if(status == ''){
            new Modals.Confirm({
                content:"您确实要删掉这条信息吗？",
                listeners:{
                    close:function(type){
                        if(type == true){
                            util.api({
                                url:'?method=mkt.audience.list.delete',
                                type: 'post',
                                data: {
                                    audience_list_id:id
                                },
                                success: function (res) {
                                    if(res.code == 0){
                                        that.props.resetTbody();
                                    }
                                }
                            });
                        }else{
                            //console.log("click cancel");
                        }
                    }
                }
            });
        }
    }
    render() {
        return (
            <tbody className="uat-crowdaudience-tbody">
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td className="first uat-crowdaudience-td">{m.name}</td>
                        <td className="uat-crowdaudience-td">{m.count}</td>
                        <td className="uat-crowdaudience-td">{m.source}</td>
                        <td className="uat-crowdaudience-td">{m.createTime}</td>
                        <td className="uat-crowdaudience-td">{m.updateTime}</td>
                        <td className="ico">
                            <ico className="icon iconfont dropdown-button" data-activates={"morelist"+m.id} data-constrainwidth="false">&#xe675;</ico>
                            <ul id={"morelist"+m.id} className="dropdown-content setuplist">
                                <li onClick={this.downloadFile.bind(this,m.id)}>
                                    <i className="icon iconfont">&#xe643;</i>
                                    <a target="_blank" href="javascript:void(0)">下载明细</a>
                                </li>
                                <li onClick={this.showgrouplist.bind(this,m.id,m.count)}>
                                    <i className="icon iconfont">&#xe668;</i>
                                    <a href="javascript:void(0)">人群中查找</a>
                                </li>
                                <li onClick={this.delete.bind(this,m.id)}>
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
//组织页面模块
class Manage extends React.Component {
    resetTbody(){
        let indexNum = this.state.index,
            sizeNum = this.state.size;
        this.fetch(indexNum,sizeNum);
    }
    formatTbodyData(total,data){
        let thisData = data;
        let downloadUrl,tbodyData = [];
        for(let i=0; i<total; i++){
            downloadUrl = FILE_PATH+thisData[i].download_url;
            tbodyData[i] = {
                id:thisData[i].audience_list_id,
                name:thisData[i].audience_list_name,
                count:thisData[i].audience_count,
                source:thisData[i].source_name,
                createTime:thisData[i].create_time,
                updateTime:thisData[i].update_time,
                downloadUrl:downloadUrl
            };
        }
        this.setState({
            tbodyModule:<TbodyTrue data={tbodyData} resetTbody={this.resetTbody}/>
        });
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
    }
    fetch(index,size){
        let that = this;
        let total=0,total_count=0,thisData=[];

        util.api({
            data: {
                method: 'mkt.audience.list.get',
                'index':index,'size':size
            },
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={6} tbodyClassName={'uat-crowdaudience-tbody'}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); total_count = parseInt(res.total_count); thisData = res.data;
                    if(total>0){
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyModule:<TbodyFalse colspan={5} tbodyClassName={'uat-crowdaudience-tbody'}/>});
                    }
                    that.setState({totalCount:total_count});
                }else{
                    that.setState({
                        totalCount:0,
                        tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-crowdaudience-tbody'}/>
                    });
                }
                $('.pagination-wrap').pagination('updateItems', total_count);
            },
            error: function () {
                that.setState({
                    totalCount:0,
                    tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-crowdaudience-tbody'}/>
                });
            }
        });
    }
    setPagination(){
        let that = this;
        let thisSize = this.state.size,totalCount = this.state.totalCount;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: totalCount,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    that.setState({index:pageNumber});
                    that.fetch(pageNumber,thisSize);
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            index: 1,
            size: 10,
            totalCount: 0,
            tbodyData: [],
            tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-crowdaudience-tbody'}/>
        };
        this.resetTbody = this.resetTbody.bind(this);
    }
    componentDidMount(){
        this.fetch(1,this.state.size);
        this.setPagination();
    }
    render(){
        return(
            <div className="crowd">
                <SubHead />
                <div className="content">
                    <header className="header">
                        <div className="title">人群管理</div>
                        <div className="h2">您可以在此查看和管理人群列表，人群可能源于营销活动中保存的特定人群或者其他来源</div>
                    </header>
                    <div className="list-box">
                        <div className="table-list-wrap">
                            <table className="page-table-box uat-crowdaudience-table">
                                <thead>
                                <tr>
                                    <th className="first">名称</th>
                                    <th>人数</th>
                                    <th>来源</th>
                                    <th>创建时间</th>
                                    <th>最后更新时间</th>
                                    <th className="ico">&nbsp;</th>
                                </tr>
                                </thead>
                                {this.state.tbodyModule}
                            </table>
                        </div>
                        <div className="pagination-wrap pagination"></div>
                    </div>
                </div>
            </div>
        )
    }
}
//渲染页面
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
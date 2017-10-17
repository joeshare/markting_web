/**
 * Created by AnThen on 2016-5-9.
 */
/*构造页面*/
import Layout from 'module/layout/layout';

//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName:'活动管理'
});

//插件
//弹层插件
let Modals = require('component/modals.js');
//分页插件
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
        let campaignCount,audienceCount;
        util.api({
            data: {
                method: 'mkt.campaign.summary.get'
            },
            success: function (res) {
                if(res.code == 0){
                    campaignCount = res.data[0].total_campaign_count;
                    audienceCount = res.data[0].total_campaign_audience_count;
                    that.setState({
                        activity:util.numberFormat(campaignCount),
                        audience:util.numberFormat(audienceCount)
                    });
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            activity:0,
            audience:0
        };
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">活动管理</span>
                    <span className="text">
                        正式营销活动<span className="variable">{this.state.activity}</span>
                        个，累计触达<span className="variable">{this.state.audience}</span>
                        人次
                    </span>
                </div>
                <div className="button-box">
                    <a className="a keyong" href={BASE_PATH+"/html/activity/plan.html"} title="新增活动">
                        <span className="icon iconfont">&#xe63b;</span>
                        <span className="text">新增活动</span>
                    </a>
                </div>
            </header>
        )
    }
}
//表格
class TbodyTrue extends React.Component{
    delete(id,type){
        let that = this;
        if(type == ''){
            new Modals.Confirm({
                content:"您确实要删掉这条信息吗？",
                listeners:{
                    close:function(type){
                        if(type == true){
                            util.api({
                                url:'?method=mkt.campaign.delete',
                                type: 'post',
                                data: {
                                    campaign_head_id:id
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
            <tbody className="uat-activitysupervise-tbody">
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td className="first uat-activitysupervise-td">
                            <a title={m.campaignName} href={m.trurl} className="tbody-box-name">{m.campaignName}</a>
                        </td>
                        <td className="uat-activitysupervise-td">{m.createTime}</td>
                        <td className="uat-activitysupervise-td">{m.startTime}</td>
                        <td className="uat-activitysupervise-td">{m.endTime}</td>
                        <td className="object uat-activitysupervise-td">
                            <div title={m.segmentationName} className="tbody-box-object">{m.segmentationName}</div>
                        </td>
                        <td className="ico">
                            <ico className="pointer icon iconfont r-btn dropdown-button moreico" data-activates={"morelist"+m.id} data-constrainwidth="false">&#xe675;</ico>
                            <ul id={"morelist"+m.id} className="dropdown-content setuplist">
                                <li style={{'display':'none'}}>
                                    <i className="icon iconfont">&#xe668;</i>
                                    <a href={BASE_PATH+"/html/activity/analyse.html?id="+m.id}>活动分析</a>
                                </li>
                                <li className={m.deleteClass} onClick={this.delete.bind(this,m.id,m.deleteClass)}>
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
            sizeNum = this.state.size,
            searchText = this.state.searchText,
            tabType = this.state.tabType;
        this.fetchTable(indexNum,sizeNum,searchText,tabType);
    }
    search(){
        let thisVal = $('#search-input').val().trim();
        let index = this.state.index,
            size = this.state.size,
            tabType = this.state.tabType;
        this.setState({searchText:thisVal});
        this.fetchTable(index,size,thisVal,tabType);
        this.setPagination();
    }
    tabsChange(type){
        let indexNum = this.state.index,
            sizeNum = this.state.size,
            searchText = '';
        this.setState({
            tabType:type,
            searchText:searchText
        });
        this.fetchTable(indexNum,sizeNum,searchText,type);
        this.setPagination();
    }
    formatTbodyData(total,data){
        let thisData = data;
        let id;
        let trurl,
            trurl1 = BASE_PATH+"/html/activity/plan.html?planId=",
            trurl2not = "&status=unreleased&returnurl=/html/activity/supervise.html",
            trurl2iss = "&status=released&returnurl=/html/activity/supervise.html",
            trurl2goov = "&status=active&returnurl=/html/activity/supervise.html";
        let status,
            status0 = "未启动",
            status1 = "已预约",
            status2 = "活动中",
            status3 = "已结束";
        let deleteClass;
        let tbodyData = [];

        for(let i=0; i<total; i++){
            id = thisData[i].campaign_head_id;
            switch (thisData[i].publish_status){
                case 0:
                    trurl = trurl1 + id + trurl2not;
                    status = status0;
                    deleteClass = '';
                    break;
                case 1:
                    trurl = trurl1 + id + trurl2iss;
                    status = status1;
                    deleteClass = 'close';
                    break;
                case 2:
                    trurl = trurl1 + id + trurl2goov;
                    status = status2;
                    deleteClass = 'close';
                    break;
                default:
                    trurl = trurl1 + id + trurl2goov;
                    status = status3;
                    deleteClass = '';
                    break;
            }
            tbodyData[i] = {
                id:id,
                campaignName:thisData[i].campaign_name,
                trurl:trurl,
                status:status,
                deleteClass:deleteClass,
                createTime:thisData[i].create_time,
                startTime:thisData[i].start_time,
                endTime:thisData[i].end_time,
                segmentationName:thisData[i].segmentation_name
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
    fetchTable(indexNum,sizeNum,searchText,tabType){
        let that = this;
        let total=0,totalCount=0,thisData=[];
        util.api({
            data: {
                method: 'mkt.campaign.progressstatus.list.get',
                'index':indexNum,'size':sizeNum,
                'publish_status':tabType,
                'campaign_name':searchText
            },
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={6} tbodyClassName={'uat-activitysupervise-tbody'}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); totalCount = parseInt(res.total_count); thisData = res.data;
                    if(total>0){
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyModule:<TbodyFalse colspan={7} tbodyClassName={'uat-activitysupervise-tbody'}/>});
                    }
                    that.setState({totalCount:totalCount});
                }else{
                    that.setState({
                        totalCount:0,
                        tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-activitysupervise-tbody'}/>
                    });
                }
                $('.pagination-wrap').pagination('updateItems', totalCount);
            },
            error: function () {
                that.setState({
                    totalCount:0,
                    tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-activitysupervise-tbody'}/>
                });
            }
        });
    }
    setPagination(){
        let that = this;
        let thisSize = this.state.size,
            searchText,tabType;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    that.setState({index:pageNumber});
                    searchText = that.state.searchText;
                    tabType = that.state.tabType;
                    that.fetchTable(pageNumber,thisSize,searchText,tabType);
                }
            });
        }
    }
    indicator(tabType,thisData){
        let indicator = $('#tabs').children('.indicator');
        switch (tabType){
            case '2':
                thisData.going.calssName = ' active';
                indicator.css({left:'150px',right:'150px'});
                break;
            case '3':
                thisData.over.calssName = ' active';
                indicator.css({left:'300px',right:'0px'});
                break;
            default:
                tabType = 0;
                thisData.notStart.calssName = ' active';
                indicator.css({left:'0px',right:'300px'});
                break;
        }
        this.setState({tabs:thisData,index:1});
        this.fetchTable(1,10,'',tabType);
    }
    fetchTabs(){
        let that = this;
        let thisData;
        let notStart = {calssName:' active',num:0},
            going = {calssName:'',num:0},
            over = {calssName:'',num:0};
        util.api({
            data: {
                method: 'mkt.campaign.progressstatus.count.get'
            },
            success: function (res) {
                if(res.code == 0){
                    notStart.num = res.data[0].count;
                    going.num = res.data[2].count;
                    over.num = res.data[3].count;
                    thisData = {notStart:notStart, going:going, over:over};
                    that.indicator(util.geturlparam('type'),thisData);
                }
            },
            error: function () {
                notStart.num = 0;
                going.num = 0;
                over.num = 0;;
                thisData = {notStart:notStart, going:going, over:over};
                that.indicator(util.geturlparam('type'),thisData);
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            tabs:{
                notStart:{calssName:' active',num:0},
                going:{calssName:'',num:0},
                over:{calssName:'',num:0}
            },
            tabType:4,
            index: 1, size: 10, searchText: '',
            totalCount: 0,
            tbodyModule:<TbodyFalse colspan={6} tbodyClassName={'uat-activitysupervise-tbody'}/>
        };
        this.resetTbody = this.resetTbody.bind(this);
    }
    componentDidMount(){
        this.setPagination();
        this.fetchTabs()
    }
    render(){
        return (
            <div className="supervise">
                <SubHead />
                <div className="content">
                    <header className="header">
                        <div className="tab-box">
                            <div className="col s12">
                                <ul className="tabs" id="tabs">
                                    <li className="tab col s3">
                                        <a className={"tab-table"+this.state.tabs.notStart.calssName} href="javascript:void(0)"  onClick={this.tabsChange.bind(this,0)}>未启动（{this.state.tabs.notStart.num}）</a>
                                    </li>
                                    <li className="tab col s3">
                                        <a className={"tab-table"+this.state.tabs.going.calssName} href="javascript:void(0)" onClick={this.tabsChange.bind(this,2)}>活动中（{this.state.tabs.going.num}）</a>
                                    </li>
                                    <li className="tab col s3">
                                        <a className={"tab-table"+this.state.tabs.over.calssName} href="javascript:void(0)" onClick={this.tabsChange.bind(this,3)}>已结束（{this.state.tabs.over.num}）</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="search-box">
                            <input placeholder="筛选关键字" id="search-input" type="text" className="input" onKeyUp={this.search.bind(this)}/>
                                <div className="icon iconfont" onClick={this.search.bind(this)}>&#xe668;</div>
                        </div>
                    </header>
                    <div className="list-box">
                        <table className="page-table-box uat-activitysupervise-table">
                            <thead>
                            <tr>
                                <th className="first">名称</th>
                                <th>创建时间</th>
                                <th>计划开始时间</th>
                                <th>计划结束时间</th>
                                <th>受众人群</th>
                                <th className="ico">操作</th>
                            </tr>
                            </thead>
                            {this.state.tbodyModule}
                        </table>
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
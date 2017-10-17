/**
 * Created by AnThen on 2017/1/12.
 * 事件中心-事件行为列表 es6+react版
 */

//构造页面
import Layout from 'module/layout/layout';

//先创建布局
const layout = new Layout({
    index: 2,
    leftMenuCurName:'事件库'
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
//整行提示
import PointOut from 'module/point-out/point-out';

//编写页面模块
class SubHead extends React.Component{
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">事件行为</span>
                    <span className="text">
                        <span className="variable">{this.props.eventName}</span>
                    </span>
                </div>
            </header>
        )
    }
}
//筛选列表
class ScreenList extends React.Component{
    fetch(){
        let that = this;
        let id = this.props.mastThis.state.general.object_id;
        let thisData,term = [],thisValues = [],values,contClass;
        util.api({
            surl: EVENT_PATH,
            data: {
                method: 'mkt.event.object.prop.list',
                object_id: id
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<res.total; i++){
                        thisValues = thisData[i].values;
                        values = [];
                        for(let j=0; j<thisValues.length; j++){
                            values[j] = {value:thisValues[j],classname:''}
                        }
                        thisValues.length > 0 ? contClass='' : contClass=' null';
                        term[i] = {
                            name:thisData[i].name,
                            label:thisData[i].label,
                            butClass:'',contClass:contClass,
                            values:values
                        };
                    }
                    that.initTerm(term);
                }
            }
        });
    }
    initTerm(term){
        let masterTerm = this.props.mastThis.state.term,mttm = [],mttmt = 0;
        let interim = [];
        let termValues = [];
        for(let i=0; i<masterTerm.length; i++){
            mttm = masterTerm[i].values;
            for(let j=0; j<mttm.length; j++){
                interim[mttmt] = {
                    name:masterTerm[i].name,
                    value:mttm[j]
                };
                mttmt++;
            }
        }
        for(let i=0; i<term.length; i++){
            for(let j=0; j<interim.length; j++){
                if(term[i].name == interim[j].name){
                    termValues = term[i].values;
                    for(let k=0; k<termValues.length; k++){
                        if(interim[j].value == termValues[k].value){
                            termValues[k].classname = ' selected';
                        }
                    }
                }
            }
        }
        this.setState({term:term});
    }
    showAll(name){
        let term = this.state.term,thisValues;
        for(let i=0; i<term.length; i++){
            if(term[i].name == name){
                thisValues = (term[i].values).length;
                if(term[i].butClass == ''){
                    term[i].butClass = ' icon';
                    if(thisValues > 0){term[i].contClass = ' show'}
                }else{
                    term[i].butClass = '';
                    if(thisValues > 0){term[i].contClass = ''}
                }
                break;
            }
        }
        this.setState({term:term});
    }
    selected(name,value){
        let term = this.state.term,thisValues;
        for(let i=0; i<term.length; i++){
            if(term[i].name == name){
                thisValues = term[i].values;
                for(let j=0; j<thisValues.length; j++){
                    if(thisValues[j].value == value){
                        thisValues[j].classname == '' ? term[i].values[j].classname=' selected' : term[i].values[j].classname='';
                    }
                }
            }
        }
        this.setState({term:term});
        this.synchro();
    }
    synchro(){
        let term = this.state.term,thisValues;
        let temporary = [],tp = 0,tpi,tpValues;
        let newTemporary = [];
        for(let i=0; i<term.length; i++){
            thisValues = term[i].values;
            tpi = 0;tpValues = [];
            for(let j=0; j<thisValues.length; j++){
                if(thisValues[j].classname == ' selected'){
                    tpValues[tpi] = thisValues[j].value;
                    temporary[tp] = {
                        name:term[i].name,
                        values:tpValues
                    };
                    tp++;tpi++;
                }
            }
        }
        if(temporary.length > 0){
            newTemporary[0] = temporary[0];
            wai:
            for(let i=0; i<newTemporary.length; i++){
                for(let j=1; j<temporary.length; j++){
                    if(newTemporary[i].name == temporary[j].name){
                        break;
                    }else{
                        newTemporary.push(temporary[j]);
                        break wai;
                    }
                }
            }
        }
        this.props.mastThis.setState({temporaryTerm:newTemporary});
    }
    constructor(props){
        super(props);
        this.state = {
            term:[]
        };
        /*
         term:[
         {name:'1',label:'商品品类',butClass:'',contClass:'',
         values:[
         {value:'圣诞蛋糕',classname:' selected'},
         {value:'生日蛋糕',classname:''}
         ]
         },{name:'2',label:'商品品类',butClass:'',contClass:'',
         values:[
         {value:'圣诞蛋糕',classname:' selected'},
         {value:'生日蛋糕',classname:''}
         ]
         }
         ]
        */
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="modals-screen-Html">
                {this.state.term.map((m,i)=> {
                    return (
                        <div className="lable">
                            <div className="header-lable">
                                <div className="title-lable">{m.label}</div>
                                <div className="show-but" onClick={this.showAll.bind(this,m.name)}>
                                    <div className={"iconfont show-icon"+m.butClass}>&#xe648;</div>
                                    <div className={"iconfont hide-icon"+m.butClass}>&#xe647;</div>
                                    <div className="show-but">全部</div>
                                </div>
                            </div>
                            <div className={"list-cont"+m.contClass}>
                                {m.values.map((n,i)=> {
                                    return (
                                        <div className={"term"+n.classname} onClick={this.selected.bind(this,m.name,n.value)}>{n.value}</div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
//表格
class TbodyTrue extends React.Component{
    render() {
        return (
            <tbody className="uat-eventaction-tbody">
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td className="first uat-eventaction-td" title={m.id}>{m.id}</td>
                        <td className="uat-eventaction-td">{m.sourceName}</td>
                        <td className="uat-eventaction-td">{m.objectName}</td>
                        <td className="uat-eventaction-td">{m.eventName}</td>
                        <td className="uat-eventaction-td">{m.time}</td>
                    </tr>
                )
            })}
            </tbody>
        )
    }
}
//组织页面模块
class Manage extends React.Component{
    screenTream(){
        let mastThis = this;
        let temporaryTerm = [],termShow = [],termShowAll = [],ni = 0,thisTag;
        let more = {moreClass:'',value:'查看更多'};
        let tableParam;
        new Modals.Window({
            id: "modalsScreenHtml",
            title: '属性筛选',
            content: "<div class='con-body'/>",
            width: 372,//默认是auto
            height: 630,//默认是auto
            buttons: [
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {
                        temporaryTerm = mastThis.state.temporaryTerm;
                        for(let i=0;i<temporaryTerm.length;i++){
                            thisTag = temporaryTerm[i].values;
                            for(let j=0;j<thisTag.length; j++){
                                termShowAll[ni] = {value:thisTag[j]};
                                ni++;
                            }
                        }
                        if(termShowAll.length > 5){
                            termShow = termShowAll.slice(0,5);
                            more.moreClass = ' show';

                        }else{
                            termShow = termShowAll;
                            more.moreClass = '';
                        }
                        mastThis.setState({
                            term:temporaryTerm,
                            termShow:termShow,
                            termShowAll:termShowAll,
                            more:more
                        });
                        self.close();
                    }
                }
            ],
            listeners: {
                close: function (type) {
                    mastThis.setState({temporaryTerm:[]});
                    tableParam = {
                        event_id:parseInt(util.geturlparam('id')),
                        attributes : mastThis.state.term,
                        index : 1,size : 10
                    };
                    mastThis.fetchTable(tableParam);
                    mastThis.setPagination();
                },
                beforeRender: function () {
                    this.customView = ReactDOM.render(
                        <ScreenList mastThis={mastThis}/>,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        });
    }
    showTerm(){
        let more = this.state.more;
        let termShowAll = this.state.termShowAll,thisTerm;
        if(more.value == '查看更多'){
            more.value ='收起';
            thisTerm = termShowAll;
        }else{
            more.value ='查看更多';
            thisTerm = termShowAll.slice(0,5);
        }
        this.setState({
            more: more,termShow: thisTerm
        });
    }
    fetchGeneral(){
        let that = this;
        let id = util.geturlparam('id');
        let thisData;
        util.api({
            surl: EVENT_PATH,
            data: {
                method: 'mkt.event.general.get',
                event_id: id
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    that.setState({general:thisData});
                }
            }
        });
    }
    fetchTable(param){
        let that = this;
        let total=0,totalCount=0,thisData=[];
        util.api({
            surl: EVENT_PATH+"?method=mkt.event.behavior.list",
            type: 'post',
            data: {
                event_id: param.event_id,
                attributes: param.attributes,
                index: param.index,size: param.size
            },
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={5} tbodyClassName={'uat-eventaction-tbody'}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    total = res.total;
                    totalCount = res.total_count;
                    that.setState({tbodyTotalCount:totalCount});
                    if(total > 0){
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyModule:<TbodyFalse colspan={5} tbodyClassName={'uat-eventaction-tbody'}/>});
                    }
                    $('.pagination-wrap').pagination('updateItems', totalCount);
                }else{
                    that.setState({tbodyTotalCount:0});
                    that.setState({tbodyModule:<TbodyFalse colspan={5} tbodyClassName={'uat-eventaction-tbody'}/>});
                }
            },error: function () {
                that.setState({tbodyTotalCount:0});
                that.setState({tbodyModule:<TbodyFalse colspan={5} tbodyClassName={'uat-eventaction-tbody'}/>});
            }
        });
    }
    formatTbodyData(total,thisData){
        let tbodyData = [],time,subject;
        for(let i=0; i<total; i++){
            subject = thisData[i].subject;
            time = (thisData[i].time)/1000;
            time = util.formatDate(time,3);
            tbodyData[i]={
                id:subject.openid,
                sourceName:thisData[i].sourceName,
                objectName:thisData[i].objectName,
                eventName:thisData[i].eventName,
                time:time
            };
        }
        this.setState({tbodyModule:<TbodyTrue data={tbodyData}/>});
    }
    setPagination(){
        let that = this;
        let tableParam;
        let thisSize = this.state.size;
        tableParam = {
            event_id:parseInt(util.geturlparam('id')),
            attributes : this.state.term,
            index : 1,size : thisSize
        };
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    tableParam.index = pageNumber;
                    that.setState({index:pageNumber});
                    that.fetchTable(tableParam);
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            general:{id:'',name:'',code:'',source_id:'',object_id:'',object_name:''},
            term:[],
            termShow:[],
            termShowAll:[],
            temporaryTerm:[],
            more: {moreClass:'',value:'查看更多'},
            pointOut:{
                icon:'',back:'',
                text:'本页包含所有用户触发的行为记录，详细记载用户的事件触发明细。'
            },
            index: 1,size: 10,
            tbodyModule:<TbodyFalse colspan={5} tbodyClassName={'uat-eventaction-tbody'}/>,
            tbodyTotalCount: 0
        };
    }
    componentDidMount(){
        let param = {
            event_id : parseInt(util.geturlparam('id')),
            attributes : [],
            index : 1,size : 10
        };
        this.fetchGeneral();
        this.fetchTable(param);
        this.setPagination();
    }
    render() {
        return (
            <div className="action">
                <SubHead eventName={this.state.general.name}/>
                <div className="content">
                    <div className="header-one">{this.state.general.object_name}</div>
                    <div className="header-two">
                        <div className="button-box" onClick={this.screenTream.bind(this)}>
                            <div className="iconfont icon">&#xe676;</div>
                            <div className="text">筛选</div>
                        </div>
                        <div className="condition">
                            {this.state.termShow.map((m,i)=> {
                                return (
                                    <div className="term">{m.value}</div>
                                )
                            })}
                            <div className={"more"+this.state.more.moreClass} onClick={this.showTerm.bind(this)}>{this.state.more.value}</div>
                        </div>
                    </div>
                    <div className="point-out-box">
                        <PointOut param={this.state.pointOut}/>
                    </div>
                    <div className="table-area">
                        <table className="page-table-box uat-eventaction-table">
                            <thead>
                            <tr>
                                <th className="first">用户标识</th>
                                <th>事件来源</th>
                                <th>事件客体</th>
                                <th>事件</th>
                                <th>触发时间</th>
                            </tr>
                            </thead>
                            {this.state.tbodyModule}
                        </table>
                        <div className="total-count">共{this.state.tbodyTotalCount}条</div>
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
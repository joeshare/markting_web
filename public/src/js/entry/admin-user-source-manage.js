/**
 * Created by AnThen on 2017/2/28.
 * IT后台-数据接入设置-用户来源管理
 */
//构造页面
import Layout from 'module/layout/layout';

//先创建布局
const layout = new Layout({
    index: 99,
    leftMenuCurName:'用户来源管理'
});

//插件
//弹层插件
let Modals = require('component/modals.js');
//分页插件
let pagination = require('plugins/pagination')($);

//集成模块
//table loading
import TbodyLoading from 'module/table-common/table-loading';

class SubHead extends React.Component{
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">用户来源管理</span>
                </div>
            </header>
        )
    }
}

class TbodyInit extends React.Component{
    render() {
        let colspan = this.props.colspan;
        let tbodyClassName = this.props.tbodyClassName || 'uat-tbody';
        return (
            <tbody className={tbodyClassName}>
            <tr>
                <td style={{textAlign:'center',width:'100%',paddingTop:'10px'}} colSpan={colspan}>
                    &nbsp;
                </td>
            </tr>
            </tbody>
        )
    }
}
class TbodyTrue extends React.Component{
    enableOn(id,available){
        let that = this;
        new Modals.Confirm({
            content:"确认启用当前来源？",
            listeners:{
                close:function(type){
                    if(type == true){
                        util.api({
                            url: "?method=mkt.source.available",
                            type: 'post',
                            data: {
                                id:id,
                                available:available
                            },
                            success: function (res) {
                                if(res.code == 0){
                                    that.props.resetNowTable();
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
    enableOff(id,available){
        let that = this;
        new Modals.Confirm({
            content:"确认停用当前来源？",
            listeners:{
                close:function(type){
                    if(type == true){
                        util.api({
                            url: "?method=mkt.source.available",
                            type: 'post',
                            data: {
                                id:id,
                                available:available
                            },
                            success: function (res) {
                                if(res.code == 0){
                                    that.props.resetNowTable();
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
    render() {
        return (
            <tbody className="uat-adminusersourcemanage-tbody">
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td className="first uat-adminusersourcemanage-td" title={m.name}>{m.name}</td>
                        <td className="uat-adminusersourcemanage-td" title={m.identifier}>{m.identifier}</td>
                        <td className={"uat-adminusersourcemanage-td "+m.enable.color}>{m.enable.text}</td>
                        <td className="uat-adminusersourcemanage-td" title={m.describe}>{m.describe}</td>
                        <td className="operation uat-adminusersourcemanage-td">
                            <ico className="pointer icon iconfont r-btn dropdown-button moreico" data-activates={"morelist"+m.id} data-constrainwidth="false">&#xe675;</ico>
                            <ul id={"morelist"+m.id} className="dropdown-content setuplist">
                                <li className={m.use.useOn} onClick={this.enableOn.bind(this,m.id,1)}>
                                    <i className="icon iconfont">&#xe664;</i>
                                    <a href="javascript:void(0)">启用</a>
                                </li>
                                <li className={m.use.useOff} onClick={this.enableOff.bind(this,m.id,0)}>
                                    <i className="icon iconfont">&#xe65c;</i>
                                    <a href="javascript:void(0)">停用</a>
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

class RightTrue extends React.Component{
    resetNowTable(){
        let that = this;
        let index = this.state.index,
            size = this.state.size,
            classify = this.state.classifyName;
        console.log(classify)
        let total=0,thisData=[];
        util.api({
            data:{
                method: 'mkt.source.list',
                index:index,
                size:size,
                id:classify
            },
            success :function (res) {
                total = parseInt(res.total); thisData = res.data;
                that.formatTbodyData(total,thisData);
            }
        });
    }
    fetchTable(index,size,classify){
        let initType = this.state.initType;
        let that = this;
        let total=0,total_count=0,thisData=[];
        util.api({
            data:{
                method: 'mkt.source.list',
                index:index,
                size:size,
                id:classify
            },
            beforeSend: function () {
                if(initType.length < 1){
                    that.setState({tbodyModule:<TbodyLoading colspan={5} tbodyClassName={'uat-adminusersourcemanage-tbody'}/>});
                }
            },
            success :function (res) {
                total = parseInt(res.total); total_count = parseInt(res.total_count); thisData = res.data;
                that.setState({tbodyTotalCount:total_count});
                that.formatTbodyData(total,thisData);
                $('.pagination-wrap').pagination('updateItems', total_count);
            }
        });
    }
    formatTbodyData(total,thisData){
        let enableType,useClass,tbodyData = [];
        for(let i=0; i<total; i++){
            if(thisData[i].available == 1){
                enableType = {text:'已启用',color:'text-green'};
                useClass = {useOn:'',useOff:'show'};
            }else{
                enableType = {text:'未启用',color:'text-red'};
                useClass = {useOn:'show',useOff:''};
            }
            tbodyData[i] = {
                id:thisData[i].id,
                name:thisData[i].name,
                identifier:thisData[i].identity_id,
                enable:enableType,
                describe:thisData[i].description,
                use:useClass
            };
        }
        this.setState({
            initType:'',
            tbodyModule:<TbodyTrue resetNowTable={this.resetNowTable} data={tbodyData}/>
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
    setPagination(){
        let that = this;
        let classify;
        let thisSize = this.state.size;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    classify = that.state.classifyName;
                    that.fetchTable(pageNumber,thisSize,classify);
                    that.setState({index:pageNumber});
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            initType:'loading',
            classifyName:'',
            index: 1, size: 10,
            tbodyModule:<TbodyInit colspan={5} tbodyClassName={'uat-adminusersourcemanage-tbody'}/>,
            tbodyTotalCount:0
        };
        this.resetNowTable = this.resetNowTable.bind(this);
    }
    componentDidMount(){
        let classify = this.props.classify;
        this.setState({classifyName:classify});
        this.fetchTable(1,10,classify);
        this.setPagination();
    }
    render() {
        return (
            <div className="table-box">
                <table className="page-table-box uat-adminusersourcemanage-table">
                    <thead>
                    <tr>
                        <th className="first">名称</th>
                        <th>识别标识符</th>
                        <th>是否启用</th>
                        <th>
                            描述<ico className="describe icon iconfont r-btn dropdown-button" data-activates="describe" data-constrainwidth="false" data-hover="true" data-beloworigin="true">&#xe66f;</ico>
                            <ul id="describe" className="dropdown-content describe-huit">
                                <li className="nohover">
                                    只有启用的来源才能接入数据
                                </li>
                            </ul>
                        </th>
                        <th className="ico">操作</th>
                    </tr>
                    </thead>
                    {this.state.tbodyModule}
                </table>
                <div className="total-count">共<span>{this.state.tbodyTotalCount}</span>条</div>
                <div className="pagination-wrap pagination"></div>
            </div>
        )
    }
}

class RightLoading extends React.Component{
    render() {
        return (
            <img className="loading" src="../../../img/loading.gif"/>
        )
    }
}

class RightFalse extends React.Component{
    render() {
        return (
            <div className="nodata">
                <img src="../../../img/system-lab/labdefault.png"/>
                <div className="h1">暂无用户来源</div>
                <div className="h2">请在分类菜单中选择一个分类进行查看</div>
            </div>
        )
    }
}

class AddSource extends React.Component{
    render() {
        return (
            <div className="add-source-html">
                <div className="line">
                    <div className="classify-title">
                        <div className="text">来源名称</div>
                        <div className="red-star">&#42;</div>
                    </div>
                    <div className="classify-cont">
                        <div className="input-box">
                            <input id="addSourceInput" className="input" placeholder="最多15个字符长度" maxLength="15"/>
                        </div>
                    </div>
                </div>
                <div className="line">
                    <div className="classify-title">&nbsp;</div>
                    <div id="addSourceHint" className="classify-cont msg">
                        <ico className="icon iconfont">&#xe60a;</ico>&nbsp;
                        <span id="addSourceHintText">数字、字母、中文、-、_、+、()、/</span>
                    </div>
                </div>
                <div className="line">
                    <div className="classify-title">
                        <div className="text">来源描述</div>
                    </div>
                    <div className="classify-cont">
                        <div className="textarea-box">
                            <textarea id="addSourceTextarea" className="textarea" placeholder="最多20个字符长度" maxLength="20"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
class AddClassify extends React.Component{
    render() {
        return (
            <div className="add-classify-html">
                <div className="line">
                    <div className="classify-title">
                        <div className="text">分类名称</div>
                        <div className="red-star">&#42;</div>
                    </div>
                    <div className="classify-cont">
                        <div className="input-box">
                            <input id="addClassifyInput" className="input" placeholder="最多15个字符长度" maxLength="15"/>
                        </div>
                    </div>
                </div>
                <div className="line">
                    <div className="classify-title">&nbsp;</div>
                    <div id="addClassifyHint" className="classify-cont msg">
                        <ico className="icon iconfont">&#xe60a;</ico>&nbsp;
                        <span id="addClassifyHintText">数字、字母、中文、-、_、+、()、/</span>
                    </div>
                </div>
            </div>
        )
    }
}

class Manage extends React.Component{
    resetNowTable(){
        let that = this;
        let index = this.state.index,
            size = this.state.size,
            classify = this.state.classifyName;
        let total=0,total_count=0,thisData=[];
        $.ajax({
            url:"../../../apidata/admin/user-source/manage.json",
            data:{
                method: '',
                index:index,
                size:size,
                classify:classify
            },
            success :function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); total_count = parseInt(res.total_count); thisData = res.data;
                    that.setState({tbodyTotalCount:total_count});
                    if(total>0){
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyModule:<TbodyFalse />});
                    }
                }else{
                    total_count = 0;
                    that.setState({tbodyModule:<TbodyFalse />});
                }
            }
        });
    }
    fetchTable(index,size,classify,name){
        let that = this;
        let total=0;
        util.api({
            data:{
                method: 'mkt.source.list',
                index:index,
                size:size,
                id:classify
            },
            beforeSend: function () {
                that.setState({
                    tableClass:'table-correct-false',
                    tbodyModule:<RightLoading />
                });
            },
            success :function (res) {
                if(res.code == 0){
                    total = parseInt(res.total);
                    if(total>0){
                        that.setState({
                            classifyName:name,
                            tableClass:'table-correct-true',
                            tbodyModule:<RightTrue classify={classify}/>
                        });
                    }else{
                        that.setState({tbodyModule:<RightFalse />});
                    }
                }else{
                    that.setState({tbodyModule:<RightFalse />});
                }
            },
            error: function () {
                that.setState({tbodyModule:<RightFalse />});
            }
        });
    }
    addSource(id){
        let masterThis = this;
        new Modals.Window({
            id: "addRootHtml",
            title: '创建来源',
            content: "<div class='con-body'/>",
            width: 400,
            height: 290,
            buttons: [
                {
                    text: '提交',
                    cls: 'accept',
                    handler: function (self) {
                        let arg = $('#addSourceInput').val().trim();
                        let textarea = $('#addSourceTextarea').val().trim();
                        if(/^([\u4E00-\u9FA5]|[a-zA-Z0-9]|-|_|\+|\/|\(|\)|（|）|\s)*$/.test(arg)){
                            $('#addSourceHint').css('display','none');
                            util.api({
                                url: "?method=mkt.source.save",
                                type: 'post',
                                data: {
                                    id:id,
                                    name:arg,
                                    description:textarea
                                },
                                success: function (res) {
                                    if(res.code == 0){
                                        masterThis.fetchTree('reset');
                                        self.close();
                                    }else{
                                        $('#addSourceHintText').text(res.msg);
                                        $('#addSourceHint').css('display','block');
                                    }
                                }
                            });
                        }else{
                            $('#addSourceHintText').text('数字、字母、中文、-、_、+、()、/');
                            $('#addSourceHint').css('display','block');
                        }
                    }
                },{
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
                        <AddSource />,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        });
    }
    addClassify(id){
        let masterThis = this;
        let thisId;
        new Modals.Window({
            id: "addRootHtml",
            title: '创建分类',
            content: "<div class='con-body'/>",
            width: 400,
            height: 'auto',
            buttons: [
                {
                    text: '提交',
                    cls: 'accept',
                    handler: function (self) {
                        let arg = $('#addClassifyInput').val().trim();
                        if(/^([\u4E00-\u9FA5]|[a-zA-Z0-9]|-|_|\+|\/|\(|\)|（|）|\s)*$/.test(arg)){
                            $('#addClassifyHint').css('display','none');
                            parseInt(id) > 0 ? thisId = id : thisId = '';
                            util.api({
                                url: "?method=mkt.classification.save",
                                type: 'post',
                                data: {
                                    id:thisId,
                                    name:arg
                                },
                                success: function (res) {
                                    if(res.code == 0){
                                        masterThis.fetchTree('reset');
                                        self.close();
                                    }else{
                                        $('#addClassifyHintText').text(res.msg);
                                        $('#addClassifyHint').css('display','block');
                                    }
                                }
                            });
                        }else{
                            $('#addClassifyHintText').text('数字、字母、中文、-、_、+、()、/');
                            $('#addClassifyHint').css('display','block');
                        }
                    }
                },{
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
                        <AddClassify />,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        });
    }
    fetchTree(mold){
        let that = this;
        let total=0,twoLevel = [],last = [],thisData=[];
        let thisMold = mold || '';
        util.api({
            data:{method: 'mkt.classification.list'},
            beforeSend: function () {
                that.setState({
                    treeLoading:'treeLoading',
                    treeList:[]
                });
            },
            success :function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); thisData = res.data;
                    for(let i=0; i<thisData.length; i++){
                        twoLevel = thisData[i].children_node;
                        thisData[i].branch = 'tree-branch';
                        if(twoLevel.length > 0){
                            thisData[i].contClass = 'hide';
                            thisData[i].addSon = '';
                            thisData[i].addSource = 'hide';
                            thisData[i].liClass = 'collapsable';
                            for(let j=0; j<twoLevel.length; j++){
                                last = (thisData[i].children_node)[j].children_node;
                                if(last.length > 0){
                                    twoLevel[j].contClass = 'hide';
                                    twoLevel[j].addSon = '';
                                    twoLevel[j].addSource = 'hide';
                                    twoLevel[j].liClass = 'collapsable';
                                    for(let k=0; k<last.length; k++){
                                        last[k].contClass = '';
                                        last[k].addSon = 'hide';
                                        last[k].addSource = '';
                                        last[k].liClass = 'collapsable';
                                    }
                                }else{
                                    twoLevel[j].contClass = '';
                                    twoLevel[j].addSource = '';
                                    twoLevel[j].liClass = 'collapsable';
                                    parseInt(twoLevel[j].count)>0 ? twoLevel[j].addSon = 'hide' : twoLevel[j].addSon = '';
                                }
                            }
                        }else{
                            thisData[i].contClass = '';
                            thisData[i].addSource = '';
                            thisData[i].liClass = 'collapsable';
                            parseInt(thisData[i].count)>0 ? thisData[i].addSon = 'hide' : thisData[i].addSon = '';
                        }
                    }
                    if(thisMold == 'reset'){
                        that.setState({
                            treeLoading:'',
                            treeList:thisData,
                            tableClass:'table-correct-false',
                            tbodyModule:<RightFalse />
                        });
                    }else{
                        that.setState({
                            treeLoading:'',
                            treeList:thisData
                        });
                    }
                    $('.dropdown-button').dropdown({
                        inDuration: 300,
                        outDuration: 225,
                        constrain_width: false,
                        hover: false,
                        gutter: 0,
                        belowOrigin: false
                    });
                }
            }
        });
    }
    treeShowHide(id,contClass,name,e){
        let thisParentLi = $(e.currentTarget).parent('.ulhiare').parent('.li');
        if(contClass.length > 0){
            if(thisParentLi.hasClass('collapsable')){
                thisParentLi.removeClass('collapsable').addClass('expandable');
                return;
            }
            if(thisParentLi.hasClass('expandable')){
                thisParentLi.removeClass('expandable').addClass('collapsable');
                return;
            }
        }else{
            this.setState({classifyName:name});
            this.fetchTable(1,10,id,name);
        }
    }
    constructor(props){
        super(props);
        this.state = {
            treeLoading:'treeLoading',
            treeList:[],
            classifyName:'',
            tableClass:'table-correct-false',
            tbodyModule:<RightFalse />
        };
        /*
         treeList:[
             {
                id:1,parent_id:-1,name:'交易净额',count:0,contClass:'hide',liClass:'collapsable',addSon:'',addSource:'hide',
                children_node:[
                     {
                        id:11,parent_id:1,name:'个人信息',count:0,contClass:'hide',liClass:'collapsable',addSon:'',addSource:'hide',
                        children_node:[
                            {id:111,parent_id:11,name:'地理区域',count:200,contClass:'',liClass:'collapsable',addSon:'hide',addSource:''}
                         ]
                     }
                 ]
             }
         ]
        */
    }
    componentDidMount(){
        this.fetchTree();
    }
    render() {
        return (
            <div className="ausm">
                <SubHead />
                <div className="content">
                    <div className={"left-tree "+this.state.treeLoading}>
                        <div className="tree-header">管理分类</div>
                        <div className="addroot">
                            <div className="addbut" onClick={this.addClassify.bind(this,-1)}>创建根分类</div>
                        </div>
                        <div className="tree-area">
                            <div className={"treeLoading"}>
                                <img src={IMG_PATH+'/img/loading.gif'} width='50'/>
                            </div>
                            <ul className="tree-branch">
                                {this.state.treeList.map((m,i)=> {
                                    return (
                                        <li className={"li "+m.liClass}>
                                            <div className="ulhiare">
                                                <div className="hitarea" onClick={this.treeShowHide.bind(this,m.id,m.contClass,m.name)}></div>
                                                <div className="name" onClick={this.treeShowHide.bind(this,m.id,m.contClass,m.name)}>
                                                    {m.name}
                                                    <span className={"num "+m.contClass}>({m.count})</span>
                                                </div>
                                                <ico className="iconc icon iconfont r-btn dropdown-button" data-activates={"add"+m.id} data-constrainwidth="false" data-beloworigin="true">&#xe675;</ico>
                                                <ul id={"add"+m.id} className="dropdown-content">
                                                    <li className={m.addSon} onClick={this.addClassify.bind(this,m.id)}>
                                                        <i className="icon iconfont">&#xe664;</i>
                                                        <a href="javascript:void(0)">添加子分类</a>
                                                    </li>
                                                    <li className={m.addSource} onClick={this.addSource.bind(this,m.id)}>
                                                        <i className="icon iconfont">&#xe664;</i>
                                                        <a href="javascript:void(0)">添加来源</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <ul className="tree-branch">
                                                {m.children_node.map((n,i)=> {
                                                    return (
                                                        <li className={"li "+n.liClass}>
                                                            <div className="ulhiare">
                                                                <div className="hitarea" onClick={this.treeShowHide.bind(this,n.id,n.contClass,n.name)}></div>
                                                                <div className="name" onClick={this.treeShowHide.bind(this,n.id,n.contClass,n.name)}>
                                                                    {n.name}
                                                                    <span className={"num "+n.contClass}>({n.count})</span>
                                                                </div>
                                                                <ico className="iconc icon iconfont r-btn dropdown-button" data-activates={"add"+n.id} data-constrainwidth="false" data-beloworigin="true">&#xe675;</ico>
                                                                <ul id={"add"+n.id} className="dropdown-content">
                                                                    <li className={n.addSon} onClick={this.addClassify.bind(this,n.id)}>
                                                                        <i className="icon iconfont">&#xe664;</i>
                                                                        <a href="javascript:void(0)">添加子分类</a>
                                                                    </li>
                                                                    <li className={n.addSource} onClick={this.addSource.bind(this,n.id)}>
                                                                        <i className="icon iconfont">&#xe664;</i>
                                                                        <a href="javascript:void(0)">添加来源</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <ul className="tree-son">
                                                                {n.children_node.map((q,i)=> {
                                                                    return (
                                                                        <li className={"li "+q.liClass}>
                                                                            <div className="hitarea" onClick={this.treeShowHide.bind(this,q.id,q.contClass,q.name)}></div>
                                                                            <div className="name" onClick={this.treeShowHide.bind(this,q.id,q.contClass,q.name)}>
                                                                                {q.name}
                                                                                <span className={"num "+q.contClass}>({q.count})</span>
                                                                            </div>
                                                                            <ico className="iconc icon iconfont r-btn dropdown-button" data-activates={"add"+q.id} data-constrainwidth="false" data-beloworigin="true">&#xe675;</ico>
                                                                            <ul id={"add"+q.id} className="dropdown-content">
                                                                                <li className={q.addSon} onClick={this.addClassify.bind(this,q.id)}>
                                                                                    <i className="icon iconfont">&#xe664;</i>
                                                                                    <a href="javascript:void(0)">添加子分类</a>
                                                                                </li>
                                                                                <li className={q.addSource} onClick={this.addSource.bind(this,q.id)}>
                                                                                    <i className="icon iconfont">&#xe664;</i>
                                                                                    <a href="javascript:void(0)">添加来源</a>
                                                                                </li>
                                                                            </ul>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="right-table">
                        <div className="right-header">
                            <div className="header-title">来源列表</div>
                            <div className="table-title">{this.state.classifyName}</div>
                        </div>
                        <div className={"table-area "+this.state.tableClass}>
                            {this.state.tbodyModule}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
/**
 * Created by AnThen on 2016-8-8.
 * 微信二维码-编辑 es6+react版
 */
'use strict';//严格模式

//构造页面
import Layout from 'module/layout/layout';

//先创建布局
const layout = new Layout({
    index: 2,
    leftMenuCurName:'微信二维码'
});

//插件
//弹层插件
let Modals = require('component/modals.js');
//时间插件
let dateTime = require('module/plan/utils/dateTime.js');
//二维码预览
import Preview from 'module/asset/qrcode-preview';

//编写页面模块
//二级头部
class SubHead extends React.Component{
    gotoLast(){
        window.history.go(-1);
    }
    modalsPreview(e){
        /*初始化变量*/
        let thisDiv = $(e.currentTarget);
        let thisData;
        let thisId = this.props.param.id;
        let wxAttc = this.props.param.subscriptionName.acct;
        let modalsTitle = this.props.param.subscriptionName.name;
        let chId = this.props.param.channelName.id;
        let chTitle = this.props.param.channelName.name;
        let qrcodeName = this.props.param.qrcodeName;
        let fixedCrowd = this.props.param.fixedCrowdInputValue,fixedCrowdShow;
        let failuresTime = this.props.param.failuresTime,failuresTimeShow;
        let comment = this.props.param.textareaText.text,commentshow;
        let tags = this.props.param.tags,tagsprarm = [];
        /*组织modals数据*/
        if(fixedCrowd==''){fixedCrowdShow='无'}else{fixedCrowdShow=fixedCrowd}
        if(failuresTime==''){failuresTimeShow='永久'}else{failuresTimeShow=failuresTime}
        if(comment==''){commentshow='无'}else{commentshow=comment}
        /*整理modals数据*/
        for(let i=0; i<tags.length; i++){
            tagsprarm[i] = {
                custom_tag_id:tags[i].id,
                custom_tag_name:tags[i].name,
                parent_id:tags[i].categoryId,
                parent_name:tags[i].categoryName,
                is_deleted:tags[i].isDeleted
            };
        }
        /*输出*/
        if(thisDiv.hasClass('keyong')){
            util.api({
                url: "?method=mkt.weixin.qrcode.create",
                type: 'post',
                data: {
                    id: thisId,
                    wx_acct: wxAttc,
                    wx_name: modalsTitle,
                    ch_code: chId,
                    ch_name: chTitle,
                    qrcode_name: qrcodeName,
                    expiration_time: failuresTime,
                    fixed_audience: fixedCrowd,
                    custom_tag_list: tagsprarm,
                    comments: comment
                },
                success: function (res) {
                    if(res.code == 0){
                        thisData = res.data[0];
                        new Modals.Window({
                            id: "modalsPreviewHtml",
                            title: modalsTitle,
                            content: "<div class='con-body'/>",
                            width: 372,//默认是auto
                            height: 623,//默认是auto
                            buttons: [
                                {
                                    text: '生成二维码',
                                    cls: 'accept',
                                    handler: function (self) {
                                        util.api({
                                            url: "?method=mkt.weixin.qrcode.create",
                                            type: 'post',
                                            data:{wechat_qrcode:thisId},
                                            success: function (res){
                                                location.href = BASE_PATH+'/html/asset/qrcode-download.html?id='+thisId;
                                                self.close('go');
                                            }
                                        });
                                    }
                                }
                            ],
                            listeners: {
                                beforeRender: function () {
                                    let param = {
                                        qrcodePic:FILE_PATH+thisData.qrcodePic,
                                        chTitle:chTitle,
                                        qrcodeName:qrcodeName,
                                        createtime:thisData.createtime,
                                        failuresTimeShow:failuresTimeShow,
                                        fixedCrowdShow:fixedCrowdShow,
                                        tags:tags,
                                        commentshow:commentshow
                                    };
                                    this.customView = ReactDOM.render(
                                        <Preview param={param}/>,
                                        $('.con-body', this.$el)[0]
                                    );
                                }
                            }
                        });
                    }else{Materialize.toast('预览数据组织失败！', 2000);}
                }
            });
        }
    }
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">编辑二维码</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" href="javascript:void(0)" title="返回" onClick={this.gotoLast.bind(this)}>
                        <span className="icon iconfont">&#xe621;</span>
                        <span className="text">返回</span>
                    </a>
                    <a className={"a "+this.props.param.preview} href="javascript:void(0)" title="预览" onClick={this.modalsPreview.bind(this)}>
                        <span className="icon iconfont">&#xe651;</span>
                        <span className="text">预览</span>
                    </a>
                </div>
            </header>
        )
    }
}
/*新建固定人群*/
class NewFixedCrowd extends React.Component {
    render(){
        return(
            <div className="line-box">
                <div className="line-title">固定人群名称</div>
                <div className="line">
                    <div className="fixed-crowd">
                        <div className="input-box-disabled">
                            <div className="input">{this.props.value}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
class NewFixedCrowdRdit extends React.Component {
    fixedCrowd(id){
        let param=[];
        if(id == 'yes'){
            this.setState({
                fixedCrowdRadio:[true,false],
                fixedCrowdDisplay: 'block',
                fixedCrowdInput: {class: '', msg: ''}
            });
            param=['bukeyong',''];
        }
        if(id == 'no'){
            this.setState({
                fixedCrowdRadio:[false,true],
                fixedCrowdDisplay: 'none',
                fixedCrowdInput: {class: '', msg: ''}
            });
            param=['keyong',''];
        }
        $('#fixed-crowd-input').val('');
        this.props.resetFixedCrowd(param);
    }
    resetThisFixedCrowd(){
        let that = this,param = [];
        let thisInput = $.trim($('#fixed-crowd-input').val()),thisInputPrompt,testType;
        if(thisInput.length > 0){
            util.api({
                data: {method: 'mkt.asset.wechat.audiencelist.match.get',audience_name:thisInput},
                success: function (res) {
                    if(res.code == 0){
                        if(res.data[0].is_match == 0){
                            testType = true;
                            thisInputPrompt = {class: '', msg: ''};
                            param = ['keyong',thisInput];
                        }
                        if(res.data[0].is_match == 1){
                            testType = false;
                            thisInputPrompt = {class: 'show', msg: '固定人群名称不能重复！'};
                            param = ['bukeyong',thisInput];
                        }
                        that.setState({fixedCrowdInput:thisInputPrompt});
                        that.props.resetFixedCrowd(param);
                    }
                }
            });
        }else{
            thisInputPrompt = {class: 'show', msg: '固定人群名称不能为空！'};
            this.setState({fixedCrowdInput:thisInputPrompt});
            param = ['bukeyong',''];
            that.props.resetFixedCrowd(param);
        }

    }
    constructor(props){
        super(props);
        this.state = {
            fixedCrowdRadio: [false,true],
            fixedCrowdDisplay: 'none',
            fixedCrowdInput: {class: '', msg: ''}
        };
    }
    render(){
        return(
            <div>
                <div className="line-box">
                    <div className="line-title">新建固定人群</div>
                    <div className="line">
                        <div className="fixed-crowd-radio">
                            <div className="radio-box" onClick={this.fixedCrowd.bind(this,'yes')}>
                                <input className="type1" name="fixed-crowd" type="radio" id="fixed-crowd-yes" value="" checked={this.state.fixedCrowdRadio[0]}/>
                                <label for="fixed-crowd-yes">是</label>
                            </div>
                            <div className="radio-box" onClick={this.fixedCrowd.bind(this,'no')}>
                                <input className="type1" name="fixed-crowd" type="radio" id="fixed-crowd-no" checked={this.state.fixedCrowdRadio[1]}/>
                                <label for="fixed-crowd-no">否</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line-box" style={{display:this.state.fixedCrowdDisplay}}>
                    <div className="line-title"><span className="red-font">&#8727;</span>固定人群名称</div>
                    <div className="line">
                        <div className="fixed-crowd">
                            <div className="input-box">
                                <input className="input" type="text" id="fixed-crowd-input" onBlur={this.resetThisFixedCrowd.bind(this)}/>
                            </div>
                            <div className={'msg '+this.state.fixedCrowdInput.class}>{this.state.fixedCrowdInput.msg}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
/*自定义标签*/
class CustomTagShow extends React.Component {
    deleteThisTag(param){
        this.props.deleteTag(param);
    }
    render(){
        let thisData = this.props.tagData;
        let isDeleted = thisData.isDeleted,name = thisData.name,categoryName = thisData.categoryName;
        if(isDeleted == 0){
            return(
                <nobr className="tag" title={categoryName}>{name}<div className="close icon iconfont" onClick={this.deleteThisTag.bind(this,thisData)}>&#xe608;</div></nobr>
            )
        }else{
            return(
                <nobr className="tag is_deleted" title={categoryName}>{name}<div className="close icon iconfont" onClick={this.deleteThisTag.bind(this,thisData)}>&#xe608;</div></nobr>
            )
        }
    }
}
/********组织页面模块********/
class Manage extends React.Component {
    dropdownButton(){
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: true,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
    }
    fetch(){
        let that = this;
        let thisId = util.geturlparam('id');
        let thisData,fixedCrowdInputValue,associationTags = [],newTags = [],noteText;
        if(thisId){
            util.api({
                data:{method: 'mkt.weixin.qrcode.info',qrcode_id:thisId},
                success: function (res) {
                    if(res.code == 0){
                        thisData = res.data[0];
                        that.setState({
                            id: thisId,
                            startTime:res.date,
                            subscriptionName: {acct:thisData.wx_acct,name:thisData.wxmp_name},
                            channelName: {id:thisData.ch_id,name:thisData.ch_name},
                            qrcodeName: thisData.qrcode_name
                        });
                        if(thisData.expiration_time){
                            that.setState({
                                failuresTime: thisData.expiration_time
                            });
                        }
                        fixedCrowdInputValue = thisData.fixed_audience;
                        that.setState({
                            fixedCrowdModule:<NewFixedCrowd value={fixedCrowdInputValue}/>,
                            fixedCrowdInputValue: fixedCrowdInputValue
                        });
                        if(fixedCrowdInputValue.length>0){
                            that.setState({
                                fixedCrowdModule:<NewFixedCrowd value={fixedCrowdInputValue}/>,
                                fixedCrowdInputValue: fixedCrowdInputValue
                            });
                        }else{
                            that.setState({
                                fixedCrowdModule:<NewFixedCrowdRdit resetFixedCrowd={that.resetFixedCrowd}/>,
                                fixedCrowdInputValue: ''
                            });
                        }
                        associationTags=thisData.custom_tag_list;
                        if(associationTags.length>0){
                            for(let i=0; i<associationTags.length;i++){
                                newTags[i] = {
                                    id:associationTags[i].custom_tag_id,
                                    name:associationTags[i].custom_tag_name,
                                    categoryId:associationTags[i].parent_id,
                                    categoryName:associationTags[i].parent_name,
                                    isDeleted:associationTags[i].is_deleted
                                };
                            }
                            that.setState({
                                tags: newTags,
                                tagsRadio:[true,false],
                                tagsAreaDisplay: 'block'
                            });
                        }
                        noteText=thisData.comment;
                        if(noteText.length>0){
                            $('#note-textarea').val(noteText);
                            that.setState({
                                textareaText:{text:noteText,num: noteText.length}
                            });
                        }
                    }else{
                        that.setState({
                            fixedCrowdModule:<NewFixedCrowdRdit resetFixedCrowd={that.resetFixedCrowd}/>,
                            fixedCrowdInputValue: ''
                        });
                    }
                }
            });
        }
    }
    fetchTagsList(){
        let that = this;
        let thisData = [],total = 0;
        util.api({
            data: {
                method: 'mkt.customtag.qrcode.fuzzy.list',
                custom_tag_name: ''
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total);
                    thisData = res.data;
                    that.formatTagsList(total,thisData,'');
                }
            }
        });
    }
    formatTagsList(total,thisData,name){
        let thisTagsList = [];
        let newtag = {name:'',addClass:''};
        for(let i=0; i<total; i++){
            thisTagsList[i] = {
                id:thisData[i].custom_tag_id,
                name:thisData[i].custom_tag_name,
                categoryId:thisData[i].custom_tag_category_id,
                categoryName:thisData[i].custom_tag_category_name,
                isDeleted:0
            };
        }
        if(name.length > 0){
            if(total > 0){
                for(let i=0; i<total; i++){
                    if(name === thisTagsList[i].name){
                        newtag = {name:'',addClass:''};
                        break;
                    }else{
                        newtag = {name:name,addClass:' show'};
                    }
                }
            }else{
                newtag = {name:name,addClass:' show'};
            }
        }
        this.setState({
            tagsList:thisTagsList,
            newtag:newtag
        });
    }
    setupDate(){
        let that = this;
        let thisDate,start_date=this.state.startTime;
        $('#failures-time').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 5,
            min: new Date(start_date),
            onClose: function(){
                thisDate = this.component.$node.context.value;
                that.setState({failuresTime:thisDate});
            }
        });
    }
    fixedAssociationTags(id){
        if(id == 'yes'){
            this.setState({
                tagsRadio:[true,false],
                tagsAreaDisplay: 'block'
            });
        }
        if(id == 'no'){
            this.setState({
                tagsRadio:[false,true],
                tagsAreaDisplay: 'none'
            });
        }
    }
    associationTags(){
        let that = this;
        let associationTagsId,associationTags;
        let thisData = [],total = 0;
        let oldInputVal = this.state.associationTagInput;
        associationTagsId = $('#associationTags');
        associationTags = associationTagsId.val().trim();
        if(util.getrexResult(associationTags)){
            this.setState({associationTagInput:associationTags});
            util.api({
                data: {
                    method: 'mkt.customtag.qrcode.fuzzy.list',
                    custom_tag_name: associationTags
                },
                success: function (res) {
                    if(res.code == 0){
                        total = parseInt(res.total);
                        thisData = res.data;
                        that.formatTagsList(total,thisData,associationTags);
                    }
                }
            });
        }else{
            associationTagsId.val(oldInputVal);
        }
    }
    resetFixedCrowd(param){
        let preview = param[0],value = param[1];
        this.setState({
            preview:preview,
            fixedCrowdInputValue:value
        });
    }
    addtag(id,name,categoryId,categoryName,isDeleted){
        let param = {id:id,name:name,categoryId:categoryId,categoryName:categoryName,isDeleted:isDeleted};
        let tags = this.state.tags,tagsLength = tags.length,result = true;
        if(tags.length > 0){
            for(let i=0; i<tagsLength; i++){
                if((param.name == tags[i].name)&&(param.categoryId == tags[i].categoryId)){
                    result = false;
                    break;
                }else{result = true;}
            }
        }else{
            result = true;
        }
        if(result){tags[tagsLength]=param}
        this.setState({tags:tags});
        $('#associationTags').val('');
        this.fetchTagsList();
    }
    deleteTag(param){
        let tags = this.state.tags,tagNum = tags.length;
        for(let i=0; i<tagNum; i++){
            if((param.id == tags[i].id)&&(param.name == tags[i].name)&&(param.categoryId == tags[i].categoryId)){
                tags.splice(i,1);
                break;
            }
        }
        this.setState({tags:tags})
    }
    resetTextareaText(){
        let thisTextarea = $.trim($('#note-textarea').val()),thisTextareaLength = thisTextarea.length;
        if(thisTextareaLength > 100){
            thisTextarea = thisTextarea.substring(0,100);
            thisTextareaLength = 100;
            $('#note-textarea').val(thisTextarea);
        }
        this.setState({
            textareaText:{text:thisTextarea,num:thisTextareaLength}
        });
    }
    constructor(props){
        super(props);
        this.state = {
            id: '',
            preview: 'keyong',
            subscriptionName: {acct:0,name:''},
            channelName: {id:0,name:''},
            qrcodeName: '',
            startTime:'',
            failuresTime: '',
            fixedCrowdModule:'',
            fixedCrowdInputValue: '',
            tagsRadio: [false,true],
            tags: [],
            tagsList:[],
            associationTagInput:'',
            newtag:{name:'',addClass:''},
            tagsAreaDisplay: 'none',
            textareaText: {text:'',num:0}
        };
        this.resetFixedCrowd = this.resetFixedCrowd.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
    }
    componentDidMount(){
        this.fetch();
        this.fetchTagsList();
        this.dropdownButton();
    }
    render() {
        return (
            <div className="qrcode-edit">
                <SubHead param={this.state}/>
                <div className="content">
                    <div className="line-box">
                        <div className="line-title">公众号</div>
                        <div className="line">
                            <div className="subscription">
                                <div className="input">{this.state.subscriptionName.name}</div>
                            </div>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="line-title">渠道分类</div>
                        <div className="line">
                            <div className="channel">
                                <div className="input">{this.state.channelName.name}</div>
                            </div>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="line-title">二维码名称</div>
                        <div className="line">
                            <div className="qrcode-name">
                                <div className="input">{this.state.qrcodeName}</div>
                            </div>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="line-title">设置失效时间</div>
                        <div className="line">
                            <div className="failures-time">
                                <input className="input" id="failures-time" type="text" value={this.state.failuresTime} readOnly onClick={this.setupDate.bind(this)}/>
                                <div className="arrow-down icon iconfont" >&#xe6ae;</div>
                            </div>
                        </div>
                    </div>
                    {this.state.fixedCrowdModule}
                    <div className="line-box">
                        <div className="line-title">新建自定义标签</div>
                        <div className="line">
                            <div className="association-tags-radio">
                                <div className="radio-box" onClick={this.fixedAssociationTags.bind(this,'yes')}>
                                    <input className="type1" name="fixed-tag" type="radio" id="fixed-tag-yes" checked={this.state.tagsRadio[0]}/>
                                    <label htmlFor="fixed-tag-yes">是</label>
                                </div>
                                <div className="radio-box" onClick={this.fixedAssociationTags.bind(this,'no')}>
                                    <input className="type1" name="fixed-tag" type="radio" id="fixed-tag-no" checked={this.state.tagsRadio[1]}/>
                                    <label htmlFor="fixed-tag-no">否</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="line-box" style={{display:this.state.tagsAreaDisplay}}>
                        <div className="line" style={{margin: '0 0 0 170px'}}>
                            <div className="tags-area">
                                <div className="tags-input">
                                    <input id="associationTags" className="input dropdown-button" type="text" maxLength="15" placeholder="按自定义标签名称搜索" data-activates="tagslist" data-beloworigin="true" onKeyUp={this.associationTags.bind(this)}/>
                                    <ul id="tagslist" className="dropdown-content tags-list">
                                        <div className="li-box">
                                            {this.state.tagsList.map((m,i)=> {
                                                return(
                                                    <li style={{height:'30px !important',lineHeight:'30px'}} onClick={this.addtag.bind(this,m.id,m.name,m.categoryId,m.categoryName,m.isDeleted)}>{m.name}&#91;{m.categoryName}&#93;</li>
                                                )
                                            })}
                                        </div>
                                        <div className={"bottom"+this.state.newtag.addClass}>{this.state.newtag.name}（新标签）&nbsp;<a className="a" title="新建新标签" href="javascript:void(0)" onClick={this.addtag.bind(this,'',this.state.newtag.name,'','','')}>新建新标签</a></div>
                                    </ul>
                                </div>
                                <div className="tags-broder" id="tags-broder">
                                    {this.state.tags.map((m,i)=> {
                                        return(
                                            <CustomTagShow tagData={m} deleteTag={this.deleteTag}/>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="line-title">备注信息</div>
                        <div className="line">
                            <div className="note-area">
                                <div className="textarea-box">
                                    <textarea className="textarea" id="note-textarea" onChange={this.resetTextareaText.bind(this)}></textarea>
                                </div>
                                <div className="font-num">{this.state.textareaText.num}&#47;100</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
/********渲染页面********/
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
/**
 * Created by AnThen on 2016-8-8.
 * 微信二维码-新建 es6+react版
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
var dateTime = require('module/plan/utils/dateTime.js');
//二维码预览
import Preview from 'module/asset/qrcode-preview';

/********编写页面模块********/
/****二级头部****/
class SubHead extends React.Component{
    gotoLast(){
        window.history.go(-1);
    }
    modalsPreview(e){
        let thisDiv = $(e.currentTarget);
        let thisData,thisId;
        /*初始化变量*/
        let wxAttc = this.props.param.subscriptionName.acct;
        let modalsTitle = this.props.param.subscriptionName.name;
        let chId = this.props.param.channelName.id;
        let chTitle = this.props.param.channelName.name;
        let qrcodeName = this.props.param.qrcodeName.value;
        let fixedCrowd = this.props.param.fixedCrowdInput.value,fixedCrowdShow;
        let failuresTime = this.props.param.failuresTime,failuresTimeShow;
        let comment = this.props.param.textareaText.value,commentshow;
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
                        thisId = thisData.id;
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
                                            url: "?method=mkt.weixin.qrcode.enable",
                                            type: 'post',
                                            data:{id:thisId},
                                            success: function (res){
                                                location.href = BASE_PATH+'/html/asset/qrcode-download.html?id='+thisId;
                                                self.close('go');
                                            }
                                        });
                                    }
                                }
                            ],
                            listeners: {
                                close: function (type) {
                                    if(type!='go'){
                                        util.api({
                                            url: "?method=mkt.weixin.qrcode.records.del",
                                            type: 'post',
                                            data:{id:thisId},
                                            success: function (res){}
                                        });
                                    }
                                },
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
                    <span className="title">新建二维码</span>
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
    resetSubscription(id,acct,name){
        let channelName = this.state.channelName;
        let qrcodeName = this.state.qrcodeName;
        let subscriptionName = {id: id, acct:acct, name: name, type: true};
        channelName.id=='' ? qrcodeName.readonly=true : qrcodeName.readonly=false;
        qrcodeName.disabled = false;
        this.setState({
            subscriptionName:subscriptionName,
            qrcodeName:qrcodeName
        });
        this.prove('subscription',true);
    }
    fetchSubscription(){
        let that = this;
        let subscription = [];
        let thisData;
        util.api({
            data: {method: 'mkt.weixin.register.list'},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<res.total; i++){
                        subscription[i] = {id:thisData[i].wxmp_id,acct:thisData[i].wx_acct,name: thisData[i].name}
                    }
                    that.setState({subscription:subscription,startTime:res.date});
                }
            }
        });
    }
    resetChannel(id,name){
        let subscription = this.state.subscriptionName;
        let qrcodeName = this.state.qrcodeName;
        let channelName = {id: id, name: name, type: true};
        subscription.id=='' ? qrcodeName.readonly=true : qrcodeName.readonly=false;
        this.setState({channelName:channelName,qrcodeName:qrcodeName});
        this.prove('channel',true);
    }
    formatChannelData(data){
        let channel = [],trueI=0,channelFalse=[],falseI=0;
        let thisData=data,thisSystem=false;
        for(let i=0; i<thisData.length; i++){
            if(thisData[i].channel_type == 0){
                thisSystem=true;
                channel[trueI] = {
                    id: thisData[i].channel_id,
                    name:thisData[i].channel_name,
                    type:thisData[i].channel_removed,
                    system:thisSystem
                };
                trueI++;
            }else{
                thisSystem=false;
                channelFalse[falseI] = {
                    id: thisData[i].channel_id,
                    name:thisData[i].channel_name,
                    type:thisData[i].channel_removed,
                    system:thisSystem
                };
                falseI++;
            }
        }
        channel = channel.concat(channelFalse);
        this.setState({channel:channel});
    }
    fetchChannel(){
        let that = this;
        util.api({
            data: {method: 'mkt.weixin.channel.list'},
            success: function (res) {
                if(res.code == 0){
                    that.formatChannelData(res.data);
                }
            }
        });
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
    modalsChannel(){
        //公用变量
        let that = this;
        /*组织变动项*/
        let channelList = this.state.channel;
        let newChannel = channelList;
        //let tagsBoxHtml = "<nobr class='tag' id='' name=''>小鲜肉<div class='close-btn' index=''>X</div></nobr>";
        //let tagsBoxHtml = "<nobr class='tag' id='' name=''>小鲜肉</nobr>";
        let tagsBoxHtml = "";
        let html1 = "<nobr class='tag' id='",
            html2 = "' name='",
            html3 = "'>",
            html4 = "<div class='close-btn' index='",
            html5 = "'>X</div>",
            html6 = "</nobr>";
        for(let i=0; i<channelList.length; i++){
            if(!channelList[i].system){
                if(channelList[i].type==1){
                    tagsBoxHtml += html1 + channelList[i].id + html2 + channelList[i].name + html3 + channelList[i].name + html4 + channelList[i].id + html5 + html6;
                }else{
                    tagsBoxHtml += html1 + channelList[i].id + html2 + channelList[i].name + html3 + channelList[i].name  + html6;
                }
            }
        }
        /*模态框架构*/
        let contentHtml = "<div class='modals-channel-html'><div class='tags-box' id='tags-area'><div class='line'><nobr class='tag'>经销商</nobr><nobr class='tag'>渠道商</nobr><nobr class='tag'>区域</nobr><nobr class='tag'>员工</nobr><nobr class='tag'>门店</nobr><nobr class='tag'>活动</nobr></div><div class='line' id='channel-tags-box'></div></div><div class='add-channel-box'><div class='add-channel-title'>添加渠道分类</div><div class='add-channel-input-area'><div class='add-channel-input-box'><input id='add-channel-input' class='add-channel-input' maxlength='20' placeholder='&#39;enter&#47;回车&#39;添加渠道分类'/></div><div class='hint icon iconfont' title='1.长度在2&#126;20个字&#10;2.不能与已有渠道重复'>&#xe63a;</div></div><div class='add-channel-note' id='add-channel-note'>不能与已有渠道重复</div></div></div>";
        /*生成模态框*/
        new Modals.Window({
            id: "modalsChannelHtml",
            title: "设置渠道分类",
            content: contentHtml,
            width: 748,//默认是auto
            height: 392,//默认是auto
            buttons: [
                {
                    text: '保存',
                    cls: 'accept',
                    handler: function (self) {
                        let thisId,thisName;
                        let newChannel = [],chaNames=[];
                        $('#channel-tags-box nobr').each(function(i){
                            thisId= $(this).attr('id');thisName = $(this).attr('name');
                            newChannel[i] = {id: thisId, name: thisName};
                            chaNames[i] = thisName;
                        });
                        util.api({
                            url: "?method=mkt.weixin.channel.update",
                            type: 'post',
                            data: {chaNames:chaNames},
                            success: function (res) {
                                if(res.code == 0){
                                    that.fetchChannel();
                                    self.close('保存');
                                }
                            }
                        });
                    }
                }, {
                    text: '取消',
                    cls: 'decline',
                    handler: function (self) {
                        self.close('取消');
                    }
                }
            ],
            listeners: {//window监听事件事件
                open: function () {
                    //console.log("open");
                },
                close: function (type) {
                    //console.log("close");
                    if(type!='保存'){
                        let thisChannel = [];
                        $('#channellist-box li').each(function(i){
                            let thisId = $(this).attr('id'),thisName = $(this).attr('data-name'),thisType = $(this).attr('data-type');
                            thisChannel[i] = {id: thisId, name: thisName, type: thisType};
                        });
                        that.setState({channel:thisChannel});
                    }
                },
                beforeRender: function () {
                    //console.log("beforeRender");
                },
                afterRender: function () {
                    //console.log("afterRender");
                    //删除tag
                    $('#channel-tags-box').on('click','.close-btn',function(){
                        let thisId = $(this).attr('index');
                        let newChannelLength = newChannel.length;
                        let thisChannel = [],j=0;
                        for(let i=0; i<newChannelLength; i++){
                            if(newChannel[i].id != thisId){
                                thisChannel[j] = newChannel[i];
                                j++;
                            }
                        }
                        newChannel = thisChannel;
                        $('#channel-tags-box #'+thisId).remove();
                    });
                    //添加tag
                    $('#add-channel-input').on('keypress',function(event){
                        if(event.keyCode == 13){
                            let thisVal = $(this).val();
                            let newChannelLength = newChannel.length;
                            let has = false;
                            let newTagId = Date.parse(new Date());
                            for(let i=0; i<newChannelLength; i++){
                                if(newChannel[i].name == thisVal){
                                    has = false;
                                    break;
                                }else{
                                    has = true;
                                }
                            }
                            if(has){
                                newChannel[newChannelLength] = {id: newTagId, name:thisVal, type:1};
                                tagsBoxHtml = "";
                                for(let i=0; i<newChannel.length; i++){
                                    if(!newChannel[i].system){
                                        if(newChannel[i].type == 1){
                                            tagsBoxHtml += html1 + newChannel[i].id + html2 + newChannel[i].name + html3 + newChannel[i].name + html4 + newChannel[i].id + html5 + html6;
                                        }else{
                                            tagsBoxHtml += html1 + newChannel[i].id + html2 + newChannel[i].name +  html3 + newChannel[i].name + html6;
                                        }
                                    }
                                }
                                $('#channel-tags-box').empty().append(tagsBoxHtml);
                                $(this).val('');
                            }
                        }
                    });
                }
            }
        });
        /*将变动项塞入模态框*/
        $('#channel-tags-box').empty().append(tagsBoxHtml);
    }
    qrcodeName(){
        let that = this;
        let thisName = $.trim($('#qrcode-name').val()),
            wx_name = this.state.subscriptionName.name,
            channel_id = this.state.channelName.id,
            qrcodeName;
        let thisData,prove = false;
        if(thisName.length<1){
            thisData = '二维码名称不能为空！';
            qrcodeName = {class: 'show', msg: thisData, type: false};
            that.setState({qrcodeName:qrcodeName});
            that.prove('qrcode',false);
        }else{
            util.api({
                data: {method: 'mkt.weixin.qrcode.match.get',wx_name: wx_name,qrcode_name: thisName,channel_id:channel_id},
                beforeSend: function () {
                    prove = false;
                    that.prove('qrcode',prove);
                },
                success: function (res) {
                    if(res.code == 0){
                        thisData = res.data[0].is_match;
                        if(thisData == 1){
                            qrcodeName = {readonly: false,class: 'show', msg: '不能与已有名称重复！', type: false,value:thisName};
                            prove = false;
                        }else{
                            qrcodeName = {readonly: false,class: '', msg: '', type: true,value:thisName};
                            prove = true;
                        }
                        that.setState({qrcodeName:qrcodeName});
                        that.prove('qrcode',prove);
                    }
                },
                error:function () {
                    prove = false;
                    that.prove('qrcode',prove);
                }
            });
        }
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
    fixedCrowd(id){
        if(id == 'yes'){
            this.setState({
                fixedCrowdRadio:[true,false],
                fixedCrowdDisplay: 'block',
                fixedCrowdInput: {class: '', msg: '', type: false, value: ''}
            });
            this.prove('fixedCrowd',false);
        }
        if(id == 'no'){
            this.setState({
                fixedCrowdRadio:[false,true],
                fixedCrowdDisplay: 'none',
                fixedCrowdInput: {class: '', msg: '', type: false, value: ''}
            });
            this.prove('fixedCrowd',true);
        }
        $('#fixed-crowd-input').val('');
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
    deleteTag(id,name,categoryId){
        let tags = this.state.tags,tagNum = tags.length;
        for(let i=0; i<tagNum; i++){
            if((id == tags[i].id)&&(name == tags[i].name)&&(categoryId == tags[i].categoryId)){
                tags.splice(i,1);
                break;
            }
        }
        this.setState({tags:tags})
    }
    testFixedCrowd(){
        let that = this;
        let thisInput = $.trim($('#fixed-crowd-input').val()),thisInputPrompt,testType;
        if(thisInput.length > 0){
            util.api({
                data: {method: 'mkt.asset.wechat.audiencelist.match.get',audience_name:thisInput},
                success: function (res) {
                    if(res.code == 0){
                        if(res.data[0].is_match == 0){
                            testType = true;
                            thisInputPrompt = {disabled: false,class: '', msg: '', type: testType,value:thisInput};
                        }
                        if(res.data[0].is_match == 1){
                            testType = false;
                            thisInputPrompt = {disabled: false,class: 'show', msg: '固定人群名称不能重复！', type: testType,value:thisInput};
                        }
                        that.setState({fixedCrowdInput:thisInputPrompt});
                        that.prove('fixedCrowd',testType);
                    }
                }
            });
        }else{
            thisInputPrompt = {disabled: false,class: 'show', msg: '固定人群名称不能为空！', type: false,value:''};
            this.setState({fixedCrowdInput:thisInputPrompt});
            this.prove('fixedCrowd',false);
        }
    }
    resetTextareaText(){
        let thisTextarea = $.trim($('#note-textarea').val()),thisTextareaLength = thisTextarea.length;
        if(thisTextareaLength > 100){
            thisTextarea = thisTextarea.substring(0,100);
            thisTextareaLength = 100;
            $('#note-textarea').val(thisTextarea);
        }
        this.setState({
            textareaText:{value:thisTextarea,num:thisTextareaLength}
        });
    }
    prove(item,type){
        let that =this;
        let testSubscription = this.state.subscriptionName.type,
            testChannel = this.state.channelName.type,
            testQrcode = this.state.qrcodeName.type,
            testFixedCrowdInput = fixedCrowd();
        switch (item){
            case 'subscription':
                if(testChannel&&testQrcode&&testFixedCrowdInput&&type){
                    this.setState({preview:'keyong',previewButClass:''});
                }else{this.setState({preview:'bukeyong',previewButClass:' disable'});}
                break;
            case 'channel':
                if(testSubscription&&testQrcode&&testFixedCrowdInput&&type){
                    this.setState({preview:'keyong',previewButClass:''});
                }else{this.setState({preview:'bukeyong',previewButClass:' disable'});}
                break;
            case 'qrcode':
                if(testSubscription&&testChannel&&testFixedCrowdInput&&type){
                    this.setState({preview:'keyong',previewButClass:''});
                }else{this.setState({preview:'bukeyong',previewButClass:' disable'});}
                break;
            case 'fixedCrowd':
                if(testSubscription&&testChannel&&testQrcode&&type){
                    this.setState({preview:'keyong',previewButClass:''});
                }else{this.setState({preview:'bukeyong',previewButClass:' disable'});}
                break;
            default:
                if(testSubscription&&testChannel&&testQrcode&&testFixedCrowdInput){
                    this.setState({preview:'keyong',previewButClass:''});
                }else{this.setState({preview:'bukeyong',previewButClass:' disable'});}
                break;
        }
        function fixedCrowd(){
            let thisDisplay = that.state.fixedCrowdDisplay,thisType = that.state.fixedCrowdInput.type;
            if(thisDisplay == 'none'){
                return true;
            }else{
                return thisType;
            }
        }
    }
    modalsPreview(e){
        let thisDiv = $(e.currentTarget);
        let thisData,thisId;
        /*初始化变量*/
        let wxAttc = this.state.subscriptionName.acct;
        let modalsTitle = this.state.subscriptionName.name;
        let chId = this.state.channelName.id;
        let chTitle = this.state.channelName.name;
        let qrcodeName = this.state.qrcodeName.value;
        let fixedCrowd = this.state.fixedCrowdInput.value,fixedCrowdShow;
        let failuresTime = this.state.failuresTime,failuresTimeShow;
        let comment = this.state.textareaText.value,commentshow;
        let tags = this.state.tags,tagsprarm = [];
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
        if(!thisDiv.hasClass('disable')){
            util.api({
                url: "?method=mkt.weixin.qrcode.create",
                type: 'post',
                data: {
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
                        thisId = thisData.id;
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
                                            url: "?method=mkt.weixin.qrcode.enable",
                                            type: 'post',
                                            data:{id:thisId},
                                            success: function (res){
                                                location.href = BASE_PATH+'/html/asset/qrcode-download.html?id='+thisId;
                                                self.close('go');
                                            }
                                        });
                                    }
                                }
                            ],
                            listeners: {
                                close: function (type) {
                                    if(type!='go'){
                                        util.api({
                                            url: "?method=mkt.weixin.qrcode.records.del",
                                            type: 'post',
                                            data:{id:thisId},
                                            success: function (res){}
                                        });
                                    }
                                },
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
    cancelAll(){
        $('#qrcode-name').val('');
        $('#note-textarea').val('');
        $('#associationTags').val('');
        this.fetchTagsList();
        this.setState({
            preview: 'bukeyong',
            subscriptionName: {id: '', acct:'', name:'', type: false},
            channelName: {id: '', name:'', type: false},
            qrcodeName: {readonly: false,class: '', msg: '', type: false, value: ''},
            failuresTime: '',
            fixedCrowdRadio: [false,true],
            fixedCrowdDisplay: 'none',
            fixedCrowdInput: {class: '', msg: '', type: false},
            tagsRadio: [false,true],
            tags: [],
            newtag:{name:'',addClass:''},
            tagsAreaDisplay: 'none',
            textareaText: {text: '',num: 0},
            previewButClass:' disable'
        });
    }
    constructor(props){
        super(props);
        this.state = {
            preview: 'bukeyong',
            subscription: [],
            subscriptionName: {id: '', acct:'', name:'', type: false},
            channel: [],
            channelName: {id: '', name:'', type: false},
            qrcodeName: {readonly: true,class: '', msg: '', type: false,value:''},
            startTime: '',
            failuresTime: '',
            fixedCrowdRadio: [false,true],
            fixedCrowdDisplay: 'none',
            fixedCrowdInput: {class: '', msg: '', type: false, value: ''},
            tagsRadio: [false,true],
            tags: [],
            tagsList: [],
            associationTagInput:'',
            newtag:{name:'',addClass:''},
            tagsAreaDisplay: 'none',
            textareaText: {value: '',num: 0},
            previewButClass:' disable'
        };
    }
    componentDidMount(){
        this.fetchSubscription();
        this.fetchChannel();
        this.fetchTagsList();
        this.dropdownButton();
    }
    render() {
        return (
            <div className="qrcode-new">
                <SubHead param={this.state}/>
                <div className="content">
                    <div className="line-box">
                        <div className="line-title"><span className="red-font">&#8727;</span>选择公众号</div>
                        <div className="line">
                            <div className="subscription dropdown-button" data-activates="subscriptionlist" data-beloworigin="true">
                                <div className="input">{this.state.subscriptionName.name}</div>
                                <div className="arrow-down"></div>
                            </div>
                            <ul id="subscriptionlist" className="dropdown-content subscription-list">
                                <div className="li-box">
                                    {this.state.subscription.map((m,i)=> {
                                        return(
                                            <li style={{height:'30px !important',lineHeight:'30px'}} onClick={this.resetSubscription.bind(this,m.id,m.acct,m.name)}>{m.name}</li>
                                        )
                                    })}
                                </div>
                                <div className="bottom">没有您需要的公众号，请到&nbsp;<a className="a" title="微信接入" href={BASE_PATH+'/html/data-access/weixin.html'}>微信接入</a>&nbsp;设置</div>
                            </ul>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="line-title"><span className="red-font">&#8727;</span>渠道分类</div>
                        <div className="line">
                            <div className="channel dropdown-button" data-activates="channellist" data-beloworigin="true">
                                <div className="input">{this.state.channelName.name}</div>
                                <div className="arrow-down"></div>
                            </div>
                            <ul id="channellist" className="dropdown-content channel-list">
                                <div id="channellist-box" className="li-box" style={{height:'182px'}}>
                                    {this.state.channel.map((m,i)=> {
                                        return(
                                            <li id={m.id} data-name={m.name} data-type={m.type} style={{height:'30px !important',lineHeight:'30px'}} onClick={this.resetChannel.bind(this,m.id,m.name)}>{m.name}</li>
                                        )
                                    })}
                                </div>
                                <div className="bottom">没有您需要的渠道？&nbsp;&nbsp;<a className="a" title="设置渠道" href='javascript:void(0)' onClick={this.modalsChannel.bind(this)}>设置渠道</a></div>
                            </ul>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="line-title"><span className="red-font">&#8727;</span>二维码名称</div>
                        <div className="line">
                            <div className="qrcode-name">
                                <div className="input-box">
                                    <input id="qrcode-name" className="input" maxLength="20" type="text" readOnly={this.state.qrcodeName.readonly} onChange={this.qrcodeName.bind(this)}/>
                                </div>
                                <div className={'msg '+this.state.qrcodeName.class}>{this.state.qrcodeName.msg}</div>
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
                    <div className="line-box">
                        <div className="line-title">新建固定人群</div>
                        <div className="line">
                            <div className="fixed-crowd-radio">
                                <div className="radio-box" onClick={this.fixedCrowd.bind(this,'yes')}>
                                    <input className="type1" name="fixed-crowd" type="radio" id="fixed-crowd-yes" checked={this.state.fixedCrowdRadio[0]}/>
                                    <label htmlFor="fixed-crowd-yes">是</label>
                                </div>
                                <div className="radio-box" onClick={this.fixedCrowd.bind(this,'no')}>
                                    <input className="type1" name="fixed-crowd" type="radio" id="fixed-crowd-no" checked={this.state.fixedCrowdRadio[1]}/>
                                    <label htmlFor="fixed-crowd-no">否</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="line-box" style={{display:this.state.fixedCrowdDisplay}}>
                        <div className="line-title"><span className="red-font">&#8727;</span>固定人群名称</div>
                        <div className="line">
                            <div className="fixed-crowd">
                                <div className="input-box">
                                    <input className="input" type="text" id="fixed-crowd-input" maxLength="50" onBlur={this.testFixedCrowd.bind(this)}/>
                                </div>
                                <div className={'msg '+this.state.fixedCrowdInput.class}>{this.state.fixedCrowdInput.msg}</div>
                            </div>
                        </div>
                    </div>
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
                                    <input id="associationTags" className="input dropdown-button" type="text" maxLength="15" placeholder="按自定义标签名称搜索" data-activates="tagslist" data-beloworigin="true" onChange={this.associationTags.bind(this)}/>
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
                                            <nobr className="tag" title={m.categoryName}>{m.name}<div className="close icon iconfont" onClick={this.deleteTag.bind(this,m.id,m.name,m.categoryId)}>&#xe608;</div></nobr>
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
                    <div className="line-box">
                        <div className="btn-area">
                            <div className="btn-box">
                                <div className={"button-main-1 but-preview"+this.state.previewButClass} onClick={this.modalsPreview.bind(this)}>预览</div>
                                <div className="button-assist-1 but-cancel" onClick={this.cancelAll.bind(this)}>取消</div>
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
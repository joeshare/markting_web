/**
 * Created by AnThen on 2016/11/1.
 * 短信素材-营销-查看 es6+react版
 */
/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'模板管理'
});

/********插件********/
/*弹层插件*/
let Modals = require('component/modals.js');

/********集成模块********/
/****选择模板****/
import VariableConfigure from 'module/message-app/variable-configure';

/********编写页面模块********/
/****二级头部****/
class SubHead extends React.Component{
    gotoLast(){
        window.history.go(-1);
    }
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">模板管理-新增</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" title="返回" onClick={this.gotoLast.bind(this)}>
                        <span className="icon iconfont">&#xe621;</span>
                        <span className="text">返回</span>
                    </a>
                </div>
            </header>
        )
    }
}
/********组织页面模块********/
class Manage extends React.Component {
    nameChange(){
        let thisVal = $('#materialName').val().trim();
        let nameHint;
        thisVal.length>0 ? nameHint='' : nameHint=' show';
        this.setState({name:thisVal,nameHint:nameHint});
        this.showHideHint();
    }
    textareaChange(){
        let thisVal = $('#template-textarea').val().trim();
        let thisValLength = thisVal.length;
        let variableNom = [],variable = [],variableLength,variableList = [];
        let variableAdd = [], variableListAdd = [];
        let showHideHintTest = false,showHideHintParam = [];

        if(thisValLength > 0){
            if(thisValLength > 70){
                this.setState({
                    huitBoxShowClass:' show'
                });
            }else{
                this.setState({
                    huitBoxShowClass:''
                });
            }
            if(this.state.type[1]==true){
                variableNom = util.findVarStrtoArr(thisVal);
                if(variableNom.length > 0){
                    variable = this.state.variable;variableList = this.state.variableList;
                    variableLength = variable.length;
                    $.unique(variableNom);
                    if(variableLength > 0){
                        for(let i=0; i<variableNom.length; i++){
                            for(let j=0; j<variableLength; j++){
                                if(variableNom[i] == variable[j].nom){
                                    variableAdd[i] = variable[j];
                                    variableListAdd[i] = variableList[j];
                                    break;
                                }else{
                                    variableAdd[i] = {
                                        nom:variableNom[i],
                                        tabType:'',tabName:'',
                                        listId:'',listCode:'',listName:""
                                    };
                                    variableListAdd[i] = {nom:variableNom[i],name:'选择物料进行变量配置'};
                                }
                            }
                        }
                    }else{
                        for(let i=0; i<variableNom.length; i++){
                            variableAdd[i] = {
                                nom:variableNom[i],
                                tabId:'',tabType:'',tabName:'',
                                listId:'',listCode:'',listName:""
                            };
                            variableListAdd[i] = {nom:variableNom[i],name:'选择物料进行变量配置'};
                        }
                    }
                    showHideHintTest = true;
                    showHideHintParam = variableListAdd;
                    this.setState({
                        variable:variableAdd,
                        variableList:variableListAdd
                    });
                }else{
                    showHideHintTest = true;
                    showHideHintParam = [];
                    this.setState({
                        variable:[],
                        variableList:[]
                    });
                }
            }
            this.setState({
                mouldContHint:'',
                textarea:thisVal,
                textareaLength:thisValLength
            });
        }else{
            this.setState({
                mouldContHint:' show',
                textarea:thisVal,
                textareaLength:thisValLength,
                huitBoxShowClass:'',
                variable:[],
                variableList:[]
            });
        }
        if(showHideHintTest){
            this.showHideHint(showHideHintParam);
        }else{
            this.showHideHint();
        }
    }
    showHideHint(param){
        let name = $('#materialName').val().trim(),nameJudgment = false,
            textarea = $('#template-textarea').val().trim(),textareaJudgment = false;
        let variableList = [],variableNom,variableJudgment = false;
        /*模板名称判决*/
        name.length>0 ? nameJudgment=true : nameJudgment=false;
        if(this.state.type[1]==true){
            /*模板内容判决*/
            if(textarea.length > 0){
                variableNom = util.findVarStrtoArr(textarea);
                if(variableNom.length > 0){
                    if(param){
                        for(let i=0; i<param.length; i++){
                            if(param[i].name == '选择物料进行变量配置'){
                                variableJudgment = false;
                                break;
                            }else{variableJudgment = true;}
                        }
                    }else{
                        variableList = this.state.variableList;
                        if(variableList.length > 0){
                            for(let i=0; i<variableList.length; i++){
                                if(variableList[i].name == '选择物料进行变量配置'){
                                    variableJudgment = false;
                                    break;
                                }else{variableJudgment = true;}
                            }
                        }else{variableJudgment = false;}
                    }
                }else{
                    variableJudgment = false;
                }
            }else{
                variableJudgment = false;
            }
            /*保存按钮判决*/
            if(nameJudgment&&variableJudgment){
                this.setState({saveButtonClass:''});
            }else{
                this.setState({saveButtonClass:' disable'});
            }
        }else{
            /*模板内容判决*/
            textarea.length>0 ? textareaJudgment=true : textareaJudgment=false;
            /*保存按钮判决*/
            if(nameJudgment&&textareaJudgment){
                this.setState({saveButtonClass:''});
            }else{
                this.setState({saveButtonClass:' disable'});
            }
        }
    }
    variable(nom){
        let masterThis = this;
        new Modals.Window({
            id: "variableConfigureHtml",
            title: '变量配置',
            content: "<div class='con-body'/>",
            width: 420,
            height: 390,
            buttons: [
                {
                    text: '提交',
                    cls: 'accept disable',
                    handler: function (self) {
                        let optsButtons0Cls = $('#variableConfigureHtml').children('.modal-footer').children('.btn-content').children('#window-btn-0').hasClass('disable');
                        let choice;
                        let nom,id,name,code,materialId,materialType,materialName;
                        let variable = [],variableList = [];
                        if(!optsButtons0Cls){
                            choice = $('#variable-configure-choice-box').children('.choice');
                            nom = choice.attr('data-nom');
                            id = choice.attr('data-id');
                            name = choice.attr('data-name');
                            code = choice.attr('data-code');
                            materialId = choice.attr('data-material-id');
                            materialType = choice.attr('data-material-type');
                            materialName = choice.attr('data-material-name');

                            variable = masterThis.state.variable;
                            variableList = masterThis.state.variableList;

                            for(let i=0; i<variable.length; i++){
                                if(variable[i].nom == nom){
                                    variable[i] = {
                                        nom:nom,
                                        tabId:materialId,tabType:materialType,tabName:materialName,
                                        listId:id,listCode:code,listName:name
                                    };
                                    variableList[i] = {nom:nom,name:materialName+'—'+name};
                                }
                            }
                            masterThis.setState({variable:variable,variableList:variableList});
                            masterThis.showHideHint(variableList);
                            self.close();
                            $('#variableConfigureHtml').children('.modal-footer').children('.btn-content').children('#window-btn-0').addClass('disable');
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
                    let that = this;
                    this.customView = ReactDOM.render(
                        <VariableConfigure run={that} nom={nom} masterThis={masterThis}/>,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        });
    }
    saveButton(){
        let channel,name,thisType,type,textarea,thisMaterialList=[],materialList=[];
        let id;
        if(this.state.saveButtonClass == ""){
            channel = this.state.channel;
            name = this.state.name;
            thisType = this.state.type;
            textarea = this.state.textarea;

            if(thisType[0]){type = 0;materialList = [];}
            if(thisType[1]){
                type = 1;
                thisMaterialList = this.state.variable;
                for(let i=0; i<thisMaterialList.length; i++){
                    materialList[i] = {
                        sms_variable_value:thisMaterialList[i].nom,
                        material_id:thisMaterialList[i].tabId,
                        material_type:thisMaterialList[i].tabType,
                        material_name:thisMaterialList[i].tabName,
                        material_property_id:thisMaterialList[i].listId,
                        material_property_code:thisMaterialList[i].listCode,
                        material_property_name:thisMaterialList[i].listName
                    };
                }
            }
            util.api({
                url: "?method=mkt.sms.smstemplet.saveorupdate",
                type: 'post',
                data: {
                    channel_type:channel,
                    type:type,
                    name:name,
                    content:textarea,
                    material_list:materialList
                },
                success: function (res) {
                    if(res.code == 0){
                        id = (res.data[0]).id;
                        window.location.href = BASE_PATH+"/html/message-app/message-mould-check.html?id="+id;
                    }else{
                        new Modals.Alert(res.msg);
                    }
                }
            });
        }
    }
    typeChange(type){
        let radio = [false,false];
        let variableClass;
        switch (type){
            case 0:
                radio[0] = true;
                variableClass = '';
                break;
            case 1:
                radio[1] = true;
                variableClass = ' show';
                break;
        }
        $('#template-textarea').val('');
        this.setState({
            type:radio,
            mouldContHint:'',
            textarea: '',
            textareaLength: 0,
            huitBoxShowClass: '',
            variableClass:variableClass,
            variable:[],
            variableList:[],
            saveButtonClass:' disable'
        });
    }
    channelChange(type){
        switch (type){
            case 'marketing':
                window.location.href = BASE_PATH+"/html/message-app/message-mould-new-marketing.html";
                break;
            case 'serve':
                window.location.href = BASE_PATH+"/html/message-app/message-mould-new-serve.html";
                break;
        }
    }
    constructor(props){
        super(props);
        this.state = {
            channel:1,
            name:'', nameHint:'',
            type:[true,false],
            mouldContHint:'',
            textarea: '',
            textareaLength: 0,
            huitBoxShowClass: '',
            variableClass:'',
            variable:[],
            variableList:[],
            saveButtonClass:' disable'
        };
    }
    render() {
        return (
            <div className="mould-new-serve">
                <SubHead />
                <div className="content">
                    <div className="tabs-area">
                        <div className="tabs-box">
                            <ul id="first-layer" className="tabs">
                                <li className="tab"><a href="javascript:void(0)" onClick={this.channelChange.bind(this,'marketing')}>营销短信模版</a></li>
                                <li className="tab"><a className="active" href="javascript:void(0)" onClick={this.channelChange.bind(this,'serve')}>服务通知模版</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="content-body">
                        <div className="content-box">
                            <div className="point-out-area">
                                <div className="point-out-box">
                                    <div className="point-out-title"><div className="icon iconfont">&#xe63a;</div></div>
                                    <div className="point-out-content">
                                        1、发送短信需要事先对短信内容进行组装，形成短信内容<br/>2、短信内容是建立在您已经创建好了将要发送的短信模板已经合法的签名<br/>3、所创建的短信内容您可以直接在活动编排或者短信平台中直接使用<br/>4、您所编辑的短信内容受Marketing Cloud以及短信供应商的约束，请避免敏感性内容出现
                                    </div>
                                </div>
                            </div>
                            <div className="msg-body">
                                <div className="market">
                                    <div className="line material-name">
                                        <div className="line-title"><span className="redstar">&#42;</span>模板名称</div>
                                        <div className="line-con">
                                            <div className="input-area">
                                                <div className="input-box">
                                                    <input id="materialName" className="input" placeholder="请填写一个模板名称 方便管理识别" maxLength="20" onChange={this.nameChange.bind(this)}/>
                                                </div>
                                            </div>
                                            <div className={"hint"+this.state.nameHint}>模板名称不能为空</div>
                                        </div>
                                    </div>
                                    <div className="line material-type">
                                        <div className="line-title"><span className="redstar">&#42;</span>短信类型</div>
                                        <div className="line-con">
                                            <div className="radio-area">
                                                <div className="radio-box">
                                                    <input className="type1" name="materialType" type="radio" id="materialType1" checked={this.state.type[0]} onClick={this.typeChange.bind(this,0)}/>
                                                    <label htmlFor="materialType1">固定模板</label>
                                                </div>
                                                <div className="radio-box">
                                                    <input className="type1" name="materialType" type="radio" id="materialType2" checked={this.state.type[1]} onClick={this.typeChange.bind(this,1)}/>
                                                    <label htmlFor="materialType2">变量模板</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="line mould-cont">
                                        <div className="line-title"><span className="redstar">&#42;</span>模板内容</div>
                                        <div className="line-con">
                                            <div className="textarea-area">
                                                <div className="textarea-box">
                                                    <textarea id="template-textarea" className="textarea" maxLength="210" placeholder="请输入模板内容" onBlur={this.textareaChange.bind(this)}></textarea>
                                                </div>
                                                <div className="textarea-num">
                                                    短信字数：{this.state.textareaLength}
                                                </div>
                                                <div className="huit-icon iconfont dropdown-button" data-hover="false" data-activates="textarea-huit" data-constrainwidth="false">&#xe66f;</div>
                                                <ul id="textarea-huit" className="dropdown-content textarea-huit">
                                                    <li style={{'height':'220px !important'}} className="nohover">示例：<br/><br/>固定模板<br/>给喜欢漂泊你的一个惊喜！即日起预定酒店安心下单，随心退<br/>订，就是这么任性！再也不用担心出行计划被打乱，让假日的<br/>心情随心所欲！快快预定钟爱的酒店，戳 http://booking.com<br/> 回T退订<br/><br/>变量模板<br/>嗨 &#123;$1&#125;，很长时间没有体验沙滩、阳光了吧！Booking为您提<br/>供会员专属优惠，最高可省&#123;$2&#125;%！您的优惠专属券已到账【<br/>&#123;$3&#125;】，有效期至12月25日，戳 http://booking.com 回T退订</li>
                                                </ul>
                                            </div>
                                            <div className={"hint"+this.state.mouldContHint}>模板内容不能为空</div>
                                            <div className={"huit-box"+this.state.huitBoxShowClass}>
                                                <div className="icon iconfont">&#xe63a;</div>
                                                <div className="huit">
                                                    当前模板内容已超过70字，短信发送字数包含“【签名】+内容”。为避免产
                                                    生长短信费用，请再次确认短信长度。
                                                </div>
                                            </div>
                                            <div className="prompt-box">
                                                * 短信内容必须合法，不能发送房产、发票等国家法律法规严令禁止的内容。<br/>
                                                * 如有链接，请将链接地址写于短信内容中，便于核实。<br/>
                                                * 短信字数&#60;&#61;70个字，按照70个字一条短信计算,变量短信根据所变换的内容长度计算。<br/>
                                                * 短信字数>70个字，即为长短信，按照67个字记为一条短信计算。<br/>
                                                * 短信内容无需添加签名，内容首尾不能加【】。<br/>
                                                * 变量均用&#123;&#36;&#125;代替，短信发送时根据顺序依次替换为变量内容。<br/>
                                                * 短信内容中每个变量&#123;&#36;&#125;按6个字计算短信长度，发送时每条短信按实际变量内容长度计算字数。<br/>
                                                * 短信字数统计由签名+短信内容+退订回复（营销短信需要）组成，请预留字数避免发送长短信。<br/>
                                                * API发送样板需在短信内容中增加退订信息，如 退订回复TD
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"line variable"+this.state.variableClass}>
                                        <div className="variable-title">配置变量规则</div>
                                        <div className="list-box" id="variable-list">
                                            {this.state.variableList.map((m,i)=> {
                                                return (
                                                    <div className="list" onClick={this.variable.bind(this,m.nom)}>
                                                        <div className="logo">&#36;</div>
                                                        <div className="list-count">
                                                            &#36;{m.nom}&nbsp;{m.name}
                                                        </div>
                                                        <div className="greater-icon iconfont">&#xe669;</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="line trigger">
                                        <div className="line-con nan-title">
                                            <div className={"button-main-1 save"+this.state.saveButtonClass} onClick={this.saveButton.bind(this)}>保存</div>
                                            <a className="button-assist-1 reset" href={BASE_PATH+"/html/message-app/message-mould.html"}>取消</a>
                                        </div>
                                    </div>
                                </div>
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
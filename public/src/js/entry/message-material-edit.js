/**
 * Created by AnThen on 2016/11/1.
 * 短信素材-营销-编辑 es6+react版
 */
/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'短信素材'
});

/********插件********/
/*弹层插件*/
let Modals = require('component/modals.js');
/*分页插件*/
let pagination = require('plugins/pagination')($);

/********集成模块********/
/****选择模板****/
import SmsTemplate from 'module/message-app/select-template';
/****短信展示****/
import SmsShow from 'module/message-app/sms-show';
/****选择优惠券****/
import SmsCoupon from 'module/message-app/select-coupon';

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
                    <span className="title">短信素材-编辑</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" title="返回" onClick={this.gotoLast.bind(this)}>
                        <span className="icon iconfont">&#xe621;</span>
                        <span className="text">返回</span>
                    </a>
                    <a className="a keyong" title="新建素材" href={BASE_PATH+"message-material-new.html"}>
                        <span className="icon iconfont">&#xe63b;</span>
                        <span className="text">新建素材</span>
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
        if(thisVal.length > 0){
            this.setState({name:thisVal,nameHint:''});
        }else{
            this.setState({name:thisVal,nameHint:' show'});
        }
        this.showHideHint('test');
    }
    textareaChange(){
        let id = this.state.msgId;
        let thisVal = $('#template-textarea').val().trim();
        let thisValLength = thisVal.length;
        let material = {actType: 'keep',name: ''};
        let textareaReadOnly = this.state.textareaReadOnly;
        let materialJudgment;

        if(thisValLength > 0){
            materialJudgment = 'test';
            this.updateMsg(id,thisVal,material);
            this.setState({mouldContHint:''});
        }else{
            if(!textareaReadOnly){
                materialJudgment = 'true';
                this.setState({
                    type:'普通短信',
                    mouldContHint:' show',
                    textareaReadOnly:true,
                    textarea:thisVal,
                    textareaLength:thisValLength,
                    msgId:id,
                    msgShow:'',
                    huitBoxShowClass:'',
                    materialClass:'',
                    material:[]
                });
            }
        }
        this.showHideHint(materialJudgment);
    }
    updateMsg(id,msg,material,signatureText){
        let signature = signatureText || this.state.changeIdiograph.name;
        let thisMsg,msgLength;
        let complete = 0,last = 0;
        let phoneMsg = [];
        let msgNum = 0,msgSubstr = "",lastMsgSubstr = "";
        let thisMaterial = this.state.material,materialName = [],setMaterial = [];
        let thisMaterialType = this.state.type,materialType = '普通短信';
        let thisMaterialClass = this.state.materialClass,materialClass = '';
        let thisVariable = this.state.variable,variable = [];
        let materialJudgment;

        signature=='请选择签名' ? thisMsg=msg : thisMsg=signature+msg;

        msgLength = thisMsg.length;
        if(msgLength > 0){
            complete = Math.floor(msgLength/70);
            last = msgLength%70;

            for(let i=0; i<complete; i++){
                msgSubstr = thisMsg.substr(msgNum,msgNum+70);
                phoneMsg[i] = msgSubstr;
                msgNum = msgNum + 70;
            }

            lastMsgSubstr = thisMsg.substr(msgLength-last);
            phoneMsg[complete] = lastMsgSubstr;
        }

        if(phoneMsg.length > 0){
            /*短信*/
            $('#template-textarea').val(msg);
            this.setState({
                textareaReadOnly:false,
                textarea:msg,
                textareaLength:msgLength,
                msgId:id,
                msgShow:<SmsShow msg={phoneMsg}/>,
                mouldContHint:''
            });
            if(msg.length > 70){
                this.setState({huitBoxShowClass:' show'});
            }else{
                this.setState({huitBoxShowClass:''});
            }
            /*物料*/
            switch (material.actType){
                case 'update':
                    materialName = material.material;
                    $.unique(materialName);
                    for(let i=0; i<materialName.length; i++){
                        setMaterial[i] = {name:materialName[i],cont:[]};
                        materialClass = ' show';
                    }
                    variable = material.variable;
                    materialType = '变量短信';
                    materialJudgment = 'false';
                    break;
                case 'remove':
                    variable = [];
                    materialType = '普通短信';
                    materialJudgment = 'true';
                    setMaterial = [];
                    materialClass = '';
                    break;
                case 'keep':
                    variable = thisVariable;
                    materialType = thisMaterialType;
                    materialJudgment = 'test';
                    setMaterial = thisMaterial;
                    materialClass = thisMaterialClass;
                    break;
            }
            this.setState({
                variable:variable,
                type: materialType,
                materialClass: materialClass,material: setMaterial
            });
        }else{
            materialJudgment = 'true';
            this.setState({
                type: '普通短信',
                textareaReadOnly:true,
                textareaLength:0,
                huitBoxShowClass:'',
                materialClass:'',
                material:[]
            });
        }
        this.showHideHint(materialJudgment);
    }
    smsTemplate(){
        let masterThis = this;
        new Modals.Window({
            id: "modalsSmsTemplateHtml",
            title: '选择模板',
            content: "<div class='con-body'/>",
            width: 800,//默认是auto
            height: 592,//默认是auto
            buttons: [],
            listeners: {
                beforeRender: function () {
                    let that = this;
                    this.customView = ReactDOM.render(
                        <SmsTemplate run={that} updateMsg={masterThis.updateMsg}/>,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        });
    }
    fetchSignature(){
        let that = this;
        let signature = [];
        let thisData;
        util.api({
            data: {method: 'mkt.sms.signature.get'},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<res.total; i++){
                        signature[i] = {id:thisData[i].id, name:thisData[i].signature_name}
                    }
                    that.setState({idiograph:signature});
                }
            }
        });
    }
    idiograph(id,name){
        let msgId = this.state.msgId;
        let msgShow = $('#template-textarea').val().trim();
        let material = {actType: 'keep',name: ''};
        $('#idiographText').text(name);
        this.setState({
            changeIdiograph:{id:id,name:name},
            idiographHint:''
        });
        if(msgShow.length > 0){
            this.updateMsg(msgId,msgShow,material,name);
        }
        this.showHideHint('test');
    }
    updateMaterial(param){
        let that = this.masterThis;
        let material = that.state.material;
        let cont = [],price,coverage,estimate;
        let thisCont = [],materialJudgment = 'false';
        for(let i=0; i<material.length; i++){
            if(material[i].name == param.target){
                estimate = util.accMul(param.price,param.stock);
                price = util.numberFormat(param.price);
                coverage = util.numberFormat(param.stock);
                estimate = util.numberFormat(estimate);
                cont = [
                    {
                        id: param.id,
                        title: param.name,
                        price:price,
                        coverage:coverage,
                        estimate:estimate
                    }
                ];
                material[i].cont = cont;
            }
        }
        that.setState({material:material});
        /*验证*/
        for(let i=0; i<material.length; i++){
            thisCont = material[i].cont;
            if(thisCont.length > 0){
                materialJudgment = 'true';
            }else{
                materialJudgment = 'false';
                break;
            }
        }
        that.showHideHint(materialJudgment);
    }
    deleteMaterial(name){
        let material = this.state.material;
        for(let i=0; i<material.length; i++){
            if(material[i].name == name){
                material[i].cont = [];
            }
        }
        this.setState({material:material});
        this.showHideHint('false');
    }
    addMaterial(materialName){
        let masterThis = this;
        let filter_overdue=true;
        new Modals.Window({
            id: "modalsSmsTemplateHtml",
            title: '选择'+materialName,
            content: "<div class='con-body'/>",
            width: 800,
            height: 592,
            buttons: [],
            listeners: {
                beforeRender: function () {
                    let that = this;
                    this.customView = ReactDOM.render(
                        <SmsCoupon run={that}
                            name={materialName}
                            masterThis={masterThis}
                            updateMaterial={masterThis.updateMaterial}
                            filter_overdue={filter_overdue}
                        />,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        });
    }
    showHideHint(material){
        let name = $('#materialName').val().trim(),nameJudgment = false,
            idiograph = $('#idiographText').text(),idiographJudgment = false,
            textarea = $('#template-textarea').val().trim(),textareaJudgment = false;
        let thisMaterial,materialClass,thisCont = [],materialJudgment = false;
        /*素材名称判决*/
        name.length>0 ? nameJudgment=true : nameJudgment=false;
        /*签名判决*/
        idiograph=="请选择签名" ? idiographJudgment=false : idiographJudgment=true;
        /*模板内容判决*/
        textarea.length>0 ? textareaJudgment=true : textareaJudgment=false;
        /*物料判决*/
        switch (material){
            case 'true':
                materialJudgment = true;
                break;
            case 'false':
                materialJudgment = false;
                break;
            case 'test':
                thisMaterial = this.state.material;
                materialClass = this.state.materialClass;
                if(materialClass == ""){
                    materialJudgment = true;
                }else{
                    for(let i=0; i<thisMaterial.length; i++){
                        thisCont = thisMaterial[i].cont;
                        if(thisCont.length > 0){
                            materialJudgment = true;
                        }else{
                            materialJudgment = false;
                            break;
                        }
                    }
                }
                break;
        }
        /*保存按钮判决*/
        if(nameJudgment&&idiographJudgment&&textareaJudgment&&materialJudgment){
            this.setState({saveButtonClass:''});
        }else{
            this.setState({saveButtonClass:' disable'});
        }
    }
    saveButton(){
        let name,smsType,idiographId,idiographName,templetId,textarea;
        let upVariable = [],variableName,upMaterial = [],stateMaterial = [],stateMaterialCont = [],materielType,materielId;
        let id;
        if(this.state.saveButtonClass == ""){
            name = this.state.name;
            idiographId = this.state.changeIdiograph.id;
            idiographName = this.state.changeIdiograph.name;
            templetId = this.state.msgId;
            textarea = this.state.textarea;
            upVariable = this.state.variable;
            stateMaterial = this.state.material;
            for(let i=0; i<upVariable.length; i++){
                variableName = '$' + upVariable[i].variable_name;
                upVariable[i].variable_name = variableName;
            }
            for(let i=0; i<stateMaterial.length; i++){
                switch (stateMaterial[i].name){
                    case '优惠券':
                        materielType = 0;
                        break;
                }
                stateMaterialCont = stateMaterial[i].cont[0];
                materielId = stateMaterialCont.id;
                upMaterial[i] = {materiel_id:materielId,materiel_type:materielType};
            }
            if(this.state.type == '普通短信'){smsType = 0}
            if(this.state.type == '变量短信'){smsType = 1}

            util.api({
                url: "?method=mkt.sms.smsmaterial.saveorupdate",
                type: 'post',
                data: {
                    id:this.state.id,
                    smsType:smsType,
                    name:name,
                    smsSignId:idiographId,
                    smsSignName:idiographName,
                    smsTempletId:templetId,
                    smsTempletContent:textarea,
                    materiel_list:upMaterial,
                    variable_list:upVariable
                },
                success: function (res) {
                    if(res.code == 0){
                        id = res.data[0].id;
                        window.location.href = BASE_PATH+"/html/message-app/message-material-check.html?id="+id;
                    }else{
                        new Modals.Alert(res.msg);
                    }
                }
            });

        }
    }
    fetch(){
        let that = this;
        let type = '普通短信',thisMsg = '',textarea = '',huitBoxShowClass = '',textareaLength = 0,textareaReadOnly = true;
        let variable = [],getVariableName,getVariableType,getVariable = [];
        let materiaContPrice,materiaContCoverage,materiaContEstimate,materiaCont = [];
        let materialClass = '',materialName,material = [],getMaterial = [];
        let thisData="";
        let complete = 0,last = 0;
        let sms = [];
        let msgNum = 0,msgSubstr = "",lastMsgSubstr = "";
        let id = util.geturlparam('id');

        util.api({
            data: {
                method:'mkt.sms.smsmaterial.get',
                id:id
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    switch (thisData.sms_type){
                        case 0:
                            type = '普通短信';
                            materialClass = '';
                            break;
                        case 1:
                            type = '变量短信';
                            materialClass = ' show';
                            break;
                    }
                    textarea = thisData.sms_template_content;
                    thisMsg = thisData.sms_sign_content + textarea;
                    textareaLength = thisMsg.length;
                    if(textareaLength > 0){
                        complete = Math.floor(textareaLength/70);
                        last = textareaLength%70;

                        for(let i=0; i<complete; i++){
                            msgSubstr = thisMsg.substr(msgNum,msgNum+70);
                            sms[i] = msgSubstr;
                            msgNum = msgNum + 70;
                        }

                        lastMsgSubstr = thisMsg.substr(textareaLength-last);
                        sms[complete] = lastMsgSubstr;
                        textareaReadOnly = false;
                    }
                    if(textareaLength > 70){
                        huitBoxShowClass = ' show';
                    }else{
                        huitBoxShowClass = '';
                    }
                    if(thisData.variable_list){
                        getVariable = thisData.variable_list;
                        for(let i=0; i<getVariable.length; i++){
                            getVariableName = getVariable[i].variable_name.split('$');
                            switch (getVariable[i].variable_type){
                                case '优惠券':
                                    getVariableType = 0;
                                    break;
                            }
                            variable[i] = {
                                variable_name:getVariableName[1],
                                variable_value:getVariable[i].variable_value,
                                variable_type:getVariableType
                            };
                        }
                    }else{getVariable = []}
                    if(thisData.materiel_list){
                        getMaterial = thisData.materiel_list;
                        for(let i=0; i<getMaterial.length; i++){
                            switch (getMaterial[i].materiel_type){
                                case 0:
                                    materialName = '优惠券';
                                    break;
                            }
                            materiaContPrice = getMaterial[i].materiel_amount;
                            materiaContCoverage = getMaterial[i].materiel_stock_total;
                            materiaContEstimate = util.accMul(materiaContPrice,materiaContCoverage);
                            materiaContPrice = util.numberFormat(materiaContPrice);
                            materiaContCoverage = util.numberFormat(materiaContCoverage);
                            materiaContEstimate = util.numberFormat(materiaContEstimate);
                            materiaCont[0] = {
                                id:getMaterial[i].materiel_id,
                                price:materiaContPrice,
                                title:getMaterial[i].materiel_name,
                                coverage:materiaContCoverage,
                                estimate:materiaContEstimate
                            };
                            material[i] = {name:materialName,cont:materiaCont}
                        }
                    }else{material = []}
                    $('#materialName').val(thisData.material_name);
                    $('#template-textarea').val(textarea);
                    that.setState({
                        id:id,
                        material_id:thisData.material_id,
                        name:thisData.material_name,
                        type:type,
                        changeIdiograph:{id:thisData.sms_sign_id,name:thisData.sms_sign_content},
                        textareaReadOnly:textareaReadOnly,
                        textarea:textarea,
                        textareaLength:textareaLength,
                        huitBoxShowClass: huitBoxShowClass,
                        msgId:thisData.sms_template_id,
                        msgShow:<SmsShow msg={sms}/>,
                        variable:variable,
                        materialClass:materialClass,
                        material:material
                    });
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            id:'',
            material_id:'',
            name:'',
            nameHint:'',
            type:'普通短信',
            idiograph: [],
            changeIdiograph: {id: '', name: '请选择签名'},
            idiographHint:'',
            mouldContHint:'',
            textareaReadOnly: true,
            textarea: '',
            textareaLength: 0,
            msgId: '',
            msgShow: '',
            huitBoxShowClass: '',
            variable: [],
            materialClass: '',
            material: [],
            saveButtonClass:''
        };
        this.updateMsg = this.updateMsg.bind(this);
    }
    componentDidMount(){
        this.fetch();
        this.fetchSignature();
    }
    render() {
        return (
            <div className="material-edit">
                <SubHead />
                <div className="content">
                    <div className="point-out-area">
                        <div className="point-out-box">
                            <div className="point-out-title"><div className="icon iconfont">&#xe63a;</div></div>
                            <div className="point-out-content">
                                1、发送短信需要事先对短信内容进行组装，形成短信内容<br/>2、短信内容是建立在您已经创建好了将要发送的短信模板已经合法的签名<br/>3、所创建的短信内容您可以直接在活动编排或者短信平台中直接使用<br/>4、您所编辑的短信内容受Marketing Cloud以及短信供应商的约束，请避免敏感性内容出现
                            </div>
                        </div>
                    </div>
                    <div className="msg-body">
                        <div className="iphone-area">
                            {this.state.msgShow}
                        </div>
                        <div className="market">
                            <div className="line material-name">
                                <div className="line-title"><span className="redstar">&#42;</span>素材名称</div>
                                <div className="line-con">
                                    <div className="input-area">
                                        <div className="input-box">
                                            <input id="materialName" className="input" placeholder="请填写一个素材名称 方便管理识别" maxLength="20" onBlur={this.nameChange.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className={"hint"+this.state.nameHint}>素材名称不能为空</div>
                                </div>
                            </div>
                            <div className="line material-type">
                                <div className="line-title"><span className="redstar">&#42;</span>短信类型</div>
                                <div className="line-con">
                                    <div className="radio-area">{this.state.type}</div>
                                </div>
                            </div>
                            <div className="line idiograph">
                                <div className="line-title"><span className="redstar">&#42;</span>选择签名</div>
                                <div className="line-con">
                                    <div className="selectbtn dropdown-button"  data-beloworigin="true" data-activates="idiograph" data-constrainwidth="true" id="idiographText">{this.state.changeIdiograph.name}</div>
                                    <ul id="idiograph" className="dropdown-content" style={{'width':'auto'}}>
                                        {this.state.idiograph.map((m,i)=> {
                                            return (
                                                <li onClick={this.idiograph.bind(this,m.id,m.name)}>{m.name}</li>
                                            )
                                        })}
                                    </ul>
                                    <div className={"hint"+this.state.idiographHint}>请选择签名</div>
                                </div>
                            </div>
                            <div className="line mould">
                                <div className="line-title"><span className="redstar">&#42;</span>选择模板</div>
                                <div className="line-con">
                                    <div className="but-box">
                                        <div className="button-main-1" onClick={this.smsTemplate.bind(this)}>选择模板</div>
                                    </div>
                                </div>
                            </div>
                            <div className="line mould-cont">
                                <div className="line-title"><span className="redstar">&#42;</span>模板内容</div>
                                <div className="line-con">
                                    <div className="textarea-area">
                                        <div className="textarea-box">
                                            <textarea id="template-textarea" className="textarea" maxLength="210" readOnly={this.state.textareaReadOnly} onBlur={this.textareaChange.bind(this)}></textarea>
                                        </div>
                                        <div className="textarea-num">
                                            短信字数：{this.state.textareaLength}
                                        </div>
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
                                        * 短信以【签名】开头，签名内容为：公司或品牌名称，字数要求3-12个字符，运营商规定必填。<br/>
                                        * 内容合法，不能发送房产、发票等国家法律法规严格禁止的内容。<br/>
                                        * 如有链接，请将链接地址写于短信内容中，便于核实。<br/>
                                        * 短信字数&#60;&#61;70个字，按照70个字一条短信计算。<br/>
                                        * 短信字数>70个字，即为长短信，按照67个字记为一条短信计算。<br/>
                                        * 短信内容无须添加签名,内容首尾不能添加【】<br/>
                                    </div>
                                </div>
                            </div>
                            <div className={"line material-header"+this.state.materialClass}>
                                <div className="header">配置物料</div>
                            </div>
                            {this.state.material.map((m,i)=> {
                                return (
                                    <div className="line material">
                                        <div className="line-title"><span className="redstar">&#42;</span>{m.name}接入</div>
                                        <div className="line-con material-cont">
                                            <div className="add-material">
                                                {m.cont.map((n,i)=> {
                                                    return (
                                                        <div className="material-box">
                                                            <div className="close iconfont" onClick={this.deleteMaterial.bind(this,m.name)}>&#xe60a;</div>
                                                            <div className="icon-box">
                                                                <div className="icon iconfont">&#xe64d;</div>
                                                            </div>
                                                            <div className="text-cont">
                                                                <div className="title-box">
                                                                    <div className="title">{n.title}</div>
                                                                    <div className="price">金额：{n.price}</div>
                                                                </div>
                                                                <div className="cont-box">
                                                                    目标覆盖量&nbsp;{n.coverage}；预估价值&nbsp;&yen;{n.estimate}&nbsp;元
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className="add-button" onClick={this.addMaterial.bind(this,m.name)}>&#43;添加物料</div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="line trigger">
                                <div className="line-con nan-title">
                                    <div className={"button-main-1 save"+this.state.saveButtonClass} onClick={this.saveButton.bind(this)}>保存</div>
                                    <a className="button-assist-1 reset" href={BASE_PATH+"message-material.html"}>取消</a>
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
/**
 * Created by AnThen on 2016/11/1.
 * 短信素材-营销-查看 es6+react版
 */
/*构造页面*/
import Layout from 'module/layout/layout';

/********插件********/
/*弹层插件*/
let Modals = require('component/modals.js');

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'短信素材'
});

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
                    <span className="title">短信素材-查看</span>
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
    editGo(){
        let status = this.state.editStatus;
        let id = this.state.id;
        if(status == ''){
            window.location.href = BASE_PATH+"message-material-edit.html?id="+id;
        }
    }
    delete(){
        let status = this.state.deleteStatus;
        let that = this,id;
        if(status == ''){
            new Modals.Confirm({
                content:"您确定要删除这个素材吗？",
                listeners:{
                    close:function(type){
                        if(type == true){
                            id = that.state.id;
                            util.api({
                                url: "?method=mkt.sms.smsmaterial.delete",
                                type: 'post',
                                data: {id:id},
                                success: function (res) {
                                    if(res.code == 0){
                                        window.location.href = BASE_PATH+"/html/message-app/message-material.html";
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
    fetch(){
        let that = this;
        let type = '普通短信',thisMsg = '',textarea = '',huitBoxShowClass = '',textareaLength = 0;
        let variable = [],getVariableName,getVariableType,getVariable = [];
        let materiaContPrice,materiaContCoverage,materiaContEstimate,materiaCont = [];
        let materialClass = '',materialName,material = [],getMaterial = [];
        let edit_check,delete_check;
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
                    }
                    if(textareaLength > 70){
                        huitBoxShowClass = ' show';
                    }else{
                        huitBoxShowClass = '';
                    }
                    switch (thisData.edit_status){
                        case 0:
                            edit_check = "";
                            break;
                        case 1:
                            edit_check = " disable";
                            break;
                    }
                    switch (thisData.delete_status){
                        case 0:
                            delete_check = "";
                            break;
                        case 1:
                            delete_check = " disable";
                            break;
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
                    }else{getMaterial = []}
                    that.setState({
                        id:id,
                        material_id:thisData.material_id,
                        name:thisData.material_name,
                        type:type,
                        idiograph:{id:thisData.sms_sign_id,name:thisData.sms_sign_content},
                        template_id:thisData.sms_template_id,
                        textarea:textarea,
                        textareaLength:textareaLength,
                        huitBoxShowClass: huitBoxShowClass,
                        sms:sms,
                        variable:variable,
                        materialClass:materialClass,
                        material:material,
                        editStatus:edit_check,
                        deleteStatus:delete_check
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
            type:'普通短信',
            idiograph:{id:'',name:''},
            template_id:'',
            textarea: '',
            textareaLength: 0,
            huitBoxShowClass: '',
            sms:[],
            editStatus:' disable',
            deleteStatus:' disable',
            variable: [],
            materialClass: '',
            material: []
        };
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="material-check">
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
                            <div className="iphone-box">
                                {this.state.sms.map((m,i)=> {
                                    return (
                                        <div className="msg-box">
                                            <div className="msg-up"></div>
                                            <div className="msg-con">{m}</div>
                                            <div className="msg-down"></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="market">
                            <div className="line material-name">
                                <div className="line-title"><span className="redstar">&#42;</span>素材名称</div>
                                <div className="line-con">
                                    <div className="input-area">
                                        <div className="input-box">
                                            <input type="text" className="input" readOnly value={this.state.name}/>
                                        </div>
                                    </div>
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
                                    <div className="selectbtn dropdown-button">{this.state.idiograph.name}</div>
                                </div>
                            </div>
                            <div className="line mould-cont">
                                <div className="line-title"><span className="redstar">&#42;</span>模板内容</div>
                                <div className="line-con">
                                    <div className="textarea-area">
                                        <div className="textarea-box">
                                            <textarea className="textarea" readOnly value={this.state.textarea}></textarea>
                                        </div>
                                        <div className="textarea-num">
                                            短信字数：{this.state.textareaLength}
                                        </div>
                                    </div>
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
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="line trigger">
                                <div className="line-con nan-title">
                                    <div className={"button-main-3 edit"+this.state.editStatus} onClick={this.editGo.bind(this)}>编辑</div>
                                    <div className={"button-assist-3 delete"+this.state.deleteStatus} onClick={this.delete.bind(this)}>删除</div>
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
/**
 * Created by AnThen on 2016/10/19.
 * 微信二维码-列表 es6+react版
 */
/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'营销短信'
});

/********插件********/
/*弹层插件*/
let Modals = require('component/modals.js');
/*分页插件*/
let pagination = require('plugins/pagination')($);

/********集成模块********/
/****选择模板****/
import SmsMateria from 'module/message-app/select-material';
/****短信展示****/
import SmsShow from 'module/message-app/sms-show';
/****添加受众****/
import AddCrowd from 'module/message-app/add-crowd';

/********编写页面模块********/
/****二级头部****/
class SubHead extends React.Component{
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">营销短信</span>
                </div>
            </header>
        )
    }
}

/********组织页面模块********/
class Manage extends React.Component {
    taskName(){
        let thisVal = $('#task').val().trim();
        this.setState({taskName:thisVal});
        this.showHideHint();
    }
    updateMsg(msg,id,signId,signContent,materialName,smsType,stockTotal){
        let materialId = id || this.state.materialId,
            sign_id = signId || this.state.signature,
            signatureText = signContent || this.state.signatureText,
            material_name = materialName || this.state.materialName;
        let thisMsg = '',msgLength,thisSmsType;
        let complete = 0,last = 0;
        let phoneMsg = [];
        let msgNum = 0,msgSubstr = "",lastMsgSubstr = "";
        let thisStockTotal = {};
        let showHideHintParam;

        if(stockTotal >= 0){
            thisStockTotal = {className:'stock-total-show',num:stockTotal};
        }else{
            thisStockTotal = {className:'stock-total-hide',num:0};
        }
        this.setState({
            materialId:materialId,
            materialName:material_name,
            signature:sign_id,
            signatureText:signatureText,
            stockTotal:thisStockTotal
        });

        if(msg.toString().length > 0){
            thisMsg = signatureText+msg;
        }else{
            thisMsg = '';
        }
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
            switch (smsType){
                case 0:
                    thisSmsType = "普通短信";
                    break;
                case 1:
                    thisSmsType = "变量短信";
                    break;
            }
            $('#template-textarea').val(msg);
            this.setState({
                sms_type:smsType,
                smsType:thisSmsType,
                textarea:msg,
                textareaLength:msgLength,
                msgShow:<SmsShow msg={phoneMsg}/>
            });
            if(msg.length > 70){
                this.setState({
                    huitBoxShowClass:' show'
                });
            }else{
                this.setState({
                    huitBoxShowClass:''
                });
            }
        }else{
            this.setState({
                sms_type:0,
                smsType:'普通短信',
                textareaLength:0,
                huitBoxShowClass:''
            });
        }
        showHideHintParam = {id:signId,total:thisStockTotal};
        this.showHideHint('updateMsg',showHideHintParam);
    }
    SmsMateria(){
        let masterThis = this;
        new Modals.Window({
            id: "modalsSmsMateriaHtml",
            title: '选择素材',
            content: "<div class='con-body'/>",
            width: 800,//默认是auto
            height: 592,//默认是auto
            buttons: [],
            listeners: {
                beforeRender: function () {
                    let that = this;
                    this.customView = ReactDOM.render(
                        <SmsMateria run={that} channelType={masterThis.state.channelType} updateMsg={masterThis.updateMsg}/>,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        });
    }
    closeCrowd(id){
        let oldCrowd = this.state.crowd;
        let oldCount = this.state.crowdTotalCount,thisCount;
        let oldCrowdLength = oldCrowd.length;
        let closeI = -1;
        let showHideHintParam;
        for(let i=0; i<oldCrowdLength; i++){
            if(oldCrowd[i].id == id){closeI = i; thisCount = oldCrowd[i].count; break;}
        }
        oldCrowd.splice(closeI, 1);
        oldCount = parseInt(oldCount)-parseInt(thisCount);
        this.setState({crowd:oldCrowd,crowdTotalCount:oldCount});
        showHideHintParam = {total:oldCount};
        this.showHideHint('closeCrowd',showHideHintParam);
    }
    changeCrowd(id,name,type,count,original){
        let oldCrowd = this.state.crowd,crowdTotalCount = 0;
        let oldCrowdLength = oldCrowd.length,repeat = true;
        for(let i=0; i<oldCrowdLength; i++){
            if(oldCrowd[i].id == id){
                repeat = false;
                break;
            }
        }
        if(repeat){
            oldCrowd[oldCrowdLength] = {
                id:id,name:name,type:type,original:original,count:count
            };
            for(let i=0; i<oldCrowd.length; i++){
                crowdTotalCount = parseInt(crowdTotalCount) + parseInt(oldCrowd[i].count);
            }
            this.setState({crowd:oldCrowd,crowdTotalCount:crowdTotalCount});
        }
        this.showHideHint();
    }
    addCrowd(){
        let that = this;
        new Modals.Window({
            id: "modalsCrowdHtml",
            title: '添加受众',
            content: "<div class='con-body'/>",
            width: 520,//默认是auto
            height: 390,//默认是auto
            buttons: [
                {
                    text: '提交',
                    cls: 'accept',
                    handler: function (self) {
                        let original = $('#modals-crowd-original').val().trim() || false;
                        let audienctId = $('#modals-crowd-changeAudienct').attr('dataid') || false,
                            audienctName = $('#modals-crowd-changeAudienct').attr('name') || false,
                            audienctType = $('#modals-crowd-changeAudienct').attr('type') || false,
                            audienctCount = $('#modals-crowd-changeAudienct').attr('count') || false;
                        if(original&&audienctId&&audienctName&&audienctType&&audienctCount){
                            that.changeCrowd(audienctId,audienctName,audienctType,audienctCount,original);
                            self.close();
                        }
                    }
                }
            ],
            listeners: {
                beforeRender: function () {
                    this.customView = ReactDOM.render(
                        <AddCrowd />,
                        $('.con-body', this.$el)[0]
                    );
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
    showHideHint(type,param){
        let name = $('#task').val().trim() || false,
            signature, signType = false,
            templateContent = $('#template-textarea').val().trim() || false,
            crowd = this.state.crowd,crowdType = false,
            crowdTotal,stockTotal,confine = false;
        if(type){
            switch (type){
                case 'updateMsg':
                    signature = param.id;
                    stockTotal = param.total;
                    crowdTotal = this.state.crowdTotalCount;
                    break;
                case 'closeCrowd':
                    crowdTotal = param.total;
                    signature = this.state.signature;
                    stockTotal = this.state.stockTotal;
                    break;
            }
        }else{
            signature = this.state.signature;
            stockTotal = this.state.stockTotal;
            crowdTotal = this.state.crowdTotalCount;
        }
        crowd.length>0 ? crowdType=true : crowdType=false;
        signature.toString().length>0 ? signType=true : signType=false;
        switch (stockTotal.className){
            case 'stock-total-show':
                crowdTotal>stockTotal.num ? confine=false : confine=true;
                break;
            case 'stock-total-hide':
                confine=true;
                break;
        }
        if(name&&signType&&templateContent&&crowdType&&confine){
            this.setState({saveButtonClass:''});
        }else{
            this.setState({saveButtonClass:' disable'});
        }
    }
    saveButton() {
        /*变量初始化*/
        let crowd = [];
        let taskSendType = 1;
        let taskAppType = 0;
        let audience = [];
        if(this.state.saveButtonClass == ''){
            crowd = this.state.crowd;
            for(let i=0; i<crowd.length; i++) {
                audience[i] = {
                    target_audience_id:crowd[i].id,
                    target_audience_type:crowd[i].type,
                    target_audience_name:crowd[i].name,
                    target_audience_original_name:crowd[i].original
                };
            }
            util.api({
                url: "?method=mkt.sms.message.createorupdate",
                type: 'post',
                data: {
                    task_name: this.state.taskName,
                    task_signature_id: this.state.signature,
                    task_material_id: this.state.materialId,
                    task_material_content: this.state.textarea,
                    target_audience_list: audience,
                    task_send_type: taskSendType,
                    task_app_type: taskAppType
                },
                success: function (res) {
                    if(res.code == 0){
                        window.location.href = BASE_PATH+"/html/message-app/message-taskcenter.html";
                    }else{
                        new Modals.Alert(res.msg);
                    }
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            channelType:0,
            sms_type:0,
            smsType:'普通短信',
            taskName: '',
            signature: '',
            signatureText: '',
            materialId: '',
            materialName: '',
            textarea: '',
            textareaLength: 0,
            msgShow: '',
            huitBoxShowClass: '',
            crowd: [],
            crowdTotalCount:0,
            stockTotal:{className:'stock-total-hide',num:0},
            saveButtonClass:' disable'
        };
        this.updateMsg = this.updateMsg.bind(this);
    }
    componentDidMount(){}
    render(){
        return(
            <div className="marketingmessage">
                <SubHead />
                <div className="content">
                    <div className="content-body">
                        <div className="msg-body">
                            <div className="iphone-area">
                                {this.state.msgShow}
                            </div>
                            <div className="market">
                                <div className="line line-h1-top">
                                    <div className="line-title">第一步&nbsp;定义短信任务</div>
                                </div>
                                <div className="line task">
                                    <div className="line-title"><span className="redstar">&#42;</span>任务名称</div>
                                    <div className="line-con">
                                        <div className="input-box">
                                            <input id="task" className="input" placeholder="请填写一个任务名称 方便管理识别" maxLength="20" onChange={this.taskName.bind(this)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="line trigger">
                                    <div className="line-title"><span className="redstar">&#42;</span>触发类型</div>
                                    <div className="line-con">即时任务</div>
                                </div>
                                <div className="line line-h1">
                                    <div className="line-title">第二步&nbsp;短信内容配置</div>
                                </div>
                                <div className="line mould">
                                    <div className="line-title"><span className="redstar">&#42;</span>选择素材</div>
                                    <div className="line-con">
                                        <div className="button-main-3" onClick={this.SmsMateria.bind(this)}>选择素材</div>
                                    </div>
                                </div>
                                <div className="line trigger">
                                    <div className="line-title"><span className="redstar">&#42;</span>短信类型</div>
                                    <div className="line-con">{this.state.smsType}</div>
                                </div>
                                <div className="line mould-cont">
                                    <div className="line-title"><span className="redstar">&#42;</span>已选素材</div>
                                    <div className="line-con">
                                        <div className="textarea-area">
                                            <div className="input-box">
                                                <input className="input" placeholder="请选择素材内容" value={this.state.materialName} readOnly/>
                                            </div>
                                            <div className="textarea-box">
                                                <textarea id="template-textarea" className="textarea" maxLength="210" readOnly></textarea>
                                            </div>
                                            <div className="textarea-num">
                                                短信字数：{this.state.textareaLength}
                                            </div>
                                            <div className="huit-icon iconfont dropdown-button" data-hover="false" data-activates="textarea-huit" data-constrainwidth="false">&#xe66f;</div>
                                            <ul id="textarea-huit" className="dropdown-content textarea-huit">
                                                <li style={{'height':'168px !important'}} className="nohover">* 短信以【签名】开头，签名内容为：公司或品牌名称，字<br/>数要求3-12个字符，运营商规定必填。<br/>* 内容合法，不能发送房产、发票等国家法律法规严格禁止<br/>的内容。<br/>* 如有链接，请将链接地址写于短信内容中，便于核实。<br/>* 短信字数&#60;&#61;70个字，按照70个字一条短信计算。<br/>* 短信字数>70个字，即为长短信，按照67个字记为一条短信<br/>计算。<br/>* 短信内容无须添加签名,内容首尾不能添加【】</li>
                                            </ul>
                                        </div>
                                        <div className={"huit-box"+this.state.huitBoxShowClass}>
                                            <div className="icon iconfont">&#xe63a;</div>
                                            <div className="huit">
                                                当前模板内容已超过70字，短信发送字数包含“【签名】+内容”。为避免产
                                                生长短信费用，请再次确认短信长度。
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="line line-h1">
                                    <div className="line-title">第三步&nbsp;目标人群圈定</div>
                                </div>
                                <div className="line crowd-total-count">
                                    <div className="line-title"><span className="redstar">&#42;</span>受众人群</div>
                                    <div className="line-con">
                                        <div className="hite">预估覆盖总计&nbsp;{this.state.crowdTotalCount}&nbsp;人</div>
                                        <div className={"hite "+this.state.stockTotal.className}>
                                            <div className="less-or-equal">&le;</div>&nbsp;素材可覆盖数量&nbsp;{this.state.stockTotal.num}&nbsp;人
                                        </div>
                                    </div>
                                </div>
                                <div className="line crowd">
                                    <div className="line-con">
                                        <div className="tag-area">
                                            {this.state.crowd.map((m,i)=> {
                                                return (
                                                    <div className="tag-box">
                                                        <div className="close iconfont" onClick={this.closeCrowd.bind(this,m.id)}>&#xe60a;</div>
                                                        <div className="icon-box">
                                                            <div className="icon iconfont">&#xe630;</div>
                                                        </div>
                                                        <div className="text-cont">
                                                            <div className="title-box">
                                                                <div className="title">{m.original}</div>
                                                                <div className="price">预估覆盖量&nbsp;{m.count}&nbsp;人</div>
                                                            </div>
                                                            <div className="cont-box">
                                                                {m.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="add-button" onClick={this.addCrowd.bind(this)}>&#43;添加受众</div>
                                    </div>
                                </div>
                                <div className="line">
                                    <div className="line-con nan-title">
                                        <div className={"button-main-1"+this.state.saveButtonClass} onClick={this.saveButton.bind(this)}>保存</div>
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
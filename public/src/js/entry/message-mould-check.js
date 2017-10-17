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
                    <span className="title">模板管理-查看</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" title="返回" onClick={this.gotoLast.bind(this)}>
                        <span className="icon iconfont">&#xe621;</span>
                        <span className="text">返回</span>
                    </a>
                    <a className="a keyong" title="新建模板" href={BASE_PATH+"message-mould-new-marketing.html"}>
                        <span className="icon iconfont">&#xe63b;</span>
                        <span className="text">新建模板</span>
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
        let href = BASE_PATH+"message-mould-edit.html?id="+id;
        if(status == ''){
            window.location.href = href;
        }
    }
    delete(){
        let status = this.state.deleteStatus;
        let id = this.state.id;
        if(status == ''){
            new Modals.Confirm({
                content:"您确定要删除这个模板吗？",
                listeners:{
                    close:function(type){
                        if(type == true){
                            util.api({
                                url: "?method=mkt.sms.smstemplet.del",
                                type: 'post',
                                data: {id:id},
                                success: function (res) {
                                    if(res.code == 0){
                                        window.location.href = BASE_PATH+"/html/message-app/message-mould.html";
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
        let mouldType = '',type = '固定模板',textarea = '',textareaLength = 0,materialList = [],materialClass = '',status = "",reasonClass = "",edit_status,delete_status,thisData="";
        let id = util.geturlparam('id');

        util.api({
            data: {
                method:'mkt.sms.smstemplet.id.get',
                id:id
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    textarea = thisData.content;
                    textareaLength = textarea.length;
                    switch (thisData.channel_type){
                        case 0:
                            mouldType = "营销短信模板";
                            break;
                        case 1:
                            mouldType = "服务通知模板";
                            break;
                        case 2:
                            mouldType = "短信验证码模板";
                            break;
                    }
                    switch (thisData.type){
                        case 0:
                            type = '固定模板';
                            break;
                        case 1:
                            type = '变量模板';
                            break;
                    }
                    switch (thisData.audit_status){
                        case 0:
                            status = "未审核";
                            reasonClass = "";
                            break;
                        case 1:
                            status = "审核通过";
                            reasonClass = "";
                            break;
                        case 2:
                            status = "审核不通过";
                            reasonClass = " red-text";
                            break;
                    }
                    switch (thisData.edit_check){
                        case true:
                            edit_status = "";
                            break;
                        case false:
                            edit_status = " disable";
                            break;
                    }
                    switch (thisData.delete_check){
                        case true:
                            delete_status = "";
                            break;
                        case false:
                            delete_status = " disable";
                            break;
                    }
                    materialList = thisData.material_list;
                    materialList.length>0 ? materialClass=' show' : materialClass='';
                    that.setState({
                        id:thisData.id,
                        name:thisData.name,
                        mouldType:mouldType,
                        type:type,
                        textarea: textarea,
                        textareaLength:textareaLength,
                        materialList:materialList,
                        materialClass:materialClass,
                        status:status,
                        reason:thisData.audit_reason,
                        reasonClass:reasonClass,
                        time:thisData.audit_time,
                        editStatus:edit_status,
                        deleteStatus:delete_status
                    });
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            id:'',
            mouldType:'',
            name:'',
            type:'固定模板',
            textarea: '',
            textareaLength: 0,
            materialList:[],
            materialClass:'',
            status:'',
            reason:'',
            reasonClass:'',
            time:'',
            editStatus:' disable',
            deleteStatus:' disable'
        };
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="mould-check">
                <SubHead />
                <div className="content">
                    <div className="tabs-area">
                        <div className="tabs-box">
                            <ul id="first-layer" className="tabs">
                                <li className="tab"><a className="active" href="javascript:void(0)">{this.state.mouldType}</a></li>
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
                                                    <input id="materialName" className="input" readOnly maxLength="20" value={this.state.name}/>
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
                                    <div className="line mould-cont">
                                        <div className="line-title"><span className="redstar">&#42;</span>模板内容</div>
                                        <div className="line-con">
                                            <div className="textarea-area">
                                                <div className="textarea-box">
                                                    <textarea id="template-textarea" className="textarea" readOnly value={this.state.textarea}></textarea>
                                                </div>
                                                <div className="textarea-num">
                                                    短信字数：{this.state.textareaLength}
                                                </div>
                                                <div className="huit-icon iconfont dropdown-button" data-hover="false" data-activates="textarea-huit" data-constrainwidth="false">&#xe66f;</div>
                                                <ul id="textarea-huit" className="dropdown-content textarea-huit">
                                                    <li style={{'height':'220px !important'}} className="nohover">示例：<br/><br/>固定模板<br/>给喜欢漂泊你的一个惊喜！即日起预定酒店安心下单，随心退<br/>订，就是这么任性！再也不用担心出行计划被打乱，让假日的<br/>心情随心所欲！快快预定钟爱的酒店，戳 http://booking.com<br/> 回T退订<br/><br/>变量模板<br/>嗨 &#123;$1&#125;，很长时间没有体验沙滩、阳光了吧！Booking为您提<br/>供会员专属优惠，最高可省&#123;$2&#125;%！您的优惠专属券已到账【<br/>&#123;$3&#125;】，有效期至12月25日，戳 http://booking.com 回T退订</li>
                                                </ul>
                                            </div>
                                            <div className="prompt-box">
                                                * 短信内容必须合法，不能发送房产、发票等国家法律法规严令禁止的内容。<br/>
                                                * 如有链接，请将链接地址写于短信内容中，便于核实。<br/>
                                                * 短信字数&#60;&#61;70个字，按照70个字一条短信计算,变量短信根据所变换的内容长度计算。<br/>
                                                * 短信字数>70个字，即为长短信，按照67个字记为一条短信计算。<br/>
                                                * 短信内容无需添加签名，内容首尾不能加【】。<br/>
                                                * 变量均用{$}代替，短信发送时根据顺序依次替换为变量内容。<br/>
                                                * 短信内容中每个变量{$}按6个字计算短信长度，发送时每条短信按实际变量内容长度计算字数。<br/>
                                                * 短信字数统计由签名+短信内容+退订回复（营销短信需要）组成，请预留字数避免发送长短信。<br/>
                                                * API发送样板需在短信内容中增加退订信息，如 退订回复TD
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"line variable"+this.state.materialClass}>
                                        <div className="line-title"><span className="redstar">&#42;</span>变量规则</div>
                                        <div className="line-con">
                                            <div className="list-box">
                                                {this.state.materialList.map((m,i)=> {
                                                    return (
                                                        <div className="list">
                                                            <div className="logo">&#36;</div>
                                                            <div className="list-count">
                                                                &#36;{m.sms_variable_value}&nbsp;{m.material_property_name}—{m.material_name}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="line other">
                                        <div className="line-title"><span className="redstar">&#42;</span>模板ID</div>
                                        <div className="line-con">{this.state.id}</div>
                                    </div>
                                    <div className="line other">
                                        <div className="line-title"><span className="redstar">&#42;</span>审核状态</div>
                                        <div className="line-con">{this.state.status}</div>
                                    </div>
                                    <div className="line other">
                                        <div className="line-title"><span className="redstar">&#42;</span>审核原因</div>
                                        <div className={"line-con"+this.state.reasonClass}>{this.state.reason}</div>
                                    </div>
                                    <div className="line other">
                                        <div className="line-title"><span className="redstar">&#42;</span>审核时间</div>
                                        <div className="line-con">{this.state.time}</div>
                                    </div>
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
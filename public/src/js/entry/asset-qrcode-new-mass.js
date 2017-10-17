/**
 * Created by AnThen on 2016-8-8.
 * 微信二维码-编辑 es6+react版
 */
'use strict';//严格模式

/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'微信二维码'
});

/********插件********/
let Modals = require('component/modals.js');
var dateTime = require('module/plan/utils/dateTime.js');/*时间插件*/

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
                    <span className="title">批量新建二维码</span>
                </div>
                <div className="button-box">
                    <a className="a keyong" href="javascript:void(0)" title="返回" onClick={this.gotoLast.bind(this)}>
                        <span className="icon iconfont">&#xe621;</span>
                        <span className="text">返回</span>
                    </a>
                </div>
            </header>
        )
    }
}
/****title****/
class Title extends React.Component{
    render() {
        return (
            <div className="mass-title-box">
                <div className="icon-box">
                    <div className="icon iconfont">&#xe63a;</div>
                </div>
                <div className="text-box">
                    <div className="strong">批量导入的二维码信息需逐个传到微信生成二维码，耗时会比较长，请耐心等待&#126;&#126;</div>
                    <div className="normal">二维码生成后才可进行编辑与下载</div>
                </div>
            </div>
        )
    }
}
/****进度条****/
class ProgressBar extends React.Component{
    render() {
        let num,turn,thisNum;
        let attainOneClass,attainTwoClass,attainThreeClass;
        let attainOneHtml=1,attainTwoHtml=2,attainThreeHtml=3;
        num = this.props.progress.num; turn = this.props.progress.turn;
        if(num >= 0){
            thisNum = '0%';
            if(turn){
                attainOneClass = ' ordinal-turn';
                attainTwoClass = '';
                attainThreeClass = '';
                attainOneHtml='';attainTwoHtml=2;attainThreeHtml=3;
            }else{
                attainOneClass = ' ordinal-act';
                attainTwoClass = '';
                attainThreeClass = '';
                attainOneHtml=1;attainTwoHtml=2;attainThreeHtml=3;
            }
        }
        if(num >= 50){
            thisNum = '50%';
            if(turn){
                attainOneClass = ' ordinal-act';
                attainTwoClass = ' ordinal-turn';
                attainThreeClass = '';
                attainOneHtml=1;attainTwoHtml='';attainThreeHtml=3;
            }else{
                attainOneClass = ' ordinal-act';
                attainTwoClass = ' ordinal-act';
                attainThreeClass = '';
                attainOneHtml=1;attainTwoHtml=2;attainThreeHtml=3;
            }
        }
        if(num >= 100){
            thisNum = '100%';
            if(turn){
                attainOneClass = ' ordinal-act';
                attainTwoClass = ' ordinal-act';
                attainThreeClass = ' ordinal-turn';
                attainOneHtml=1;attainTwoHtml=2;attainThreeHtml='';
            }else{
                attainOneClass = ' ordinal-act';
                attainTwoClass = ' ordinal-act';
                attainThreeClass = ' ordinal-act';
                attainOneHtml=1;attainTwoHtml=2;attainThreeHtml=3;
            }
        }
        return (
            <div className="progress-bar-box">
                <div className="progress">
                    <div className="determinate" style={{width: thisNum}}></div>
                </div>
                <div className="ordinal-box">
                    <div className={"ordinal-one"+attainOneClass}>{attainOneHtml}</div>
                    <div className={"ordinal-two"+attainTwoClass}>{attainTwoHtml}</div>
                    <div className={"ordinal-three"+attainThreeClass}>{attainThreeHtml}</div>
                </div>
            </div>
        )
    }
}
/****步骤一****/
class StepOneDefault extends React.Component{
    clickInputFile(){
        $('#input-file').click();
    }
    changeInputFile(){
        let thisValue = $('#input-file').val();
        this.setState({
            fileName: thisValue,
            importClass: 'button-main-1 import-but'
        });
    }
    changeStepOne(){
        let that = this;
        let uploadData,formData = new FormData();
        let param;
        if(this.state.importClass === 'button-main-1 import-but'){
            uploadData = $('#input-file')[0].files[0];
            formData.append("uploadedFile", uploadData);
            param = {fileName: this.state.fileName,formData:formData};
            that.props.swatchStep('run',param);
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            importClass: 'button-main-1 disable import-but close'
        };
    };
    render() {
        return (
            <div className="step-one-default-box">
                <div className="step-box">
                    <div className="title">请下载批量创建二维码的&nbsp;&nbsp;<a className="a" href={FILE_PATH+'wechat_qrcode_batch_template.xlsx'}>模板文件</a></div>
                    <div className="input-area">
                        <div className="input-box">
                            <input className="input" value={this.state.fileName} readOnly onClick={this.clickInputFile.bind(this)}
                            />
                            <input className="input-file" id="input-file" type="file" onChange={this.changeInputFile.bind(this)}/>
                        </div>
                        <div className="but-box">
                            <div className="button-assist-3 file-but" onClick={this.clickInputFile.bind(this)}>选择文件</div>
                            <div className={this.state.importClass} onClick={this.changeStepOne.bind(this)}><span className="icon iconfont">&#xe621;</span>导入文件</div>
                        </div>
                    </div>
                </div>
                <div className="trigon-box">
                    <div className="trigon iconfont">&#xe6b1;</div>
                </div>
            </div>
        )
    }
}
class StepOne extends React.Component{
    cancelUploadFile(e){
        if(!$(e.currentTarget).hasClass('close')){
            this.props.swatchStep('default');
        }
    }
    render() {
        let type,msg,progress,progressInt,success=0,fail= 0,failUrl='#';
        let scheduleClass,numClass="none",msgClass='',returnPointClass="none";
        let cancelBut = this.props.result.cancelBut;
        type = this.props.result.type;
        msg = this.props.result.msg;
        progress = this.props.progress;
        progressInt = parseInt(progress);
        if(type){
            scheduleClass = '';
            msgClass = '';
        }else{
            scheduleClass = ' error';
            msgClass = ' error';
        }
        if(progressInt>0){
            numClass="block";
        }else{
            numClass="none";
        }
        if(progressInt>99){
            returnPointClass="block";
            success=this.props.result.successNum;
            fail=this.props.result.fail;
            failUrl=FILE_PATH+this.props.result.failUrl
        }else{
            returnPointClass="none";
        }
        return (
            <div className="step-one-box">
                <div className="step-box">
                    <div className="schedule-bar-area">
                        <div className={"schedule-bar-box"+scheduleClass}>
                            <div className="schedule" style={{width:progress}}>
                                <div className="dian" style={{display: numClass}}></div>
                                <div className="num" style={{display: numClass}}>{progress}</div>
                            </div>
                        </div>
                        <div id="cancel-but" className={"cancel-but"+cancelBut} onClick={this.cancelUploadFile.bind(this)}>取消上传</div>
                    </div>
                    <div className={"point"+msgClass}>{msg}</div>
                    <div className="return-point" style={{display: returnPointClass}}>成功导入二维码信息&nbsp;<span className="success">{success}</span>&nbsp;个，失败&nbsp;<a className="fail" href={failUrl}>{fail}</a>&nbsp;个</div>
                </div>
                <div className="trigon-box">
                    <div className="trigon iconfont">&#xe6b1;</div>
                </div>
            </div>
        )
    }
}
/****步骤二****/
class StepTwo extends React.Component{
    changeSuccessNum(success){
        let bogusWebSocket=null,num=0;
        bogusWebSocket = setInterval(function(){
            num++;
            $('#success-num').html(num);
            if(num>success){clearInterval(bogusWebSocket);}
        },500);
    }
    render() {
        let run=this.props.stepTwo.run;
        let success=this.props.stepTwo.success;
        let add=this.props.stepTwo.add;
        let stepBoxClass='',returnPointClass=" none";
        if(add){
            if(run){
                stepBoxClass=' run';
                returnPointClass=' block';
                this.changeSuccessNum(success-1);
            }else{
                stepBoxClass='';
                returnPointClass=" none";
            }
        }else{
            stepBoxClass=' run';
            returnPointClass=' block';
            $('#success-num').html(success);
        }
        return (
            <div className="step-two-box">
                <div className={"step-box"+stepBoxClass}>
                    <div className="point">导入文件后，我们会前往微信生成二维码。</div>
                    <div className="return-point" style={{display: returnPointClass}}> 已生成二维码：<span className="success" id="success-num">0</span>&nbsp;&#47;&nbsp;{success}</div>
                </div>
                <div className={"trigon-box"+stepBoxClass}>
                    <div className="trigon iconfont">&#xe6b1;</div>
                </div>
            </div>
        )
    }
}
/****步骤三****/
class StepThreeDefault extends React.Component{
    render() {
        return (
            <div className="step-three-default-box">
                <div className="step-box">
                    设置二维码信息
                </div>
            </div>
        )
    }
}
class StepThree extends React.Component{
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
                that.props.resetStepThreeData('expirationTime',thisDate);
            }
        });
    }
    fixedAssociationTags(id){
        let thisDate;
        if(id == 'yes'){
            thisDate = 'block';
            this.setState({
                tagsRadio:[true,false],
                tagsAreaDisplay: 'block'
            });
        }
        if(id == 'no'){
            thisDate = 'none';
            this.setState({
                tagsRadio:[false,true],
                tagsAreaDisplay: 'none'
            });
        }
        this.props.resetStepThreeData('tagsAreaDisplay',thisDate);
    }
    associationTags(event){
        let associationTagsId,associationTags,tags=[],tagsLength,result=true;
        let keycode = event.keyCode;
        if(keycode == 13){
            tags = this.state.tags;
            tagsLength = tags.length;
            associationTagsId = $('#associationTags');
            associationTags = $.trim(associationTagsId.val());
            for(let i=0; i<tagsLength; i++){
                if(associationTags == tags[i]){
                    result = false;
                    break;
                }else{
                    result = true;
                }
            }
            if(result){tags[tagsLength]=associationTags}
            this.setState({tags:tags});
            associationTagsId.val('');
            this.props.resetStepThreeData('tags',tags);
        }
    }
    deleteTag(name){
        let tags = this.state.tags,tagNum = tags.length;
        for(let i=0; i<tagNum; i++){
            if(name == tags[i]){
                tags.splice(i,1);
                break;
            }
        }
        this.setState({tags:tags});
        this.props.resetStepThreeData('tags',tags);
    }
    resetTextareaText(){
        let thisTextarea = $.trim($('#note-textarea').val()),thisTextareaLength = thisTextarea.length;
        if(thisTextareaLength > 100){
            thisTextarea = thisTextarea.substring(0,100);
            thisTextareaLength = 100;
            $('#note-textarea').val(thisTextarea);
        }
        this.setState({textareaTextNum:thisTextareaLength});
        this.props.resetStepThreeData('comment',thisTextarea);
    }
    constructor(props){
        super(props);
        this.state = {
            startTime: '',
            tagsRadio: [false,true],
            tags: [],
            tagsAreaDisplay: 'none',
            textareaTextNum: 0
        };
    }
    componentDidMount(){
        this.fetchToday();
    }
    render() {
        return (
            <div className="step-three-box">
                <div className="step-box">
                    <div className="box-title">设置二维码信息</div>
                    <div className="cont-box">
                        <div className="line">
                            <div className="title">设置失效时间</div>
                            <div className="box-cont">
                                <div className="setup-time">
                                    <input className="input" type="text" readOnly id="failures-time" onClick={this.setupDate.bind(this)}/>
                                    <div className="arrow-down iconfont">&#xe6ae;</div>
                                </div>
                            </div>
                        </div>
                        <div className="line">
                            <div className="title">新建自定义标签</div>
                            <div className="box-cont">
                                <div className="association-tags-radio">
                                    <div className="radio-box" onClick={this.fixedAssociationTags.bind(this,'yes')}>
                                        <input className="type1" name="fixed-tag" type="radio" id="fixed-tag-yes" checked={this.state.tagsRadio[0]}/>
                                        <label for="fixed-tag-yes">是</label>
                                    </div>
                                    <div className="radio-box" onClick={this.fixedAssociationTags.bind(this,'no')}>
                                        <input className="type1" name="fixed-tag" type="radio" id="fixed-tag-no" checked={this.state.tagsRadio[1]}/>
                                        <label for="fixed-tag-no">否</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="line" style={{display:this.state.tagsAreaDisplay}}>
                            <div className="title"></div>
                            <div className="box-cont">
                                <div className="tags-area">
                                    <div className="tags-input">
                                        <input id="associationTags" className="input" type="text" placeholder="标签名" onKeyUp={this.associationTags.bind(this)}/>
                                    </div>
                                    <div className="tags-broder" id="tags-broder">
                                        {this.state.tags.map((m,i)=> {
                                            return(
                                                <nobr className="tag">{m}<div className="close icon iconfont" onClick={this.deleteTag.bind(this,m)}>&#xe608;</div></nobr>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="line">
                            <div className="title">备注信息</div>
                            <div className="box-cont">
                                <div className="note-area">
                                    <div className="textarea-box"><textarea className="textarea" id="note-textarea" onChange={this.resetTextareaText.bind(this)}></textarea></div>
                                    <div className="font-num">{this.state.textareaTextNum}&nbsp;&#47;&nbsp;100</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
/********组织页面模块********/
class Manage extends React.Component {
    swatchStep(type,param){
        let that = this;
        let thisProgress = {};
        let stepOneResult={},stepOneSubModule;
        let formData;
        let ajax_url=UPLOADAIP_PATH+"?method=mkt.weixin.qrcode.batch.upload";
        let thisData;
        let stepThreeSubModule=<StepThreeDefault />;
        if(type=='default'){
            thisProgress = {num: 0,turn:false};
            stepOneSubModule = <StepOneDefault swatchStep={this.swatchStep}/>;
            this.setState({
                progress: thisProgress,
                stepOneSubModule:stepOneSubModule,
                stepTwo: {run: false, success: 0, add: true},
                stepThreeSubModule: <StepThreeDefault />,
                saveButClass: ' disable'
            });
        }
        if(type=='run'){
            formData=param.formData;
            $.ajax({
                url: ajax_url,
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                xhr: function(){
                    function onprogress(evt){
                        var loaded = evt.loaded;     /*已经上传大小情况*/
                        var tot = evt.total;      /*附件总大小*/
                        var per = Math.floor(100*loaded/tot) + '%';  /*已经上传的百分比*/
                        thisProgress = {num: 0,turn:true};
                        stepOneResult={type:true,msg:param.fileName,successNum:0,fail:0,failUrl:'#',cancelBut:' close'};
                        stepOneSubModule = <StepOne result={stepOneResult} progress={per}/>;
                        that.setState({
                            progress: thisProgress,
                            stepOneResult:stepOneResult,
                            stepOneProgress:per,
                            stepOneSubModule:stepOneSubModule
                        });
                    }
                    var xhr = $.ajaxSettings.xhr();
                    if(onprogress && xhr.upload) {
                        xhr.upload.addEventListener("progress",onprogress,false);
                        return xhr;
                    }
                },
                success: function (rest) {
                    if(rest.code == 0){
                        thisData = rest.data[0];
                        stepOneResult={type:true,msg:param.fileName,successNum:thisData.succ_count,fail:thisData.fail_count,failUrl:thisData.fail_url,cancelBut:' close'};
                        stepOneSubModule = <StepOne result={stepOneResult} progress={that.state.stepOneProgress} swatchStep={that.swatchStep}/>;
                        that.setState({
                            stepOneResult:stepOneResult,
                            stepOneSubModule:stepOneSubModule,
                            batchId:thisData.batch_id
                        });
                        if(thisData.succ_count > 0){
                            thisProgress = {num: 50,turn:true};
                            that.setState({
                                progress: thisProgress,
                                stepTwo:{run:true,success:thisData.succ_count,add:true}
                            });
                            setTimeout(function(){
                                thisProgress = {num: 100,turn:true};
                                stepOneResult={type:true,msg:param.fileName,successNum:thisData.succ_count,fail:thisData.fail_count,failUrl:thisData.fail_url,cancelBut:''};
                                stepOneSubModule = <StepOne result={stepOneResult} progress={that.state.stepOneProgress} swatchStep={that.swatchStep}/>;
                                stepThreeSubModule = <StepThree resetStepThreeData={that.resetStepThreeData}/>;
                                that.setState({
                                    progress: thisProgress,
                                    stepOneSubModule:stepOneSubModule,
                                    stepTwo:{run:true,success:thisData.succ_count,add:false},
                                    stepThreeSubModule:stepThreeSubModule,
                                    saveButClass:''
                                });
                            },thisData.succ_count*500)
                        }else{
                            thisProgress = {num: 0,turn:false};
                            that.setState({
                                progress: thisProgress,
                                stepTwo:{run:false,success:0,add:true}
                            });
                        }
                    }
                },
                error: function(){
                    stepOneResult={type:false,msg:'['+param.fileName+']上传失败',successNum:0,fail:0,failUrl:'#',cancelBut:''};
                    stepOneSubModule = <StepOne result={stepOneResult} progress={'0%'} swatchStep={that.swatchStep}/>;
                    that.setState({
                        stepOneResult:stepOneResult,
                        stepOneProgress:'0%',
                        stepOneSubModule:stepOneSubModule,
                        stepTwo:{run:false,success:0}
                    });
                }
            });
        }
    }
    resetStepThreeData(term,data){
        switch (term){
            case 'expirationTime':
                this.setState({expirationTime:data});
                break;
            case 'tagsAreaDisplay':
                this.setState({tagsAreaDisplay:data});
                break;
            case 'tags':
                this.setState({tags:data});
                break;
            case 'comment':
                this.setState({comment:data});
                break;
        }
    }
    dataSave(e){
        let batchId,expirationTime,tagsAreaDisplay,tags=[],comment;
        if(!$(e.currentTarget).hasClass('disable')){
            batchId=this.state.batchId;
            expirationTime=this.state.expirationTime;
            tagsAreaDisplay=this.state.tagsAreaDisplay;
            comment=this.state.comment;
            if(tagsAreaDisplay=='none'){
                tags=[];
            }else{
                tags=this.state.tags;
            }
            util.api({
                url: "?method=mkt.weixin.qrcode.batch.save",
                type: 'post',
                data: {batch_id:batchId,expiration_time:expirationTime,tagNames:tags,comment:comment},
                success: function (res) {
                    if(res.code == 0){
                        location.href = BASE_PATH+'/html/asset/qrcode-download-mass.html?id='+batchId;
                    }
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            id:'',
            progress: {num: 0, turn: false},
            stepOneSubModule: <StepOneDefault />,
            stepOneResult: {type: true, msg: '文件名称', successNum: 0, fail: 0, failUrl: '#', cancelBut: ' close'},
            stepOneProgress: '0%',
            stepTwo: {run: false, success: 0, add: true},
            stepThreeSubModule: <StepThreeDefault />,
            saveButClass: ' disable',
            batchId: '',
            expirationTime: '',
            tags:[],
            tagsAreaDisplay:'none',
            comment: ''
        };
        this.swatchStep = this.swatchStep.bind(this);
        this.resetStepThreeData = this.resetStepThreeData.bind(this);
    }
    componentDidMount(){
        this.swatchStep('default');
    }
    render() {
        return (
            <div className="qrcode-mass">
                <SubHead />
                <div className="content">
                    <div className="mass-box">
                        <Title />
                        <ProgressBar progress={this.state.progress}/>
                        <div className="step-area">
                            {this.state.stepOneSubModule}
                            <StepTwo stepTwo={this.state.stepTwo} swatchStep={this.swatchStep}/>
                            {this.state.stepThreeSubModule}
                        </div>
                        <div className="save-but-box">
                            <div className={"button-main-2 but"+this.state.saveButClass} onClick={this.dataSave.bind(this)}>保存</div>
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
/**
 * Created by AnThen on 2016/12/6.
 */
/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'优惠券'
});

/********插件********/
/*时间插件*/
var dateTime = require('module/plan/utils/dateTime.js');

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
                    <span className="title">优惠券编辑</span>
                </div>
                <div className="button-box icon iconfont">
                    <a className="a keyong" title="返回" onClick={this.gotoLast.bind(this)}>&#xe621;</a>
                </div>
            </header>
        )
    }
}
/****内容头部****/
class ConHead extends React.Component{
    render() {
        return (
            <div className="header">
                <div className="logo"><img src={IMG_PATH+"/img/coupon/new1.png"}/></div>
                <div className="tt">
                    <div className="title">营销优惠券</div>
                    <div className="h2">
                        <div className="text">Marketing Cloud</div>
                        <div className="ico icon iconfont">&#xe6b4;</div>
                    </div>
                    <div className="text-box">MC营销优惠券，我们重新定义了优惠券，让他它不再是一种毫无意义的串码。在MC优惠券中心，我们对优惠券引入了标签体系让优惠券成为一种可被描述的物料，追踪实际的使用效果，通过用户对券券的使用习惯描述用户画像。</div>
                </div>
            </div>
        )
    }
}
/****第一步****/
class PlayOne extends React.Component{
    changeName(){
        let name = $('#coupon-name').val().trim();
        this.setState({couponName:name});
        this.buttonClass();
    }
    isChecked(type){
        let radio = [false,false,false];
        switch (type){
            case 'common':
                radio[0] = true;
                break;
            case 'autogeny':
                radio[1] = true;
                break;
            case 'own':
                radio[2] = true;
                break;
        }
        this.setState({
            couponType:type,
            couponRadio:radio,
        });
    }
    buttonClass(){
        let couponName = $('#coupon-name').val().trim() || false;
        if(couponName){
            this.setState({nextButtonClass:''});
        }
    }
    nextButton(){
        let param;
        let nowHistoryState = history.state;
        if(this.state.nextButtonClass==''){
            param = {
                name:this.state.couponName,
                type:this.state.couponType
            };
            nowHistoryState.oneParam = param;
            nowHistoryState.nowStep = 'two';
            history.pushState(nowHistoryState,'','');
            this.props.stepRecord('two');
        }
    }
    constructor(props){
        /*common:普通码;autogeny:平台生成码;own:自有码*/
        super(props);
        this.state = {
            couponName:'',
            couponType:'common',
            couponRadio:[true,false,false],
            nextButtonClass:' disable'
        };
    }
    fetch(){
        let nowHistoryState = history.state || false;
        let oneParam,name,couponType,couponRadio;
        if(nowHistoryState){
            oneParam = nowHistoryState.oneParam || false;
            if(oneParam){
                name = oneParam.name;
                $('#coupon-name').val(name);
                console.log('118：'+nowHistoryState.oneParam.type)
                switch (nowHistoryState.oneParam.type){
                    case 'common':
                        couponType = 'common';
                        couponRadio = [true,false,false];
                        break;
                    case 'generate':
                        couponType = 'generate';
                        couponRadio = [false,true,false];
                        break;
                    case 'own':
                        couponType = 'own';
                        couponRadio = [false,false,true];
                        break;
                    default:
                        couponType = 'common';
                        couponRadio = [true,false,false];
                        break;
                }
                this.setState({couponName:name,couponType:couponType,couponRadio:couponRadio});
                this.buttonClass();
            }
        }
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="play-one">
                <div className="line name">
                    <div className="line-title"><span className="redstar">&#42;</span>管理名称</div>
                    <div className="line-cont">
                        <div className="input-box">
                            <input type="text" id="coupon-name" className="input" placeholder="请填写一个冠名名称 方便识别" onChange={this.changeName.bind(this)}/>
                        </div>
                        <div className="hint">管理名称不能为空</div>
                    </div>
                </div>
                <div className="line type">
                    <div className="line-title"><span className="redstar">&#42;</span>券码类型</div>
                    <div className="line-cont">
                        <div className="radio-area">
                            <div className="radio-box">
                                <input className="type1" name="couponType" type="radio" id="couponType1" checked={this.state.couponRadio[0]} onClick={this.isChecked.bind(this,'common')}/>
                                <label htmlFor="couponType1">通用码</label>
                            </div>
                            <div className="radio-box">
                                <input className="type1" name="couponType" type="radio" id="couponType2" checked={this.state.couponRadio[1]} onClick={this.isChecked.bind(this,'autogeny')}/>
                                <label htmlFor="couponType2">平台生成码</label>
                            </div>
                            <div className="radio-box">
                                <input className="type1" name="couponType" type="radio" id="couponType3" checked={this.state.couponRadio[2]} onClick={this.isChecked.bind(this,'own')}/>
                                <label htmlFor="couponType3">自有码上传</label>
                            </div>
                        </div>
                        <div className="huit-icon iconfont">&#xe66f;</div>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 next"+this.state.nextButtonClass} onClick={this.nextButton.bind(this)}>下一步</div>
                    </div>
                </div>
            </div>
        )
    }
}
/****第二步****/
class PlayTwo extends React.Component{
    stepTransfer(step){
        this.props.stepRecord(step);
    }
    constructor(props){
        super(props);
        this.state = {
            cont:''
        };
        this.stepTransfer = this.stepTransfer.bind(this);
    }
    fetch(){
        let nowHistoryState = history.state;
        let couponType = nowHistoryState.oneParam.type;
        switch (couponType){
            case 'common':
                this.setState({cont:<PlayTwoCommon stepTransfer={this.stepTransfer}/>});
                break;
            case 'generate':
                this.setState({cont:<PlayTwoGenerate stepTransfer={this.stepTransfer}/>});
                break;
            case 'own':
                this.setState({cont:<PlayTwoOwn stepTransfer={this.stepTransfer}/>});
                break;
            default:
                this.setState({cont:<PlayTwoCommon stepTransfer={this.stepTransfer}/>});
                break;
        }
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="play-two">
                <div className="h1">规则配置</div>
                <div className="rule-explain">
                    <div className="h2">规则说明</div>
                    <div className="point-out-area">
                        <div className="point-out-box">
                            <div className="point-out-title"><div className="icon iconfont">&#xe63a;</div></div>
                            <div className="point-out-content">
                                1、通用优惠券适用与目标受众对一人一码情况没有约束的场景<br/>
                                2、请您预估好目标投放量，在您投放中遇到券码库存紧张情况可进行追加<br/>
                                3、优惠券中心的所有码您可以直接接入到短信、微信卡券等渠道中进行使用<br/>
                                4、如果您自行进行投放，建议您避免同一批次的优惠代码重复使用，避免核销冲突
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.cont}
            </div>
        )
    }
}
/*普通码*/
class PlayTwoCommon extends React.Component{
    changeName(){
        let name = $('#common-name').val().trim();
        this.setState({commonName:name});
        this.buttonClass();
    }
    changeNum(){
        let num = $('#common-num').val().trim();
        this.setState({commonNum:num});
        this.buttonClass();
    }
    buttonClass(){
        let name = $('#common-name').val().trim() || false;
        let num = $('#common-num').val().trim() || false;
        if(name && num){
            this.setState({nextButtonClass:''});
        }
    }
    nextButton(){
        let param;
        let nowHistoryState = history.state;
        if(this.state.nextButtonClass==''){
            param = {
                name:this.state.commonName,
                num:this.state.commonNum
            };
            nowHistoryState.twoParam = param;
            nowHistoryState.nowStep = 'three';
            history.pushState(nowHistoryState,'','');
            this.props.stepTransfer('three');
        }
    }
    backButton(){
        let nowHistoryState = history.state;
        nowHistoryState.nowStep = 'one';
        history.pushState(nowHistoryState,'','');
        this.setState({nextButtonClass:' disable'});
        this.props.stepTransfer('one');
    }
    constructor(props){
        super(props);
        this.state = {
            commonName:'',
            commonNum:'',
            nextButtonClass:' disable',
            hint:['不能为空','请按规则填写','只能是数字']
        };
    }
    fetch(){
        let twoParam = history.state.twoParam || false;
        if(twoParam){
            $('#common-name').val(twoParam.name);
            $('#common-num').val(twoParam.num);
            this.setState({commonName:twoParam.name,commonNum:twoParam.num});
        }
        this.buttonClass();
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="rule-body">
                <div className="common">
                    <div className="line name">
                        <div className="line-title"><span className="redstar">&#42;</span>券码名称</div>
                        <div className="line-cont">
                            <div className="input-box">
                                <input type="text" id="common-name" className="input" placeholder="优惠码内容为最终用户收到的数字、字母或组合的串码" onChange={this.changeName.bind(this)}/>
                            </div>
                            <div className="huit-icon iconfont">&#xe66f;</div>
                            <div className="hint">券码名称不能为空</div>
                        </div>
                    </div>
                    <div className="line amount">
                        <div className="line-title"><span className="redstar">&#42;</span>券码数量</div>
                        <div className="line-cont">
                            <div className="input-box">
                                <input type="text" id="common-num" className="input" placeholder="请填写投放预期优惠码数量" onChange={this.changeNum.bind(this)}/>
                            </div>
                            <div className="hint">券码数量不能为空</div>
                        </div>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 save"+this.state.nextButtonClass} onClick={this.nextButton.bind(this)}>下一步</div>
                        <div className="button-assist-1 back" onClick={this.backButton.bind(this)}>上一步</div>
                    </div>
                </div>
            </div>
        )
    }
}
/*平台生成码*/
class PlayTwoGenerate extends React.Component{
    isChecked(type){
        let radio = [false,false,false];
        switch (type){
            case 'letter':
                radio[0] = true;
                break;
            case 'number':
                radio[1] = true;
                break;
            case 'blend':
                radio[2] = true;
                break;
        }
        this.setState({
            ruleOne:type,
            ruleOneRadio:radio
        });
        this.ruleOutcome(type,'one');
    }
    numSize(num){
        this.setState({ruleTwo:num});
        this.ruleOutcome(num,'two');
    }
    ruleOutcome(param,type){
        let ruleOne,ruleTwo;
        let outcomeNum = 0;

        switch (type){
            case 'one':
                ruleOne = param;
                ruleTwo = this.state.ruleTwo;
                outcomeNum = 1;
                break;
            case 'two':
                ruleOne = this.state.ruleOne;
                ruleTwo = param;
                outcomeNum = 2;
                break;
        }
        this.setState({outcomeNum:outcomeNum});
        this.buttonClass(outcomeNum,'rule');
    }
    couponRule(){
        let num = $('#coupon-num').val().trim();
        this.setState({couponNum:num});
        this.buttonClass('','num');
    }
    ruleTest(outcomeNum){
        let nextButtonClass, hintValue;
        let couponNum = this.state.couponNum || false;
        if(couponNum){
            if(parseInt(couponNum) <= parseInt(outcomeNum)){
                hintValue = {show:'none',num:0};
                nextButtonClass = '';
            }else{
                hintValue = {show:'block',num:2};
                nextButtonClass = ' disable';
            }
            this.setState({hintValue:hintValue,nextButtonClass:nextButtonClass});
        }
    }
    numTest(){
        let nextButtonClass, hintValue;
        let outcome = parseInt(this.state.outcomeNum);
        let num = $('#coupon-num').val().trim() || false;
        let reg = new RegExp(/^[1-9][0-9]*$/);
        if(num){
            if(reg.test(num)){
                num = parseInt(num);
                if(num <= outcome){
                    nextButtonClass = '';
                    hintValue = {show:'none',num:0};
                }else{
                    nextButtonClass = ' disable';
                    hintValue = {show:'block',num:2};
                }
            }else{
                nextButtonClass = ' disable';
                hintValue = {show:'block',num:1};
            }
        }else{
            nextButtonClass = ' disable';
            hintValue = {show:'block',num:0};
        }
        this.setState({hintValue:hintValue,nextButtonClass:nextButtonClass});
    }
    buttonClass(param,type){
        let outcomeNum,couponNum,thisHintValue,nextButtonClass;
        switch (type){
            case 'rule':
                this.ruleTest(param);
                break;
            case 'num':
                this.numTest();
                break;
            case 'init':
                outcomeNum = parseInt(param.outcomeNum);
                couponNum = parseInt(param.couponNum);
                if(couponNum <= outcomeNum){
                    thisHintValue = {show:'none',num:0};
                    nextButtonClass = '';
                }else{
                    thisHintValue = {show:'block',num:2};
                    nextButtonClass = ' disable';
                }
                this.setState({hintValue:thisHintValue,nextButtonClass:nextButtonClass});
                break;
        }
    }
    nextButton(){
        let param;
        let nowHistoryState = history.state;
        if(this.state.nextButtonClass==''){
            param = {
                ruleOne:this.state.ruleOne,
                ruleTwo:this.state.ruleTwo,
                outcomeNum:this.state.outcomeNum,
                num:this.state.couponNum
            };
            nowHistoryState.twoParam = param;
            nowHistoryState.nowStep = 'three';
            history.pushState(nowHistoryState,'','');
            this.props.stepTransfer('three');
        }
    }
    backButton(){
        let nowHistoryState = history.state;
        nowHistoryState.nowStep = 'one';
        history.pushState(nowHistoryState,'','');
        this.setState({nextButtonClass:' disable'});
        this.props.stepTransfer('one');
    }
    constructor(props){
        /*letter:字母组合;number:数字组合;blend:数字字母混合*/
        super(props);
        this.state = {
            ruleOne:'letter',
            ruleOneRadio:[true,false,false],
            ruleTwo:5,
            numSizeSelect:[{num:5},{num:6},{num:7},{num:8},{num:9},{num:10},{num:11},{num:12},{num:13},{num:14},{num:15},{num:16},{num:17},{num:18},{num:19},{num:20}],
            outcomeNum:0,
            couponNum:'',
            nextButtonClass:' disable',
            hint:['券码数量不能为空','只能是正整数','数值不能超过可生成的卷码量'],
            hintValue:{show:'none',num:0}
        };
    }
    fetch(){
        let twoParam = history.state.twoParam || false;
        let radio = [false,false,false],ruleOne,ruleTwo,num;
        let outcomeNum;
        let param;
        if(twoParam){
            ruleOne = twoParam.ruleOne;
            ruleTwo = twoParam.ruleTwo;
            outcomeNum = twoParam.outcomeNum;
            num = twoParam.num;
            param = {
                outcomeNum:outcomeNum,
                couponNum:num
            };
            switch (ruleOne){
                case 'letter':
                    radio[0] = true;
                    break;
                case 'number':
                    radio[1] = true;
                    break;
                case 'blend':
                    radio[2] = true;
                    break;
            }
            this.setState({
                ruleOne:ruleOne,
                ruleOneRadio:radio,
                ruleTwo:ruleTwo,
                outcomeNum:outcomeNum,
                couponNum:num
            });
            $('#coupon-num').val(num);
            this.buttonClass(param,'init');
        }
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="rule-body">
                <div className="autogeny">
                    <div className="line rule-div">
                        <div className="line-title"><span className="redstar">&#42;</span>规则一</div>
                        <div className="line-cont">
                            <div className="radio-area">
                                <div className="radio-box">
                                    <input className="type1" name="playTwoRule" type="radio" id="playTwoRule1" checked={this.state.ruleOneRadio[0]} onClick={this.isChecked.bind(this,'letter')}/>
                                    <label htmlFor="playTwoRule1">字母组合</label>
                                </div>
                                <div className="radio-box">
                                    <input className="type1" name="playTwoRule" type="radio" id="playTwoRule2" checked={this.state.ruleOneRadio[1]} onClick={this.isChecked.bind(this,'number')}/>
                                    <label htmlFor="playTwoRule2">数字组合</label>
                                </div>
                                <div className="radio-box">
                                    <input className="type1" name="playTwoRule" type="radio" id="playTwoRule3" checked={this.state.ruleOneRadio[2]} onClick={this.isChecked.bind(this,'blend')}/>
                                    <label htmlFor="playTwoRule3">数字字母混合</label>
                                </div>
                            </div>
                            <div className="huit-icon iconfont">&#xe66f;</div>
                        </div>
                    </div>
                    <div className="line num-size">
                        <div className="line-title"><span className="redstar">&#42;</span>规则二</div>
                        <div className="line-cont">
                            <div className="selectbtn dropdown-button" data-beloworigin="true" data-constrainwidth="true" data-activates="num-size">{this.state.ruleTwo}</div>
                            <div id="num-size" className="dropdown-content">
                                <ul className="select-ul">
                                    {this.state.numSizeSelect.map((m,i)=> {
                                        return (
                                            <li onClick={this.numSize.bind(this,m.num)}>{m.num}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="line outcome">
                        <div className="line-title">可生成卷码量</div>
                        <div className="line-cont">
                            <div className="icon iconfont">&#xe63a;</div>
                            当前类型还可生成&nbsp;{this.state.outcomeNum}&nbsp;个券码
                        </div>
                    </div>
                    <div className="line amount">
                        <div className="line-title"><span className="redstar">&#42;</span>券码数量</div>
                        <div className="line-cont">
                            <div className="input-box">
                                <input type="text" id="coupon-num" className="input" placeholder="请填写投放预期优惠码数量" onChange={this.couponRule.bind(this)}/>
                            </div>
                            <div className="hint" style={{'display':this.state.hintValue.show}}>{this.state.hint[this.state.hintValue.num]}</div>
                        </div>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 save"+this.state.nextButtonClass} onClick={this.nextButton.bind(this)}>下一步</div>
                        <div className="button-assist-1 back" onClick={this.backButton.bind(this)}>上一步</div>
                    </div>
                </div>
            </div>
        )
    }
}
/*自有码上传*/
class PlayTwoOwn extends React.Component{
    uploadFile(){}
    uploadFileInput(){
        $('#upload-file').click();
    }
    cancelFileUpload(){}
    fileDelete(name){
        let filesList = this.state.filesList;
        for(let i=0; i<filesList.length; i++){
            if(filesList[i].name == name){
                filesList.splice(i,1);
            }
        }
        this.setState({filesList:filesList});
        this.buttonClass(filesList);
    }
    nextButton(){
        let param = [];
        let nowHistoryState = history.state;
        let filesList = this.state.filesList;
        if(this.state.nextButtonClass==''){
            for(let i=0; i<filesList.length; i++){
                param[i] = filesList[i].name;
            }
            nowHistoryState.twoParam = param;
            nowHistoryState.nowStep = 'three';
            history.pushState(nowHistoryState,'','');
            this.props.stepTransfer('three');
        }
    }
    backButton(){
        let nowHistoryState = history.state;
        nowHistoryState.nowStep = 'one';
        history.pushState(nowHistoryState,'','');
        this.setState({nextButtonClass:' disable'});
        this.props.stepTransfer('one');
    }
    buttonClass(param){
        let nextButtonClass;
        if(param.length > 0){
            nextButtonClass = '';
        }else{
            nextButtonClass = ' disable';
        }
        this.setState({nextButtonClass:nextButtonClass});
    }
    constructor(props){
        super(props);
        this.state = {
            fileUploadType:'init',
            fileUploadMsg:'fail',
            filesList:[],
            nextButtonClass:' disable'
        };
    }
    render() {
        return (
            <div className="rule-body">
                <div className="own">
                    <div className="line caption">
                        <div className="line-cont">
                            <div className="title">第一步&nbsp;选择文件上传</div>
                            <div className="download"><a className="a" href="#">下载模板</a></div>
                        </div>
                    </div>
                    <div className="file-upload">
                        <input id="upload-file" className="file-input" type="file" onChange={this.uploadFile.bind(this)}/>
                        <div className="upload-box file-upload-init">
                            <div className="init-box">
                                <div className="select-box">
                                    <div className="button" onClick={this.uploadFileInput.bind(this)}>选择上传文件</div>
                                </div>
                            </div>
                        </div>
                        <div className="upload-box file-upload-loading">
                            <div className="loading-box">
                                <div className="cloud">
                                    <div className="preloader-wrapper big active">
                                        <div className="spinner-layer spinner-blue-only">
                                            <div className="circle-clipper left">
                                                <div className="circle"></div>
                                            </div>
                                            <div className="gap-patch">
                                                <div className="circle"></div>
                                            </div>
                                            <div className="circle-clipper right">
                                                <div className="circle"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="loading-cont">
                                    <div className="text">文件上传中...</div>
                                    <div className="msg" title={this.state.fileUploadMsg}>{this.state.fileUploadMsg}</div>
                                </div>
                                <div className="select-box">
                                    <div className="button-main-3 button" onClick={this.cancelFileUpload.bind(this)}>取消加载</div>
                                </div>
                            </div>
                        </div>
                        <div className="upload-box file-upload-success">
                            <div className="success-box">
                                <div className="ico icon iconfont">&#xe610;</div>
                                <div className="success-cont">
                                    <div className="text">文件加载成功！</div>
                                    <div className="msg" title={this.state.fileUploadMsg}>{this.state.fileUploadMsg}</div>
                                </div>
                                <div className="select-box">
                                    <div className="button" onClick={this.uploadFileInput.bind(this)}>重新选择文件</div>
                                </div>
                            </div>
                        </div>
                        <div className="upload-box file-upload-fail">
                            <div className="fail-box">
                                <div className="ico icon iconfont">&#xe60a;</div>
                                <div className="fail-cont">
                                    <div className="text">文件加载失败！</div>
                                    <div className="msg" title={this.state.fileUploadMsg}>{this.state.fileUploadMsg}</div>
                                </div>
                                <div className="select-box">
                                    <div className="button" onClick={this.uploadFileInput.bind(this)}>选择上传文件</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="line caption">
                        <div className="line-cont">
                            <div className="title">第二步&nbsp;核对上传数据</div>
                            <div className="huit-icon iconfont">&#xe66f;</div>
                        </div>
                    </div>
                    <div className="line files-list">
                        <div className="line-cont">
                            {this.state.filesList.map((m,i)=> {
                                return (
                                    <div className="lists">
                                        <div className="files">{m.name}</div>
                                        <div className="detail">
                                            <div className="num">记录数量&nbsp;{m.num}&nbsp;条</div>
                                            <div className="delete" onClick={this.fileDelete.bind(this,m.name)}>删除</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 save"+this.state.nextButtonClass} onClick={this.nextButton.bind(this)}>下一步</div>
                        <div className="button-assist-1 back" onClick={this.backButton.bind(this)}>上一步</div>
                    </div>
                </div>
            </div>
        )
    }
}
/****第三步****/
class PlayThree extends React.Component{
    changePrice(){
        let price = $('#coupon-price').val().trim() || false;
        this.setState({price:price});
        this.buttonClass('price');
    }
    startTime(){
        let that =this;
        let thisDate;
        let minTime = this.state.minTime;
        let maxTime = this.state.endTime || false;
        if(maxTime){
            $('#start-time').pickadate({
                format: 'yyyy-mm-dd',
                selectMonths: true,
                selectYears: 5,
                min: new Date(minTime),
                max: new Date(maxTime),
                onClose: function(){
                    thisDate = this.component.$node.context.value;
                    that.setState({startTime:thisDate});
                    that.buttonClass('purviewTime');
                }
            });
        }else{
            $('#start-time').pickadate({
                format: 'yyyy-mm-dd',
                selectMonths: true,
                selectYears: 5,
                min: new Date(minTime),
                onClose: function(){
                    thisDate = this.component.$node.context.value;
                    that.setState({startTime:thisDate});
                    that.buttonClass('purviewTime');
                }
            });
        }
    }
    endTime(){
        let that =this;
        let thisDate;
        let minTime = this.state.minTime;
        $('#end-time').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 5,
            min: new Date(minTime),
            onClose: function(){
                thisDate = this.component.$node.context.value;
                that.setState({endTime:thisDate});
                that.buttonClass('purviewTime');
            }
        });
    }
    backButton(){
        let nowHistoryState = history.state;
        nowHistoryState.nowStep = 'two';
        history.pushState(nowHistoryState,'','');
        this.setState({saveButtonClass:' disable'});
        this.props.stepRecord('two');
    }
    saveButton(){
        if(this.state.saveButtonClass == ''){
            alert('提交')
        }
    }
    priceTest(){
        let param;
        let pricetf = false, hintPrice;
        let price = $('#coupon-price').val().trim() || false;
        let reg = new RegExp(/^([0-9])+(\.[0-9]+)?$/);

        if(price){
            if(reg.test(price)){
                pricetf = true;
                hintPrice = {show:'none',num:0};
            }else{
                pricetf = false;
                hintPrice = {show:'block',num:1};
            }
        }else{
            pricetf = false;
            hintPrice = {show:'block',num:0};
        }
        param = {hint:hintPrice,tf:pricetf};
        return(param);
    }
    purviewTimeTest(){
        let param;
        let timetf = false, hintPurviewTime;
        let startTime = $('#start-time').val().trim() || false;
        let endDate = $('#end-time').val().trim() || false;

        if(startTime && endDate){
            timetf = true;
            hintPurviewTime = {show:'none',num:2};
        }else{
            timetf = false;
            hintPurviewTime = {show:'block',num:2};
        }
        param = {hint:hintPurviewTime,tf:timetf};
        return(param);
    }
    buttonClass(type){
        let testPrice,testPurviewTime;
        let pricetf = false,purviewTimetf = false,hintPrice,hintPurviewTime;

        switch (type){
            case 'init':
                testPrice = this.priceTest();
                testPurviewTime = this.purviewTimeTest();
                pricetf = testPrice.tf;
                purviewTimetf = testPurviewTime.tf;
                hintPrice = testPrice.hint;
                hintPurviewTime = testPurviewTime.hint;
                this.setState({hintPrice:hintPrice,hintPurviewTime:hintPurviewTime});
                break;
            case 'price':
                testPrice = this.priceTest();
                testPurviewTime = this.purviewTimeTest();
                pricetf = testPrice.tf;
                purviewTimetf = testPurviewTime.tf;
                hintPrice = testPrice.hint;
                this.setState({hintPrice:hintPrice});
                break;
            case 'purviewTime':
                testPrice = this.priceTest();
                testPurviewTime = this.purviewTimeTest();
                pricetf = testPrice.tf;
                purviewTimetf = testPurviewTime.tf;
                hintPurviewTime = testPurviewTime.hint;
                this.setState({hintPurviewTime:hintPurviewTime});
                break;
            default:
                hintPrice = {show:'none',num:0};
                hintPurviewTime = {show:'none',num:2};
                this.setState({hintPrice:hintPrice,hintPurviewTime:hintPurviewTime});
                break;
        }
        if(pricetf && purviewTimetf){
            this.setState({saveButtonClass:''});
        }else{
            this.setState({saveButtonClass:' disable'});
        }
    }
    constructor(props){
        super(props);
        this.state = {
            price:'',
            minTime:'',
            startTime:'',endTime:'',
            saveButtonClass:' disable',
            hint:['不能为空','只能大于零的数字','时间必须填写完整'],
            hintPrice:{show:'none',num:0},
            hintPurviewTime:{show:'none',num:2}
        };
    }
    fetch(){
        let minTime,startTime,endTime;
        let threeParam = history.state.threeParam || false;
        if(threeParam){
            minTime = history.state.nowTime;
            startTime = util.formatDate(threeParam.startTime/1000,3);
            endTime = util.formatDate(threeParam.endTime/1000,3);

            $('#coupon-price').val(threeParam.price);
            $('#start-time').val(startTime);
            $('#end-time').val(endTime);
            this.setState({
                price:threeParam.price,
                minTime:minTime,
                startTime:startTime,
                endTime:endTime
            });

            this.buttonClass('init');
        }else{
            this.buttonClass();
        }
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="play-three">
                <div className="line value">
                    <div className="line-title"><span className="redstar">&#42;</span>券码价值</div>
                    <div className="line-cont">
                        <div className="input-box">
                            <input type="text" id="coupon-price" className="input" placeholder="请填写优惠券折扣金额" onChange={this.changePrice.bind(this)}/>
                        </div>
                        <div className="hint" style={{'display':this.state.hintPrice.show}}>卷码价值{this.state.hint[this.state.hintPrice.num]}</div>
                    </div>
                </div>
                <div className="line channel">
                    <div className="line-title"><span className="redstar">&#42;</span>场景渠道</div>
                    <div className="line-cont">
                        <div className="radio-area">
                            <div className="radio-box">
                                <input className="type1" name="channelType" type="radio" id="couponChannel" checked/>
                                <label htmlFor="couponChannel">短信渠道</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line time">
                    <div className="line-title"><span className="redstar">&#42;</span>有效时间</div>
                    <div className="line-cont">
                        <div className="radio-area">
                            <div className="radio-box">
                                <input className="type1" name="timeType" type="radio" id="couponTimeType" checked/>
                                <label htmlFor="couponTimeType">范围时间模式</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line time-interval">
                    <div className="line-cont">
                        <div className="period-box">
                            <div className="period">
                                <input id="start-time" className="input" type="text" readOnly value={this.state.startTime} placeholder="起始时间" onClick={this.startTime.bind(this)}/>
                                <div className="icon iconfont">&#xe6ae;</div>
                            </div>
                            <div className="zhi">至</div>
                            <div className="period">
                                <input id="end-time" className="input" type="text" readOnly value={this.state.endTime} placeholder="结束时间" onClick={this.endTime.bind(this)}/>
                                <div className="icon iconfont">&#xe6ae;</div>
                            </div>
                        </div>
                        <div className="hint" style={{'display':this.state.hintPurviewTime.show}}>{this.state.hint[this.state.hintPurviewTime.num]}</div>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 save"+this.state.saveButtonClass} onClick={this.saveButton.bind(this)}>保存</div>
                        <div className="button-assist-1 back" onClick={this.backButton.bind(this)}>上一步</div>
                    </div>
                </div>
            </div>
        )
    }
}

/********组织页面模块********/
class Manage extends React.Component{
    stepRecord(step){
        console.log('以下是stepRecord得到的值：')
        console.log(history.state)
        console.log('以上是stepRecord得到的值：')

        let thisStep = ['','',''];
        switch (step){
            case 'one':
                thisStep = [' act','',''];
                this.setState({step:thisStep,cont:<PlayOne stepRecord={this.stepRecord}/>});
                break;
            case 'two':
                thisStep = [' act',' act',''];
                this.setState({step:thisStep,cont:<PlayTwo stepRecord={this.stepRecord}/>});
                break;
            case 'three':
                thisStep = [' act',' act',' act'];
                this.setState({step:thisStep,cont:<PlayThree stepRecord={this.stepRecord}/>});
                break;
            default:
                thisStep = [' act','',''];
                this.setState({step:thisStep,cont:<PlayOne stepRecord={this.stepRecord}/>});
                break;
        }
    }
    constructor(props){
        super(props);
        this.state = {
            step:[' act','',''],
            cont:''
        };
        this.stepRecord = this.stepRecord.bind(this);
    }
    fetch(){
        let that = this;
        let nowHistoryState = history.state || false;
        let thisData;
        let paramStep = 'one';
        let nowParam = {oneParam:'',twoParam:'',threeParam:'',nowStep:paramStep,nowTime:''};

        if(nowHistoryState){
            nowParam = nowHistoryState;
            paramStep = nowParam.nowStep;
            history.pushState(nowParam,'','');
            that.stepRecord(paramStep);
        }else{
            /*
             coupon-edit-common.json
             coupon-edit-autogeny.json
             coupon-edit-own.json
             */
            $.get("../../apidata/coupon/coupon-edit-common.json", function(res){
                if(res.code == 0){
                    thisData = res.data[0];
                    nowParam.oneParam = {
                        name:thisData.title,
                        type:thisData.source
                    };
                    switch (thisData.source){
                        case 'common':
                            nowParam.twoParam = {
                                name:thisData.rule.coupon_code,
                                num:thisData.stock_total
                            };
                            break;
                        case 'generate':
                            nowParam.twoParam = {
                                ruleOne:thisData.rule.type_code,
                                ruleTwo:thisData.rule.length,
                                outcomeNum:thisData.rule.max_count,
                                num:thisData.stock_total
                            };
                            break;
                    }
                    nowParam.threeParam = {
                        price:thisData.amount,
                        startTime:thisData.start_time,
                        endTime:thisData.end_time
                    };
                    nowParam.nowTime = res.date;

                    history.pushState(nowParam,'','');
                    that.stepRecord(paramStep);
                }
            });
        }
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="coupon-new">
                <SubHead />
                <div className="content">
                    <ConHead />
                    <div className="cont-body">
                        <div className="step-area">
                            <div className="progress">
                                <div className="determinate"></div>
                            </div>
                            <div className="step-box">
                                <div className={"step"+this.state.step[0]}>1</div>
                                <div className={"step"+this.state.step[1]}>2</div>
                                <div className={"step"+this.state.step[2]}>3</div>
                            </div>
                            <div className="step-bt">
                                <div className="one">优惠券定义</div>
                                <div className="two">优惠券规则</div>
                                <div className="three">接入配置</div>
                            </div>
                        </div>
                        <div className="cont">{this.state.cont}</div>
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
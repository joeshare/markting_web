/**
 * Created by AnThen on 2016-7-6.
 * 文件接入 es6+react版
 */
'use strict';//严格模式

//构造页面
import Layout from 'module/layout/layout';

//组件
let Modals = require('component/modals.js');

//先创建布局
const layout = new Layout({
    index: 1,
    leftMenuCurName:'文件接入'
});

//本页全局公用变量
//文件上传ajax
var ajaxOperate = 0;

//编写页面模块
//二级头部
class SubHead extends React.Component{
    fetch(){
        let that = this;
        let cumulative,reLastTime,lastTime;
        util.api({
            url: "?method=mkt.data.inbound.file.generalinfo.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.code == 0){
                    if(res.data.length > 0){
                        cumulative = res.data[0].migarated_row_count;
                        if(res.data[0].last_upload_time){
                            reLastTime = (res.data[0].last_upload_time)/1000;
                            lastTime = util.formatDate(reLastTime,1);
                        }else{
                            lastTime = '无修改';
                        }
                        that.setState({
                            cumulative: cumulative,
                            lastTime: lastTime
                        });
                    }
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {cumulative:0,lastTime:'无修改'};
    }
    componentDidMount(){
        this.fetch();
    }
    render(){
        return(
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">文件接入</span>
                    <span className="text">
                        已接入累计数据<span className="variable">{this.state.cumulative}</span>条，最后一次上传时间<span className="variable">{this.state.lastTime}</span>
                    </span>
                </div>
            </header>
        );
    }
}
//文件模板下载
class FileDownload extends React.Component{
    formatTempletListData(data,type){
        let that = this;
        let templateList = [],templateListId = [],isMark;
        let isChecked,j=0;
        for(let i=0; i<data.length; i++){
            if(type == 'checked'){isChecked=data[i].isChecked}else{isChecked=true}
            templateList[i] = {"template_name": data[i].template_name,"template_id":data[i].template_id,isChecked:isChecked,isMark:' '};
            /*1.3
             templateList[i] = {"template_name": data[i].template_name,"template_id":data[i].template_id,isChecked:isChecked,isMark:' show'};
            */
            if(isChecked){templateListId[j]=i;j++;}
        }
        that.setState({data: templateList});
        this.fetchTempletDownloadHref(templateListId);
    }
    fetchTempletListData(){
        let that = this;
        util.api({
            url: "?method=mkt.data.inbound.file.template.list.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.code == 0){
                    that.formatTempletListData(res.data,res.total);
                }
            }
        });
    }
    isChecked(id){
        let fdata = this.state.data;
        fdata.map(m=> {
            if ('file-download'+m.template_id === id) {
                m.isChecked ? m.isChecked = false : m.isChecked = true;
            }
        });
        this.formatTempletListData(fdata,'checked');
    }
    fetchTempletDownloadHref(list){
        let that = this;
        let listid;
        let thisUrl = 'javascript:void(0)',
            classname = 'disable';
        if(list.length>0){
            listid = list.toString();
            util.api({
                url: "?method=mkt.data.inbound.file.template.download",
                type: 'get',
                data: {"template_id_list": listid},
                success: function (res) {
                    if(res.code == 0){
                        thisUrl = FILE_PATH + res.data[0].download_file_name;
                        classname = '';
                    }
                    that.setState({
                        downloadBut:{classname:classname,href:thisUrl}
                    });
                }
            });
        }else{
            that.setState({
                downloadBut:{classname:classname,href:thisUrl}
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            data:[],
            downloadBut:{
                classname:'disable',
                href:'javascript:void(0)'
            }
        };
    }
    componentDidMount(){
        this.fetchTempletListData();
    }
    render(){
        return(
            <div className="download-area">
                <div className="area-title">文件模板下载</div>
                <div className="download-box">
                    <div className="list-but-box">
                        <ul id="list-but-ul" className="ul uat-fileaccess-ul">
                            {this.state.data.map((m,i)=> {
                                return (
                                    <li className='li uat-fileaccess-li'>
                                        <input type='checkbox' className='filled-in' id={'file-download'+m.template_id} name={m.template_id} checked={m.isChecked} onChange={this.isChecked.bind(this,'file-download'+m.template_id)}/>
                                        <label htmlFor={'file-download'+m.template_id}>{m.template_name}</label>
                                        <span className={'new-mark'+m.isMark}>new</span>
                                    </li>
                                )
                            })}
                        </ul>
                        <div id="download-templet-box">
                            <a id="download-templet" className={"button-assist-1 "+this.state.downloadBut.classname} href={this.state.downloadBut.href}>下载（zip）</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//数据文件上传
class DataUpFile extends React.Component{
    firstBoxState(status,msg){
        let firstBox = {
            init:{classname:'init',component:<StateInit uploadFile={this.uploadFile}/>},
            loading:{classname:'loading',component:<StateLoading msg={msg} uploadFile={this.uploadFile}/>},
            success:{classname:'success',component:<StateSuccess msg={msg} uploadFile={this.uploadFile}/>},
            fail:{classname:'fail',component:<StateFail msg={msg} uploadFile={this.uploadFile}/>}
        };
        switch (status){
            case 'init':
                this.setState({firstBoxCondition:firstBox.init});
                break;
            case 'loading':
                this.setState({firstBoxCondition:firstBox.loading});
                break;
            case 'success':
                this.setState({firstBoxCondition:firstBox.success});
                break;
            case 'fail':
                this.setState({firstBoxCondition:firstBox.fail});
                break;
        }
    }
    uploadFile(formData,ajax_url,fileName,type,fileUnique){
        let that = this;
        switch (type){
            case 'init':
                that.firstBoxState('init');
                break;
            case 'loading':
                ajaxOperate = $.ajax({
                    url: ajax_url,
                    type: 'post',
                    data: formData,
                    /**
                     * 必须false才会避开jQuery对 formdata 的默认处理
                     * XMLHttpRequest会对 formdata 进行正确的处理
                     */
                    processData: false,
                    /**
                     *必须false才会自动加上正确的Content-Type
                     */
                    contentType: false,
                    beforeSend: function(){
                        that.firstBoxState('loading',fileName);
                    },
                    success: function (rest) {
                        if(rest.code == 0){
                            that.setState({
                                lableStatus:{class:'',readonly:false},
                                uploadBut:{class:'',unique:fileUnique,type:rest.data[0].file_type}
                            });
                            that.firstBoxState('success',fileName);
                            that.showUploadFileResult(rest.data[0].data_topic,rest.data[0].data_rows,rest.data[0].unrecognize_fields,'success');
                        }else{
                            that.setState({
                                lableStatus:{class:'pause',readonly:true},
                                uploadBut:{class:'',unique:'',type:''}
                            });
                            that.firstBoxState('fail',rest.msg);
                            that.showUploadFileResult('','','','fail');
                        }
                    }
                });
                break;
            case 'stop':
                ajaxOperate.abort();
                that.firstBoxState('init');
                break;
            case 'success':
                that.firstBoxState('success',fileName);
                break;
            case 'fail':
                that.firstBoxState('fail',fileName);
                break;
        }
    }
    showUploadFileResult(topic,rows,fields,type){
        let undefinedNum,style;
        if(fields.length>0){
            undefinedNum = fields.split(',').length;
        }else{
            undefinedNum = 0;
        }
        if(undefinedNum>0){
            style = 'icoblock';
        }else{
            style = 'iconone';
            if(type == 'fail'){undefinedNum='';}
        }
        this.setState({
            secondData:{subject:topic,rows:rows,amount:undefinedNum,cont:fields,style:style}
        });
    }
    labelRecord(data){
        this.setState({labelData:data});
    }
    startUpload(e){
        let that = this;
        let addInputVal = $('#add-lable').val();
        let fileUnique,fileType,tagName;
        if(!$(e.currentTarget).hasClass('disable')){
            fileUnique = this.state.uploadBut.unique;
            fileType = this.state.uploadBut.type;
            tagName = this.state.labelData;
            if(addInputVal.length>0){
                if(($.inArray(addInputVal,tagName)) < 0){
                    tagName[tagName.length]=addInputVal;
                }
            }
            util.api({
                url: "?method=mkt.data.inbound.file.tag.update",
                type: 'post',
                data: {'file_unique': fileUnique, 'tag_names': tagName, 'file_type': fileType},
                success: function (res) {
                    if(res.code == 0){
                        that.setState({
                            secondData:{subject:'',rows:'',amount:'',cont:'',style:'iconone'},
                            labelData:[],
                            uploadBut:{class:'disable',unique:'',type:''}
                        });
                        that.firstBoxState('init');
                        $('#public-header-red-corner').css('display','block');
                        $('.tooltipped').tooltip({delay: 50});
                        $('#add-lable').val('');
                        Materialize.toast('上传成功！', 2000);
                    }else{
                        new Modals.Alert('上传失败！');
                    }
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            firstBoxCondition:{classname:'init',component:<StateInit />},
            secondData:{subject:'',rows:'',amount:'',cont:'',style:'iconone'},
            labelData:[],
            lableStatus:{class:'pause',readonly:true},
            uploadBut:{class:'disable',unique:'',type:''}
        };
        this.uploadFile = this.uploadFile.bind(this);
        this.labelRecord = this.labelRecord.bind(this);
    }
    componentDidMount(){
        this.firstBoxState('init');
    }
    render(){
        return(
            <div className="upload-area">
                <div className="area-title">数据文件上传</div>
                <div className="upload-box">
                    <div className="first-box">
                        <div className="box-title">第一步&nbsp;选择上传文件</div>
                        <div className={'files-box '+this.state.firstBoxCondition.classname}>
                            {this.state.firstBoxCondition.component}
                        </div>
                    </div>
                    <div className="second-box">
                        <div className="box-title">第二步&nbsp;核对上传数据摘要</div>
                        <Second data={this.state.secondData}/>
                    </div>
                    <div className="third-box">
                        <div className="box-title">第三步&nbsp;设置标签（可选）</div>
                        <Third status={this.state.lableStatus} labelData={this.state.labelData} labelRecord={this.labelRecord}/>
                    </div>
                    <div className="upload-but-box">
                        <div className={"button-main-1 "+this.state.uploadBut.class} onClick={this.startUpload.bind(this)} id="upload-but">开始上传</div>
                    </div>
                </div>
            </div>
        );
    }
}
//第一步四种状态
//状态：初始化
class StateInit extends React.Component{
    uploadFileInput(){
        let that = this;
        let fileName,uploadData;
        let formData = new FormData(),file_url,file_unique,ajax_url;
        util.api({
            url: "?method=mkt.data.inbound.file.uploadurl.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.code == 0){
                    fileName = $('#upload-file').val();
                    uploadData = $('#upload-file')[0].files[0];
                    formData.append("uploadedFile", uploadData);
                    file_url = res.data[0].file_url;
                    file_unique = res.data[0].file_unique;
                    ajax_url = UPLOADAIP_PATH+"?method=" + file_url + "&file_unique=" + file_unique;
                    that.props.uploadFile(formData,ajax_url,fileName,'loading',file_unique);
                }
            }
        });
    }
    activateUploadFileInput(){
        $('#upload-file').click();
    }
    render() {
        return(
            <div className="init-box">
                <div className="select-box">
                    <div className="button" onClick={this.activateUploadFileInput.bind(this)}>选择上传文件</div>
                    <input id="upload-file" className="file-input" type="file" placeholder="选择文件" onChange={this.uploadFileInput.bind(this)}/>
                </div>
            </div>
        )
    };
}
//状态：文件上传中
class StateLoading extends React.Component{
    uploadFileInput(){
        this.props.uploadFile('','','','stop','');
    }
    render() {
        return(
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
                <div className="cont">
                    <div className="text">文件上传中...</div>
                    <div className="msg" title={this.props.msg}>{this.props.msg}</div>
                </div>
                <div className="select-box">
                    <div className="waves-effect waves-light btn button" onClick={this.uploadFileInput.bind(this)}>取消加载</div>
                </div>
            </div>
        )
    };
}
//状态：文件上传成功
class StateSuccess extends React.Component{
    uploadFileInput(){
        let that = this;
        let fileName,uploadData;
        let formData = new FormData(),file_url,file_unique,ajax_url;
        util.api({
            url: "?method=mkt.data.inbound.file.uploadurl.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.code == 0){
                    fileName = $('#upload-file').val();
                    uploadData = $('#upload-file')[0].files[0];
                    formData.append("uploadedFile", uploadData);
                    file_url = res.data[0].file_url;
                    file_unique = res.data[0].file_unique;
                    ajax_url = UPLOADAIP_PATH+"?method=" + file_url + "&file_unique=" + file_unique;
                    that.props.uploadFile(formData,ajax_url,fileName,'loading',file_unique);
                }
            }
        });
    }
    activateUploadFileInput(){
        $('#upload-file').click();
    }
    render() {
        return(
            <div className="success-box">
                <div className="ico icon iconfont">&#xe610;</div>
                <div className="cont">
                    <div className="text">文件加载成功！</div>
                    <div className="msg" title={this.props.msg}>{this.props.msg}</div>
                </div>
                <div className="select-box">
                    <div className="waves-effect waves-light btn button" onClick={this.activateUploadFileInput.bind(this)}>重新选择文件</div>
                    <input id="upload-file" className="file-input" type="file" placeholder="选择文件" onChange={this.uploadFileInput.bind(this)}/>
                </div>
            </div>
        )
    };
}
//状态：文件上传失败
class StateFail extends React.Component{
    uploadFileInput(){
        let that = this;
        let fileName,uploadData;
        let formData = new FormData(),file_url,file_unique,ajax_url;
        util.api({
            url: "?method=mkt.data.inbound.file.uploadurl.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.code == 0){
                    fileName = $('#upload-file').val();
                    uploadData = $('#upload-file')[0].files[0];
                    formData.append("uploadedFile", uploadData);
                    file_url = res.data[0].file_url;
                    file_unique = res.data[0].file_unique;
                    ajax_url = UPLOADAIP_PATH+"?method=" + file_url + "&file_unique=" + file_unique;
                    that.props.uploadFile(formData,ajax_url,fileName,'loading',file_unique);
                }
            }
        });
    }
    activateUploadFileInput(){
        $('#upload-file').click();
    }
    render() {
        return(
            <div className="fail-box">
                <div className="ico icon iconfont">&#xe60a;</div>
                <div className="cont">
                    <div className="text">文件加载失败！</div>
                    <div className="msg">{this.props.msg}</div>
                </div>
                <div className="select-box">
                    <div className="waves-effect waves-light btn button" onClick={this.activateUploadFileInput.bind(this)}>选择上传文件</div>
                    <input id="upload-file" className="file-input" type="file" placeholder="选择文件" onChange={this.uploadFileInput.bind(this)}/>
                </div>
            </div>
        )
    };
}
//第二步
class Second extends React.Component{
    render(){
        return(
            <ul className="data-area">
                <li className="box">
                    <div className="pub-title">主题数据：</div>
                    <div className="pub-text main">{this.props.data.subject}</div>
                </li>
                <li className="box">
                    <div className="pub-title">数据条数：</div>
                    <div className="pub-text amount">{this.props.data.rows}</div>
                </li>
                <li className="box">
                    <div className="pub-title">未识别属性：</div>
                    <div className="pub-text undefined">
                        <span className="num">{this.props.data.amount}</span>
                        <span className={"ico icon iconfont "+this.props.data.style} title={this.props.data.cont}>&#xe674;</span>
                    </div>
                </li>
            </ul>
        );
    }
}
//第三步
class Third extends React.Component{
    delLable(e){
        let delText = $(e.currentTarget).prev('.text').text();
        let labelData = this.props.labelData,lableNum = labelData.length;
        for(let i=0; i<lableNum; i++){
            if(delText == labelData[i]){
                labelData.splice(i,1);
                break;
            }
        }
        this.props.labelRecord(labelData);
    }
    removeRepeat(text){
        let thisData,thisText = $.trim(text);
        let result = false;
        if(thisText.length>0){
            thisData = this.props.labelData;
            if(thisData.length>0){
                for(let i=0;i<thisData.length; i++){
                    if(thisText == thisData[i]){
                        result = false;
                        break;
                    }else{
                        result = true;
                    }
                }
            }else{
                result = true;
            }
            return result;
        }
    }
    inputEnter(e){
        let keycode = e.keyCode;
        let thisVal;
        if((keycode == 13)||(keycode == 32)){
            thisVal = $(e.currentTarget).val();
            if(this.removeRepeat(thisVal)){this.changeLable(thisVal)}
        }

    }
    changeLable(text){
        let thisData = this.props.labelData,lableNum = thisData.length;
        thisData[lableNum] = text;
        this.props.labelRecord(thisData);
        $('#add-lable').val('');
    }
    render(){
        return(
            <div className="block-area" id="block-area">
                <div id="block-box" style={{float:"left"}}>
                    {this.props.labelData.map((m,i)=> {
                        return (
                            <div className='block-box'>
                                <span className='text'>{m}</span>
                                <span className='ico icon iconfont del-block' onClick={this.delLable.bind(this)}>&#xe608;</span>
                            </div>
                        )
                    })}
                </div>
                <input id="add-lable" className={"input "+this.props.status.class} readOnly={this.props.status.readonly} type="text" placeholder="请输入标签名称" onKeyDown={this.inputEnter.bind(this)}/>
            </div>
        );
    }
}
//组织页面模块
class Manage extends React.Component {
    render() {
        return (
            <div className="file">
                <SubHead />
                <div className="content">
                    <FileDownload />
                    <DataUpFile />
                </div>
            </div>
        )
    }
}
//渲染页面
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
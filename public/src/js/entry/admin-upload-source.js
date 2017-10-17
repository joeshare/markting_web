/**
 * 用户来源批量上传
 * author:lxf
 */
import Layout from 'module/layout/layout';
import PointOut from 'module/point-out/point-out';

const layout = new Layout({
    index: 99,
    leftMenuCurName: '用户来源管理'
});
class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploaded: false,
            file_id: 0,
            record_count: 0,
            file_name: ''
        }
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        $('.dropdown-button').dropdown();
    }

    //获取上传文件的接口地址
    getUploadUrlPath() {
        let that = this;
        let result = '';
        util.api({
            data: {
                method: "mkt.usersource.file.upload.get",
            },
            async: false,
            success: function (res) {
                if (res.code == 0) {
                    result = res.data[0].file_url
                } else {
                    result = '';
                }
            }
        });
        return result;
    }

    //文件上传
    uploadFile() {
        let that = this;
        let formData = new FormData();
        let fileObj = $('#upload-file')[0].files[0];
        let filePathName = $('#upload-file').val();
        let fileName = fileObj.name;
        let uploadUrl = this.getUploadUrlPath();
        this.setState({
            fileUploadMsg: filePathName
        });
        formData.append('file_input', fileObj);//第一个参数的这个名称要和后端对应上
        //单独写请求
        $.ajax({
            url: API_PATH + '?method=' + uploadUrl + '&user_id=' + USER_ID,
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,//必填
            contentType: false,//必填
            beforeSend: function () {
                $('.upload-box').hide();
                $('.file-upload-loading').show();
            },
            error: function (jqXHR, textStatus) {
                $('.upload-box').hide();
                $('.file-upload-fail').show();
            },
            success: function (res) {
                if (res.code == 0) {
                    let data = res.data[0] || {};
                    $('.upload-box').hide();
                    $('.file-upload-success').show();
                    that.setState({
                        isUploaded: true,
                        file_id: data.file_id,
                        record_count: data.record_count,
                        file_name: data.file_name
                    })
                } else {
                    $('.upload-box').hide();
                    $('.file-upload-fail').show();
                    that.setState({
                        isUploaded: false
                    })
                }
            }
        });
    }

    //触发文件上传表单点击事件
    uploadFileInput() {
        $('#upload-file').trigger('click')
    }

    cancelFileUpload() {

    }

    submit() {
        if ($('.fn-wrap .disable').length > 0)return;
        util.api({
            data: {
                method: 'mkt.usersource.data.import',
                file_id: this.state.file_id
            },
            success(response){
                if (response.code == 0) {
                    window.location.href = "/html/admin/user-source-manage.html";
                } else {
                    util.toast({
                        type: 3,
                        title: "操作失败",
                        describe: response.msg,
                    });
                }
            }
        });

    }

    render() {
        let isUploaded = this.state.isUploaded;
        let uploadResultStr = '';
        let disableClass = '';
        if (isUploaded) {
            disableClass = '';
            uploadResultStr = <div className="upload-result-info">
                <div>上传文件：{this.state.file_name}</div>
                <div>共计来源：{_.str.numberFormat(this.state.record_count)} <span className="icon iconfont dropdown-button"
                                                                              data-activates="tip-su"
                                                                              data-beloworigin="true"
                                                                              data-constrainwidth="false"
                                                                              data-hover="true">&#xe66f;

                </span></div>
                <ul id="tip-su" className="dropdown-content width-auto">
                    <div style={{padding: '0 10px'}}>
                        <div> 通用码只在数量上受约束，所有目标受众获得的全码都完全一样</div>
                    </div>
                </ul>
            </div>
        } else {
            disableClass = 'disable';
            uploadResultStr = <div className="empty"><span className="icon iconfont">&#xe627;</span><span
                className="txt">尚未上传目标文件</span>
            </div>;
        }
        return (
            <div className="upload-source">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">批量上传来源</span>
                    </div>
                </header>
                <div className="content clearfix">
                    <div className="tip-wrap clearfix">
                        <PointOut param={{
                            icon: 'orange',
                            back: 'orange',
                            text: {
                                title: '当分类级别较复杂且定义的来源数量较多时，耗时会比较长，请耐心等待~~',//必须
                                text: ['批量上传仅作为来源初始化使用，仅能进行一次，请谨慎操作。', '来源及来源支持数字、字母、中文、-、_、+、（）、/']
                            }
                        }}/>
                    </div>
                    <div className="h3">第一步 选择文件上传</div>
                    <div className="down-link">下载 <a href="/download/source.xlsx" target="_ablank">《用户来源批量上传文件模板》</a>
                    </div>
                    <div className="file-upload">
                        <input id="upload-file" className="file-input" type="file"
                               onChange={this.uploadFile.bind(this)}/>
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
                                    <div className="msg"
                                         title={this.state.fileUploadMsg}>{this.state.fileUploadMsg}</div>
                                </div>
                                <div className="select-box">
                                    <div className="button-main-3 button" onClick={this.cancelFileUpload.bind(this)}>
                                        取消加载
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="upload-box file-upload-success">
                            <div className="success-box">
                                <div className="ico icon iconfont">&#xe610;</div>
                                <div className="success-cont">
                                    <div className="text">文件上传成功！</div>
                                    <div className="msg"
                                         title={this.state.fileUploadMsg}>{this.state.fileUploadMsg}</div>
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
                                    <div className="text">文件上传失败！</div>
                                    <div className="msg"
                                         title={this.state.fileUploadMsg}>{this.state.fileUploadMsg}</div>
                                </div>
                                <div className="select-box">
                                    <div className="button" onClick={this.uploadFileInput.bind(this)}>选择上传文件</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="h3">第二步 核对上传数据</div>
                    <div className="status-warp">
                        {uploadResultStr}

                    </div>
                    <div className="fn-wrap">
                        <div className={"button-main-1 " + disableClass} onClick={this.submit.bind(this)}>确定</div>
                    </div>
                </div>
            </div>
        )
    }
}

//渲染
const root = ReactDOM.render(
    <Root />,
    document.getElementById('page-body')
);

module.exports = Root;
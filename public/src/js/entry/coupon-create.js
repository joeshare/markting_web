/**
 * Created by liuxiaofan on 2016/12/19.
 * 优惠券-新建
 */
'use strict';
//先创建布局
import Layout from 'module/layout/layout';
let Modals = require('component/modals.js');
const layout = new Layout({
    index: 2,
    leftMenuCurName: '优惠券'
});

//2级头
class SubHead extends React.Component {
    gotoLast() {
        window.history.back();
    }

    render() {
        let title=util.geturlparam('id')?"编辑优惠券":"新建优惠券";
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">{title}</span>
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
//内容头
class ConHead extends React.Component {
    render() {
        return (
            <div className="header">
                <div className="logo"><img src={IMG_PATH + "/img/coupon/new1.png"}/></div>
                <div className="tt">
                    <div className="title">营销优惠券</div>
                    <div className="h2">
                        <div className="text">Marketing Cloud</div>
                        <div className="ico icon iconfont">&#xe6b4;</div>
                    </div>
                    <div className="text-box">
                        MC营销优惠券，我们重新定义了优惠券，让他它不再是一种毫无意义的串码。在MC优惠券中心，我们对优惠券引入了标签体系让优惠券成为一种可被描述的物料，追踪实际的使用效果，通过用户对券券的使用习惯描述用户画像。
                    </div>
                </div>
            </div>
        )
    }
}
//第1步
class StepOne extends React.Component {
    render() {
        let nextButtonClass = this.props.title ? '' : 'disable';
        return (
            <div className="play-one">
                <div className="line name">
                    <div className="line-title">
                        <span className="redstar">&#42;</span>管理名称
                    </div>
                    <div className="line-cont">
                        <div className="input-box">
                            <input type="text" id="coupon-name"
                                   className="input"
                                   placeholder="请填写一个管理名称 方便识别"
                                   maxLength="20"
                                   value={this.props.title}
                                   onChange={(e) => {
                                       let val = $.trim(e.target.value) || '';
                                       if (!util.getrexResult(val)) return;
                                       this.props.setRootState({
                                           title: val,
                                           nextButtonClass: val ? '' : ' disable'
                                       });
                                   }}
                            />
                        </div>
                        <div className="hint">管理名称不能为空</div>
                    </div>
                </div>
                <div className="line type">
                    <div className="line-title"><span className="redstar">&#42;</span>券码类型</div>
                    <div className="line-cont">
                        <div className="radio-area">
                            {this.props.radios.map((m, i) => {
                                return (
                                    <div className="radio-box">
                                        <input className="type1" type="radio" id={"couponType-" + i}
                                               checked={m.check}
                                               onClick={() => {
                                                   let newRadios = _.clone(this.props.radios);
                                                   newRadios.map((item) => {
                                                       item.check = item.source_code == m.source_code;
                                                   });
                                                   this.props.setRootState({
                                                       source_code: m.source_code,
                                                   })
                                               }}/>
                                        <label htmlFor={"couponType-" + i}>{m.name}</label>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="huit-icon iconfont dropdown-button"
                             data-activates="tip-typedesc"
                             data-constrainwidth="false"
                             data-hover="true"
                        >&#xe66f;</div>
                        <ul id="tip-typedesc" className="dropdown-content width-auto">
                            <div style={{
                                padding: '6px 10px'
                            }}>
                                <div> 通用码只在数量上受约束，所有目标受众获得的全码都完全一样</div>
                                <div> 平台生成码将依据优惠码平台提供的自定义规则，让您能按需直接生成优惠码</div>
                                <div>自有码上传是优惠码平台可以接收您上传的自有优惠码，经过处理后可以直接使用</div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 next " + nextButtonClass}
                             onClick={() => {
                                 if (nextButtonClass == 'disable')return;
                                 this.props.changeStep('next');
                             }}
                        >下一步
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//第2步-基础部分
class StepTwo extends React.Component {
    render() {
        let conComponent = '';
        switch (this.props.stateData.source_code) {
            case 'common':
                conComponent = <StepTwocommon
                    stateData={this.props.stateData}
                    changeStep={this.props.changeStep}
                    setRootState={this.props.setRootState}
                />;
                break;
            case 'generate':
                conComponent = <StepTwogenerate
                    stateData={this.props.stateData}
                    changeStep={this.props.changeStep}
                    setRootState={this.props.setRootState}
                />;
                break;
            case 'own':
                conComponent = <StepTwoown
                    stateData={this.props.stateData}
                    changeStep={this.props.changeStep}
                    setRootState={this.props.setRootState}
                />;
                break;
        }
        return (
            <div className="play-two">
                <div className="h1">规则配置</div>
                <div className="rule-explain">
                    <div className="h2">规则说明</div>
                    <div className="point-out-area">
                        <div className="point-out-box">
                            <div className="point-out-title">
                                <div className="icon iconfont">&#xe63a;</div>
                            </div>
                            <div className="point-out-content">
                                1、通用优惠券适用与目标受众对一人一码情况没有约束的场景<br/>
                                2、请您预估好目标投放量，在您投放中遇到券码库存紧张情况可进行追加<br/>
                                3、优惠券中心的所有码您可以直接接入到短信、微信卡券等渠道中进行使用<br/>
                                4、如果您自行进行投放，建议您避免同一批次的优惠代码重复使用，避免核销冲突
                            </div>
                        </div>
                    </div>
                </div>
                {conComponent}
            </div>
        )
    }
}
//第2步-通用码
class StepTwocommon extends React.Component {
    render() {
        let nextButtonClass = (this.props.stateData.rulecommon.coupon_code && this.props.stateData.stock_total) ? '' : 'disable';
        return (
            <div className="rule-body">
                <div className="common">
                    <div className="line name">
                        <div className="line-title"><span className="redstar">&#42;</span>券码名称</div>
                        <div className="line-cont">
                            <div className="input-box">
                                <input type="text" className="input"
                                       maxLength="20"
                                       value={this.props.stateData.rulecommon.coupon_code}
                                       placeholder="优惠码内容为最终用户收到的数字、字母或组合的串码"
                                       onChange={(e) => {
                                           let val = $.trim(e.target.value) || '';
                                           let reg = /^[0-9a-zA-Z]*$/;
                                           if (!reg.test(val))return;
                                           this.props.setRootState({
                                               rulecommon: {
                                                   coupon_code: val
                                               }
                                           });
                                       }}/>
                            </div>
                            <div className="huit-icon iconfont dropdown-button"
                                 data-activates="tip-typedesc"
                                 data-constrainwidth="false"
                                 data-hover="true"
                            >&#xe66f;</div>
                            <ul id="tip-typedesc" className="dropdown-content width-auto">
                                <div style={{
                                    padding: '6px 10px'
                                }}>
                                    <div>示例</div>
                                    <div>【48294】、【URXMG】、【U73GK6D】</div>
                                </div>
                            </ul>
                            <div className="hint">券码名称</div>
                        </div>
                    </div>
                    <div className="line amount">
                        <div className="line-title"><span className="redstar">&#42;</span>券码数量</div>
                        <div className="line-cont">
                            <div className="input-box">
                                <input type="text" className="input"
                                       placeholder="请填写投放预期优惠码数量"
                                       value={this.props.stateData.stock_total}
                                       onChange={(e) => {
                                           let val = $.trim(e.target.value) || '';
                                           let reg = /^[0-9]*$/;
                                           if (!reg.test(val))return;
                                           if(parseInt(val)<=0)return;
                                           if (val > 1000000)return;
                                           this.props.setRootState({
                                               stock_total: val
                                           });
                                       }}/>
                            </div>
                            <div className="hint"> 券码数量</div>
                        </div>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 save " + nextButtonClass}
                             onClick={() => {
                                 if (nextButtonClass == 'disable')return;
                                 this.props.changeStep('next');
                             }}>下一步
                        </div>
                        <div className="button-assist-1 back" onClick={() => {
                            this.props.changeStep('prev');
                        }}>上一步
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//第2步-平台生成码
class StepTwogenerate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            outcomeNum: 0
        };
    }

    isChecked(type_code) {
        this.props.setRootState({
            rulegenerate: Object.assign(this.props.stateData.rulegenerate, {
                type_code: type_code
            })
        });
        this.getMaxCount(type_code, this.props.stateData.rulegenerate.length);
    }


    componentDidMount() {
        this.setState({
            outcomeNum: 1
        });
    }

    componentDidUpdate() {
        $('.dropdown-button').dropdown();
    }

    //根据规则类型和长度获取最大值
    getMaxCount(type_code, length) {
        let that = this;
        let stateData = this.props.stateData;
        util.api({
            data: {
                method: "mkt.material.coupon.max.count",
                type_code: stateData.rulegenerate.type_code,
                length: stateData.rulegenerate.length
            },
            success: function (res) {
                that.props.setRootState({
                    rulegenerate: Object.assign(stateData.rulegenerate, {
                        max_count: res.data[0].max_count
                    })
                });
            }
        });
    }

    render() {
        let that = this;
        let stateData = this.props.stateData;
        let nextButtonClass = (stateData.stock_total) ? '' : 'disable';
        return (
            <div className="rule-body">
                <div className="autogeny">
                    <div className="line rule-div">
                        <div className="line-title"><span className="redstar">&#42;</span>规则一</div>
                        <div className="line-cont">
                            <div className="radio-area">
                                <div className="radio-box">
                                    <input className="type1" name="playTwoRule" type="radio" id="playTwoRule1"
                                           checked={stateData.rulegenerate.type_code == 'alpha' ? true : false}
                                           onClick={this.isChecked.bind(this, 'alpha')}/>
                                    <label htmlFor="playTwoRule1">字母组合</label>
                                </div>
                                <div className="radio-box">
                                    <input className="type1" name="playTwoRule" type="radio" id="playTwoRule2"
                                           checked={stateData.rulegenerate.type_code == 'number' ? true : false}
                                           onClick={this.isChecked.bind(this, 'number')}/>
                                    <label htmlFor="playTwoRule2">数字组合</label>
                                </div>
                                <div className="radio-box">
                                    <input className="type1" name="playTwoRule" type="radio" id="playTwoRule3"
                                           checked={stateData.rulegenerate.type_code == 'mixed' ? true : false}
                                           onClick={this.isChecked.bind(this, 'mixed')}/>
                                    <label htmlFor="playTwoRule3">数字字母混合</label>
                                </div>
                            </div>
                            <div className="huit-icon iconfont dropdown-button"
                                 data-activates="tip-typedesc"
                                 data-constrainwidth="false"
                                 data-hover="true"
                            >&#xe66f;</div>
                            <ul id="tip-typedesc" className="dropdown-content width-auto">
                                <div style={{
                                    padding: '6px 10px'
                                }}>
                                    <div>示例</div>
                                    <div>【48294】、【URXMG】、【U73GK6D】</div>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className="line num-size">
                        <div className="line-title"><span className="redstar">&#42;</span>规则二</div>
                        <div className="line-cont">
                            <div className="selectbtn dropdown-button"
                                 data-beloworigin="true"
                                 data-constrainwidth="true"
                                 data-activates="num-size">{stateData.rulegenerate.length}</div>
                            <div id="num-size" className="dropdown-content">
                                <ul className="select-ul">
                                    {_.range(5, 21).map((m, i) => {
                                        return (
                                            <li onClick={() => {
                                                this.props.setRootState({
                                                    rulegenerate: Object.assign(stateData.rulegenerate, {
                                                        length: m
                                                    })
                                                });
                                                this.getMaxCount(stateData.rulegenerate.type_code, m)
                                            }}>{m}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="line outcome">
                        <div className="line-title">可生成卷码量</div>
                        <div className="line-cont">
                            <div className="icon ishengcconfont">&#xe63a;</div>
                            当前类型还可生成&nbsp;{_.str.numberFormat(stateData.rulegenerate.max_count)}&nbsp;个券码
                        </div>
                    </div>
                    <div className="line amount">
                        <div className="line-title"><span className="redstar">&#42;</span>券码数量</div>
                        <div className="line-cont">
                            <div className="input-box">
                                <input type="text" id="coupon-num" className="input"
                                       placeholder="请填写投放预期优惠码数量"
                                       value={this.props.stateData.stock_total}
                                       onChange={(e) => {
                                           let val = $.trim(e.target.value) || '';
                                           let reg = /^[0-9]*$/;
                                           if (val > 1000000)return;
                                           if(parseInt(val)<=0)return;
                                           if (!reg.test(val))return;
                                           this.props.setRootState({
                                               stock_total: val
                                           });
                                       }}/>
                            </div>
                            <div className="hint"></div>
                        </div>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 save " + nextButtonClass}
                             onClick={() => {
                                 if (nextButtonClass == 'disable')return;
                                 this.props.changeStep('next');
                             }}>下一步
                        </div>
                        <div className="button-assist-1 back" onClick={() => {
                            this.props.changeStep('prev');
                        }}>上一步
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//第2步-自有码上传
class StepTwoown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileUploadMsg: '',
            totalcount: this.props.stateData.stock_total //用来记录上传的文件内容的记录总条数
            // totalcount: 0 //每次重新计数不依赖之前的总数
        }
    }

    //获取上传文件的接口地址
    getUploadUrlPath() {
        let that = this;
        let result = '';
        util.api({
            data: {
                method: "mkt.materiel.coupon.file.upload.get",
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
                    let record_count = res.data[0].record_count;
                    let newRuleown = that.props.stateData.ruleown;
                    let file_name = res.data[0].file_name;
                    that.setState({
                        totalcount: Number(that.state.totalcount) + record_count
                    });
                    newRuleown.push({
                        file_name: file_name,
                        record_count: record_count
                    });

                    that.props.setRootState({
                        ruleown: newRuleown,
                        stock_total: that.state.totalcount
                    });
                    $('.upload-box').hide();
                    $('.file-upload-success').show();
                } else {
                    $('.upload-box').hide();
                    $('.file-upload-fail').show();
                }
            }
        });
    }

    //删除文件列表
    fileDelete(file_name, record_count) {
        let newRuleown = this.props.stateData.ruleown;
        newRuleown.map((m, i) => {
            if (m.file_name == file_name) newRuleown.splice(i, 1)
        });
        let totalcount = this.state.totalcount - record_count;
        this.setState({
            totalcount: totalcount
        });
        this.props.setRootState({
            ruleown: newRuleown,
            stock_total: totalcount
        });
    }

    //取消上传的文件
    cancelFileUpload() {

    }

    //触发文件上传表单点击事件
    uploadFileInput() {
        $('#upload-file').trigger('click')
    }

    render() {
        let that = this;
        let stateData = this.props.stateData;
        let nextButtonClass = (stateData.ruleown.length > 0) ? '' : 'disable';
        return (
            <div className="rule-body">
                <div className="own">
                    <div className="line caption">
                        <div className="line-cont">
                            <div className="title">第一步&nbsp;选择文件上传</div>
                            <div className="download"><a className="a" href="/download/coupon_batch_list.xlsx">下载模板</a>
                            </div>
                        </div>
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
                    <div className="line caption">
                        <div className="line-cont">
                            <div className="title">第二步&nbsp;核对上传数据</div>
                            <div className="huit-icon iconfont dropdown-button"
                                 data-activates="tip-typedesc"
                                 data-constrainwidth="false"
                                 data-hover="true"
                            >&#xe66f;</div>
                            <ul id="tip-typedesc" className="dropdown-content width-auto">
                                <div style={{
                                    padding: '6px 10px'
                                }}>
                                    <div>记录数量是文件中的实际记录数，在保存之后后台会对所有文件中的记录进行排重处理，所以最终数量有可能会小于当前显示数量</div>

                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className="line files-list">
                        <div className="line-cont">
                            {stateData.ruleown.map((m, i) => {
                                return (
                                    <div className="lists">
                                        <div className="files">{m.file_name.slice(m.file_name.indexOf('/') + 1)}</div>
                                        <div className="detail">
                                            <div className="num">记录数量 {m.record_count} 条</div>
                                            <div className="delete"
                                                 onClick={this.fileDelete.bind(this, m.file_name, m.record_count)}>
                                                删除
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 save " + nextButtonClass}
                             onClick={() => {
                                 if (nextButtonClass == 'disable')return;
                                 this.props.changeStep('next');
                             }}>下一步
                        </div>
                        <div className="button-assist-1 back" onClick={() => {
                            this.props.changeStep('prev');
                        }}>上一步
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//第3步
class StepThree extends React.Component {
    componentDidMount() {
        this.setPickdate();
    }

    componentDidUpdate() {
        this.setPickdate();
    }

    setPickdate() {
        let that = this;
        let startTime = util.formatDate(that.props.start_time, 3);
        let nowTime = util.formatDate(that.props.stateData.start_time/1000, 3);
        let compareStart,compareEnd;
        $('#start-time').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 5,
            min: nowTime,
            clear: '',
            onClose: function (data) {
                let thisDate,timestamp;
                thisDate = this.get('value') + ' 0:0:0';
                timestamp = new Date(thisDate).getTime();
                compareStart = util.toDate(this.get('value'));
                compareEnd = util.toDate($('#end-time').val());
                if(compareEnd < compareStart){
                    that.props.setRootState({
                        start_time: timestamp,
                        end_time: timestamp
                    });
                }else{
                    that.props.setRootState({
                        start_time: timestamp
                    });
                }
                startTime = thisDate;
            }
        });
        $('#end-time').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 5,
            clear: '',
            onOpen: function () {
                this.set({
                    min: startTime
                });
            },
            onClose: function (data) {
                let thisDate = this.get('value') + ' 0:0:0';//0点开始
                let timestamp = new Date(thisDate).getTime();
                that.props.setRootState({
                    end_time: timestamp
                })
            }
        });
    }

    render() {
        let nextButtonClass = this.props.stateData.amount ? '' : 'disable';

        return (
            <div className="play-three">
                <div className="line value">
                    <div className="line-title"><span className="redstar">&#42;</span>券码价值</div>
                    <div className="line-cont">
                        <div className="input-box">
                            <input type="text" className="input"
                                   placeholder="请填写优惠券折扣金额"
                                   value={this.props.stateData.amount}
                                   onChange={(e) => {
                                       let val = $.trim(e.target.value) || '';
                                       let reg = /^[0-9]*$/;
                                       if (!reg.test(val))return;
                                       if (val > 10000)return;
                                       this.props.setRootState({
                                           amount: val
                                       });
                                   }}/>
                        </div>
                        <div className="hint">卷码价值</div>
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
                                <input id="start-time" className="input" type="text" readOnly
                                       value={util.formatDate(this.props.stateData.start_time / 1000, 3)}
                                       placeholder="起始时间"/>
                                <div className="icon iconfont">&#xe6ae;</div>
                            </div>
                            <div className="zhi">至</div>
                            <div className="period">
                                <input id="end-time" className="input" type="text" readOnly
                                       value={util.formatDate(this.props.stateData.end_time / 1000, 3)}
                                       placeholder="结束时间"
                                />
                                <div className="icon iconfont">&#xe6ae;</div>
                            </div>
                        </div>
                        <div className="hint"></div>
                    </div>
                </div>
                <div className="line button">
                    <div className="line-cont">
                        <div className={"button-main-1 save " + nextButtonClass} onClick={(e) => {
                            if (nextButtonClass == 'disable')return;
                            this.props.submit();
                        }}>保存
                        </div>
                        <div className="button-assist-1 back" onClick={() => {
                            this.props.changeStep('prev');
                        }}>上一步
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//根
class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            title: "",//优惠券名称
            source_code: "common",//类型
            radios: [
                {
                    name: '通用码',
                    source_code: 'common',
                    check: true
                },
                {
                    name: '平台生成码',
                    source_code: 'generate',
                    check: false
                },
                {
                    name: '自有码',
                    source_code: 'own',
                    check: false
                }
            ],
            id: '',
            amount: '',//价值

            rulecommon: {//通用规则
                coupon_code: '',//券码名称
            },

            rulegenerate: {//平台规则
                type_code: 'alpha',//组合类型，分为三种情况：alpha-字母，number-数字, mixed-混合
                length: 6, //长度
                max_count: 0
            },
            ruleown: [
                // {
                //     file_name: "1.xls",
                //     record_count: 0
                // },
                // {
                //     file_name: "2.xls",
                //     record_count: 0
                // }
            ],//自有码上传规则
            stock_total: '',//优惠码数量
            channel_code: "sms",//渠道
            start_time: '',
            end_time: ''
        };
    }

    componentDidMount() {
        let setStateData = window.localStorage.getItem('coupon_create_data');
        // this.setRootState($.parseJSON(setStateData));//把本地存储的数据取出来
        //默认的开始和结束时间为当天
        util.getSeverTime(time => {
            this.setRootState({
                start_time: time,
                end_time: time,
            })
        });

        let id = util.getLocationParams() && util.getLocationParams().id;
        id && this.fetchEditData(id);//如果有ID就是修改优惠券

    }

    componentDidUpdate() {
        $('.dropdown-button').dropdown();
        // window.localStorage.setItem('coupon_create_data', JSON.stringify(this.state));//每次更新数据后都保存到本地存储
    }

    //变更步骤
    changeStep(direction) {
        let curStep = this.state.step;
        if (direction == 'prev') {
            this.setState({
                step: curStep - 1
            })
        } else if (direction == 'next') {
            this.setState({
                step: curStep + 1
            })
        }
    }

    setRootState(data) {

        this.setState(data);
    }

    //获取编辑数据
    fetchEditData(id) {
        let that = this;
        util.api({
            data: {
                method: 'mkt.material.coupon.editdetail',
                id: id
            },
            success: function (response) {
                let data = response.data[0];
                let newRadios = _.clone(that.state.radios);
                newRadios.map((item) => {
                    item.check = item.source_code == data.source_code;
                });
                if (data.source_code == 'own') data.stock_total = 0;
                that.setRootState({
                    step: 1,
                    id: id,
                    title: data.title,
                    source_code: data.source_code,
                    [data.source_code + 'Data']: data,
                    radios: newRadios,
                    ['rule' + data.source_code]: data.rule,
                    stock_total: data.stock_total,
                    amount: data.amount,
                    channel_code: data.channel_code,
                    start_time: data.start_time,
                    end_time: data.end_time
                });

            }
        });
    }

    submit() {
        let that = this;
        let stateData = this.state;
        util.api({
            url: "?method=mkt.materiel.coupon.save",
            type: 'post',
            data: {
                id: stateData.id,
                title: stateData.title,
                source_code: stateData.source_code,
                rule: JSON.stringify(stateData['rule' + stateData.source_code]),
                stock_total: stateData.stock_total,
                amount: stateData.amount,
                channel_code: stateData.channel_code,
                start_time: stateData.start_time,
                end_time: stateData.end_time
            },
            success: function (res) {
                if (res.code == 0) {
                    window.location.href = '/html/coupon/list.html';
                } else {
                    new Modals.Alert({
                        title: '保存失败',
                        content: res.code + ':' + res.msg
                    })
                }
            }
        });

    }

    render() {
        let step = this.state.step;
        let conComponent = '';
        switch (step) {
            case 1:
                conComponent = <StepOne
                    title={this.state.title}
                    source_code={this.state.source_code}
                    radios={this.state.radios}
                    changeStep={this.changeStep.bind(this)}
                    setRootState={this.setRootState.bind(this)}
                />;
                break;
            case 2:
                conComponent = <StepTwo
                    stateData={this.state}
                    changeStep={this.changeStep.bind(this)}
                    setRootState={this.setRootState.bind(this)}
                />;
                break;
            case 3:
                conComponent = <StepThree
                    stateData={this.state}
                    changeStep={this.changeStep.bind(this)}
                    setRootState={this.setRootState.bind(this)}
                    submit={this.submit.bind(this)}

                />;
                break;
        }
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
                                {_.range(3).map((m, i) => {
                                    let actClass = this.state.step == i + 1 ? 'act' : '';
                                    return <div className={"step " + actClass}>{i + 1}</div>;
                                })}
                            </div>
                            <div className="step-bt">
                                <div className="one">优惠券定义</div>
                                <div className="two">优惠券规则</div>
                                <div className="three">接入配置</div>
                            </div>
                        </div>
                        <div className="cont">{conComponent}</div>
                    </div>
                </div>
            </div>
        )
    }
}

const root = ReactDOM.render(
    <Root />,
    document.getElementById('page-body')
);
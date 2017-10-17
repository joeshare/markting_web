/**
 * Created by richard on 2016-9-5.
 * 修改密码
 */
'use strict';//严格模式
import 'plugins/jquery.md5';//$.md5('yourstr')

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errMsg: '',//错误信息
            oldPass: '',
            newPass: '',
            validCode: '',
            conPass: '',
            passRank: '0'//密码强度
        };
        this.checkLogin();
        util.refreshAuth();
    }

    //检查是否已经登录
    checkLogin() {
        util.api({
            surl: window.NODE_PATH + "?method=mkt.user.access",
            success: function (responseData) {
                if (responseData.code > 3000 && responseData.code < 3005) {
                    window.location.href = "/html/signin/login.html";
                    return;
                }
            }
        });
    }
    clearLocalStorage(){
        localStorage.setItem('user_token', "");
        localStorage.setItem('showWelcomTip', 0);
    }
    //异常退出登录
    logOut() {
        this.clearLocalStorage();
        window.location.href = '/html/signin/login.html';
        //不用再登录
        //util.api({
        //    surl: window.NODE_PATH + "?method=mkt.user.login",
        //    type: 'post',
        //    success: function (res) {
        //        localStorage.setItem('user_token', "");
        //        localStorage.setItem('showWelcomTip', 0);
        //        window.location.href = '/html/signin/success.html';
        //    }
        //});
    }
    //成功
    successPage(){
        this.clearLocalStorage();
        window.location.href = '/html/signin/success.html';
    }

    submit() {
        let that = this;
        if (this.state.newPass != this.state.conPass) {
            this.setState({
                errMsg: '确认密码和新密码不一致'
            });
        } else {
            util.api({
                surl: window.NODE_PATH + "?method=mkt.user.resetpwd",
                type: 'post',
                data: {
                    'old_password': $.md5(this.state.oldPass),
                    'vcode': this.state.validCode,
                    'password': $.md5(this.state.newPass)
                },
                success: function (res) {
                    if (res.code === 0) {
                        that.successPage();
                        // window.location.href = '/html/signin/success.html';
                    } if(res.code==="E9041"||res.msg ==="认证code不合法"){//{"code":"E9041","data":[],"msg":"认证code不合法"}
                        that.logOut();
                    }else {
                        that.setState({
                            errMsg: res.msg
                        })

                    }
                }
            });
        }

    }


    changeoldPass(e) {
        let val = $.trim(e.target.value) || '';
        this.setState({
            oldPass: val
        });

    }

    changenewPass(e) {
        let val = $.trim(e.target.value) || '';
        if (util.sv.hasZh(val)) {
            return
        }

        let rank = util.sv.checkKeyboardCharacterRank(val);
        this.setState({
            newPass: val,
            passRank: rank
        });
    }

    changeconPass(e) {
        let val = $.trim(e.target.value) || '';
        if (util.sv.hasZh(val)) {
            return
        }
        this.setState({
            conPass: val
        });
    }

    changeValidCode(e) {
        let val = $.trim(e.target.value) || '';
        this.setState({
            validCode: val
        });
    }

    refreshValidCode() {
        $('.validcode-img').attr('src', window.VCODE_IMG + "?" + new Date().getTime())
    }

    render() {
        let passRank = this.state.passRank;
        let showErrClass = this.state.errMsg ? '' : 'fn-hide';
        let tipStr = (
            <div className="tip-wrap">
                <span className=''>弱</span>
                <span className=''>中</span>
                <span className=''>强</span>
            </div>
        );
        switch (passRank) {
            case 1:
                tipStr = (
                    <div className="tip-wrap">
                        <span className='on s'>弱</span>
                        <span className=''>中</span>
                        <span className=''>强</span>
                    </div>
                );
                break;
            case 2:
                tipStr = (
                    <div className="tip-wrap">
                        <span className='on s'>弱</span>
                        <span className='on m'>中</span>
                        <span className=''>强</span>
                    </div>
                );
                break;
            case 3:
                tipStr = (
                    <div className="tip-wrap">
                        <span className='on s'>弱</span>
                        <span className='on m'>中</span>
                        <span className='on w'>强</span>
                    </div>
                );
                break;
        }
        return (
            <div>
                <div id="header" className="clearfix">
                    <div className="left">
                        <span className="left company-logo"/>
                    </div>
                </div>
                <div id="page-con">
                    <div className="page-body-header">
                        <div className="text-box">修改密码</div>
                        <div className="button-box">
                            <a className="a keyong" id="goIndex" href="/" title="返回首页">
                                <span className="icon iconfont">&#xe657;</span>
                                <span className="text">返回首页</span>
                            </a>
                        </div>
                    </div>
                    <div className="page-body-con">
                        <div className="message-box form-wrap">
                            <div className="row form-tit">{USER_ID}，请修改密码。</div>
                            <div className="row">
                                <div className="form-l"><span className="font-star">*</span>旧密码</div>
                                <div className="form-r">
                                    <input type="password" maxLength="16" value={this.state.oldPass}
                                           onChange={this.changeoldPass.bind(this)}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-l"><span className="font-star">*</span>新密码</div>
                                <div className="form-r">
                                    <input type="password" maxLength="16" value={this.state.newPass}
                                           onChange={this.changenewPass.bind(this)}/>
                                </div>
                            </div>
                            <div className="row">
                                {tipStr}
                            </div>
                            <div className="row">
                                <div className="form-l"><span className="font-star">*</span>确认新密码</div>
                                <div className="form-r">
                                    <input type="password" maxLength="16" value={this.state.conPass}
                                           onChange={this.changeconPass.bind(this)}/>
                                </div>
                            </div>
                            <div className="row fn-hide">
                                <div className="form-l"><span className="font-star">*</span>验证码</div>
                                <div className="form-r">
                                    <div className="left validcode-filed"><input type="text" className=""
                                                                                 value={this.state.validCode}
                                                                                 onChange={this.changeValidCode.bind(this)}
                                    /></div>
                                    <div className="left validcode-wrap"><img
                                        src={window.VCODE_IMG}
                                        className="validcode-img"/></div>
                                    <div className="right validcode-refresh">
                                <span className="icon iconfont"
                                      onClick={this.refreshValidCode.bind(this)}>&#xe658;</span>
                                    </div>
                                </div>
                            </div>
                            <div className={"err-msg "+showErrClass}>
                                <ico className="icon iconfont ">&#xe60a;</ico>
                                {this.state.errMsg}</div>
                            <div className="row">
                                <div className="button-main-1" onClick={this.submit.bind(this)}>完成修改</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="footer">大连瑞雪科技有限公司</div>
            </div>
        )
    }
}

//渲染
const changePassword = ReactDOM.render(
    <ChangePassword />,
    document.getElementById('container')
);

export default ChangePassword;
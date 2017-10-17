/**
 * Created by richard on 2016-9-5.
 * 登录
 */
'use strict';//严格模式
import 'plugins/jquery.md5';//$.md5('yourstr')

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',//用户名
            errCount: 0,//错误次数
            passWord: '',//密码
            validCode: '',//验证码
            showErr: false,//显示错误
            showUserNameClear: false,//显示清理用户名
            showPassWordClear: false//显示清理
        }
    }

    submit() {
        let that = this;
        var pwd = that.state.passWord||that.$el.find('#passWord').val();
        var user_id=this.state.userName|| that.$el.find('#userName').val();
        console.log("surl",window.NODE_PATH+"?method=mkt.user.login")
        util.api({
            surl: window.NODE_PATH+"?method=mkt.user.login",
            type: 'post',
            data: {
                'user_id': user_id,
                'vcode': this.state.validCode,
                'password': $.md5(pwd)
            },
            success: function (res) {
                if (res.code === 0) {
                    var rec = (res.data && res.data.length) ? res.data[0] : {};
                    localStorage.setItem('user_token', rec.user_token || 1);
                    localStorage.setItem('comp_id', (rec.user_info && rec.user_info.comp_id) ? rec.user_info.comp_id : "");
                    localStorage.setItem('comp_name', (rec.user_info && rec.user_info.comp_name) ? rec.user_info.comp_name : '');
                    localStorage.setItem('user_id', user_id);
                    localStorage.setItem('showWelcomTip', 0);
                    localStorage.setItem('auth_code',  rec.auth_code );
                    window.location.href = "/";

                } else {
                    that.setState({
                        showErr: true,
                        errCount: that.state.errCount + 1
                    })
                }
            }
        });
    }

    clearUserName() {
        this.setState({
            userName: '',
            showUserNameClear: false
        });
    }

    clearPassWord() {
        this.setState({
            passWord: '',
            showPassWordClear: false
        });
    }

    changeUserName(e) {
        let val = $.trim(e.target.value) || '';
        this.setState({
            userName: val,
            showUserNameClear: val ? true : false
        });

    }

    changePassWord(e) {
        let val = $.trim(e.target.value) || '';
        this.setState({
            passWord: val,
            showPassWordClear: val ? true : false
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
        // $('.validcode-img').attr('src', 'http://mktdevsrv.rc.dataengine.com/api?method=mkt.login.vcode')
    }

    enterEvent(e) {
        if (e.keyCode == 13) {
            this.submit();
        }
    }
    componentDidMount() {
        this.$el = $(React.findDOMNode(this));
    }
    render() {
        let showErrClass = this.state.showErr ? '' : 'fn-hide';
        let showUserNameClear = this.state.showUserNameClear ? '' : 'fn-hide';
        let showPassWordClear = this.state.showPassWordClear ? '' : 'fn-hide';
        // let showValidCode = this.state.errCount > 3 ? '' : 'fn-hide';
        let showValidCode = 'fn-hide';
        return (
            <div>
                <div className="header">
                    <div className="menuwrap clearfix">
                        <div className="logowrap left"></div>
                        <div className="title left">营销云</div>
                    </div>
                </div>
                <div className="con">
                    <div className="formwrap">
                        <div className="input-block">
                            <ico className="icon iconfont user">&#xe64e;</ico>
                            <ico className={"icon iconfont cleartext "+showUserNameClear}
                                 onClick={this.clearUserName.bind(this)}>&#xe60a;
                            </ico>
                            <input id="userName" type="text" className=""
                                   placeholder="请输入您的用户名" value={this.state.userName}
                                   onChange={this.changeUserName.bind(this)}
                            />
                        </div>
                        <div className="input-block">
                            <ico className="icon iconfont password">&#xe64b;</ico>
                            <ico className={"icon iconfont cleartext "+showPassWordClear}
                                 onClick={this.clearPassWord.bind(this)}>&#xe60a;
                            </ico>
                            <input id="passWord" type="password" className=""
                                   placeholder="请输入您的密码"
                                   value={this.state.passWord}
                                   onChange={this.changePassWord.bind(this)}
                                   onKeyUp={this.enterEvent.bind(this)}
                            />
                            <div className={"errtip "+showErrClass}>
                                <div className="txt left">用户名或密码错误！</div>
                                <ico className="icon iconfont right">&#xe60a;</ico>
                            </div>
                        </div>
                        <div className={"input-block clearfix "+showValidCode}>
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
                        <a href="javascript:void(0);" id="submit" name="submit" className="btn submit" onClick={this.submit.bind(this)}>登录</a>
                    </div>
                </div>
            </div>
        )
    }
}
//渲染
const login = ReactDOM.render(
    <Login />,
    document.getElementById('login')
);

export default Login;
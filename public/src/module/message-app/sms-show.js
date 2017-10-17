/**
 * Created by AnThen on 2016/11/15.
 * 短信展示
 */
class SmsShow extends React.Component{
    render() {
        return (
            <div className="iphone-box">
                {this.props.msg.map((m,i)=> {
                    return (
                        <div className="msg-box">
                            <div className="msg-up"></div>
                            <div className="msg-con">{m}</div>
                            <div className="msg-down"></div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
module.exports = SmsShow;
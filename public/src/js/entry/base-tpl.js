/**
 * Created by richard on 2016-10-12.
 * 标题
 */
'use strict';
import Layout from 'module/layout/layout';

const layout = new Layout({
    index: 2,
    leftMenuCurName: '标题'
});


class MessagePlatform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        let datainfo = this.state.datainfo;
        return (
            <div className="message-platform">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">短信渠道平台</span>
                    </div>
                    <div className="button-box icon iconfont"></div>
                </header>
                <div className="content">
                    aa
                </div>
            </div>
        )
    }
}


//渲染
const messagePlatform = ReactDOM.render(
    <MessagePlatform />,
    document.getElementById('page-body')
);


module.exports = MessagePlatform;
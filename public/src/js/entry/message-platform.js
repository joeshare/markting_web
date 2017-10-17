/**
 * Created by richard on 2016-10-12.
 * 短信渠道平台
 */
'use strict';
import Layout from 'module/layout/layout';

const layout = new Layout({
    index: 2,
    leftMenuCurName: '短信应用'
});


class MessagePlatform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
      
        return (
            <div className="message-platform">
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">短信渠道平台</span>
                    </div>
                    <div className="button-box icon iconfont"></div>
                </header>
                <div className="content">
                    <div className="status-infobox">

                    </div>
                    <div className="apps-infobox">
                        <div className="l">
                            <div className="title">
                                短信应用
                            </div>
                            <ul className="con">
                                <li>

                                </li>
                                <li>

                                </li>
                            </ul>
                        </div>
                        <div className="r">
                            <div className="title">快捷链接</div>
                            <div className="con">
                                <div>欢迎您，xx</div>
                                <div><a href="#">任务统计中心</a></div>
                            </div>
                        </div>
                    </div>
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
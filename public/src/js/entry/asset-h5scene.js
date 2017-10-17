/**
 * Created by richard on 2016-10-24.
 */
import Layout from 'module/layout/layout';
const layout = new Layout({
    index: 2,
    leftMenuCurName: 'H5场景'
});

class H5Scene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth_code: ''
        }

    }

    fetch() {
        let that = this;
        util.api({
            surl: 'http://scene.dataengine.com/login.php',
            success: function (response) {
                if (response.success) {
                    that.setState({
                        auth_code: response.auth_code
                    })

                }

            }
        });
    }

    componentDidMount() {
        // this.fetch();

    }

    render() {
        // let iframeUrl = 'http://scene.dataengine.com/index/sso_login?auth_code=' + window.AUTH_CODE;//dev环境
        let iframeUrl = 'http://101.201.75.158/index/sso_login?auth_code=' + window.AUTH_CODE;//test环境
        if (window.AUTH_CODE) {
            return (
                <div className="h5scene">
                    <iframe id="iframe" name="h5-iframe" width="100%" height="100%" frameborder="0" scrolling="auto"
                            marginheight="0" marginwidth="0" src={iframeUrl}></iframe>

                </div>
            )
        } else {
            return (
                <div className="h5scene"></div>
            )
        }

    }
}
//渲染
const h5Scene = ReactDOM.render(
    <H5Scene />,
    document.getElementById('page-body')
);


module.exports = H5Scene;
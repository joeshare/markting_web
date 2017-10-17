/*
 * @Author: UEC
 * @Date:   2016-08-10 17:22:13
 * @Last Modified by:   UEC
 * @Last Modified time: 2016-09-01 15:59:54
 */

'use strict';
class panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.$el = $(React.findDOMNode(this));
        this.setState(this.props.data);

    }

    showIndata() {
        this.props.queryMainKey()
    }

//下载主数据
    downLoadMaindata() {
        util.api({
            data: {
                method: "mkt.contacts.commit.dataparty.download",
                contact_id: this.props.current_contact_id
            },
            success: function (res) {
                if (!res.code && res.data) {
                    location.href = FILE_PATH + res.data[0].download_url;
                }
            }
        });
    }

    render() {
        console.info(this.props.data)
        if (this.props.data.md_count == 0) {
            $('.maindata-btn').hide();
        }
        if (this.props.data.nonmd_count == 0) {
            $('.improtdata-btn').hide();
        }
        return (
            <div className="listCard">
                <div className="lc_d1 con">
                    <span>提交数据</span>
                    <div>
                        <span>{this.props.data.commit_count}</span>
                        <img src="../../../img/linkmanForm/b1.png"/>
                    </div>
                </div>
                <div className="lc_d2  con">
                    <span>今日提交数据</span>
                    <div>
                        <span>{this.props.data.today_count}</span>
                        <img src="../../../img/linkmanForm/b2.png"/>
                    </div>
                </div>
                <div className="lc_d3  con"><span>浏览数据</span>
                    <div>
                        <span>{this.props.data.page_views}</span>
                        <img src="../../../img/linkmanForm/b3.png"/>
                    </div>
                </div>
                <div className="lc_d4  con"><span>产生主数据</span>
                    <div>
                        <span>{this.props.data.md_count}</span>
                        <img src="../../../img/linkmanForm/b4.png"/>
                    </div>
                    <div onClick={this.downLoadMaindata.bind(this)} className="drAmin maindata-btn">
                        <span>下载</span>
                    </div>
                </div>
                <div className="lc_d5  con"><span>未导入主数据</span>
                    <div>
                        <span>{this.props.data.nonmd_count}</span>
                        <img src="../../../img/linkmanForm/b5.png"/>
                    </div>
                    <div onClick={this.showIndata.bind(this)} className="drAmin improtdata-btn">
                        <span>导入数据</span>
                    </div>
                </div>
            </div>
        )

    }
}
module.exports = panel;
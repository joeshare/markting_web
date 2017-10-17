/*
* @Author: UEC
* @Date:   2016-08-10 16:46:20
* @Last Modified by:   UEC
* @Last Modified time: 2016-08-29 18:28:29
*/

'use strict';
let API={
    downLoadbackInfo:'?method=mkt.contacts.commit.download'
};
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = { };
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
        var params = util.getLocationParams();
        if (params!=null) {
            if (params.returnurl!='') {
                $('.backPage').show();
            }else{
                $('.backPage').hide();
            }
        }
    }
    downBackInfo(){
        var params = util.getLocationParams();
        util.api({
            url: API.downLoadbackInfo,
            type: 'get',
            data: {
                contact_id: params.contact_id,
                commit_time:3
            },
            success: function(res) {
                if(!res.code&&res.data){
                    location.href=FILE_PATH+res.data[0].download_url;
                }
            },
            error: function(err) {

            }
        })
    }
    backPage(){
        var params = util.getLocationParams();
        if (params!=null) {
            location.href=BASE_PATH+"/"+params.returnurl;
        }
    }
    render(){
        return (
            <div className="lm_header">
                <span className="head_icon">表单信息反馈情况&nbsp;&nbsp;{this.props.data.contact_name}</span>
                <span className="head_icon"><i title="下载" className="iconfont backInfo" onClick={this.downBackInfo.bind()}>&#xe643;</i>&nbsp;&nbsp;<i title="返回" onClick={this.backPage.bind()} className="iconfont backPage">&#xe621;</i></span>
            </div>
        )

    }
}
module.exports = panel;
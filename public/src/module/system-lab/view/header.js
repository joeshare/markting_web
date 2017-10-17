
class Panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lab_count:0,
            last_time:''
        };
    }
    componentDidMount(){
        this.initTitle();
    }
    initTitle(){
        let _this =this;
        util.api({
            url: "?method=mkt.tag.system.tagcount.get",
            type: 'get',
            data: {},
            success: function (res) {
                if(res.msg == 'success'){
                    _this.setState({
                        lab_count:res.data[0].tag_count,
                        last_time:res.data[0].sync_time
                    });
                }
            }
        });
    }
    thousandbit(num) {
        return num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
    }

    render(){
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">系统标签</span>
                    <span className="text">
                        系统标签<span className="variable" >{this.thousandbit(this.state.lab_count)}</span>个，最后一次同步时间<span className="variable" id="sync-time">{this.state.last_time}</span>
                    </span>
                </div>
            </header>
        )
    }
}
module.exports = Panel;
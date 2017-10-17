class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            status:0,
            name:'未命名'
        };
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
    }
    getStatusText(){
        let texts=['未生效','已生效','活动中','全部'];
        return texts[this.props.data.publish_status||0];
    }
    editTitle(e){
        if(e.target.classList.contains('rui-disabled')){
            return;
        }
        this.props.editSegmentTitle();
    }
    render(){
        let editBtnClass=this.props.data.publish_status?'rui-disabled':0;
        return (
            <div className="text-box">
                <span className="title">受众细分</span>
                <span id="segment-save-result" className="segment-save-result"><span className="color">{this.props.data.segment_name||'未命名'}&nbsp;|&nbsp;{this.getStatusText()}&nbsp;{this.props.data.updatetime?'| '+this.props.data.updatetime:""}</span></span>&nbsp;<a className={"a icon iconfont rui-cursor-pointer rui-ico-btn " +editBtnClass} id="rui-modals-edit" title="修改名称" onClick={this.editTitle.bind(this)}>&#xe609;</a>
            </div>
        )
    }
}
module.exports = panel;
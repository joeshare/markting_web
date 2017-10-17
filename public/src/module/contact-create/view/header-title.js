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
        let texts=["未启动","启动","停用"];
        return texts[this.props.data.contact_status];
    }
    editTitle(){
        this.props.editTitle();
    }
    render(){
        return (
            <div className="text-box">
                <span className="title">新建表单</span>
                <span id="create-edit-result" className="create-edit-result"><span className="color">{this.props.data.contact_name||'未命名'}&nbsp;|&nbsp;{this.getStatusText()}</span></span>&nbsp;<a className="a icon iconfont rui-cursor-pointer rui-ico-btn"  id="plan-edit" title="修改名称" onClick={this.editTitle.bind(this)}>&#xe609;</a>
            </div>
        )
    }
}
module.exports = panel;
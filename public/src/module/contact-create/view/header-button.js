class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          stopStyle:"",
          startStyle:"",
          tagCls:"a keyong rui-disabled rui-ico-btn"
        };
        console.log('this.props.data',this.props.data)

    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
    }
    saveHandler(){
      this.props.saveHandler();
    }
    stopHandler(){
        this.props.stopHandler();
    }
    startHandler(){
        this.props.startHandler();
    }
    tagHandler(){
        this.props.tagHandler();
    }
    render(){
        if(this.props.data.contact_status==1){
            this.state.stopStyle='block';
            this.state.startStyle="none";
        }else if(this.props.data.contact_status==2){
            this.state.stopStyle="none";
            this.state.startStyle="block";
        }else{
            this.state.stopStyle='none';
            this.state.startStyle="block";
        }
        if(this.props.data.contact_name){
            this.state.tagCls="a keyong rui-ico-btn"
        }
        return (
            <div className="button-box">
                <a className="a keyong rui-ico-btn" id="return-pages" style={{display:'none'}} title="返回">
                    <span className="icon iconfont">&#xe621;</span>
                    <span className="text">返回</span>
                </a>
                <a onClick={this.saveHandler.bind(this)} className="a keyong rui-ico-btn" id="contact-save" title="保存">
                    <span className="icon iconfont">&#xe602;</span>
                    <span className="text">保存</span>
                </a>
                <a onClick={this.stopHandler.bind(this)} className="a keyong rui-ico-btn" id="contact-stop" title="停用" href="javascript:void(0);" style={{display:this.state.stopStyle}}>
                    <span className="icon iconfont">&#xe643;</span>
                    <span className="text">停用</span>
                </a>
                <a onClick={this.startHandler.bind(this)}  className="a keyong rui-ico-btn " id="contact-start" title="启用" href="javascript:void(0);" style={{display:this.state.startStyle}}>
                    <span className="icon iconfont">&#xe633;</span>
                    <span className="text">启用</span>
                </a>
                <span style={{display:'none;'}} onClick={this.tagHandler.bind(this)} className={this.state.tagCls} id="tag-edit" title="打标签" >
                    <span className="icon iconfont">&#xe672;</span>
                    <span className="text">打标签</span>
                </span>
            </div>
        )

    }
}
module.exports = panel;
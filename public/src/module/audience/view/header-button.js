class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          stopStyle:"",
          startStyle:"",
          tagCls:"a keyong rui-disabled rui-ico-btn"
        };
    }
    validateDisabled(dom){
       return dom.classList.contains("rui-disabled");
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
    }
    //保存
    saveHandler(e){
        !this.validateDisabled(e.target)&&this.props.saveHandler();
    }
    //失效
    uneffectHandler(e){
        !this.validateDisabled(e.target)&&this.props.updateStatus(0);
    }
    //生效
    effectHandler(e){
        !this.validateDisabled(e.target)&&this.props.updateStatus(1);
    }
    //返回
    page2return(e){
        if(this.validateDisabled(e.target)){
            return;
        }
        if(this.props.data.returnurl) {
            window.location.href = this.props.data.returnurl;
        }
    }
    //关联标签
    relateTagEdit(e){
        !this.validateDisabled(e.target)&&this.props.relateTagEdit();
    }
    render(){
        //['未生效','已生效','活动中','全部']
        let returnurlClass="bukeyong";//原值：rui-disabled
        let tagEditClass="bukeyong";//原值：rui-disabled
        let saveBtnClass="bukeyong";//原值：rui-disabled
        if(this.props.data.segment_head_id){
            tagEditClass="";
        }
        if(this.props.data.publish_status==1) {//已生效
            this.state.effectStyle = 'none';
            this.state.uneffectStyle = "block";
            tagEditClass="bukeyong";//原值：rui-disabled
        }else{//未生效
            this.state.effectStyle='block';
            this.state.uneffectStyle="none";
            returnurlClass="keyong";//原值为空
            saveBtnClass="keyong";//原值为空
            tagEditClass="keyong";//原值：无此行
        }
        if(this.props.data.returnurl){
            this.state.returnurlStyle="block";
            returnurlClass="keyong";//原值为空
        }else{
            this.state.returnurlStyle='none';
        }

        return (
            <div className="button-box">
                <a className={"a return-pages "+returnurlClass} id="return-pages" title="返回" onClick={this.page2return.bind(this)} style={{display: this.state.returnurlStyle}}>
                    <span className="icon iconfont">&#xe621;</span>
                    <span className="text">返回</span>
                </a>
                <a className={"a "+saveBtnClass} id="rui-modals-save" onClick={this.saveHandler.bind(this)} title="保存">
                    <span className="icon iconfont">&#xe602;</span>
                    <span className="text">保存</span>
                </a>
                <a className={"a "+tagEditClass} id="aud-tag-edit" onClick={this.relateTagEdit.bind(this)} title="打标签">
                    <span className="icon iconfont">&#xe636;</span>
                    <span className="text">打标签</span>
                </a>
                <a className="a keyong " id="audience-uneffect" title="取消生效" onClick={this.uneffectHandler.bind(this)} href="javascript:void(0);" style={{display: this.state.uneffectStyle}}>
                    <span className="icon iconfont">&#xe664;</span>
                    <span className="text">取消生效</span>
                </a>
                <a className="a keyong segment-effect-icon" id="audience-effect" title="受众细分生效后，可在活动中使用"  onClick={this.effectHandler.bind(this)}  href="javascript:void(0);" style={{display: this.state.effectStyle}}>
                    <span className="icon iconfont">&#xe65c;</span>
                    <span className="text">生效</span>
                </a>
            </div>
        )

    }
}
module.exports = panel;
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = { };
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
    }
    render(){
        let path=BASE_PATH;
        return (
            <div className="button-box">
                <a className="a keyong rui-ico-btn" title="新建表单" id="create-form"  href={path+"/html/asset/contact-create.html?returnurl=html/asset/contact.html"}>
                    <span className="icon iconfont">&#xe66b;</span>
                    <span className="text">新建表单</span>
                </a>
            </div>
        )

    }
}
module.exports = panel;
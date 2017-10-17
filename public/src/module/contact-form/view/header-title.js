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


    render(){
        return (
            <div className="text-box">
                <span className="title">联系人表单</span>
            </div>
        )
    }
}
module.exports = panel;
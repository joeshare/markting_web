
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.$el = $(React.findDOMNode(this));
        this.setState(this.props.field)
    }
    componentWillUpdate(){
        let _this=this;
    }
    componentDidUpdate(){
       // console.log(this.props.height)
       // console.log(this.props.width)
        //this.changeStyle(this.props.width,this.props.height);
    }
    fieldClick(){
        this.props.fieldClick(this.props.field);
    }

    render(){
        let _this=this;
            let cls=this.props.field.selected?'selected':'';
        if(this.props.isMl){
            cls+=" ml";
        }
        return (
            <div className={'contact-field rui-cursor-pointer '+cls} onClick={this.fieldClick.bind(this)}>
                <span className="text">
                  {this.props.field.field_name}
                </span>
                <span className="a keyong icon iconfont round" id="tag-edit">&#xe610;</span>
                <span className="a keyong icon iconfont round-empty" id="tag-edit"></span>
            </div>
        )

    }
}
module.exports = panel;
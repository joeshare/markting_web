let Title= require('./header-title.js');
let Buttons= require('./header-button.js');
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = { };
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));

    }
    render(){
        return (
            <div className="page-body-header" id="page-body-header">
                <Title data={this.props.data} editTitle={this.props.editTitle}/>
                <Buttons data={this.props.data} saveHandler={this.props.saveHandler} stopHandler={this.props.stopHandler} startHandler={this.props.startHandler} tagHandler={this.props.tagHandler}/>
            </div>
        )

    }
}
module.exports = panel;
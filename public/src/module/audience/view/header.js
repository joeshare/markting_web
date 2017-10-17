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
                <Title data={this.props.data}   editSegmentTitle={this.props.editSegmentTitle}/>
                <Buttons data={this.props.data}
                    saveHandler={this.props.saveHandler}
                    updateStatus={this.props.updateStatus}
                    relateTagEdit={this.props.relateTagEdit}
                    editSegmentTitle={this.props.editSegmentTitle}
                    />
            </div>
        )

    }
}
module.exports = panel;
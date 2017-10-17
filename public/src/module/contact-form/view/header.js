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
                <Title />
                <Buttons />
            </div>
        )

    }
}
module.exports = panel;
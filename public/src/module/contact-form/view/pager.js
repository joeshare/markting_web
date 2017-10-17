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
            <div className="pager">
                <div className="pagination-wrap pagination light-theme simple-pagination"></div>
            </div>
         )
    }
}
module.exports = panel;
/*
* @Author: UEC
* @Date:   2016-08-11 11:19:35
* @Last Modified by:   UEC
* @Last Modified time: 2016-08-18 14:11:29
*/

'use strict';
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
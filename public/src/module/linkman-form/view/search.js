/*
* @Author: UEC
* @Date:   2016-08-10 18:54:39
* @Last Modified by:   UEC
* @Last Modified time: 2016-09-01 15:36:46
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
    selectCondition(index,name){
        $('#select-btn').text(name||'全部');
        this.setState({
            status:index||0
        })
        this.props.loadList(index,1,7)
    }
    render(){
        return (
            <div className="search">
               <span>反馈时间</span>
               <span className="status">
                    <span id="select-btn" className="selectbtn dropdown-button contactway-btn" data-activates="select-list"
                        data-beloworigin="true">全部</span>
                    <ul id="select-list" className="dropdown-content">
                        <li onClick={this.selectCondition.bind(this,1,'今天')}>今天</li>
                        <li onClick={this.selectCondition.bind(this,2,'一周内')}>一周内</li>
                        <li onClick={this.selectCondition.bind(this,3,'一个月内')}>一个月内</li>
                        <li onClick={this.selectCondition.bind(this,4,'3个月内')}>3个月内</li>
                        <li onClick={this.selectCondition.bind(this,0,'全部')}>全部</li>
                    </ul>
                </span>
            </div>
        )
    }
}
module.exports = panel;
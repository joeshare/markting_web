/*
* @Author: UEC
* @Date:   2016-08-11 10:41:53
* @Last Modified by:   UEC
* @Last Modified time: 2016-08-30 16:25:45
*/

'use strict';
let Modals = require('component/modals.js');
let API = {
    delUserData:'?method=mkt.contacts.commit.del'//删除用户反馈数据
};
let Tr=require('./trs-view.js');
class Panel extends React.Component{
    constructor(props){
        super(props);
        this.state = { };
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
        this.setState(this.props.data);
    }
    componentDidUpdate(){
        $('.dropdown-button').dropdown({
                constrain_width: false,
                gutter: 30,
                belowOrigin: true
            }
        );

    }
    render(){
        let _this=this;
        let body=(this.props.data&&this.props.data.body&&this.props.data.body.length)?this.props.data.body:[];
        let head=(this.props.data&&this.props.data.head&&this.props.data.head.length)?this.props.data.head:[];
        return (
            <div className="listTable">
            	<table>
            		<thead>
            			<tr>
                         {
                           head.map(function (result){
            				 return(<th>{result.col_name}</th>)
                           })
                         }
                        <th></th>
            			</tr>
            		</thead>
            		<tbody>
                    {
                       body.map(function (result){
                                    return(
                                        <Tr data={result} header={head} delListData={ _this.props.delListData}/>
                                      )
                        })
                    }

            		</tbody>
            	   </table>
                   {
                    !body.length&&(function(){ return (<div style={{'text-align':'center','line-height':'70px'}} colspan={head.length} >暂无数据</div>) })()
                   }
            </div>
        )

    }
}
module.exports = Panel;
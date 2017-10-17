/*
* @Author: UEC
* @Date:   2016-08-11 10:41:53
* @Last Modified by:   UEC
* @Last Modified time: 2016-09-01 15:11:56
*/

'use strict';
let Modals = require('component/modals.js');
let API = {
    delUserData:'?method=mkt.contacts.commit.del'//删除用户反馈数据
};
class tds extends React.Component{
    constructor(props){
        super(props);
        this.state = { };
    }
    componentDidMount(){

    }
    delListData(val1){
        this.props.delListData(val1);
    }
    render(){
        let arr=[];
        for(var i=0,len=this.props.header.length;i<len;i++){
        	let header=this.props.header[i];
        	arr.push({
               name:this.props.data[header.col_code]
        	})
 
        }
        return (<tr>
                            
                      {
                      	arr.map((d)=>{
                      		return (
                                <td>{d.name}</td>
                      			)
                      	})
                      }
            				<td>
                                <span className="icon iconfont r-btn dropdown-button dropdown-button-more"
                                data-activates={"list_data"+this.props.data.commit_id}
                                    data-gutter="30"
                                    data-constrainwidth="false"
                                    data-beloworigin="true"
                                    title="更多操作"
                                >&#xe675;</span>
                                <ul id={"list_data"+this.props.data.commit_id} className="dropdown-content">
                                    <li onClick={this.delListData.bind(this,this.props.data.commit_id)} style={{'height':'34px','line-height':'34px','min-height':'34px'}}>
                                        <i className="icon iconfont">&#xe674;</i><span style={{'padding':'7px 29px'}}>删除</span>
                                    </li>
                                </ul>
                            </td>
           
        </tr>)

    }
}
module.exports = tds;
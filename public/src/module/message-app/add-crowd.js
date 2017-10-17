/**
 * Created by AnThen on 2016/12/19.
 * 短信平台-添加受众
 */

class AddCrowd extends React.Component{
    fetch(){
        let that = this;
        let audienct = [];
        let thisData;
        util.api({
            data: {method: 'mkt.sms.audienct.get'},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<res.total; i++){
                        audienct[i] = {id:thisData[i].id, name: thisData[i].name, type: thisData[i].type, count: thisData[i].count}
                    }
                    that.setState({audienct:audienct});
                }
            }
        });
    }
    changeAudienct(id,name,type,count){
        $('#modals-crowd-changeAudienct').attr({
            dataid:id,
            name:name,
            type:type,
            count:count
        }).text(name);
    }
    constructor(props){
        super(props);
        this.state = {
            audienct:[]
        };
    }
    componentDidMount(){
        this.fetch();
    }
    render(){
        return(
            <div className="modals-crowd-html">
                <div className="title-area">
                    <div className="title-box"><span className="redstar">&#42;</span>名称：</div>
                    <div className="title-box"><span className="redstar">&#42;</span>人群细分：</div>
                </div>
                <div className="cont-area">
                    <div className="name-box">
                        <input id="modals-crowd-original" type="text" className="name" maxLength="20"/>
                    </div>
                    <div id="modals-crowd-changeAudienct" className="selectbtn dropdown-button" data-beloworigin="true" data-activates="addcrowd" data-constrainwidth="true"></div>
                    <ul id="addcrowd" className="dropdown-content addcrowdlist" style={{'width':'auto'}}>
                        {this.state.audienct.map((m,i)=> {
                            return (
                                <li onClick={this.changeAudienct.bind(this,m.id,m.name,m.type,m.count)}><div className="name">{m.name}</div><div className="count">{m.count}</div></li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}
module.exports = AddCrowd;
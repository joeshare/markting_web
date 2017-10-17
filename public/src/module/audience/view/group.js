'use strict';
let Input=require('./input.js');
let GroupRight=require('./group-right.js');
function compareFunction(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
}
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };

    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
    }
    componentWillUpdate(){
        let _this=this;
    }
    componentDidUpdate(){
    }
    showModel(params){
        console.info(params)
        this.props.showModel(params);
    }
    createTag(groupId){
        this.props.createTag(groupId);
    }
    changeGroupInfo(){
        this.groupInfo=Object.assign({},this.props.data)
    }
    delGroup(groupId){
        this.props.delGroup(groupId);
    }
    changeGroupName(e){
        let val = e.target.value||"";
        this.props.changeGroupName(this.groupInfo.group_id,val.substr(0,25));
    }
    getMinHeight(){
        let num=this.groupInfo.tag_list.length>5?this.groupInfo.tag_list.length:5;
        return num*60+110;
    }

    render(){
        let _this=this;
        this.changeGroupInfo();
        this.state.addTagStyle=this.props.getCurrentTagNumByGroup(_this.groupInfo.group_id)*1>=this.props.data.TAG_NUM_LIMIT*1?'none':'block';
        this.state.groupLineStyle=this.props.groupStyle;
        this.state.minHeight=this.getMinHeight();
        let disabledCls=this.groupInfo.publish_status?'rui-disabled':0;
        this.groupInfo.tag_list.sort(compareFunction("tag_index"));
        return (
            <div>
                <div className="group" style={{minHeight:this.state.minHeight}} id={this.groupInfo.group_id+"-wrapper"}>
                    <div className="group-left">
                         <div className="group-toolBar">
                             <div className="group-name input-field col s12">
                              <input type="text"  className="validate" value={this.props.data.group_name} maxlength="25"  onChange={this.changeGroupName.bind(this)} />
                             </div>
                             <div className="del-group">
                                 <div className={"ico icon iconfont "+disabledCls} onClick={this.delGroup.bind(this,_this.groupInfo.group_id)}> &#xe674;</div>
                             </div>
                         </div>
                         <div className="group-box" id={this.groupInfo.group_id+"-box"}>
                             <div>
                              <div className="tmpSpace" id={"before-"+(this.groupInfo.tag_list.length?(this.groupInfo.group_id+"-"+this.groupInfo.tag_list[0].tag_id):'')||new Date().getTime()} data-tag-id={this.groupInfo.tag_list[0].tag_id}></div>
                             </div>
                             {
                                 this.groupInfo.tag_list.map((rec)=>{
                                     let inputData=rec;
                                     inputData.group_id=_this.groupInfo.group_id;
                                     inputData.publish_status=_this.groupInfo.publish_status;
                                     return <Input data={inputData}
                                         tag_id={inputData.tag_id}
                                         showModel={this.showModel.bind(this)}
                                         delTag={this.props.delTag}
                                         changeTagExclude={this.props.changeTagExclude}
                                         changeTagText={this.props.changeTagText}
                                         clickInput={this.props.clickInput}
                                         groupData={this.groupInfo }
                                         setTipsPos={this.props.setTipsPos}
                                         inputOnMouseEnter={this.props.inputOnMouseEnter}
                                         ref="retval"
                                     />;
                                 })
                             }
                            <div className={"segment-add-tag-box "+disabledCls} onClick={this.createTag.bind(this,_this.groupInfo.group_id)} style={{display:this.state.addTagStyle}}>
                                <div className="ico icon iconfont add-tag"> &#xe672;</div>
                                <span className="add-tag-text">添加标签人群</span>
                            </div>
                         </div>
                    </div>
                    <GroupRight groupData={this.groupInfo } />
                </div>
                <div className="line-group-box"  style={{display:this.state.groupLineStyle}}>
                    <div className="line-first"></div>
                    <div className="line-txt">和</div>
                    <div className="line-end"></div>
                </div>
           </div>
        )

    }
}
module.exports = panel;
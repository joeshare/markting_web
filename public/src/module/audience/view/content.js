'use strict';
let Group=require('./group.js');
let LabModel = require('./lab-model');
let Tips = require('./tips');
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
        this.state = { };
        let group_id=this.props.getRandomStr();
        this.defaultData=[{
            "group_id":group_id,
            "group_name":"分组",
            "group_index":1,
            "tag_list":[{
                "tag_id": group_id+"_temp_tag",
                "tag_name": "选择标签来筛选人群",
                "tag_exclude": 0,
                "tag_value_list": []
            }]
        }];
        this.returnValue=this.returnValue.bind(this)

    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
    }
    componentWillUpdate(){
        let _this=this;
    }
    componentDidUpdate(){
    }
    showModel(params)
    {
        this.refs.showMode.showModel(params);
    }
    returnValue(data)
    {
        console.info(data)

        if(data&&data.tag_id&&Array.isArray(data.tag_value_list)){
            this.props.changeTagText(data.group_id,data.tag_id,data.tag_id_old,data);
        }
    }
    changeGroupsData(){
        this.groupsData=(this.props.data.filter_groups&&this.props.data.filter_groups.length)?this.props.data.filter_groups:this.defaultData;
    }
    createGroup(){
        this.props.createGroup();
    }
    render(){
        let _this=this;
        this.changeGroupsData();
        this.state.groupStyle=this.props.getCurrentGroupNum()*1>=this.props.data.GROUP_NUM_LIMIT*1?'none':'block';
        let num=0;
        let disableCls=_this.props.data.publish_status?'rui-disabled':'';
        this.groupsData.sort(compareFunction("group_index"));
        return (
            <div className="content-wrapper">
                <div className="content-top">
                    <div className="title">受众细分</div>
                    <div className="count">总计覆盖人数：<span className="num">{this.props.data.segment_total||0} </span>&nbsp;人</div>
                </div>
                <div className="content-center">
                    {
                        this.groupsData.map((rec)=>{
                            rec.TAG_NUM_LIMIT=_this.props.data.TAG_NUM_LIMIT;
                            rec.publish_status=_this.props.data.publish_status;
                            rec.tipsData=_this.props.data.tipsData;
                            ++num;
                            let groupStyle="block";
                            if(_this.state.groupStyle=='none'&&num==_this.groupsData.length){
                                groupStyle='none';
                            }
                            return <Group
                                data={rec}
                                createTag={this.props.createTag}
                                showModel={this.showModel.bind(this)}
                                getCurrentTagNumByGroup={this.props.getCurrentTagNumByGroup}
                                delGroup={this.props.delGroup}
                                delTag={this.props.delTag}
                                groupStyle={groupStyle}
                                changeGroupName={this.props.changeGroupName}
                                changeTagExclude={this.props.changeTagExclude}
                                changeTagText={this.props.changeTagText}
                                clickInput={this.props.clickInput}
                                setTipsPos={this.props.setTipsPos}
                                inputOnMouseEnter={this.props.inputOnMouseEnter}
                                ref="retval"
                            />
                        })
                    }
                    <div className="add-group-box" style={{display:this.state.groupStyle}}>
                      <div className={"add-group-btn "+disableCls} onClick={this.createGroup.bind(this)}>添加分组</div>
                    </div>
                    <Tips data={this.props.data.tipsData} />
                </div>
                <LabModel ref="showMode" returnValue={this.returnValue.bind(this)}/>
            </div>
        )
    }
}
module.exports = panel;
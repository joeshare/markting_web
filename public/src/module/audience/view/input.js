'use strict';

class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
        this.defaultData={
            "tag_id": this.props.data.group_id+"_temp_tag",
            "tag_name": "选择标签来筛选人群",
            "tag_exclude": 0
            //"tag_value_list": []
        }

    }
    componentDidMount(){
    }
    componentWillUpdate(){
        let _this=this;
    }
    componentDidUpdate(){
    }
    clickInput(){
        //发布状态不能编辑
        if(this.props.groupData.publish_status){
              return;
        }
        //1 表示修改 0 表示新建
        let isNew=(Array.isArray(this.props.data.tag_value_list)&&this.props.data.tag_value_list.length)?1:0;
        this.props.showModel({'goup':JSON.parse(JSON.stringify(this.props.groupData)),'type':isNew,'tagid':this.props.data.tag_id});
        //TODO::
        //this.changeTagText();
        //this.props.clickInput(this.inputData.group_id,this.inputData.tag_id);
        //this.props.groupData 全组的数据
    }
    delTag(groupId,tagId){
       this.props.delTag(groupId,tagId);
        $('.segment-tips').hide();
    }
    changeTagExclude(e){
       let checked=e.target.checked;
       this.props.changeTagExclude(this.props.data.group_id,this.props.data.tag_id,checked);
    }
    changeTagText(data){
        if(data&&data.tag_id&&Array.isArray(data.tag_value_list)){
            this.props.changeTagText(data.group_id,data.tag_id,data.tag_id_old,data);
        }

    }
    setTipsPos(groupId,tagId,e){
        this.props.setTipsPos(groupId,tagId,e);
        //let count=Array.isArray(this.props.data.tag_value_list)?this.props.data.tag_value_list.length:0;
        //if(count){
        //    let tar=e.target;
        //    if(tar.classList.contains("close-icon")||
        //        tar.classList.contains("end-icon")||
        //        tar.classList.contains("first-icon")||
        //        tar.classList.contains("input")){
        //        tar=tar.parentNode;
        //    }
        //    let $tar=$(tar);
        //    let $tips=$tar.parent().parent().find('.tips');
        //    let tipsDom=$tips.get(0);
        //    let $cc=$('#segment .content-center');
        //    let ccDom=$cc.get(0);
        //    let ccHeight=ccDom.scrollHeight+ccDom.offsetTop;
        //    let tarTop=tar.offsetTop;
        //    let diff=ccHeight-tarTop-70;
        //    let tipsDomHeight=tipsDom.offsetHeight;
        //    let top=40;
        //    if(diff<tipsDomHeight){
        //        top=-tipsDomHeight-5;
        //    }
        //    $tips.css({top:top}).show();
        //
        //}

    }
    inputOnMouseEnter(e){
        this.props.inputOnMouseEnter(e);
        //$('.segment-tips').hide();
    }
    render(){
        let _this=this;
        let inputId=this.props.data.tag_id+'_input';
        let inputCls=this.props.data.active?'active':'';
        let tipsData=Array.isArray(this.props.data.tag_value_list)?this.props.data.tag_value_list.slice(0,10):[];
        let count=Array.isArray(this.props.data.tag_value_list)?this.props.data.tag_value_list.length:0;
        let isDrag=this.props.groupData.publish_status?'':'dom-dragable';
        let inputClass="";
        let closeIconClass="";
        if(!isDrag){//不可拖拽状态
            // this.inputData.showText=""; //这里为什么要置空？？
            inputClass=" disabled";
            closeIconClass=" disabled";
        }
        let id=this.props.data.group_id+"-"+this.props.data.tag_id;
        let checkBoxId=id+'-checkbox';
        let inputBoxId=id+'-box';
        let inputWrapperId=id+'-wrapper';
        let excludeDisabled=this.props.data.showText?"":"disabled";
        if(this.props.data.publish_status==1) {//已生效
            excludeDisabled="disabled";
        }
        let isOutDateClass='';
        if(_.isEmpty(this.props.data.tag_value_list)){
            isOutDateClass='';
        }else{
            isOutDateClass=this.props.data.tag_value_list.every(m=>m.tag_status==0)?'':' out-date';
            excludeDisabled=this.props.data.tag_value_list.every(m=>m.tag_status==0)?'':' disabled';
        }
        let isCustomTagStr=this.props.data.tag_type==1?<span className="fc-blue">[自定义标签] </span>:'';
        return (
                <div>
                    <div className="tag-box"  id={inputWrapperId}>
                            <div ref="inputBox"
                                onMouseEnter={this.setTipsPos.bind(this,this.props.data.group_id,this.props.data.tag_id)}
                                onMouseLeave={this.inputOnMouseEnter.bind(this)}
                                className={"input-box rui-bg-white "+inputCls+isOutDateClass} id={id}
                                data-ground-id={this.props.data.group_id}
                                data-tag-id={this.props.data.tag_id}>
                               <div title="拖拽" className={"ico icon iconfont first-icon  "+isDrag }>&#xe677;</div>
                               <div className={"input "+inputClass}
                                    onClick={this.clickInput.bind(this)}>{isCustomTagStr}{this.props.data.showText||this.props.data.tag_name}</div>
                               <div className={"ico icon iconfont end-icon "+inputClass}  onClick={this.clickInput.bind(this)}>&#xe669;</div>
                               <div className={"ico icon iconfont close-icon " +closeIconClass} onClick={this.delTag.bind(this,this.props.data.group_id,this.props.data.tag_id)}>&#xe608;</div>

                            </div>
                            <div className="exclude-box act-box">
                               <input className="filled-in"  id={checkBoxId} type="checkbox"
                                   onChange={this.changeTagExclude.bind(this)}
                                   checked={this.props.data.tag_exclude?"checked":""}
                                   disabled={excludeDisabled}

                               />
                               <label htmlFor={checkBoxId} className="label">排除</label>
                            </div>

                    </div>
                    <div className="tmpSpace" id={"after-"+id} data-tag-id={this.props.data.tag_id}></div>

                </div>
        )

    }
}
module.exports = panel;

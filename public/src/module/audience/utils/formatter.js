/**
 * Created by AnThen on 2016-11-3.
 */
    'use strict';
let formatter={
    transformSegmentShowText(data){
        let _this=this;
        if(Array.isArray(data.filter_groups)){
            data.filter_groups.forEach((group,i)=>{
                if(group&&Array.isArray(group.tag_list)){
                    group.tag_list.forEach((tag,y)=>{
                        tag.showText=_this.transformTagShowText(tag);
                    })
                }
            })
        }
        return data
    },
    transformTagShowText(data){
        let str="";
        let tag_val_arr=[];
        let suffix="";
        if(data&&Array.isArray(data.tag_value_list)){
            if(data.tag_value_list.length&&data.tag_name){
                str=data.tag_name;
            }
            data.tag_value_list.forEach((x,i)=>{
                if(x&&x.tag_value){
                    tag_val_arr.push(x.tag_value);
                }
            })
        }
        let tagNum=0;
        if(tag_val_arr.length){
            str=`${data.tag_name}-${tag_val_arr.join(',')}`;
            suffix=`等${tag_val_arr.length}个`;
            tagNum=tag_val_arr.length;
        }
        if(tagNum==1&&str.length>25){
            str=`${str.substr(0,25)}...`;
        }else if(tagNum>1&&str.length>25){
            str=`${str.substr(0,20)}...${suffix}`;
        }
        // console.log('str',str)
        return str;
    },
    /**
     *  根据id删除标签
     * @param id
     * @param groupId
     * @param filter_groups
     * return 被删除数据
     */
    delTagById(id,groupId,filter_groups){
        let tag=null;
        let index=-1;
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                if(Array.isArray(r.tag_list)&&r.tag_list.length){
                    r.tag_list.every((t,i)=>{
                        if(t.tag_id==id){
                            tag= JSON.parse(JSON.stringify(t));
                            index=i;
                            return false;
                        }
                        return true;
                    });
                    if(index>-1){
                        r.tag_list.splice(index,1);
                    }
                }
                return false;
            }
            return true;
        })
        return tag;
    },
    /**
     * 根据拖拽对象组织数据（从新排序）
     * @param $drag
     * @param filter_groups
     */
    transformerGroupDataByDrag( detTagId,tmpSpaceId,groupId,filter_groups){
        let targetTagId=$("#"+tmpSpaceId).attr('data-tag-id');//String(tmpSpaceId).replace(/^(before-|after-)/, "");
        //表示没有移动到目标上方
        if(targetTagId==detTagId){
            return;
        }
        console.log('transformerGroupDataByDrag',detTagId)
        console.log('transformerGroupDataByDrag',tmpSpaceId)
        console.log('transformerGroupDataByDrag',groupId)
        console.log('transformerGroupDataByDrag',targetTagId)
        let optType=null;
        if(tmpSpaceId.indexOf('before-')==0){
            optType="before";
        }else if(tmpSpaceId.indexOf('after-')==0){
            optType="after";
        }
        let tag=this.delTagById(detTagId,groupId,filter_groups);
        let targetTagIndex=-1;
        if(!optType){//没有操作类型就停止操作
            return ;
        }
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                if(Array.isArray(r.tag_list)&&r.tag_list.length){
                    r.tag_list.every((t,n)=>{
                        if(t.tag_id==targetTagId){
                            targetTagIndex=n;
                            console.log("targetTagIndex:"+targetTagIndex)
                            return false;
                        }
                        return true;
                    });
                    if(targetTagIndex>-1){
                        if(optType=="before"&&targetTagIndex>0){
                            targetTagIndex--;
                        }else if( optType=="after"){
                            targetTagIndex++;
                        }
                        r.tag_list.splice(targetTagIndex,0,tag);
                        r.tag_list.forEach((t,x)=>{
                            t.tag_index=x;
                        })
                    }

                }else if(Array.isArray(r.tag_list)){
                    r.tag_list.push(tag);
                }
                console.log('transformerGroupDataByDrag after',JSON.stringify(filter_groups))
                return false;
            }
            return true;
        })
    },
    /**
     * 组数据
     * @param groupId
     * @param filter_groups
     * @returns {*}
     */
    getGroupData(groupId,filter_groups){
        let groupData=null;
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                groupData=JSON.parse(JSON.stringify(r));
                return false;
            }
            return true;
        })
        return groupData;
    },
    /**
     * 标签数据
     * @param tagId
     * @param groupId
     * @param filter_groups
     * @returns {*}
     */
    getTagData(tagId,groupId,filter_groups){
        let tagData=null;
        filter_groups.every((r,i)=>{
            if(r.group_id==groupId){
                if(Array.isArray(r.tag_list)&&r.tag_list.length){
                    r.tag_list.every((t,n)=>{
                        if(t.tag_id==tagId){
                            tagData=JSON.parse(JSON.stringify(t));
                            return false;
                        }
                        return true;
                    });
                }
                return false;
            }
            return true;
        })
        return tagData;
    },
    delDataInArr:function(arr,data){
        var i=arr.indexOf(data);
        if(i>-1){
            arr.splice(i,1);
        }
    },
    isSameName:function(arr,name){
        return arr.indexOf(name)>-1;
    },
    setTagData:function(arr,name){
        if(arr.indexOf(name)<0){
            arr.push(name)
        }
    },
    //漏斗查询过滤组中的无效数据
    filterGroup:function(groups){
        let _this=this;
        Array.isArray(groups)&&groups.forEach((g,i)=>{
            _this.filterTagList(g.tag_list);
        })
    },
    filterTagList:function(tag_list){
        return tag_list.filter((x,i)=>{
            return Array.isArray(x.tag_value_list)&&!!x.tag_value_list.length;
        })
    },
    transformerSaveData:function(data){
        if(Array.isArray(data.filter_groups)){
            data.filter_groups.forEach((group,i)=>{
                group.group_index=i;
                if(group&&Array.isArray(group.tag_list)){
                    group.tag_list.forEach((tag,y)=>{
                        tag.tag_index=y;
                    })
                }
            })
        }
    }

};
module.exports = formatter;
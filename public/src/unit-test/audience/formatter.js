/**
 * Author LLJ
 * Date 2016-6-1 14:10
 */



var formatter={
    //头部信息
    headerInfo:function(data){
        var opt={
            name:data["segment_name"],
            release:data["publish_status"],
            oper:data["oper"],
            dateTime:data["updatetime"],
            id:data["id"]
        };
        return opt;
    },
    tags2XAxis:function(data){
        var xAxis=[];
        data.forEach(function(itm,i){
            xAxis.push(itm.tag_name);
        })
      return xAxis;
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
    //数据转化成漏斗数据
    data2FunnelChart:function(data){

    },
    //根据条件删除主数据
    delFilterGroups:function(arr,gIndex,data){
         arr.forEach(function(group,i){
             var grp=group;
             if(grp.group_index==gIndex){
                 grp.tag_list.every(function(tag,index){
                        var t=tag,tId=t.tag_id;
                        if(tId==data.tag_id){
                            grp.splice(index,1);
                            return false;
                        }
                     return true;
                 })
             }
         })
    },
    //设置主数据
    setFilterGroups:function(arr,gIndex,data){
        arr.forEach(function(group,i){
            var grp=group;
            if(grp.group_index==gIndex){
                var isNew=true;
                grp.tag_list.every(function(tag,index){
                    var t=tag,tId=t.tag_id;
                    if(tId==data.tag_id){
                        tag.exclude=data.exclude;
                        return isNew=false;
                    }
                    return true;
                })
                if(isNew){
                    grp.push(data)
                }
            }
        })
    }
};

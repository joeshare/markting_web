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
    }
};
module.exports= formatter;

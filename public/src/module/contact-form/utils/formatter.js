/**
 * Author LLJ
 * Date 2016-8-25 10:26
 */
var formatter={
    transformDisplayData:function(data){
        var arr=[];
        if(data&&data.length){
            data.forEach(function(d,i){
                arr.push({
                  id:d.contact_id,
                  name:d.contact_name
                 })
            )
        }
        return arr;
    }
};
module.exports= formatter;
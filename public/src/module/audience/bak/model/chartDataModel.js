/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
function model(){
    this.objects={};
    this.setData=function(id,data){
        this.objects[id]=$.extend(true,[],data);
    };
    this.getDataById=function(id){
        var str=JSON.stringify(this.objects[id]);
       return JSON.parse(str);
    };
    this.delData=function(id){
       delete  this.objects[id];
    };


}
module.exports=model;
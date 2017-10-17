/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
require('component/index.js');
function model(view){
    this.view=view;
    this.objects={};
    this.create=function(arg){
        this.objects[arg.id]=new RUI.Modals.Base(arg);
        return this.objects[arg.id];
    };

}
module.exports=model;
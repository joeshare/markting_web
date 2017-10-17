/**
 * Author LLJ
 * Date 2016-4-18 15:25
 */
function model(){
    var _data={};

    this.filterDta=function(){
        $.each(_data,function(i,itm){
            if(itm.ends){
                $.each(itm.ends,function(k,p){
                    if(!_data[k]){
                       delete  itm.ends[k];
                    }
                })
            }
        })
    };
    this.saveDraw=function(startId,endId,arg){
       if(!_data[startId].ends)_data[endId].ends={};
       if(!_data[startId].ends[endId]) _data[startId].ends[endId]={};
        $.extend(true,_data[startId].ends[endId],arg);
    };
    this.forEach=function(callBack){
        $.each(_data,function(i,itm){
            callBack&&callBack.call(this,i,itm,this);
        })
    };
    /**
     *  获取画线点
     * @param dom
     * @returns {*[]}
     */
    this.getDrawPoint=function(dom){
          return this.getCenterByDom(dom);
    };
    /**
     *  获取中心坐标
     * @param dom
     * @returns {*[]}
     */

    this.getCenterByDom=function(dom){
        return [dom.offsetLeft-dom.offsetWidth/2,dom.offsetTop-dom.offsetHeight/2];
    };
    /**
     * 获取位置坐标
     * @param dom
     * @returns {*[]}
     */
    this.getPosByDom=function(dom){
         return [dom.offsetLeft,dom.offsetTop];
    };
    /**
     * 增加节点
     * @param obj
     */
    this.addNode=function(obj){
        _data[obj.id]= $.extend(true,{},obj);
    };

    this.delNode=function(id){
        delete _data[id];
    };
    this.clearAll=function(){
        _data={};
    };
    /**
     *  设置节点信息
     * @param id
     * @param arg
     */
    this.setNode=function(id,arg){
        $.extend(true,_data[id],arg);
    };
    this.getNodeById=function(id){
         return $.extend(true,{},_data[id]);
    };
    /**
     * 设置全部数据
     * @param d
     */
    this.setData=function(d){
        _data= $.extend(true,{},d);
    };
    /**
     * 获取全部数据
     * @returns {*}
     */
    this.getData=function(){
       return $.extend(true,{},_data);
    };

};


module.exports=model;

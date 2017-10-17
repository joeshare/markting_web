/**
 * Author LLJ
 * Date 2016-5-23 11:24
 */
var aop = {
    before:function(ins,methodName,callback){
        if(typeof ins[methodName] != "undefined"){
            var method = ins[methodName];
        }
        ins[methodName] = function(){
            callback.apply(ins,arguments)
            return method.apply(ins,arguments);
        }
    },
    after:function(ins,methodName,callback){
        if(typeof ins[methodName] != "undefined"){
            var method = ins[methodName];
        }
        ins[methodName] = function(){
            var ret = method.apply(ins,arguments),
                callret = callback.apply(ins,arguments);
            return typeof callret == "undefined" ? ret : callret;
        }
    }
};
module.exports = aop;
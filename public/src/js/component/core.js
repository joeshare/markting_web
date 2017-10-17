/**
 * Author LLJ
 * Date 2016-4-26 9:44
 */
window.RUI={};

RUI.namespace =function(s){
    var arr = s.split('.');
    var ns = this;
    for(var i=0,k=arr.length;i<k;i++){
        if(typeof ns[arr[i]] == 'undefined'){
            ns[arr[i]] = {};
        }
        ns = ns[arr[i]];
    }
};
RUI.inherits = function (child, parent) {
    function Fun() {};
    Fun.prototype = parent.prototype;
    child.superClass_ = parent.prototype;
    child.prototype = new Fun();
    child.prototype.constructor = child;
};
/**
 *  根据选择器获取模板 HTML
 * @param selector
 * @param templates
 * @returns {*|jQuery}
 */
RUI.template= function (selector, templates) {
    return $(templates).filter(selector).html();
};
/**
 *  获取指定模板
 * @param tpls
 * @param selector
 * @returns {*|jQuery}
 */
RUI.queryTpl= function (tpls, selector) {
    return $(tpls).filter(selector).html();
};

module.exports=RUI;




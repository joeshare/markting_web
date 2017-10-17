/**
 * Author LLJ
 * Date 2016-6-8 15:11
 */
var util={
    getDateTimeStr:function(time){
        var d = new Date(time||new Date().getTime()),
        s = d.getFullYear() + "-";
        s += ("0"+(d.getMonth()+1)).slice(-2) + "-";
        s += ("0"+d.getDate()).slice(-2)+" " ;
        s += ("0"+d.getHours()).slice(-2) + ":";
        s += ("0"+d.getMinutes()).slice(-2) + ":";
        s += ("0"+d.getSeconds()).slice(-2) ;
        return s;
    },
   getDateStr:function(time){
       var d = new Date(time||new Date().getTime()),
       s = d.getFullYear() + "-";
       s += ("0"+(d.getMonth()+1)).slice(-2) + "-";
       s += ("0"+d.getDate()).slice(-2) ;
       return s;
   },
    getTimeStr:function(time){
        var d = new Date(time||new Date().getTime()),s="";
        s += ("0"+d.getHours()).slice(-2) + ":";
        s += ("0"+d.getMinutes()).slice(-2) + ":";
        s += ("0"+d.getSeconds()).slice(-2) ;
        return s;
    },
    //时间字符串值保留到分钟
    timeHourMin:function (str){
        if(!str){
            return '00:00';
        }else if(str.length>5){
            str=str.substr(0,5);
        }
        return str;
    },
    //补齐时间位数 （19位）
    padTime:function (str){
        if(!str){
            return dateTime.getDateTimeStr();
        }else if(str.length<19){
            str+=":00";
        }
        return str;
    }
};
module.exports = util;
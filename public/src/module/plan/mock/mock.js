/**
 * Author LLJ
 * Date 2016-5-13 13:46
 */

/**
 *  随机数字（位数）
 * */
function randomNum(n) {
    var num="";
    for(var i=0;i<n;i++) {
        num+=Math.floor(Math.random()*10);
    }
    return num;
}
/**
 *  随机字母（位数,大小写）
 * */
function randomLetters(len,isUpper){
        var x=isUpper?"ABCDEFGHIJKLMNOPQRSTUVWXYZ":"abcdefghijklmnopqrstuvwxyz";
        var str = "";
        for (var i = 0; i < len; i++) {
            str += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
        }
        return str;
}
var DEFAULTURL = BASE_PATH + '/html/activity/plan-iframe.html';
var GROUPURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
var TRIGGERURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';

var data1 = {
    "1463119297731": {
        "switch": [],
        "ends": {"1463119300812": {"id": "1463119300812", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463119297731",
        "nodeType": "trigger",
        "itemType": "timer-trigger",
        "icon": "&#xe63f;",
        "url": TRIGGERURL,
        "x": "269px",
        "y": "8px",
        "info": {
            "name": "ddddd",
            "startDate": "5 五月, 2016",
            "startTime": "3:57 PM",
            "endDate": "14 五月, 2016",
            "endTime": "3:57 PM",
            "desc": "5 五月, 2016 3:57 PM"
        }
    },
    "1463119300812": {
        "switch": [],
        "ends": {"1463119319114": {"id": "1463119319114", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463119300812",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "icon": "&#xe63f;",
        "x": "122px",
        "y": "183px",
        "info": {
            "name": "ddddd",
            "select": "1",
            "selectText": "人群1",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "人群1"
        }
    },
    "1463119314665": {
        "switch": [{
            "id": "1463119329065",
            "drawType": "curveTriangle",//init 0
            "drawColor": "#65bb43"//color
        }, {"id": "1463119330643", "drawType": "curveTriangle", "drawColor": "#e64646"}],
        "ends": {},
        "id": "1463119314665",
        "nodeType": "decisions",
        "itemType": "wechat-send",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "160px",//string
        "y": "392px",//string
        z:111,//string
        "info": {
            "name": "ddddd",
            "publicNumber": "1",
            "publicNumberText": "wxgzh2016",
            "img": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "wxgzh2016"
        }
    },
    "1463119319114": {
        "switch": [{
            "id": "1463119327786",
            "drawType": "curveTriangle",
            "drawColor": "#65bb43"
        }, {"id": "1463119314665", "drawType": "curveTriangle", "drawColor": "#e64646"}],
        "ends": {},
        "id": "1463119319114",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "471px",
        "y": "79px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "wxgzh2016",
            "img": "1",
            "time": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "wxgzh2016"
        }
    },
    "1463119327786": {
        "switch": [],
        "ends": {},
        "id": "1463119327786",
        "nodeType": "activity",
        "itemType": "wait-set",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "332px",
        "y": "543px",
        "info": {
            "name": "dddddd",
            "desc": "1小时",
            "refresh1": "1",
            "refresh2": "hour",
            "refresh2Text": "小时",
            "radio": "relative",
            "date": "",
            "setTime": ""
        }
    },
    "1463119329065": {
        "switch": [],
        "ends": {},
        "id": "1463119329065",
        "nodeType": "activity",
        "itemType": "save-current-group",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "54px",
        "y": "640px",
        "info": {"name": "dddd", "group": "0", "groupText": "人群1", "desc": "人群1"}
    },
    "1463119330643": {
        "switch": [],
        "ends": {},
        "id": "1463119330643",
        "nodeType": "activity",
        "itemType": "set-tag",
        "icon": "&#xe63f;",
        "url": DEFAULTURL,
        "x": "725px",
        "y": "445px",
        "info": {"name": "rrrrr", "desc": "eeeeeeee"}
    }
};
var tar = [
    {
        "result": [
            { tag_id:1,tag_name:"男"},
            { tag_id:2,tag_name:"女"},
            { tag_id:3,tag_name:"无值"}
        ],
        "name": "性别"
    }
];
//完成
var data2 = {
    "1463568158807": {
        "switch": [],
        "ends": {
            "1463724617708": {"id": "1463724617708", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463724619406": {"id": "1463724619406", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463724621612": {"id": "1463724621612", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463724623703": {"id": "1463724623703", "drawType": "curveTriangle", "drawColor": "#787878"}
        },
        "id": "1463568158807",
        "num": 0,
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "693px",
        "y": "130px",
        "info": {
            "name": "",
            "select": "1",
            "selectText": "乐友母婴童测试白名单",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "乐友母婴童测试白名单"
        }
    },
    "1463724545877": {
        "num": 5,
        "switch": [],
        "ends": {"1463568158807": {"id": "1463568158807", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463724545877",
        "nodeType": "trigger",
        "itemType": "manual-trigger",
        "url": TRIGGERURL,
        "x": "693px",
        "y": "28px"
    },
    "1463724617708": {
        "num": 5,
        "switch": [],
        "ends": {},
        "id": "1463724617708",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "373px",
        "y": "258px",
        "info": {
            "name": "",
            "imgSelect": "1",
            "imgSelectText": "待产商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "待产商品促销"
        }
    },
    "1463724619406": {
        "num": 5,
        "switch": [],
        "ends": {},
        "id": "1463724619406",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "602px",
        "y": "340px",
        "info": {
            "name": "",
            "imgSelect": "2",
            "imgSelectText": "准妈妈商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "准妈妈商品促销"
        }
    },
    "1463724621612": {
        "num": 5,
        "switch": [],
        "ends": {},
        "id": "1463724621612",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "837px",
        "y": "345px",
        "info": {
            "name": "",
            "imgSelect": "3",
            "imgSelectText": "新生宝宝商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "新生宝宝商品促销"
        }
    },
    "1463724623703": {
        "num": 5,
        "switch": [],
        "ends": {},
        "id": "1463724623703",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "1085px",
        "y": "256px",
        "info": {
            "name": "",
            "imgSelect": "4",
            "imgSelectText": "宝宝用品玩具促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "宝宝用品玩具促销"
        }
    }
};
var data3 = {
    "1463726083810": {
        "num": 4,
        "switch": [],
        "ends": {
            "1463726102348": {"id": "1463726102348", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463726104204": {"id": "1463726104204", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463726106286": {"id": "1463726106286", "drawType": "curveTriangle", "drawColor": "#787878"},
            "1463726108558": {"id": "1463726108558", "drawType": "curveTriangle", "drawColor": "#787878"}
        },
        "id": "1463726083810",
        "nodeType": "trigger",
        "itemType": "timer-trigger",
        "url": TRIGGERURL,
        "x": "689px",
        "y": "65px",
        "info": {
            "name": "",
            "startDate": "27 五月, 2016",
            "startTime": "12:00 AM",
            "endDate": "5 六月, 2016",
            "endTime": "12:00 PM",
            "desc": "27 五月, 2016 12:00 AM"
        }
    },
    "1463726102348": {
        "num": 15,
        "switch": [],
        "ends": {"1463726133770": {"id": "1463726133770", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726102348",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "385px",
        "y": "176px",
        "info": {
            "name": "",
            "select": "5",
            "selectText": ">8个月孕龄的孕期准妈妈",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": ">8个月孕龄的孕期准妈妈",
            "BASEPATH": ""
        }
    },
    "1463726104204": {
        "num": 10,
        "switch": [],
        "ends": {"1463726136268": {"id": "1463726136268", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726104204",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "614px",
        "y": "175px",
        "info": {
            "name": "",
            "select": "6",
            "selectText": "<8个月孕龄的孕期准妈妈",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "<8个月孕龄的孕期准妈妈",
            "BASEPATH": ""
        }
    },
    "1463726106286": {
        "num": 5,
        "switch": [],
        "ends": {"1463726138686": {"id": "1463726138686", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726106286",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "836px",
        "y": "175px",
        "info": {
            "name": "",
            "select": "7",
            "selectText": "0~6个月新妈妈爸爸",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "0~6个月新妈妈爸爸",
            "BASEPATH": ""
        }
    },
    "1463726108558": {
        "num": 1,
        "switch": [],
        "ends": {"1463726141453": {"id": "1463726141453", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726108558",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": GROUPURL,
        "x": "1065px",
        "y": "173px",
        "info": {
            "name": "",
            "select": "8",
            "selectText": "6~24个月宝宝父母",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "6~24个月宝宝父母",
            "BASEPATH": ""
        }
    },
    "1463726133770": {
        "num": 4,
        "switch": [],
        "ends": {"1463726152804": {"id": "1463726152804", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726133770",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "429px",
        "y": "300px",
        "info": {
            "name": "",
            "imgSelect": "1",
            "imgSelectText": "待产商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "待产商品促销"
        }
    },
    "1463726136268": {
        "num": 1,
        "switch": [],
        "ends": {"1463726155336": {"id": "1463726155336", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726136268",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "662px",
        "y": "310px",
        "info": {
            "name": "",
            "imgSelect": "2",
            "imgSelectText": "准妈妈商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "准妈妈商品促销"
        }
    },
    "1463726138686": {
        "num": 33,
        "switch": [],
        "ends": {"1463726157652": {"id": "1463726157652", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726138686",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "896px",
        "y": "308px",
        "info": {
            "name": "",
            "imgSelect": "3",
            "imgSelectText": "新生宝宝商品促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "新生宝宝商品促销"
        }
    },
    "1463726141453": {
        "num": 5,
        "switch": [],
        "ends": {"1463726160510": {"id": "1463726160510", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726141453",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "1131px",
        "y": "310px",
        "info": {
            "name": "",
            "imgSelect": "4",
            "imgSelectText": "宝宝用品玩具促销",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "宝宝用品玩具促销"
        }
    },
    "1463726152804": {
        "num": 2,
        "switch": [{"id": "1463726165888", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726152804",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "url": "/html/activity/plan-iframe.html",
        "x": "382px",
        "y": "413px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "乐友孕婴童 ",
            "img": "1",
            "time": "1",
            "completed": "",
            "refresh1": "1",
            "refresh2": "no-sel",
            "desc": "待产商品促销"
        }
    },
    "1463726155336": {
        "num": 9,
        "switch": [{"id": "1463726165888", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726155336",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "url": "/html/activity/plan-iframe.html",
        "x": "621px",
        "y": "410px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "乐友孕婴童 ",
            "img": "1",
            "time": "1",
            "completed": "",
            "refresh1": "1",
            "refresh2": "no-sel",
            "desc": "准妈妈商品促销"
        }
    },
    "1463726157652": {
        "num": 6,
        "switch": [{"id": "1463726165888", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726157652",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "url": "/html/activity/plan-iframe.html",
        "x": "845px",
        "y": "409px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "乐友孕婴童 ",
            "img": "1",
            "time": "1",
            "completed": "",
            "refresh1": "1",
            "refresh2": "no-sel",
            "desc": "新生宝宝商品促销"
        }
    },
    "1463726160510": {
        "num": 1,
        "switch": [{"id": "1463726165888", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726160510",
        "nodeType": "decisions",
        "itemType": "wechat-check",
        "url": "/html/activity/plan-iframe.html",
        "x": "1079px",
        "y": "413px",
        "info": {
            "name": "",
            "publicNumber": "1",
            "publicNumberText": "乐友孕婴童 ",
            "img": "1",
            "time": "1",
            "completed": "",
            "refresh1": "1",
            "refresh2": "no-sel",
            "desc": "宝宝用品玩具促销"
        }
    },
    "1463726165888": {
        "num": 2,
        "switch": [],
        "ends": {"1463726173460": {"id": "1463726173460", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726165888",
        "nodeType": "activity",
        "itemType": "wait-set",
        "url": "/html/activity/plan-iframe.html",
        "x": "711px",
        "y": "549px",
        "info": {
            "name": "",
            "desc": "28 五月, 201612:00 AM",
            "refresh1": "1",
            "refresh2": "no-sel",
            "refresh2Text": "请选择",
            "radio": "specify",
            "date": "28 五月, 2016",
            "setTime": "12:00 AM"
        }
    },
    "1463726173460": {
        "num": 3,
        "switch": [{"id": "1463726191110", "drawType": "curveTriangle", "drawColor": "#65bb43"}, {
            "id": "1463726193945",
            "drawType": "curveTriangle",
            "drawColor": "#e64646"
        }],
        "ends": {},
        "id": "1463726173460",
        "nodeType": "decisions",
        "itemType": "label-judgment",
        "url": "/html/activity/plan-iframe.html",
        "x": "714px",
        "y": "650px",
        "info": {
            "name": "",
            "fitSelect": "0",
            "fitSelectText": "",
            "tags": ["1周内", "孕妇及妈妈用品-哺乳用品", "惠氏"],
            "desc": "1周内..."
        }
    },
    "1463726191110": {
        "num": 4,
        "switch": [],
        "ends": {},
        "id": "1463726191110",
        "nodeType": "activity",
        "itemType": "save-current-group",
        "url": "/html/activity/plan-iframe.html",
        "x": "547px",
        "y": "736px",
        "info": {"name": "", "group": "1", "groupText": "周末促销消费会员", "desc": "周末促销消费会员"}
    },
    "1463726193945": {
        "num": 1,
        "switch": [],
        "ends": {},
        "id": "1463726193945",
        "nodeType": "activity",
        "itemType": "save-current-group",
        "url": "/html/activity/plan-iframe.html",
        "x": "870px",
        "y": "736px",
        "info": {"name": "", "group": "2", "groupText": "周末促销未消费会员", "desc": "周末促销未消费会员"}
    }
};
var data4 = {
    "1463726438304": {
        "num": 18,
        "switch": [],
        "ends": {"1463726443230": {"id": "1463726443230", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726438304",
        "nodeType": "trigger",
        "itemType": "timer-trigger",
        "url": TRIGGERURL,
        "x": "690px",
        "y": "14px",
        "info": {
            "name": "",
            "startDate": "1 七月, 2016",
            "startTime": "12:00 AM",
            "endDate": "15 七月, 2016",
            "endTime": "12:00 PM",
            "desc": "1 七月, 2016 12:00 AM"
        }
    },
    "1463726443230": {
        "num": 48,
        "switch": [],
        "ends": {"1463726460926": {"id": "1463726460926", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726443230",
        "nodeType": "audiences",
        "itemType": "target-group",
        "url": "http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated",
        "x": "692px",
        "y": "101px",
        "info": {
            "name": "",
            "select": "9",
            "selectText": "7-12个月宝宝的会员",
            "newSelect": "1",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "7-12个月宝宝的会员",
            "BASEPATH": ""
        }
    },
    "1463726460926": {
        "num": 46,
        "switch": [
            {"id": "1463726468554", "drawType": "curveTriangle", "drawColor": "#65bb43"},
            {
            "id": "1463726471535",
            "drawType": "curveTriangle",
            "drawColor": "#e64646"
             }
        ],
        "ends": {},
        "id": "1463726460926",
        "nodeType": "decisions",
        "itemType": "label-judgment",
        "url": "/html/activity/plan-iframe.html",
        "x": "701px",
        "y": "198px",
        "info": {"name": "", "fitSelect": "0", "fitSelectText": "", "tags": ["宝宝营养品-营养品"], "desc": "宝宝营养品-营养品"}
    },
    "1463726468554": {
        "num": 7,
        "switch": [],
        "ends": {
            "1463726474944": {"id": "1463726474944", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726468554",
        "nodeType": "activity",
        "itemType": "send-h5",
        "url": "/html/activity/plan-iframe.html",
        "x": "570px",
        "y": "294px",
        "info": {
            "name": "",
            "h5Select": "1",
            "h5SelectText": "婴儿辅食产品试用装赠送",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "perSelect": "no-sel",
            "perSelectText": "请选择",
            "groupSelect": "1",
            "groupSelectText": "不限",
            "desc": "婴儿辅食产品试用装赠送"
        }
    },
    "1463726471535": {
        "num": 5,
        "switch": [],
        "ends": {
             "1463726477339": {"id": "1463726477339", "drawType": "curveTriangle", "drawColor": "#787878"},
             "1463726477339": {"id": "1463726477339", "drawType": "curveTriangle", "drawColor": "#787878"},
             "1463726477339": {"id": "1463726477339", "drawType": "curveTriangle", "drawColor": "#787878"}
        },
        "id": "1463726471535",
        "nodeType": "activity",
        "itemType": "send-h5",
        "url": "/html/activity/plan-iframe.html",
        "x": "829px",
        "y": "290px",
        "info": {
            "name": "",
            "h5Select": "2",
            "h5SelectText": "3~24个月宝宝营养搭配微信群讲座",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "perSelect": "no-sel",
            "perSelectText": "请选择",
            "groupSelect": "1",
            "groupSelectText": "不限",
            "desc": "3~24个月宝宝营养搭配微信群讲座"
        }
    },
    "1463726474944": {
        "num": 3,
        "switch": [],
        "ends": {"1463726484326": {"id": "1463726484326", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726474944",
        "nodeType": "activity",
        "itemType": "wait-set",
        "url": "/html/activity/plan-iframe.html",
        "x": "577px",
        "y": "381px",
        "info": {
            "name": "",
            "desc": "3天",
            "refresh1": "3",
            "refresh2": "day",
            "refresh2Text": "天",
            "radio": "relative",
            "date": "",
            "setTime": ""
        }
    },
    "1463726477339": {
        "num": 3,
        "switch": [],
        "ends": {"1463726488028": {"id": "1463726488028", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726477339",
        "nodeType": "activity",
        "itemType": "wait-set",
        "url": "/html/activity/plan-iframe.html",
        "x": "834px",
        "y": "384px",
        "info": {
            "name": "",
            "desc": "5天",
            "refresh1": "5",
            "refresh2": "day",
            "refresh2Text": "天",
            "radio": "relative",
            "date": "",
            "setTime": ""
        }
    },
    "1463726484326": {
        "num": 49,
        "switch": [],
        "ends": {"1463726492755": {"id": "1463726492755", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726484326",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "567px",
        "y": "479px",
        "info": {
            "name": "",
            "imgSelect": "5",
            "imgSelectText": "婴儿辅食产品试用装赠送",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "婴儿辅食产品试用装赠送"
        }
    },
    "1463726488028": {
        "num": 4,
        "switch": [],
        "ends": {"1463726492755": {"id": "1463726492755", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726488028",
        "nodeType": "activity",
        "itemType": "send-msg",
        "url": "/html/activity/plan-iframe.html",
        "x": "839px",
        "y": "485px",
        "info": {"name": "", textarea:"新产品电子券 H5Z900201X007","desc": "新产品电子券 H5Z900201X007"}
    },
    "1463726492755": {
        "num": 32,
        "switch": [],
        "ends": {"1463726499074": {"id": "1463726499074", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726492755",
        "nodeType": "activity",
        "itemType": "wait-set",
        "url": "/html/activity/plan-iframe.html",
        "x": "712px",
        "y": "572px",
        "info": {
            "name": "",
            "desc": "14 七月, 201612:00 AM",
            "refresh1": "1",
            "refresh2": "no-sel",
            "refresh2Text": "请选择",
            "radio": "specify",
            "date": "14 七月, 2016",
            "setTime": "12:00 AM"
        }
    },
    "1463726499074": {
        "num": 7,
        "switch": [{"id": "1463726504429", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726499074",
        "nodeType": "decisions",
        "itemType": "label-judgment",
        "url": "/html/activity/plan-iframe.html",
        "x": "715px",
        "y": "655px",
        "info": {"name": "", "fitSelect": "no-sel", "fitSelectText": "", "tags": ["新产品首发购买用户"], "desc": "新产品首发购买用户"}
    },
    "1463726504429": {
        "num": 5,
        "switch": [],
        "ends": {"1463726518064": {"id": "1463726518064", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726504429",
        "nodeType": "activity",
        "itemType": "set-tag",
        "url": "/html/activity/plan-iframe.html",
        "x": "708px",
        "y": "750px",
        "info": {"name": "", "desc": "新产品尝鲜者"}
    },
    "1463726518064": {
        "num": 10,
        "switch": [],
        "ends": {"1463726528393": {"id": "1463726528393", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726518064",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "707px",
        "y": "836px",
        "info": {
            "name": "",
            "imgSelect": "9",
            "imgSelectText": "新产品满意度调查",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "新产品满意度调查"
        }
    },
    "1463726528393": {
        "num": 17,
        "switch": [{"id": "1463726543107", "drawType": "curveTriangle", "drawColor": "#65bb43"}, {
            "id": "1463726554513",
            "drawType": "curveTriangle",
            "drawColor": "#e64646"
        }],
        "ends": {},
        "id": "1463726528393",
        "nodeType": "decisions",
        "itemType": "label-judgment",
        "url": "/html/activity/plan-iframe.html",
        "x": "708px",
        "y": "915px",
        "info": {"name": "", "fitSelect": "no-sel", "fitSelectText": "", "tags": ["新产品满意用户"], "desc": "新产品满意用户"}
    },
    "1463726543107": {
        "num": 2,
        "switch": [],
        "ends": {"1463726566844": {"id": "1463726566844", "drawType": "curveTriangle", "drawColor": "#787878"}},
        "id": "1463726543107",
        "nodeType": "activity",
        "itemType": "send-img",
        "url": "/html/activity/plan-iframe.html",
        "x": "573px",
        "y": "1013px",
        "info": {
            "name": "",
            "imgSelect": "10",
            "imgSelectText": "新产品品牌传播图文",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "desc": "新产品品牌传播图文"
        }
    },
    "1463726554513": {
        "num": 18,
        "switch": [],
        "ends": {},
        "id": "1463726554513",
        "nodeType": "activity",
        "itemType": "save-current-group",
        "url": "/html/activity/plan-iframe.html",
        "x": "832px",
        "y": "1013px",
        "info": {"name": "", "group": "3", "groupText": "新产品回访用户", "desc": "新产品回访用户"}
    },
    "1463726566844": {
        "num": 6,
        "switch": [{"id": "1463726572873", "drawType": "curveTriangle", "drawColor": "#65bb43"}],
        "ends": {},
        "id": "1463726566844",
        "nodeType": "decisions",
        "itemType": "wechat-forwarded",
        "url": "/html/activity/plan-iframe.html",
        "x": "570px",
        "y": "1099px",
        "info": {
            "name": "",
            "publicSelect": "1",
            "publicSelectText": "乐友孕婴童 ",
            "imgSelect": "10",
            "imgSelectText": "新产品品牌传播图文",
            "numSelectText": "",
            "refresh1": "1",
            "refresh2": "hour",
            "desc": "乐友孕婴童 "
        }
    },
    "1463726572873": {
        "num": 3,
        "switch": [],
        "ends": {},
        "id": "1463726572873",
        "nodeType": "activity",
        "itemType": "set-tag",
        "url": "/html/activity/plan-iframe.html",
        "x": "569px",
        "y": "1191px",
        "info": {"name": "", "desc": "口碑传播者"}
    }
};
var menu={
    "code": 0,
    "msg": "success",
    "total": 0,
    "data": [
        {
            "type": 0,
            "index": 0,
            "name": "触发",
            "code": "trigger",
            "icon": null,
            "url": null,
            "color": null,
            "children": [
                {
                    "type": 0,
                    "index": 0,
                    "name": "定时触发",
                    "code": "timer-trigger",
                    "icon": "&#xe63f;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 2,
                    "index": 2,
                    "name": "手动触发",
                    "code": "manual-trigger",
                    "icon": "&#xe63e;",
                    "url": null,
                    "color": null
                }
            ]
        },
        {
            "type": 1,
            "index": 1,
            "name": "受众",
            "code": "audiences",
            "icon": null,
            "url": null,
            "color": null,
            "children": [
                {
                    "type": 0,
                    "index": 0,
                    "name": "目标人群",
                    "code": "target-group",
                    "icon": "&#xe639;",
                    "url": null,
                    "color": null
                },
                {

                        "type": 0,
                        "index": 1,
                        "name": "细分人群",
                        "code": " separated-group",
                        "icon": "&#xe639;",
                        "url": null,
                        "color": null
                }
            ]
        },
        {
            "type": 2,
            "index": 2,
            "name": "决策",
            "code": "decisions",
            "icon": null,
            "url": null,
            "color": null,
            "children": [
                {
                    "type": 0,
                    "index": 0,
                    "name": "联系人属性比较",
                    "code": "attr-comparison",
                    "icon": "&#xe66e;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 1,
                    "index": 1,
                    "name": "微信图文是否发送",
                    "code": "wechat-send",
                    "icon": "&#xe66d;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 2,
                    "index": 2,
                    "name": "微信图文是否查看",
                    "code": "wechat-check",
                    "icon": "&#xe66c;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 3,
                    "index": 3,
                    "name": "微信图文是否转发",
                    "code": "wechat-forwarded",
                    "icon": "&#xe673;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 4,
                    "index": 4,
                    "name": "是否订阅公众号",
                    "code": "subscriber-public",
                    "icon": "&#xe66b;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 5,
                    "index": 5,
                    "name": "是否个人号好友",
                    "code": "personal-friend",
                    "icon": "&#xe66a;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 6,
                    "index": 6,
                    "name": "标签判断",
                    "code": "label-judgment",
                    "icon": "&#xe671;",
                    "url": null,
                    "color": null
                }
            ]
        },
        {
            "type": 3,
            "index": 3,
            "name": "行动",
            "code": "activity",
            "icon": null,
            "url": null,
            "color": null,
            "children": [
                {
                    "type": 0,
                    "index": 0,
                    "name": "等待",
                    "code": "wait-set",
                    "icon": "&#xe670;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 1,
                    "index": 1,
                    "name": "保存当前人群",
                    "code": "save-current-group",
                    "icon": "&#xe669;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 2,
                    "index": 2,
                    "name": "设置标签",
                    "code": "set-tag",
                    "icon": "&#xe668;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 5,
                    "index": 5,
                    "name": "发送微信图文",
                    "code": "send-img",
                    "icon": "&#xe63a;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 6,
                    "index": 6,
                    "name": "发送H5活动",
                    "code": "send-h5",
                    "icon": "&#xe63c;",
                    "url": null,
                    "color": null
                },
                {
                    "type": 7,
                    "index": 7,
                    "name": "发送个人号消息",
                    "code": "send-msg",
                    "icon": "&#xe665;",
                    "url": null,
                    "color": null
                }
            ]
        }
    ]
};
/* 20160928 v1.3版
 {
 "code": 0,
 "msg": "success",
 "total": 4,
 "data": [{
 "type": 0,
 "index": 0,
 "name": "触发",
 "code": "trigger",
 "icon": null,
 "url": null,
 "color": null,
 "children": [{
 "type": 0,
 "index": 0,
 "name": "预约触发",
 "code": "timer-trigger",
 "icon": "&#xe63f;",
 "url": null,
 "color": null
 },
 {
 "type": 2,
 "index": 2,
 "name": "手动触发",
 "code": "manual-trigger",
 "icon": "&#xe63e;",
 "url": null,
 "color": null
 }]
 },
 {
 "type": 1,
 "index": 1,
 "name": "受众",
 "code": "audiences",
 "icon": null,
 "url": null,
 "color": null,
 "children": [{
 "type": 0,
 "index": 0,
 "name": "目标人群",
 "code": "target-group",
 "icon": "&#xe639;",
 "url": null,
 "color": null
 }]
 },
 {
 "type": 2,
 "index": 2,
 "name": "决策",
 "code": "decisions",
 "icon": null,
 "url": null,
 "color": null,
 "children": [{
 "type": 2,
 "index": 2,
 "name": "微信图文是否查看",
 "code": "wechat-check",
 "icon": "&#xe66c;",
 "url": null,
 "color": null
 },
 {
 "type": 3,
 "index": 3,
 "name": "微信图文是否转发",
 "code": "wechat-forwarded",
 "icon": "&#xe673;",
 "url": null,
 "color": null
 },
 {
 "type": 4,
 "index": 4,
 "name": "是否订阅公众号",
 "code": "subscriber-public",
 "icon": "&#xe66b;",
 "url": null,
 "color": null
 },
 {
 "type": 6,
 "index": 6,
 "name": "标签判断",
 "code": "label-judgment",
 "icon": "&#xe671;",
 "url": null,
 "color": null
 }]
 },
 {
 "type": 3,
 "index": 3,
 "name": "行动",
 "code": "activity",
 "icon": null,
 "url": null,
 "color": null,
 "children": [{
 "type": 0,
 "index": 0,
 "name": "等待",
 "code": "wait-set",
 "icon": "&#xe670;",
 "url": null,
 "color": null
 },
 {
 "type": 1,
 "index": 1,
 "name": "保存当前人群",
 "code": "save-current-group",
 "icon": "&#xe669;",
 "url": null,
 "color": null
 },
 {
 "type": 2,
 "index": 2,
 "name": "设置标签",
 "code": "set-tag",
 "icon": "&#xe668;",
 "url": null,
 "color": null
 },
 {
 "type": 5,
 "index": 5,
 "name": "发送微信图文",
 "code": "send-img",
 "icon": "&#xe63a;",
 "url": null,
 "color": null
 }]
 }],
 "date": "2016-09-28",
 "total_count": 4,
 "col_names": []
 }
 */

var matchTagMock=()=>{
    var data=[],system_tag=[],custom_tag=[];
    if(Math.random()>0.3){
        if(Math.random()>0.2){
            system_tag.push({
                "tag_id": randomNum(10),
                "tag_name": "人口属性市",
                "tag_path": "用户属性>地理区域>",
                "tag_value": "上海市"+randomNum(3),
                "tag_value_seq": randomNum(10)
            })
            var random=Math.random()>0.6;
            if(random){
                var num=Math.floor(random*10);
                while(num--){
                    system_tag.push({
                        "tag_id": randomNum(10),
                        "tag_name": "人口属性市",
                        "tag_path": "用户属性>地理区域>",
                        "tag_value": "上海市"+randomNum(3),
                        "tag_value_seq": randomNum(10)
                    })
                }
            }

        }
        if(Math.random()>0.3){
            custom_tag.push({
                "custom_tag_id": randomNum(10),
                "custom_tag_name": "火星"+randomNum(3),
                "tag_path": "太阳系>",
                "custom_tag_category_id": "BulUGcgLOt1483518681313",
                "custom_tag_category_name": "未分类"
            })
            var random=Math.random()>0.6;
            if(random){
                var num=Math.floor(random*10);
                while(num--){
                    custom_tag.push({
                        "custom_tag_id": randomNum(10),
                        "custom_tag_name": "火星"+randomNum(3),
                        "tag_path": "太阳系>",
                        "custom_tag_category_id": "BulUGcgLOt1483518681313",
                        "custom_tag_category_name": "未分类"
                    })
                }
            }

        }
        data.push(
            {
                "system_tag": system_tag,
                "system_total": 1,
                "system_total_count": 1,
                "custom_tag": custom_tag,
                "custom_total": 1,
                "custom_total_count": 1
            }
        )

    }
    return {
        "code" : 0,
        "msg" : "success",
        "total" : 1,
        "data" : data,
        "total_count" : 1
    }
};
let segmentAll=()=>{
  let data=[];
  if(Math.random()>0.2){
      var num=randomNum(1);
      while(num--){
          data.push({
              "segment_name": randomLetters(4)+randomNum(2),
              "publish_status": 1,
              "segment_head_id": Math.random(),
              "cover_count": Math.floor(Math.random()*100)
          })
      }
  }
  return {
      "code": 0,
      "msg": "success",
      "total": 1,
      "data": data,
      "date": "2017-01-19",
      "total_count": 10,
      "col_names": []
  };
};
let audienceAll=()=>{
    let data=[];
    if(Math.random()>0.2){
        var num=randomNum(1);
        while(num--){
            data.push( {
                "audience_list_name": randomLetters(5),
                "create_time": "2017-01-12 09:53:33",
                "audience_list_id": randomNum(5),
                "audience_count": randomNum(5),
                "source_name": "营销活动"
            })
        }
    }
    return {
        "code": 0,
        "msg": "success",
        "total": 1,
        "data": data,
        "date": "2017-01-19",
        "total_count": 10,
        "col_names": []
    };
};
let material=()=>{
    let data=[];
    if(Math.random()>0.2){
        var num=randomNum(1);
        while(num--){
           var id= randomNum(1)
            data.push( {
                "sms_material_id":id,
                "sms_material_name": "火星人"+id
            })
        }
    }
    return {
                "code" : 0,
                "msg" : "success",
                "total" : 2,
                "data" : data,
                "total_count" : 2
            };
};
let materialUsestatus=()=>{
    var rand= Math.random();
    var b=rand>0.9;
    return {
        "code" : 0,
        "msg" : "success",
        "total" : 1,
        "data" : [
            {
                "sms_material_id": "p7dIdVs6TP1483954957293",
                "flag": b
            }
        ],
        "total_count" : 1
    };

};
module.exports.data1 = data1;
module.exports.data2 = data2;
module.exports.data3 = data3;
module.exports.data4 = data4;
module.exports.tar = tar;
module.exports.menu = menu;
module.exports.matchTag = matchTagMock;
module.exports.segmentAll = segmentAll;
module.exports.audienceAll = audienceAll;
module.exports.material = material;
module.exports.materialUsestatus = materialUsestatus;
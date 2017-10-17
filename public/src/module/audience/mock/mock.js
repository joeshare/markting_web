/**
 * Created by AnThen on 2016-11-2.
 */
'use strict';
function random(n)
{
    var num="";
    for(var i=0;i<n;i++)
    {
        num+=Math.floor(Math.random()*10);
    }
    return num;
}
function randomName(len){
    var x = "媒体渠道大类气味儿哟无二哦旅行牛拉车围棋软件巍峨方面塑料袋密封";
    var str = "";
    for (var i = 0; i < len; i++) {
        str += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return str;

}
let data = {
    "ver": "1.4.1",
    "user_id": "web-test",
    "user_token": "FpqWT3q7T3IufBkdwPjuGqVmBbkH2fcJ",
    "segment_head_id": "",
    "segment_name": "AAA",
    "publish_status": 1,
    "filter_groups": [{
        "group_seq": 2,
        "tag_id": "KyQYBEHT_1",
        "tag_group_id": "KyQYBEHT",
        "tag_name": "睡眠客户-否",
        "exclude": 1
    }, {
        "groupId": "group2",
        "group_index": 2,
        "tag_list": [{
            "group_seq": 1,

            "tag_id": "Zc2E7DO0",
            "tag_name": "水果",
            tag_ids: [{
                "tag_val": "苹果",
                "tag_val_id": "LBej3qLy_2"
            }],
            "exclude": 1
        }]
    }]
};
let data2 = {
    "oper": "Mock_奥巴马",
    "id": 91,
    "updatetime": "2016-11-02 15:50:47",
    "segment_head_id": "",
    "segment_name": "AAA",
    "publish_status": 1,
    "filter_groups": [
        {
            "group_id": "group1",
            "group_name": "fenzu",
            "group_index": 1,
            "tag_list": [
                {
                    "tag_id": random(1),
                    "tag_name": "性别",
                    "tag_exclude": 0,
                    "tag_type":"",
                    "tag_index":1,
                    "tag_value_list": [
                        {
                            "tag_value_id": "XXXX_0",
                            "tag_value": "男"
                        },
                        {
                            "tag_value_id": "XXXX_1",
                            "tag_value": "女"
                        }
                    ]
                },
                {
                    "tag_id": random(2),
                    "tag_name": "年龄",
                    "tag_exclude": 1,
                    "tag_value_list": [
                        {
                            "tag_value_id": "XXXX_0",
                            "tag_value": "0-1"
                        },
                        {
                            "tag_value_id": "XXXX_1",
                            "tag_value": "1-2"
                        }
                    ]
                }
            ]
        },
        {
            "group_id": "group2",
            "group_name": "数组11111",
            "group_index": 1,
            "tag_list": [
                {
                    "tag_id":random(3),
                    "tag_name": "性别1",
                    "tag_exclude": 0,
                    "tag_value_list": [
                        {
                            "tag_value_id": "XXXX_0",
                            "tag_value": "男"
                        },
                        {
                            "tag_value_id": "XXXX_1",
                            "tag_value": "女"
                        }
                    ]
                },
                {
                    "tag_id": random(4),
                    "tag_name": "年龄2",
                    "tag_exclude": 1,
                    "tag_value_list": [
                        {
                            "tag_value_id": "XXXX_0",
                            "tag_value": "0-1"
                        },
                        {
                            "tag_value_id": "XXXX_1",
                            "tag_value": "1-2"
                        }
                    ]
                }
            ]
        },
        {
            "group_id": "group3",
            "group_name": "数组3333",
            "group_index": 1,
            "tag_list": [
                {
                    "tag_id":random(5),
                    "tag_name": "性别3",
                    "tag_exclude": 0,
                    "tag_value_list": [
                        {
                            "tag_value_id": "XXXX_0",
                            "tag_value": "男"
                        },
                        {
                            "tag_value_id": "XXXX_1",
                            "tag_value": "女"
                        }
                    ]
                },
                {
                    "tag_id": random(6),
                    "tag_name": "年龄3",
                    "tag_exclude": 1,
                    "tag_value_list": [
                        {
                            "tag_value_id": "XXXX_0",
                            "tag_value": "0-1"
                        },
                        {
                            "tag_value_id": "XXXX_1",
                            "tag_value": "1-2"
                        }
                    ]
                }
            ]
        },
        {
            "group_id": "group4",
            "group_name": "数组444",
            "group_index": 1,
            "tag_list": [
                {
                    "tag_id":random(7),
                    "tag_name": "性别4",
                    "tag_exclude": 0,
                    "tag_value_list": [
                        {
                            "tag_value_id": "XXXX_0",
                            "tag_value": "男"
                        },
                        {
                            "tag_value_id": "XXXX_1",
                            "tag_value": "女"
                        }
                    ]
                },
                {
                    "tag_id": random(8),
                    "tag_name": "年龄4",
                    "tag_exclude": 1,
                    "tag_value_list": [
                        {
                            "tag_value_id": "XXXX_0",
                            "tag_value": "0-1"
                        },
                        {
                            "tag_value_id": "XXXX_1",
                            "tag_value": "1-2"
                        }
                    ]
                }
            ]
        }
    ]
};
var tagData={
    "tag_id": "XXXXXX",
    "tag_name": "性别",
    "tag_exclude": 0,
    "tag_value_list": [
        //{
        //    "tag_value_id": "XXXX_0",
        //    "tag_value": "男"
        //},
        //{
        //    "tag_value_id": "XXXX_1",
        //    "tag_value": "女"
        //},
        //{
        //    "tag_value_id": "XXXX_1",
        //    "tag_value": "泰上帝发誓地方撒国不限"
        //},
        //{
        //    "tag_value_id": "XXXX_1",
        //    "tag_value": "泰上帝发誓地方撒国泰国"
        //},
        //{
        //    "tag_value_id": "XXXX_1",
        //    "tag_value": "泰上帝发誓地方撒国2"
        //},
        {
            "tag_value_id": "XXXX_1",
            "tag_value": "泰上帝发誓地方撒国泰国1泰上帝发誓地方撒国不限泰上帝发誓地方撒国不限泰上帝发誓地方撒国不限泰上帝发誓地方撒国不限泰上帝发誓地方撒国不限泰上帝发誓地方撒国不限"
        }
    ]
}
function randomTagData(){
    let tag_value_list=[];
    let len=random(2) ;
    for(let x=0;x<len;x++){
        tag_value_list.push((()=>{
            return {
                "tag_value_id":random(5),
                "tag_value": randomName(7)
            };
        })())
    }
    return {
        "tag_id":random(5),
        "tag_name": randomName(2),
        "tag_exclude": 0,
        "tag_value_list": tag_value_list
    };
}
function randomFunnelTag(){
    return  {
        "tag_id":random(6),
        "tag_name":randomName(5),
        "tag_count":random(3)*1
    };
}
/**
 *  {"tag_id":"MBlyH6F1_0","tag_name":"媒体渠道大类-SEM","tag_count":random(3)},
 {"tag_id":"LBej3qLy_0","tag_name":"男-性别","tag_count":random(3)}
 * @returns {{code: number, msg: string, total: number, data: Function}}
 */
var funnelData=function(){
    let res={"code":0,"msg":"success","total":2,
        "data":(()=>{
            let arr=[];
            let len=random(1) ;
            for(let x=0;x<len;x++){
                arr.push(randomFunnelTag())
            }
            return arr;
        })(),
        "date":"2016-11-04","total_count":2,"col_names":[]
    }
    console.log('funnelData',res)
    return res;
}

let funnelSubmit={
    "method": "${同接口名称}",
    "user_token": "6200819d9366af1383023a19907ZZf9048e4c14fd56333b263685215",
    "filter_group": {
        "group_id": "group1",
        "group_name": "fenzu",
        "group_index": 1,
        "tag_list": [{
            "tag_id": "XXXXXX",
            "tag_name": "性别",
            "tag_exclude": 1,
            "tag_index": 1,
            "tag_value_list": [{
                "tag_value_id": "XXXX_0",
                "tag_value": "男"
            },
                {
                    "tag_value_id": "XXXX_1",
                    "tag_value": "女"
                }]
            },
            {
                "tag_id": "XXXXXX",
                "tag_name": "年龄",
                "tag_exclude": 1,
                "tag_index": 2,
                "tag_value_list": [{
                    "tag_value_id": "XXXX_0",
                    "tag_value": "0-1"
                },
                    {
                        "tag_value_id": "XXXX_1",
                        "tag_value": "1-2"
                    }]
            }]
    }
};
var newFunnelCharts= {
    "code": 0,
    "msg": "success",
    "total": 2,
    "data": [{
        "group_id": "group1",
        "group_name": "fenzu",
        "group_index": 1,
        "group_change": 1,//0 表示不重算 1 重算
        "chart_data": [
            {
                "tag_id": 101,
                "tag_name": "性别",
                "tag_count": 100
            },
            {
                "tag_id": 102,
                "tag_name": "年龄",
                "tag_count": 90
            }]
    },
        {
            "group_id": "group1",
            "group_name": "fenzu",
            "group_index": 1,
            "group_change": 1,//0 表示不重算 1 重算
            "chart_data": [
                {
                    "tag_id": 101,
                    "tag_name": "性别",
                    "tag_count": 100
                },
                {
                    "tag_id": 102,
                    "tag_name": "年龄",
                    "tag_count": 90
                }]
        }]
};
module.exports = {
  body:data2,
  tagData:tagData,
  getTagData:randomTagData,
  funnelData:funnelData

};
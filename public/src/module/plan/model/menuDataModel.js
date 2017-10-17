/**
 * Author LLJ
 * Date 2016-5-6 9:59
 */
//
var DEFAULTURL = BASE_PATH + '/html/activity/plan-iframe.html';
var GROUPURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
var TRIGGERURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';

function model() {
    var menu = {
        //触发
        trigger: [
            ['&#xe63f;', '定时触发', "trigger", TRIGGERURL, "timer-trigger"],
            ['&#xe63d;', '事件触发', "trigger", TRIGGERURL, "event-trigger"],
            ['&#xe63e;', '手动触发', "trigger", TRIGGERURL, "manual-trigger"]
        ],
        //受众
        audiences: [
            ['&#xe639;', '目标人群', 'audiences', GROUPURL, "target-group"],
            ['&#xe639;', '细分人群', 'audiences', GROUPURL, "segement-group"],
            ['&#xe639;', '固定人群', 'audiences', GROUPURL, "fix-group"],
            ['&#xe66f;', '事件人群', 'audiences', GROUPURL, "event-group"],
        ],
        //决策
        decisions: [
            ['&#xe66e;', '联系人属性比较', 'decisions', DEFAULTURL, "attr-comparison"],
            ['&#xe66d;', '微信图文是否发送', 'decisions', DEFAULTURL, "wechat-send"],
            ['&#xe66c;', '微信图文是否查看', 'decisions', DEFAULTURL, "wechat-check"],
            ['&#xe673;', '微信图文是否转发', 'decisions', DEFAULTURL, "wechat-forwarded"],
            ['&#xe66b;', '是否订阅公众号', 'decisions', DEFAULTURL, "subscriber-public"],
            ['&#xe66a;', '是否个人号好友', 'decisions', DEFAULTURL, "personal-friend"],
            ['&#xe671;', '标签判断', 'decisions', DEFAULTURL, "label-judgment"],
        ],
        // 活动
        activity: [
            ['&#xe670;', '等待', 'activity', DEFAULTURL, "wait-set"],
            ['&#xe669;', '保存当前人群', 'activity', DEFAULTURL, "save-current-group"],
            ['&#xe668;', '设置标签', 'activity', DEFAULTURL, "set-tag"],
            ['&#xe667;', '添加到其他活动', 'activity', DEFAULTURL, "add-activity"],
            ['&#xe666;', '转移到其他活动', 'activity', DEFAULTURL, "move-activity"],
            ['&#xe63a;', '发送微信图文', 'activity', DEFAULTURL, "send-img"],
            ['&#xe63c;', '发送H5活动', 'activity', DEFAULTURL, "send-h5"],
            ['&#xe665;', '发送个人号消息', 'activity', DEFAULTURL, "send-msg"],
            ['&#xe66c;', '发送短信', 'activity', DEFAULTURL, "send-sms"],
        ]
    };
    //根据itemType获取数据
    this.getDataByItemType=function(type){
        var data=[];
        for(var k in menu){
            var classArr=menu[k];
            classArr.every(function(nodeArr,i){
                if(nodeArr.indexOf(type)>-1){
                    data=nodeArr;
                    return false;
                }
                return true;
            })
            if(data.length){
                break;
            }
        }
        return data;
    };
    this.getNameByItemType=function(type){
         return this.getDataByItemType(type)[1];
    }

}
module.exports =model;
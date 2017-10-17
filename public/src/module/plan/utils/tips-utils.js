/**
 * Author LLJ
 * Date 2016-5-10 9:53
 */
var PICKADATESTARTTIME;
var DAYTIME=24*3600*1000;
var DIFFTIME=DAYTIME*7;
var optTpl=require('../tpl/option-tpl.html');
var dateTime=require('./dateTime');
var ATTRCOMPARSION;

function getVal(v) {
    return v || "";
}
function getSelectText(v){
    return v=="请选择"?"":v;
}
var DEFAULTURL = BASE_PATH + '/html/activity/plan-iframe.html';
var GROUPURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
var TRIGGERURL = 'http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';
var constant=require('./constant.js');
var refresh_interval_type_arr=constant.refresh_interval_type_arr;
var refresh_interval_type_arr_v17=constant.refresh_interval_type_arr_v17;
var triggerURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdd9e1c5030a#mode=integrated&analysisId=8aaffc4854cd9ee40154cdd3cf3302de';
var audiencesURL='http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854cd9ee40154cdda7240031f#mode=integrated';
//url string
//userIds Array
function postIframeData(url,  userIds) {
    var $input = $('<input name="postData" type="hidden" />').val(JSON.stringify({userIds:userIds}));
    var $form = $('<form style="position:absolute;top:-1200px;left:-1200px;" action="' + url + '" method="POST" target="plan-bas-con"></form>').appendTo(document.body);
    $form.append($input).submit();
}

function changeChart(url){
    document.querySelector("#plan-chart").src=url;
}
//展示Bas 数据
function showBas(id){
    util.api({
        url: "?method=mkt.dataanalysis.audiences.get",
        data: {
            audience_type: 0,//0-细分人群 1-固定人群
            audience_ids:id+""//string 人群ID为0。多个用逗号分隔
        },
        success: function (res) {
            if (res && res.code == 0&&res.data) {
                changeChart(audiencesURL);
                util.postIframeData(audiencesURL,'plan-bas-con', JSON.stringify({userIds:res.data}))
                //postIframeData(audiencesURL, res.data)
            }else{
                changeChart(DEFAULTURL);
            }
        },
        error: function (res) {
            changeChart(DEFAULTURL);
        }
    })
}


function getDataByNodeId(id){
   return $('#'+id).data("data");
}
//刷新频率验证
function numberValidate(val){
    var reg =  /^\d+$/;
   return  (reg.test(val)&&val>0)?val:1;
}
//联动 设置 二级菜单加载
function subSelectRender(apiArg,callBack){
  util.api({
      url:"?method=mkt.asset.wechat.list.get",
      data:{
          asset_id:apiArg.key,
          size:30
      },
      success:function(res){
         if(res&&res.code==0&&res.data&&res.data.length){
             callBack&&callBack.call(null,res.data);
         }
      }
  })
}
function openMacketBAS(){
    var $openMacket=$('#openMacket');
    $openMacket.is(":visible")&&$openMacket.click();
}
var typeMap = {
    //定时触发
    'timer-trigger': {
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                  var $startDate= $(sel).find("#timer-trigger-start-date"),
                      $endDate= $(sel).find("#timer-trigger-end-date");
                    PICKADATESTARTTIME=new Date().getTime();

                    $startDate.pickadate({
                        format: 'yyyy-mm-dd',
                        selectMonths: true, // Creates a dropdown to control month
                        selectYears: 5, // Creates a dropdown of 15 years to control year
                        onOpen: function() {
                            this.set("min",new Date(PICKADATESTARTTIME))
                        },
                        onSet: function(thingSet) {
                            PICKADATESTARTTIME= thingSet.select;
                            var endDateVal=$endDate.val();
                            if(PICKADATESTARTTIME>=(new Date(endDateVal).getTime()-DAYTIME)){
                                $endDate.pickadate('picker').set('select', PICKADATESTARTTIME+DIFFTIME)
                            }
                        }
                    });

                    $endDate.pickadate({
                        format: 'yyyy-mm-dd',
                        selectMonths: true, // Creates a dropdown to control month
                        selectYears: 5, // Creates a dropdown of 15 years to control year
                        onOpen: function() {
                            this.set("min",new Date(PICKADATESTARTTIME+DAYTIME))
                        }
                    });
                    $(sel).find("#timer-trigger-start-time").lolliclock({
                        autoclose: true,
                        hour24: true,//24小时制
                        afterHide: function () {
                           // console.info('小时：' + $('#start-time').data('lolliclock').hours)
                        }
                    });
                    $(sel).find("#timer-trigger-end-time").lolliclock({
                        autoclose: true,
                        hour24: true,//24小时制
                        afterHide: function () {
                            //console.info('小时：' + $('#end-time').data('lolliclock').hours)
                        }
                    });
                },
                end: function () {
                    $('.lolliclock-popover').remove();//注意这个坑，弹窗销毁后，里面NEW的东西一定要销毁
                }
            };

        },
        'getDataByType': function (sel) {
            var now=new Date().getTime(),
                diffTime=24*3600*1000*7,
                defaultStartDate=dateTime.getDateStr(now),
                defaultStartTime=dateTime.getTimeStr(now),
                defaultEndDate=dateTime.getDateStr(now+diffTime),
                defaultEndTime=dateTime.getTimeStr(now+diffTime),
                name = $("#timer-trigger-name").val(),
                startDate = $("#timer-trigger-start-date").val()||defaultStartDate,
                startTime = $("#timer-trigger-start-time").val()||defaultStartTime,
                endDate = $("#timer-trigger-end-date").val()||defaultEndDate,
                endTime = $("#timer-trigger-end-time").val()||defaultEndTime,
                desc = dateTime.padTime(startDate+" "+startTime);
            return {
                name: getVal(name),
                startDate:  startDate,
                startTime: dateTime.timeHourMin(startTime),
                endDate:endDate,
                endTime: dateTime.timeHourMin(endTime),
                "start_time":desc,
                "end_time":dateTime.padTime(endDate+" "+endTime),
                desc: getVal(desc != desc ? "" : desc)
            };
        }

    },
    'manual-trigger': {
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                },
                end: function () {
                },
                cancel: function(index){
                    return false;
                }
            };

        },
        'getDataByType': function (sel) {
            var val = $('#manual-trigger-tips input[type="radio"]:checked').val(),
                remark =$("#manual-trigger-textarea").val(),
                run=val=='manual'?'手动停止':'仅运行一次';
            return {
                name:getVal(remark?remark: ""),
                run:run,
                manualType: val||'only',
                remark: getVal(remark?remark: ""),
                desc: getVal(run != run ? "" : run)
            };
        }

    },
    //目标人群
    'target-group': {
        'getEventByType': function (sel) {
            return {
                success: function () {
                        $(sel).find("select").material_select();
                        $("#target-group-select").off().on("change",function(e){
                               var $tar=$(this),val=$tar.val();
                                window.old_iframe_url=audiencesURL;
                                if(val){
                                    showBas(val);
                                }else{
                                    changeChart(DEFAULTURL);
                                }
                        })

                        $("#target-group-refresh-select1").off().on("keyup",function(e){
                            var $tar=$(this),val=$tar.val();
                            $tar.val(numberValidate(val));
                        })
                        var val= $("#target-group-select").val();
                        if(val){
                                openMacketBAS();
                                showBas(val);
                            window.old_iframe_url=audiencesURL;
                        }else{
                            changeChart(DEFAULTURL);
                        }
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#target-group-name").val(),
                select = $("#target-group-select").val(),
                selectText = $("#target-group-select").find("option:selected").text(),
                newSelect = $("#target-group-new-select").val()||0,
                refresh1 = $("#target-group-refresh-select1").val(),
                refresh2 = $("#target-group-refresh-select2").val();
            return {
                name: getVal(name),
                segmentation_id: getVal(select),
                segmentation_name: getSelectText(selectText),
                allowed_new: newSelect,//0:允许,1:不允许
                refresh_interval_type_arr:refresh_interval_type_arr,
                refresh_interval: getVal(refresh1),
                refresh_interval_type: getVal(refresh2),
                desc: getSelectText(selectText),
                BASEPATH: BASE_PATH
            };
        }
    },
    'segement-group':{//细分人群
        'getEventByType': function (sel) {
            return {
                success: function () {
                    $(sel).find("select").material_select();
                    //数字校验 v1.6 有 v1.7 暂时不用了
                    $("#sepement-group-refresh-select1").off().on("keyup",function(e){
                        var $tar=$(this),val=$tar.val();
                        $tar.val(numberValidate(val));
                    })
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#segement-group-name").val(),
                select = $("#segement-group-select-val").val(),
                selectText = $("#segement-group-select-text").text(),
                newSelect = $("#segement-group-new-select").val()||0,
                refresh1 = $("#segement-group-refresh-select1").val(),
                refresh2 = $("#segement-group-refresh-select2").val();
            return {
                name: getVal(name),
                segmentation_id: getVal(select),
                segmentation_name: getSelectText(selectText),
                allowed_new: newSelect,//0:允许,1:不允许
                refresh_interval_type_arr:refresh_interval_type_arr_v17,
                refresh_interval: 1,//v1.7 写死
                refresh_interval_type: getVal(refresh2),
                desc: getSelectText(selectText),
                BASEPATH: BASE_PATH
            };
        }
    },
    'fix-group':{//固定人群
        'getEventByType': function (sel) {
            return {
                success: function () {
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#fix-group-name").val(),
                fix_group_id = $("#fix-group-select-val").val(),
                fix_group_name = $("#fix-group-select-text").text();
            return {
                name: getVal(name),
                "fix_group_id": fix_group_id,
                "fix_group_name": fix_group_name,
                desc: getSelectText(fix_group_name)
            };
        }
    },
    //微信图文发送
    'wechat-send': {
        'getEventByType': function (sel) {
            return {//wechat-send
                success: function () {
                    $(sel).find("select").material_select();
                    $("#wechat-send-refresh1").off().on("keyup",function(e){
                        var $tar=$(this),val=$tar.val();
                        $tar.val(numberValidate(val));
                    })
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#wechat-send-name").val(),
                select = $("#wechat-send-public-number").val(),
                selectText = $("#wechat-send-public-number").find("option:selected").text(),
                img = $("#wechat-send-img").val(),
                imgText = $("#wechat-send-img").find("option:selected").text(),
                refresh1 = $("#wechat-send-refresh1").val(),
                refresh2 = $("#wechat-send-refresh2").val();
            return {
                refresh_interval_type_arr:refresh_interval_type_arr,
                name: getVal(name),
                "asset_id":getVal(select),//公众号id(后端字段)
                "asset_name":getSelectText(selectText),//公众号name(后端字段)
                "img_text_asset_id":getVal(img),//图文id(后端字段)
                "img_text_asset_name":getVal(imgText),//图文name(后端字段)
                refresh_interval: getVal(refresh1),
                refresh_interval_type: getVal(refresh2),
                desc: getSelectText(selectText)
            };
        }
    },
    //微信查看
    'wechat-check': {
        'getEventByType': function (sel) {
            //wechat-check
            return {
                success: function () {
                    $(sel).find("select").material_select();

                    $("#wechat-check-refresh1").off().on("keyup",function(e){
                        var $tar=$(this),val=$tar.val();
                        $tar.val(numberValidate(val));
                    })
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#wechat-check-name").val(),
                select = $("#wechat-check-public-number").val(),
                selectText = $("#wechat-check-public-number").find("option:selected").text(),
                img = $("#wechat-check-img").val(),
                imgText = $("#wechat-check-img").find("option:selected").text(),
                time = $("#wechat-check-time").val()||0,
                completed = $("#wechat-check-complete").val()||0,
                refresh1 = $("#wechat-check-refresh1").val(),
                refresh2 = $("#wechat-check-refresh2").val();
            return {
                refresh_interval_type_arr:refresh_interval_type_arr,
                name: getVal(name),
                "asset_id":getVal(select),//公众号id
                "asset_name":getSelectText(selectText),//公众号name
                "img_text_asset_id":getVal(img),//图文id
                "img_text_asset_name":getVal(imgText),//图文name
                read_time: time,//查看时长,0:不限,1:超一分钟,2:超三分钟,3:超五分钟,4:超十分钟
                read_percent: completed,
                refresh_interval: getVal(refresh1),
                refresh_interval_type: getVal(refresh2),
                desc: getSelectText(selectText)
            };
        }
    },
    //保存当前人群
    'save-current-group': {
        'getEventByType': function (sel) {
            //save-current-group
            return {
                success: function () {//保存当前人群 打开时要增加回车事件 在tipModel 中完成
                    $(sel).find("select").material_select();
                },
                end:function(){//保存当前人群 关闭时要销毁回车事件  在tipModel 中完成

                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#save-current-group-name").val(),
                group = $("#save-current-group-select").val(),
                groupText = $("#save-current-group-select").find("option:selected").text();
            return {
                name: getVal(name),
                audience_id: getVal(group),
                audience_name: getVal(groupText),
                desc: getSelectText(groupText)
            };
        }
    },
    //设置标签
    'set-tag': {
        'getEventByType': function (sel) {
            return {
                success: function () {
                },
                end:function(){

                }
            };
        },
        'getDataByType': function (sel) {
            var name = $("#set-tag-name").val(),
                desc = $("#set-tag-textarea").val(),
                $tags = $("#set-tag-content .set-tag"),
                desc = "",
                tags = [];
            if ($tags.length) {
                $tags.each(function (i, itm) {
                    var $thiz = $(itm),
                        name = $thiz.attr("attr-name") || "";
                    tags.push(name);
                })
            }
            desc = tags.length ? (tags.length>1?tags[0]+"...":tags[0]): "";
            return {
                name: getVal(name),
                tag_names:tags,
                desc: getVal(desc)
            };
        }
    },
    //等待设置
    'wait-set': {
        'getEventByType': function (sel) {
            //wait-set
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                    $(sel).find("#wait-set-date").pickadate({
                        format: 'yyyy-mm-dd',
                        selectMonths: true, // Creates a dropdown to control month
                        selectYears: 5, // Creates a dropdown of 15 years to control year
                        onOpen: function() {
                            this.set("min",new Date())
                        },
                        onSet: function(thingSet) {
                            //thingSet.select
                        }
                    });
                    $(sel).find("#wait-set-time").lolliclock({
                        autoclose: true,
                        hour24: true,//24小时制
                        afterHide: function () {
                            // console.info('小时：' + $('#start-time').data('lolliclock').hours)
                        }
                    });
                        $("#wait-set-refresh1").off().on("keyup",function(e){
                            var $tar=$(this),val=$tar.val();
                            $tar.val(numberValidate(val));
                        })
                },
                end: function () {
                    $('.lolliclock-popover').remove();//注意这个坑，弹窗销毁后，里面NEW的东西一定要销毁
                }
            }
        },
        'getDataByType': function (sel) {
            var now=new Date().getTime(),
                defaultStartDate=dateTime.getDateStr(now),
                defaultStartTime=dateTime.getTimeStr(now);
            var name = $("#wait-set-name").val(),
                date = $("#wait-set-date").val()||defaultStartDate,
                setTime = $("#wait-set-time").val()||defaultStartTime,
                radio = $(sel).find("input[type='radio']:checked").val(),
                refresh1 = $("#wait-set-refresh1").val(),
                refresh2 = $("#wait-set-refresh2").val(),
                refresh2Text = $("#wait-set-refresh2").find("option:selected").text(),
                desc = "",type,specific_time;
            if (radio == 'relative') {//0:相对时间
                type=0;
                desc = refresh1 + refresh2Text + "";
            } else if (radio == 'specify') {//指定时间
                type=1;
                desc=specific_time= desc = date +" "+ setTime + ":00";
            }
            return {
                name: getVal(name),
                desc: getVal(desc),
                relative_value: getVal(refresh1),
                relative_type: getVal(refresh2),
                refresh2Text: getVal(refresh2Text),
                refresh_interval_type_arr:refresh_interval_type_arr,
                radio: getVal(radio),
                date: getVal(date),
                setTime: dateTime.timeHourMin(setTime),
                "specific_time":specific_time,
                type:type

            };
        }
    },
    'label-judgment': {//标签判断
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $('#label-judgment-tag').dropdown({
                        constrain_width: true,
                        belowOrigin: true
                    });
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#label-judgment-name").val(),
                fitSelect = $("#label-judgment-select").val(),
                fitSelectText = $("#label-judgment-select").find("option:selected").text(),
                $tags = $("#label-judgment-tag-content .active-tag"),
                desc = "",
                tags = [];
            if ($tags.length) {
                $tags.each(function (i, itm) {
                    var $thiz = $(itm),
                        tag_id = $thiz.attr("attr-val") || "",
                        tag_name = $thiz.attr("attr-name") || "",
                        tag_type = $thiz.attr("attr-type") || "";
                    tags.push({tag_id,tag_name,tag_type});
                })
            }
            desc = tags.length ? (tags.length>1?tags[0].tag_name+"...":tags[0].tag_name): "";
            //"tags":[{"tag_id":11,"tag_name":"abc"},{"tag_id":22,"tag_name":"gty"}]
            return {
                name: getVal(name),
                rule: getVal(fitSelect),
                ruleText: getVal(fitSelectText),
                tags: tags,
                desc: getVal(desc)
            };
        }
    },
    'send-h5': {//发送h5
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                    var cache=getDataByNodeId($(this)[0].follow.id);
                    function subSelect(data){
                        var subSelectArr=[],res=data[0];
                        var selected=cache?cache.group_id:"";
                        if(res.group_data&&res.group_data.length){
                           // {"group_id":1,"group_name":"母婴群1","member_count":200},
                            res.group_data.forEach(function(itm,i){
                                subSelectArr.push({val:itm.group_id,text:itm.group_name});
                            })

                        }
                        var opts= _.template($(optTpl).filter('#select').html())({selectArr:subSelectArr,selected:selected});
                        $('#send-h5-group-select').html(opts).material_select();
                    }
                    $('#send-h5-per-select').off().on("change",function(e){
                        var $tar= $(this),val=$tar.val(),text=$tar.find("option:selected").text();
                        subSelectRender({
                            key:val
                        },subSelect);
                    })
                    subSelectRender({
                        key:$('#send-h5-per-select').val()
                    },subSelect);
                }
            }
        },
        'getDataByType': function (sel) {
            var name = $("#send-h5-name").val(),
                h5Select = $("#send-h5-h5-select").val(),
                h5SelectText = $("#send-h5-h5-select").find("option:selected").text(),
                publicSelect = $("#send-h5-public-select").val(),
                publicSelectText = $("#send-h5-public-select").find("option:selected").text(),
                perSelect = $("#send-h5-per-select").val(),
                perSelectText = $("#send-h5-per-select").find("option:selected").text(),
                groupSelect = $("#send-h5-group-select").val(),
                groupSelectText = $("#send-h5-group-select").find("option:selected").text();
            return {
                name: getVal(name),
                img_text_asset_id: h5Select,//图文id
                img_text_asset_name: h5SelectText,//图文name
                pub_asset_id: publicSelect,//公众号id
                pub_asset_name: publicSelectText,//公众号name
                prv_asset_id: perSelect,//个人号id
                prv_asset_name: perSelectText,//个人号name
                group_id: groupSelect,
                group_name: groupSelectText,
                desc: getSelectText(h5SelectText)
            };
        }
    },
    'send-img': {//发送微信图文
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function () {
            var name = $("#send-img-name").val(),
                imgSelect = $("#send-img-img-select-val").val(),
                imgSelectText = $("#send-img-img-select").val(),
                publicSelect = $('#send-img-public-val').val(),
                publicSelectText = $("#send-img-public-select").find("option:selected").text();
            return {
                name: getVal(name),
                img_text_asset_id: imgSelect,//图文id
                img_text_asset_name: imgSelectText,//图文name
                asset_id: publicSelect,//公众号id
                asset_name: publicSelectText,//公众号name
                desc: getSelectText(imgSelectText)
            };
        }
    },
    'send-sms': {//发送短信
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                }
            }
        },
        'getDataByType': function () {
            var name = $("#send-sms-name").val(),
                typeSelect = $("#send-sms-type-select").val(),
                typeSelectText = $("#send-sms-type-select").find("option:selected").text(),
                materialSelect = $('#send-sms-material-val').val(),
                materialSelectText = $("#send-sms-material-select").val();

            return {
                name: getVal(name),
                sms_category_type: typeSelect,//类型id
                sms_category_name: typeSelectText,//类型name
                sms_material_id: materialSelect,//素材id
                sms_material_name: materialSelectText,//素材name
                desc: getSelectText(materialSelectText)
            };
        }
    },
    'send-msg': {//发送个人信息
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    var cache=getDataByNodeId($(this)[0].follow.id);
                    var selected=cache?cache.group_id:"";
                    $(sel).find("select").material_select();
                    function subSelect(data){
                        var subSelectArr=[],res=data[0];
                        if(res.group_data&&res.group_data.length){
                            // {"group_id":1,"group_name":"母婴群1","member_count":200},
                            res.group_data.forEach(function(itm,i){
                                subSelectArr.push({val:itm.group_id,text:itm.group_name});
                            })
                        }
                        var opts= _.template($(optTpl).filter('#select').html())({selectArr:subSelectArr,selected:selected});
                        $('#send-msg-group-select').html(opts).material_select();
                    }
                    $('#send-msg-select').off().on("change",function(e){
                        var $tar= $(this),val=$tar.val(),text=$tar.find("option:selected").text();
                        subSelectRender({
                            key:val
                        },subSelect);
                    })
                    subSelectRender({
                        key:$('#send-msg-select').val()
                    },subSelect);
                }
            }
        },
        'getDataByType': function () {
            var name = $("#send-msg-name").val(),
                perSelect = $("#send-msg-select").val(),
                perSelectText = $("#send-msg-select").find("option:selected").text(),
                grpSelect = $("#send-msg-group-select").val(),
                grpSelectText = $("#send-msg-group-select").find("option:selected").text(),
                textarea = $("#send-msg-textarea").val();
            return {
                name: getVal(name),
                asset_id: perSelect,//个人号id
                asset_name: perSelectText,//个人号name
                group_id: grpSelect,
                group_name: grpSelectText,
                text_info: textarea,
                desc: getVal(textarea)
            };
        }
    },
    'add-activity': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'move-activity': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'event-group': {
        'getEventByType': function () {
        },
        'getDataByType': function () {
            return {
                name: '',
                desc: ''
            }
        }
    },
    'event-trigger': {
        'getEventByType': function () {
           // console.log('000000000000000');
        },
        'getDataByType': function () {
           // return {};
            var name = $('#event-trigger-name').val();
            var desc =$('#event-trigger-select').val();
            var eventid = $('#event-val').val();
            var eventcode = $('#event-code').val();
            return {
                name: getVal(name),
                desc: getVal(desc),
                event_name:getVal(desc),
                event_id:getVal(eventid),
                event_code:getVal(eventcode)
            };
        }
    },
    'attr-comparison': {//联系人关系
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    var cache=getDataByNodeId($(this)[0].follow.id);
                    var selected=cache?cache.subSelect:"";
                    $(sel).find("select").material_select();
                    var $startDate= $(sel).find("#attr-comparison-sub-val-date"),startDate=$startDate.pickadate('picker');
                    $startDate.pickadate({
                        format: 'yyyy-mm-dd',
                        selectMonths: true, // Creates a dropdown to control month
                        selectYears: 5, // Creates a dropdown of 15 years to control year
                        onSet: function(thingSet) {
                            //thingSet.select
                        }
                    });
                    $(sel).find("#attr-comparison-sub-val-time").lolliclock({
                        autoclose: true,
                        hour24: true,//24小时制
                        afterHide: function () {
                            // console.info('小时：' + $('#start-time').data('lolliclock').hours)
                        }
                    });
                    $("#attr-comparison-rel-select").off().on("change",function(e){
                         var $tar= $(this),val=$tar.val(),text=$tar.find("option:selected").text();
                        var subSelectArr=[];
                        var dateWrap$=$('#attr-comparison-sub-val-date-wrap').hide(),
                            valWrap=$('#attr-comparison-sub-val-wrap').hide(),
                            numWrap= $('#attr-comparison-sub-num-wrap').hide();
                        if(val==0){
                            valWrap.show();
                            ////0：等于,1:包含2:starts_with，3：ends_with 4:empty,5:大于,6:小于,7:大于等于,8:小于等于
                            ATTRCOMPARSION=subSelectArr=[{val:0,text:"等于"},{val:1,text:"包含"},{val:2,text:"以特定文本开头"},{val:3,text:"以特定文本结尾"},{val:4,text:"为空"}];
                        }else if(val==1){
                            numWrap.show();
                            ATTRCOMPARSION=subSelectArr=[{val:0,text:"等于"},{val:5,text:"大于"},{val:6,text:"小于"},{val:7,text:"大于等于"},{val:8,text:"小于等于"},{val:4,text:"为空"}];
                        }else if(val==2){
                            dateWrap$.show();
                            ATTRCOMPARSION=subSelectArr=[{val:0,text:"等于"},{val:7,text:"早于"},{val:8,text:"晚于"},{val:4,text:"为空"}];
                        }

                        var opts= _.template($(optTpl).filter('#select').html())({selectArr:subSelectArr,selected:selected});
                        $('#attr-comparison-sub-select').html(opts).material_select();

                    })
                    $("#attr-comparison-sub-num").off().on("keyup",function(e){
                        var $tar=$(this),val=$tar.val();
                        $tar.val(numberValidate(val));
                    })
                }
            }

        },
        'getDataByType': function (sel) {
            ////0：等于,1:包含2:starts_with，3：ends_with 4:empty,5:大于,6:小于,7:大于等于,8:小于等于
            ATTRCOMPARSION=ATTRCOMPARSION||constant.attr_comparsion;
            var now=new Date().getTime(),
                defaultStartDate=dateTime.getDateStr(now),
                defaultStartTime=dateTime.getTimeStr(now),
                name= $("#attr-comparison-name").val(),
                relSelect = $("#attr-comparison-rel-select").val(),
                relSelectText = $("#attr-comparison-rel-select").find("option:selected").text(),
                subSelect = $("#attr-comparison-sub-select").val(),
                subSelectText = $("#attr-comparison-sub-select").find("option:selected").text(),
                checkBox =$("#attr-comparison-non-checkbox").is(':checked'),
                date=$('#attr-comparison-sub-val-date').val()||defaultStartDate,
                time=$('#attr-comparison-sub-val-time').val()||defaultStartTime,
                val=$('#attr-comparison-sub-val').val(),
                num= $('#attr-comparison-sub-num').val();

            var rule,rule_value;
            if(relSelect==0){//文本
                rule_value=val;
            }else if(relSelect==1){//数字
                rule_value=num;
            }else if(relSelect==2){//日期
                rule_value=date+" "+time+":00";
            }
            rule=subSelect;
            return {
                name:name,
                prop_type: relSelect||0,
                prop_typeText: getSelectText(relSelectText),
                exclude:checkBox?1:0,//0:不选中"不",1:选中“不”
                date:date,
                val:val,
                num:num,
                subSelectArr:ATTRCOMPARSION,
                subSelect:(subSelect||1)*1,
                subSelectText:getSelectText(subSelectText),
                time:time,
                desc: getSelectText(relSelectText),
                rule:rule,
                refresh_interval_type_arr:refresh_interval_type_arr,
                rule_value:rule_value
            };
        }
    },
    'wechat-forwarded': {//微信转发
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                        $("#wechat-forwarded-refresh1").off().on("keyup",function(e){
                            var $tar=$(this),val=$tar.val();
                            $tar.val(numberValidate(val));
                        })
                }
            }
        },
        'getDataByType': function () {
            var name = $("#wechat-forwarded-name").val(),
                publicSelect = $("#wechat-forwarded-public-select").val(),
                publicSelectText = $("#wechat-forwarded-public-select").find("option:selected").text(),
                imgSelect = $("#wechat-forwarded-img-select").val(),
                imgSelectText = $("#wechat-forwarded-img-select").find("option:selected").text(),
                numSelect = $("#wechat-forwarded-num").val(),
                numSelectText = $("#wechat-forwarded-num").find("option:selected").text(),
                refresh1 = $("#wechat-forwarded-refresh1").val(),
                refresh2 = $("#wechat-forwarded-refresh2").val();
            return {
                name: getVal(name),
                "asset_id":publicSelect,//公众号id
                "asset_name":publicSelectText,//公众号name
                "img_text_asset_id":imgSelect,//图文id
                "img_text_asset_name":imgSelectText,//图文name
                forward_times: numSelect,
                forward_times_text: numSelectText,
                refresh_interval: refresh1,
                refresh_interval_type: refresh2,
                refresh_interval_type_arr:refresh_interval_type_arr,
                desc: getSelectText(publicSelectText)
            };
        }
    },
    'subscriber-public': {//是否订阅公众号
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    $(sel).find("select").material_select();
                    $("#subscriber-public-refresh1").off().on("keyup",function(e){
                        var $tar=$(this),val=$tar.val();
                        $tar.val(numberValidate(val));
                    })
                }
            }
        },
        'getDataByType': function () {
            var name = $("#subscriber-public-name").val(),
                publicSelect = $("#subscriber-public-public-select").val(),
                publicSelectText = $("#subscriber-public-public-select").find("option:selected").text(),
                timeSelect = $("#subscriber-public-time-select").val(),
                timeSelectText = $("#subscriber-public-time-select").find("option:selected").text(),
                refresh1 = $("#subscriber-public-refresh1").val(),
                refresh2 = $("#subscriber-public-refresh2").val();
            return {
                name:getVal(name),
                "asset_id":publicSelect,//公众号id
                "asset_name":publicSelectText,//公众号name
                subscribe_time:timeSelect,
                subscribe_time_text:timeSelectText,
                refresh_interval: getVal(refresh1),
                refresh_interval_type: getVal(refresh2),
                refresh_interval_type_arr:refresh_interval_type_arr,
                desc: getSelectText(publicSelectText)

            }
        }
    },
    'personal-friend': {//个人号
        'getEventByType': function (sel) {
            return {
                success: function (layero, index) {
                    var cache=getDataByNodeId($(this)[0].follow.id);
                    var selected=cache?cache.group_id:"";
                    function subSelect(data){
                        var subSelectArr=[],res=data[0];
                        if(res.group_data&&res.group_data.length){
                            // {"group_id":1,"group_name":"母婴群1","member_count":200},
                            res.group_data.forEach(function(itm,i){
                                subSelectArr.push({val:itm.group_id,text:itm.group_name});
                            })
                        }
                        var opts= _.template($(optTpl).filter('#select').html())({selectArr:subSelectArr,selected:selected});
                        $('#personal-friend-group-select').html(opts).material_select();
                    }
                    $(sel).find("select").material_select();
                    $('#personal-friend-public-select').off().on("change",function(e){
                        var $tar= $(this),val=$tar.val(),text=$tar.find("option:selected").text();
                        subSelectRender({
                            key:val
                        },subSelect);
                    })
                    $("#personal-friend-refresh1").off().on("keyup",function(e){
                        var $tar=$(this),val=$tar.val();
                        $tar.val(numberValidate(val));
                    })

                    subSelectRender({
                        key:$('#personal-friend-public-select').val()
                    },subSelect);
                }
            }
        },
        'getDataByType': function () {
            var name = $("#personal-friend-name").val(),
                prvt_id = $("#personal-friend-public-select").val(),
                prvt_text = $("#personal-friend-public-select").find("option:selected").text(),
                group_id = $("#personal-friend-group-select").val(),
                group_text = $("#personal-friend-group-select").find("option:selected").text(),
                refresh1 = $("#personal-friend-refresh1").val(),
                refresh2 = $("#personal-friend-refresh2").val();
            return {
                name: name,
                asset_id:prvt_id,
                asset_name:prvt_text,
                group_id:group_id,
                group_name:group_text,
                refresh_interval: getVal(refresh1),
                refresh_interval_type: getVal(refresh2),
                refresh_interval_type_arr: refresh_interval_type_arr,
                desc: getSelectText(prvt_text)
            }
        }
    }
};
function switchFun(type, selector, funName) {
    return typeMap[type] && typeMap[type][funName] && typeMap[type][funName](selector);
}
var utils = {
    //根据类型获取tips 事件
    getEventByType: function (type, selector) {
        return switchFun(type, selector, "getEventByType");
    },
    //根据类型获取tips 数据
    getDataByType: function (type, selector) {
        return switchFun(type, selector, "getDataByType");
    }
};
module.exports = utils;

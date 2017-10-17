/**
 * Created by AnThen on 2016-7-7.
 */

/*加载本页模块*/
var tpl = require("html/audience/contact-file-tpl.html");
/*组件*/
var Modals = require('component/modals.js');
var dateTime = require('module/plan/utils/dateTime.js');/*时间插件*/

/*本页公有变量*/
var lableList = new Array();

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({dataType:{id:1,name:'微信视图'},userData:{},actionNum:{},tagName:[]}),
    //组织模块
    template: {
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateUserinfo: _.template($(tpl).filter('#tpl-userinfo').html()),
        templateLableEdit: _.template($(tpl).filter('#tpl-lable-edit').html()),
        templateLabelEdit: _.template($(tpl).filter('#tpl-label-edit').html()),
        templateLableList: _.template($(tpl).filter('#tpl-lable-list').html())
    },
    //设置响应事件
    events: {
        "click #crowd-list li a": "resetdataType",
        "click #user-info-edit": "userInfoEdit",
        "click #label-edit-but": "labelEdit"
    },
    dropdownButton: function(){
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
    },
    resetdataType:function(e){
        var id = $(e.currentTarget).attr('id'),
            name = $(e.currentTarget).attr('name');
        $('#crowd-list-box').text(name);
        this.model.set({dataType: {id:id,name:name}});
        console.log(id)
        if(id == '1'){
            $('#base-info-user').css('display','none');
            $('#base-info-wechat').css('display','block');
            $('#user-info-edit').css('display','none');
            $('#contact-content').css('display','none');
            $('#wechat-content').css('display','block');
        }else{
            $('#base-info-user').css('display','block');
            $('#base-info-wechat').css('display','none');
            $('#user-info-edit').css('display','block');
            $('#contact-content').css('display','block');
            $('#wechat-content').css('display','none');
        }
    },
    /*验证规则*/
    validate: function(data,type){
        var re,thisdata = data.trim();
        var testRule;
        switch (type){
            case "int":
                testRule = new RegExp("^(0|[1-9][0-9]*)$");
                re = testRule.test(thisdata);
                break;
            case "float":
                testRule = new RegExp("^[0-9]+(.[0-9]{1,3})?$");
                re = testRule.test(thisdata);
                break;
            case "special":
                testRule = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                if(testRule.test(thisdata)){re=false}else{re=true}
                break;
            default:
                if(thisdata.length>0){re=true}else{re=false}
                break;
        }
        return re;
    },
    /*编辑标签私有方法*/
    hasStr: function(array,str){
        var re = true;
        for(var i=0; i<array.length; i++){
            if(str == array[i]){re = false; break;}else{re = true;}
        }
        return re;
    },
    removeDuplicated: function(array,str){
        var re = new Array(),j = 0;
        for(var i=0; i<array.length; i++){
            if(str != array[i]){re[j] = array[i]; j++;}
        }
        return re;
    },
    /*编辑标签*/
    labelEdit: function () {
        var that = this;
        var userId = util.geturlparam('user_id') || 1;
        var thatTemplate = this.template.templateLableEdit(this.model.toJSON());
        var thisVal;
        new Modals.Window({
            id: "lableEdit",
            title: "细分人群标签",
            content: thatTemplate,
            //width:'auto',//默认是auto
            //height:'auto',//默认是auto
            buttons: [
                {
                    text: '保存',
                    cls: 'accept',
                    handler: function (self) {
                        util.api({
                            url: "?method=mkt.data.main.segmenttag.update",
                            type: 'post',
                            data: {'contact_id':userId,'tag_name':lableList.toString()},
                            success: function (res) {
                                if(res.code == 0){
                                    $('#label-box').html(that.template.templateLableList({tagName:lableList}));
                                    self.close();
                                }
                            }
                        });
                    }
                }, {
                    text: '取消',
                    cls: 'decline',
                    handler: function (self) {
                        self.close();
                    }
                }
            ],
            listeners: {//window监听事件事件
                open: function () {
                    $('#lable-wrap').html(that.template.templateLabelEdit({lableList:lableList}));
                },
                close: function () {
                    //console.log("close");
                },
                beforeRender: function () {
                    //console.log("beforeRender");
                },
                afterRender: function () {
                    $('#lable-input').change(function () {
                        thisVal = $(this).val();
                        if(that.hasStr(lableList,thisVal)){
                            $(this).val('');
                            lableList[lableList.length] = thisVal;
                            $('#lable-wrap').html(that.template.templateLabelEdit({lableList:lableList}));
                        }
                    });

                }
            }
        });

        $('#lableEdit').on('click','.rui-close',function(){
            thisVal = $(this).parents('.segment-tag').children('.text').text();
            lableList = that.removeDuplicated(lableList,thisVal);
            $(this).parents('.segment-tag').empty().remove();
        })

    },
    /*编辑用户信息*/
    userInfoEdit: function () {
        var that = this;
        var thatTemplate = this.template.templateUserinfo(this.model.toJSON());
        new Modals.Window(
            {
                id: "userinfoEdit",
                title: "联系人基本信息编辑",
                content: thatTemplate,
                width: '434',//默认是auto
                height: '740',//默认是auto
                buttons: [{
                    text: '保存',
                    cls: 'accept',
                    handler: function (self) {
                        var reviseName = $('#userinfo_name').val(),
                            reviseGender = $('#userinfo_gender').val(),
                            reviseBirthday = $('#userinfo_birthday').val(),
                            reviseBlood = $('#userinfo_blood').val(),
                            reviseIQ = $('#userinfo_iq').val(),
                            reviseUserid = $('#userinfo_userid').val(),
                            reviseDrivingLicence = $('#userinfo_driving_licence').val(),
                            reviseMobile = $('#userinfo_mobile').val(),
                            revisePhone = $('#userinfo_phone').val(),
                            reviseEmail = $('#userinfo_email').val(),
                            reviseQQ = $('#userinfo_qq').val(),
                            reviseWechat = $('#userinfo_wechat').val(),
                            revisePrivate = $('#userinfo_private').val(),
                            reviseAccount = $('#userinfo_account').val(),
                            reviseNationality = $('#userinfo_nationality').val(),
                            reviseProvince = $('#userinfo_province').val(),
                            reviseCity = $('#userinfo_city').val(),
                            reviseNation = $('#userinfo_nation').val(),
                            reciseProfession = $('#userinfo_profession').val(),
                            reciseIncome = $('#userinfo_income').val(),
                            reciseConsume = $('#userinfo_consume').val(),
                            reciseMarriage = $('#userinfo_marriage').val(),
                            reviseEducated = $('#userinfo_educated').val(),
                            reviseJobType = $('#userinfo_job_type').val();
                        var testName, testIQ, testNationality, testProvince, testCity, testNation, testProfession, testIncome, testConsume;

                        //姓名验证
                        if(that.validate(reviseName)){testName=that.validate(reviseName,'special');}else{testName=true;}
                        //IQ验证
                        if(that.validate(reviseIQ)){testIQ=that.validate(reviseIQ,'int');}else{testIQ=true;}
                        //国籍验证
                        if(that.validate(reviseNationality)){testNationality=that.validate(reviseNationality,'special');}else{testNationality=true;}
                        //省验证
                        if(that.validate(reviseProvince)){testProvince=that.validate(reviseProvince,'special');}else{testProvince=true;}
                        //市验证
                        if(that.validate(reviseCity)){testCity=that.validate(reviseCity,'special');}else{testCity=true;}
                        //民族验证
                        if(that.validate(reviseNation)){testNation=that.validate(reviseNation,'special');}else{testNation=true;}
                        //职业验证
                        if(that.validate(reciseProfession)){testProfession=that.validate(reciseProfession,'special');}else{testProfession=true;}
                        //月收入验证
                        if(that.validate(reciseIncome)){testIncome=that.validate(reciseIncome,'float');}else{testIncome=true;}
                        //月消费验证
                        if(that.validate(reciseConsume)){testConsume=that.validate(reciseConsume,'float');}else{testConsume=true;}

                        //验证总结
                        if(!testName || !testIQ || !testNationality || !testProvince || !testCity || !testNation || !testProfession || !testIncome || !testConsume){
                            //姓名验证结果
                            if(testName){$('#userinfo_name').parents('.input-field').removeClass('wrong')}else{$('#userinfo_name').parents('.input-field').addClass('wrong')}
                            //IQ验证结果
                            if(testIQ){$('#userinfo_iq').parents('.input-field').removeClass('wrong')}else{$('#userinfo_iq').parents('.input-field').addClass('wrong')}
                            //国籍验证结果
                            if(testNationality){$('#userinfo_nationality').parents('.input-field').removeClass('wrong')}else{$('#userinfo_nationality').parents('.input-field').addClass('wrong')}
                            //省验证结果
                            if(testProvince){$('#userinfo_province').parents('.input-field').removeClass('wrong')}else{$('#userinfo_province').parents('.input-field').addClass('wrong')}
                            //市验证结果
                            if(testCity){$('#userinfo_city').parents('.input-field').removeClass('wrong')}else{$('#userinfo_city').parents('.input-field').addClass('wrong')}
                            //民族验证结果
                            if(testNation){$('#userinfo_nation').parents('.input-field').removeClass('wrong')}else{$('#userinfo_nation').parents('.input-field').addClass('wrong')}
                            //职业验证结果
                            if(testProfession){$('#userinfo_profession').parents('.input-field').removeClass('wrong')}else{$('#userinfo_profession').parents('.input-field').addClass('wrong')}
                            //月收入验证结果
                            if(testIncome){$('#userinfo_income').parents('.input-field').removeClass('wrong')}else{$('#userinfo_income').parents('.input-field').addClass('wrong')}
                            //月消费验证结果
                            if(testConsume){$('#userinfo_consume').parents('.input-field').removeClass('wrong')}else{$('#userinfo_consume').parents('.input-field').addClass('wrong')}
                        }else{
                            //姓名验证结果
                            $('#userinfo_name').parents('.input-field').removeClass('wrong');
                            //IQ验证结果
                            $('#userinfo_iq').parents('.input-field').removeClass('wrong');
                            //国籍验证结果
                            $('#userinfo_nationality').parents('.input-field').removeClass('wrong');
                            //省验证结果
                            $('#userinfo_province').parents('.input-field').removeClass('wrong');
                            //市验证结果
                            $('#userinfo_city').parents('.input-field').removeClass('wrong');
                            //民族验证结果
                            $('#userinfo_nation').parents('.input-field').removeClass('wrong');
                            //职业验证结果
                            $('#userinfo_profession').parents('.input-field').removeClass('wrong');
                            //月收入验证结果
                            $('#userinfo_income').parents('.input-field').removeClass('wrong');
                            //月消费验证结果
                            $('#userinfo_consume').parents('.input-field').removeClass('wrong');

                            util.api({
                                url: "?method=mkt.data.main.basicinfo.update",
                                type: 'post',
                                data: {
                                    'contact_id':$('#userinfo_name').attr('contactid'),
                                    'md_type':$('#userinfo_name').attr('mdtype'),
                                    'name':reviseName,
                                    'gender':reviseGender,
                                    'birthday':reviseBirthday,
                                    'blood_type': reviseBlood,
                                    'iq':reviseIQ,
                                    'identify_no': reviseUserid,
                                    'driving_license': reviseDrivingLicence,
                                    'mobile':reviseMobile,
                                    'tel':revisePhone,
                                    'email':reviseEmail,
                                    'qq':reviseQQ,
                                    'wechat':reviseWechat,
                                    'acct_type':revisePrivate,
                                    'acct_no':reviseAccount,
                                    'citizenship':reviseNationality,
                                    'provice':reviseProvince,
                                    'city':reviseCity,
                                    'nationality':reviseNation,
                                    'job':reciseProfession,
                                    'monthly_income':reciseIncome,
                                    'monthly_consume':reciseConsume,
                                    'marital_status':reciseMarriage,
                                    'education':reviseEducated,
                                    'employment':reviseJobType
                                },
                                success: function (res) {
                                    if(res.code == 0){
                                        $('#user-name').text(reviseName);
                                        $('#user-gender').text(reviseGender);
                                        $('#user-birthday').text(reviseBirthday);
                                        $('#user-mobile').text(reviseMobile);
                                        $('#user-email').text(reviseEmail);
                                        $('#user-qq').text(reviseQQ);
                                        $('#user-private').text(revisePrivate);
                                        $('#user-account').text(reviseAccount);
                                        $('#user-address').html(reviseProvince+'&#47;'+reviseCity);
                                        $('#user-marriage').text(reciseMarriage);
                                        self.close();
                                    }
                                }
                            });

                            //self.close();
                        }
                    }
                }, {
                    text: '取消',
                    cls: 'decline',
                    handler: function (self) {
                        self.close();
                    }
                }
                ],
                listeners: {//window监听事件事件
                    open: function () {
                        //console.log("open")
                    },
                    close: function () {
                        console.log("close----")
                    },
                    beforeRender: function () {
                        //console.log("beforeRender")
                    },
                    afterRender: function () {
                        $('select').material_select();
                        //console.log("afterRender")
                        $('#userinfo_birthday').on('click',function(){
                            var thisVal = '1970-01-01';
                            $('#userinfo_birthday').pickadate({
                                format: 'yyyy-mm-dd',
                                selectMonths: true, // Creates a dropdown to control month
                                selectYears: 5, // Creates a dropdown of 15 years to control year
                                onOpen: function() {
                                    this.set("min",new Date(thisVal))
                                }
                            });
                        });
                    }
                }

            }
        );
    },
    /*组织用户信息数据*/
    formatUserData: function(data,total,userId,mdtype){
        var userData;
        var thisIncome,thisConsume;
        var weixinData=false,lianxirenData=false;
        if(parseInt(total)>0){
            if(data.monthly_income){thisIncome=parseFloat(data.monthly_income)}else{thisIncome=0.00}
            if(data.monthly_consume){thisConsume=parseFloat(data.monthly_consume)}else{thisConsume=0.00}
            if(data.photo||data.wx_nickname||data.wx_gender){weixinData=true;}
            if(data.name||data.photo||data.gender||data.birthday){lianxirenData=true;}
            userData = {
                "weixinData": weixinData,
                "lianxirenData": lianxirenData,
                "name": data.name || '未知',
                "wechatName": data.wx_nickname || '未知',
                "popto": data.photo || false,
                "gender": data.gender || '男',
                "wechatGender": data.wx_gender || '未知',
                "birthday": data.birthday || '1970-01-01',
                "blood": data.blood || '未知',
                "IQ": data.iq || 0,
                "userid": data.identify_no || '',
                "drivingLicence": data.driving_license || '',
                "mobile": data.mobile || '未知',
                "phone": data.tel || '',
                "email": data.email || '未知',
                "QQ": data.qq || '未知',
                "wechat":data.wechat || '',
                "private": data.acct_type || '未知',
                "account": data.acct_no || '未知',
                "nationality": data.citizenship || '中国',
                "wechatNationality": data.wx_country || '未知',
                "province": data.provice || '未知',
                "wechatProvince": data.wx_provice || '未知',
                "city": data.city || '未知',
                "wechatCity": data.wx_city || '未知',
                "nation": data.nationality || '汉族',
                "profession": data.job || '',
                "income": thisIncome,
                "consume": thisConsume,
                "marriage": data.marital_status || '未知',
                "educated": data.education || '本科',
                "jobType": data.employment || '在职',
                "contactId": data.contact_id || userId,
                "mdType": mdtype
            };
        }else{
            userData = {
                "weixinData": false,
                "lianxirenData": false,
                "name": '用户姓名',
                "popto": false,
                "gender": '男',
                "birthday": '1970-01-01',
                "blood": '未知',
                "IQ": 0,
                "userid": '未知',
                "drivingLicence": '未知',
                "mobile": '未知',
                "phone": '未知',
                "email": '未知',
                "QQ": '未知',
                "wechat": '未知',
                "private": '未知',
                "account": '未知',
                "nationality": '中国',
                "wechatNationality": '中国',
                "province": '未知',
                "wechatProvince": '未知',
                "city": '未知',
                "wechatCity": '未知',
                "nation": '汉族',
                "profession": '',
                "income": 0.00,
                "consume": 0.00,
                "marriage": '未知',
                "educated": '本科',
                "jobType": '在职',
                "contactId": userId,
                "mdType": mdtype
            };
        }
        this.model.set({userData: userData});
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
        /*基本信息*/
        this.fetchUserData();
        /*获取用户标签*/
        this.fetchLableData();
    },

    /*基本信息*/
    fetchUserData: function(){
        var that = this;
        var userId = util.geturlparam('user_id') || 1;
        var show_user_file_md_type= util.geturlparam("show_user_file_md_type") || 0;
        console.log('show_user_file_md_type：'+show_user_file_md_type)
        var mdType;
        show_user_file_md_type==0? mdType=8 : mdType=show_user_file_md_type;
        var thisdata,thistotal=0;
        util.api({
            url: "?method=mkt.data.main.basicinfo.get",
            type: 'get',
            data: {'contact_id':userId,'md_type':mdType},
            success: function (res) {
                if(res.code == 0){
                    thisdata = res.data[0];
                    thistotal = res.total;
                }else{
                    thisdata = {};
                    thistotal = 0;
                }
                that.formatUserData(thisdata,thistotal,userId,mdType);
            }
        });
    },
    /*获取用户标签*/
    fetchLableData: function(){
        var that = this;
        var userId = util.geturlparam('user_id') || 1;
        var mdType = this.model.attributes.mdType;
        util.api({
            url: "?method=mkt.data.main.segmenttag.get",
            type: 'get',
            data: {'map_id':userId,'md_type':mdType},
            success: function (res) {
                if(res.code == 0){
                    $.each(res.data, function (i) {
                        lableList[i] = res.data[i].tag_name;
                    });
                    that.model.set({tagName: res.data});
                }
            }
        });
    },
    /*组织视图模板*/
    render: function () {
        //加载主模板
        this.$el.html(this.template.templateMain(this.model.toJSON()));
        this.dropdownButton();
        return this;
    }
});

/************生成页面************/
var container = new Container({
    el: '#alone'
});

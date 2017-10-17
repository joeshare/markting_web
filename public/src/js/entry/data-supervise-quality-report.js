/**
 * Created by AnThen on 2016-5-10.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/data-supervise/quality-report-tpl.html");
//加载组件
var Modals = require('component/modals.js');
let pagination = require('plugins/pagination')($);//分页插件
/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'主数据管理'
});

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        illegalData: []
    }),
    //组织模块
    template:{
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateTbody: _.template($(tpl).filter('#tbody-content').html()),
        templateIllegallist: _.template($(tpl).filter('#tpl-illegallist').html()),
        templateMorelist: _.template($(tpl).filter('#tpl-morelist').html())
    },
    //设置响应事件
    events: {
        "click #goback": "goback",
        "mouseover .dropdown-button-illegal": "resetIllegallist",
        "click .moreico": "moreicoIndex",
        "change #uploadFile": "uploadFile"
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
    goback: function () {
        window.history.go(-1);
    },
    resetMorelist: function(){
        $('#morelist-box', this.$el).html(this.template.templateMorelist(this.model.toJSON()));
        this.dropdownButton();
    },
    resetIllegallist: function(e){
        $('#illegal-list-box', this.el).html(this.template.templateIllegallist(this.model.toJSON()));
        this.dropdownButton();
        var listid = $(e.currentTarget).parents('tr').attr('listid');

        util.api({
            url: "?method=mkt.data.unqualified.count.get",
            type: 'get',
            data: {'batch_id': listid},
            success: function (res) {
                if(res.code==0){
                    if(res.data[0]){
                        $('#illegal-list').children('li').eq(0).children('.num').text(res.data[0].mobile_rows);
                        $('#illegal-list').children('li').eq(1).children('.num').text(res.data[0].email_rows);
                        $('#illegal-list').children('li').eq(2).children('.num').text(res.data[0].duplicate_rows);
                    }
                }
            }
        });

    },
    resetDownloadFileUrl: function(listid,fileType){
        util.api({
            url: "?method=mkt.data.quality.illegaldata.download",
            type: 'get',
            data: {"batch_id":listid,"file_type":fileType},
            success: function (res) {
                if(res.code == 0){
                    if(res.data.length > 0){
                        $('#downloadFile').attr('href',FILE_PATH+res.data[0].download_file_name);
                        $('#morelist').children('li:first-child').removeClass('close');
                    }else{
                        $('#downloadFile').attr('href',"javascript:void(0)");
                        $('#morelist').children('li:first-child').addClass('close');
                    }
                }else{
                    $('#downloadFile').attr('href',"javascript:void(0)");
                    $('#morelist').children('li:first-child').addClass('close');
                }
            }
        });
    },
    resetReviewLogUrl: function(listid){
        util.api({
            url: "?method=mkt.data.quality.log.download",
            type: 'get',
            data: {"import_data_id":listid},
            success: function (res) {
                if(res.code == 0){
                    if(res.data.length > 0){
                        $('#reviewLog').attr('href',FILE_PATH+res.data[0].download_file_name);
                    }else{
                        $('#reviewLog').attr('href',"javascript:void(0)");
                    }
                }else{
                    $('#reviewLog').attr('href',"javascript:void(0)");
                }
            }
        });
    },
    moreicoIndex : function(e){
        var thatIllegal = $(e.currentTarget).parents('tr').children('.illegaltd'),
            listid = $(e.currentTarget).attr('listid'),
            fileType = $(e.currentTarget).attr('file-type'),
            fileUnique = $(e.currentTarget).attr('file-unique');
        if(thatIllegal.html().trim() == ''){
            $('#morelist li:first-child').addClass('stop');
            $('#morelist li:last-child').addClass('stop');
            $('#downloadFile').attr('href',"javascript:void(0)");
            this.resetReviewLogUrl(listid);
        }else{
            $('#morelist li:first-child').removeClass('stop');
            $('#morelist li:last-child').removeClass('stop');
            this.resetDownloadFileUrl(listid,fileType);
            this.resetReviewLogUrl(listid);
        };
        $('#morelist').attr({'listid':listid,'fileUnique':fileUnique});
    },
    uploadFile: function(){
        var listid = $('#morelist').attr('listid'),
            fileUnique = $('#morelist').attr('fileUnique');
        var formData = new FormData(),file_unique;
        formData.append("uploadedFile", $('#uploadFile')[0].files[0]);
        var url = UPLOADAIP_PATH+"?method=mkt.service.file.repiar.upload" + "&file_unique=" + fileUnique;
        var lawful = 0,
            illegal = "",
            illegal1 = "<a href='javascript:void(0)' class='r-btn dropdown-button dropdown-button-illegal' data-activates='illegal-list' data-constrainwidth='false' data-gutter='-140'><num class='num'>",
            illegal2 = "</num><ico class='pointer icon iconfont'>&#xe604;</ico></a>",
            modifyLogData = "",
            modifyLog = "",
            modifyLog1 = "<a class='download'' href='",
            modifyLog2 = "' title='",
            modifyLog3 = "'>",
            modifyLog4 = "</a><span class='time'>",
            modifyLog5 = "</span>",
            objective = $('tr[listid='+listid+']');

        $.ajax({
            url: url,
            type: 'post',
            data: formData,
            /**
             * 必须false才会避开jQuery对 formdata 的默认处理
             * XMLHttpRequest会对 formdata 进行正确的处理
             */
            processData: false,
            /**
             *必须false才会自动加上正确的Content-Type
             */
            contentType: false,
            success: function (rest) {
                if((rest.code==0)&&(rest.data.length>0)){
                    if(rest.data[0].legalRows){lawful = rest.data[0].legalRows;}
                    if(rest.data[0].illegalRows){illegal = illegal1 + rest.data[0].illegalRows + illegal2;}
                    if(rest.modifyLog){
                        modifyLogData = rest.modifyLog[0];
                        modifyLog = modifyLog1 + FILE_PATH + modifyLogData.modifyDownloadFilename + modifyLog2 + modifyLogData.modifyFilename + modifyLog3 + modifyLogData.modifyFilename + modifyLog4 + modifyLogData.handleTime + modifyLog5;
                    }
                }
                objective.children('.lawful').text(lawful);
                objective.children('.illegal').html(illegal);
                objective.children('.modify').html(modifyLog);
            }
        });
    },
    /*表格数据整理*/
    formatData: function(data,total){
        var reData = new Array();
        var modifyLog = new Array(),thisName,thisUrl,handleTime;
        if(total>0){
            for(var i=0; i<total; i++){
                modifyLog = data[i].modify_log || [];
                if(modifyLog.length > 0){
                    thisName = (modifyLog[0].modify_file_name).split('/');
                    thisName = thisName[thisName.length-1];
                    thisUrl = FILE_PATH + modifyLog[0].modify_file_name;
                    handleTime = modifyLog[0].handle_time;
                }else{
                    thisName = '';thisUrl = '';handleTime = '';
                }
                reData[i] = {
                    'data_id': data[i].data_id,
                    'file_type_value':data[i].file_type_value,
                    'source_file_name':data[i].source_file_name,
                    'start_time': data[i].start_time,
                    'end_time': data[i].end_time,
                    'data_source': data[i].data_source,
                    'legal_data_rows_count': data[i].legal_data_rows_count,
                    'ilegal_data_rows_count': data[i].ilegal_data_rows_count,
                    'modify_file_url': thisUrl,
                    'modify_file_name': thisName,
                    'handle_time': handleTime,
                    'file_unique':data[i].file_unique,
                    'file_type':data[i].file_type,
                    'modify_log': data[i].modify_log
                };
            }
        }
        $('#quality-report-tbody', this.el).html(this.template.templateTbody({listData:reData}));
        this.resetMorelist();
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
        this.fetchTbodyData(1,7);
    },
    /*获取表格数据*/
    fetchTbodyData: function(index,size){
        var that = this;
        util.api({
            url: "?method=mkt.data.quality.list.get",
            type: 'get',
            data: {'index':index,'size':size},
            success: function (res) {
                if(res.code == 0){
                    that.formatData(res.data,res.total);
                    $('.pagination-wrap').pagination('updateItems', res.total_count);
                }else{
                    that.formatData('',0);
                    $('.pagination-wrap').pagination('updateItems', res.total_count);
                }
            }
        });
    },
    /*实例化分页插件*/
    setPagination() {
        var that = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: 7,//最多显示页数
                onPageClick: function (pageNumber, event) {
                    that.fetchTbodyData(pageNumber,7);
                }
            });
        }
    },
    //组织完试图做的事情
    afterRender: function () {
        /*初始化页面说明部分*/
        util.api({
            url: "?method=mkt.data.quality.count.get",
            type: 'get',
            data: {},
            success: function (res) {
                if((res.code == 0)&&(res.total > 0)){
                    $('#total-rows').html(res.data[0].total_rows);
                    $('#issue-rows').html(res.data[0].issue_rows);
                    $('#modified-rows').html(res.data[0].modified_rows);
                }
            }
        });
    },
    //组织视图模板
    render: function () {
        //加载主模板
        $('#page-body', this.el).html(this.template.templateMain(this.model.toJSON()));
        this.setPagination();
        this.afterRender();
        return this;
    }
})    ;

/************生成页面************/
var container = new Container({
    el: '#container'
});


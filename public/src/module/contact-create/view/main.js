'use strict';
let Header = require('./header.js');
let Content = require('./content.js');
let modalsTpl = require('../tpl/modal-tpl.html');
let relTagTpl = require('../tpl/rel-tag.html');
let Modals = require('component/modals.js');
let DragModel = require('../model/dragModel.js');
let formatter = require('../utils/formatter.js');
let fieldSDataFormatter = require('../utils/fieldSDataFormatter.js');
let descMaxNum = 100;
let current_contact_id = null;
let REL_TAG_NAMS = [];
let key_modify_status = 0;
//默认必选的fields
const defaultRequiredSelectFieldArr = ['mobile', 'tel', 'qq', 'email'];
const API = {
    saveForm: '?method=mkt.contact.list.create',
    queryFields: '?method=mkt.contact.keylist.get',
    queryMainKeys: '?method=mkt.contact.importkeylist.get',
    updateStatus: '?method=mkt.contact.list.used',
    queryRelTags: '?method=mkt.contact.list.tag.get',
    updateRelTags: '?method=mkt.contact.list.tag'
};
window.formNameChange = function (thiz) {
    let msg = "";
    if (thiz.value.length < 1) {
        thiz.classList.add('invalid');
        msg = '表单标题不能为空！';
    } else {
        thiz.classList.remove('invalid');
    }
    $("#modal-form-error-msg").text(msg);
};
window.formDescChange = function (thiz) {
    var num = thiz.value.length;
    if (num > descMaxNum) {
        thiz.value = thiz.value.substring(0, descMaxNum);
        num = descMaxNum;
    }
    $("#modal-form-desc-total").text(num + "/" + descMaxNum)
};
//渲染已有关联标签
function renderTagsRel(data) {
    //{
    //    code:
    //    data:[
    //        {
    //            contact_tags:[
    //                {
    //                    tag_name:'',
    //                    tag_id:'',
    //                }
    //            ]
    //        }
    //    ]
    //}
    REL_TAG_NAMS = [];
    var tags = (data[0] && data[0].contact_tags && data[0].contact_tags.length) ? data[0].contact_tags : [];
    var h = _.template($(relTagTpl).filter('#rel-tag').html())({data: tags});
    $('#tag-wrap').append(h);
    tags.forEach(function (itm, i) {
        REL_TAG_NAMS.push(itm.tag_name);
    })
}
//增加标签
function addTag() {
    var val = $('#tag-name').val();
    if ($.trim(val)) {
        var html = '<div class="segment-tag" attr-name="' + val + '">' + val + '<i class="icon iconfont rui-close contact-tag-remove">&#xe622;</i></div>';
        if (!formatter.isSameName(REL_TAG_NAMS, val)) {
            $('#tag-wrap').append(html);
            formatter.setTagData(REL_TAG_NAMS, val);
        }

    }

}
//绑定键盘事件
function bindKeydown(type) {
    if (type) {
        document.onkeydown = function (e) {
            e = e || window.event;
            if ((e.keyCode || e.which) == 13) {
                addTag();
            }
        }
    } else {
        document.onkeydown = null;
    }
}
function errorAlertMsg(msg) {
    new Modals.Alert(msg || "数据获取失败！");
}
function successMsg(msg) {
    Materialize.toast(msg || "保存成功！", 3000)
}
//标签按钮是否置灰
function tagBtnDisabled(type) {
    var $btn = $("#tag-edit");
    if (type) {
        !$btn.hasClass('rui-disabled') && $btn.addClass("rui-disabled");
    } else {
        $btn.removeClass("rui-disabled");
    }
}
class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contact_id: "",
            fields: [],
            contact_title: "",//"联系人表单,
            contact_name: "",
            contact_status: 0,
            contact_descript: ""
        };
        this.stateClone = {};
        this.originalData = {};
        let _this = this;
        this.loadContent = this.loadContent.bind(this);
        this.fieldClick = this.fieldClick.bind(this);
        this.editTitle = this.editTitle.bind(this);
        this.dragDisabled = this.dragDisabled.bind(this);
        this.editFormTitle = this.editFormTitle.bind(this);
        this.changeSetBox = this.changeSetBox.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.stopHandler = this.stopHandler.bind(this);
        this.startHandler = this.startHandler.bind(this);
        this.tagHandler = this.tagHandler.bind(this);
        this.page2preview = this.page2preview.bind(this);

    }

    setFieldIndex(data) {
        this.cloneData();
        let arr = [];
        let sortArr = [];
        $('#form-body .input-block-wrapper').each((i, itm)=> {
            let id = itm.id;//name-wrapper
            sortArr.push(id.substring(0, id.indexOf("-")));
        })
        let fields = data || this.stateClone.fields;
        fields.forEach((field, i)=> {
            sortArr.forEach((sf, n)=> {
                if (field.field_code == sf) {
                    field['index'] = n;
                    arr.push(field);
                }
            })

        })
        return arr;
    }

    getSaveParams(arg) {
        let param = {};
        let fields = this.state.fields;
        let _this = this;
        return (function () {
            let headerInfo = {
                contact_id: _this.state.contact_id || current_contact_id,
                contact_name: _this.state.contact_name,
                contact_title: _this.state.contact_title,
                contact_descript: _this.state.contact_descript,
                contact_status: _this.state.contact_status,
                key_modify_status: 0,
                column_shown_status: 0
            };
            param = $.extend(true, headerInfo, arg);
            param.contact_name = param.contact_name || "未命名-" + _this.getDateStr();
            param.contact_title = param.contact_title || "联系人表单";
            if (!param.contact_id) {
                delete param.contact_id;
            }

            console.log("param", param)
            console.log("param arg", arg)

            let res = $.extend(true, param, {
                field_list: _this.setFieldIndex()
            });
            return res;
        })();
    }

    //保存标签
    updateRelTags() {
        console.log('REL_TAG_NAMS', REL_TAG_NAMS)
        util.api({
            url: API.updateRelTags,
            type: 'post',
            data: {
                contact_id: current_contact_id,
                tag_names: REL_TAG_NAMS
            },
            success: function (res) {
                tagBtnDisabled(false);
                if (res && res.code == 0) {
                    successMsg();
                } else {
                    errorAlertMsg("保存失败！");
                }
            },
            error: function (res) {
                errorAlertMsg("保存失败！");
                tagBtnDisabled(false);
            }
        })
    }

    //查询标签
    queryRelTags(callBack) {
        current_contact_id && util.api({
            url: API.queryRelTags,
            type: 'get',
            data: {
                contact_id: current_contact_id
            },
            success: function (res) {
                if (res && res.code == 0 && res.data && res.data.length) {
                    callBack && callBack(res.data);
                }
            },
            error: function (res) {
                //errorAlertMsg();
            }
        })
    }

    //获取主键数据
    getKeyData(callBack) {
        // .key.list
        /*
         field_name
         field_code
         is_selected
         */
        if (current_contact_id) {
            util.api({
                url: API.queryMainKeys,
                data: {
                    contact_id: current_contact_id
                },
                success: function (res) {
                    console.log("queryMainKeys", res)
                    if (!res.code) {
                        console.log(res)
                        callBack && callBack(res.data);
                    } else {
                        callBack && callBack([]);
                    }
                },
                error: function (res) {

                }
            })
        } else {
            callBack && callBack([]);
        }

        //let arr=[];
        //arr.push({
        //    field_name:"手机",
        //    field_code:"mobile",
        //    is_selected:1//Math.round(Math.random()*2)
        //})
        //arr.push({
        //    field_name:"QQ",
        //    field_code:"qq",
        //    is_selected:1//Math.round(Math.random()*2)
        //})
        //callBack&&callBack(arr);

    }

    loadContent(arg) {
        let _this = this;
        if (!arg.contact_id) {
            delete arg.contact_id;
        }
        util.api({
            url: API.queryFields,
            data: arg,
            success: function (res) {
                if (!res.code) {
                    var data = {
                        contact_id: arg.contact_id,
                        fields: res.data,
                        contact_name: res.contact_name,
                        contact_title: res.contact_title || _this.state.contact_title,
                        contact_descript: res.contact_descript,
                        contact_status: res.contact_status || 0
                    };
                    _this.setState(data);
                    _this.updateOriginalData(data);
                }

            },
            error: function (res) {

            }
        })
        //_this.stateClone=JSON.parse(JSON.stringify(data));
        //_this.setState(data);
    }

    fieldClick(arg) {
        let fields = JSON.parse(JSON.stringify(this.state.fields));
        let current_selected = 1;
        fields.every((f, i)=> {
            f['isNew'] = false;
            if (f.field_code == arg.field_code) {
                current_selected = f.selected = arg.selected ? 0 : 1;
                f['isNew'] = true;
            }
            return true;
        })
        let SelectedContactFileds = this.getSelectedContactFiled();
        if (SelectedContactFileds.length == 1 && defaultRequiredSelectFieldArr.indexOf(arg.field_code) > -1 && !current_selected) {
            new Modals.Alert({
                title: '联系方式需有一项是必填项！',
                content: '<div style="padding-top: 20px;">手机，固话号码，QQ号，邮箱地址</div>'
            })
            return;
        }
        this.setState({
            fields: fields
        });
    }

    //字段条件设置事件
    changeSetBox(id, code, checkboxType) {
        let $tar = $('#' + id);
        let tar = $tar[0];
        let arr = [];
        this.state.fields.every((f, i)=> {
            if (f.field_code == code) {
                f[checkboxType] = f[checkboxType] ? 0 : 1;
            }
            arr.push(f)
            return true;
        })
        this.setState({
            fields: arr
        })
    }

    clearNewCls() {
        let fields = this.state.fields;
        fields.forEach((f, i)=> {
            f['isNew'] = false;
        })
        this.setState({
            fields: fields
        });
    }

    componentDidMount() {
        this.$el = $(React.findDOMNode(this));
        let _this = this;
        this.eventBind();
        this.DragModel = new DragModel();
        var params = util.getLocationParams();//||{audienceId:124};
        current_contact_id = this.state.contact_id;
        if (params) {
            current_contact_id = params.contact_id;
        }
        this.changeHomeIcon();
        this.loadContent({
            contact_id: current_contact_id
        });
    }

    getDateStr() {
        var date = new Date(); //日期对象
        var now = "";
        now = date.getFullYear() + "-";
        now = now + (date.getMonth() + 1) + "-";
        now = now + date.getDate() + " ";
        now = now + date.getHours() + ":";
        now = now + date.getMinutes() + ":";
        now = now + date.getSeconds() + "";
        return now;
    }

    editTitle() {
        let _this = this;
        let win = new Modals.Window({
            id: "modals-edit",
            title: '联系人表单信息编辑',
            content: _.template($(modalsTpl).filter('#tpl-modal-edit').html())({name: _this.state.contact_name || ""}),
            width: 384,
            buttons: [{
                text: '保存', cls: 'accept ', handler: function (thiz) {
                    var name = $('#modal-contact-name').val();
                    let arg = _this.getSaveParams({
                        contact_name: name
                    })
                    _this.dataSaveAction(arg, function () {
                        _this.setState({
                            contact_name: name
                        })
                        successMsg();
                    });
                    thiz.close();
                }
            }, {
                text: '取消', cls: 'decline', handler: function (thiz) {
                    thiz.close();
                }
            }],
            listeners: {
                afterRender: function (thiz) {
                },
                close: function (thiz) {
                    win = null;
                }
            }
        })
    }

    editFormTitle(title, desc) {
        let _this = this;
        title = _this.state.contact_title;
        desc = _this.state.contact_descript || "";
        console.log("desc", desc)
        let total = desc.length;
        let win = new Modals.Window({
            id: "modals-form-edit",
            title: '设置表单标题及描述',
            content: _.template($(modalsTpl).filter('#modal-form').html())({title: title, desc: desc, total: total}),
            width: 384,
            buttons: [{
                text: '保存', cls: 'accept ', handler: function (thiz) {
                    formNameChange(document.querySelector('#modal-contact-title'));
                    var msg = $('#modal-form-error-msg').text();
                    if (msg) {
                        return;
                    }
                    var ntitle = $('#modal-contact-title').val();
                    var ndesc = $('#modal-contact-desc').val();
                    let arg = _this.getSaveParams({
                        contact_title: ntitle,
                        contact_descript: ndesc
                    })
                    _this.dataSaveAction(arg, function () {
                        _this.setState({
                            contact_title: ntitle,
                            contact_descript: ndesc
                        })
                        successMsg();
                    });
                    thiz.close();
                }
            }, {
                text: '取消', cls: 'decline', handler: function (thiz) {
                    thiz.close();
                }
            }],
            listeners: {
                afterRender: function (thiz) {
                },
                close: function (thiz) {
                    win = null;
                }
            }
        })
    }

    eventBind() {
        let _this = this;
        $("#form-body").on('click', function () {
            _this.clearNewCls();
        })
        $("#form-body").on('mousemove', function (e) {
            let tar = e.target, $tar = $(tar);
            if (tar.classList.contains('set')) {
                _this.dragDisabled(true);
            } else if (tar.classList.contains('drag-move')) {
                _this.dragDisabled(false)
            }
            if (tar.classList.value.indexOf('opt-menu') < 0) {
                $('.menu-wrapper').hide();
            }
        }).on('mouseover', function (e) {
            _this.dragDisabled(false)
        }).on('mousedown', function (e) {
            let tar = e.target, $tar = $(tar);
            if (tar.classList.value.indexOf('opt-menu') > -1) {
                e.stopPropagation();
            }
        })


        /*
         $('#'+this.props.field.field_code+"-set-menu").off().on('mouseleave',function(e){
         $(this).hide();
         }).on('mouseover',function(e){
         console.log(e)
         e.stopPropagation();
         })
         */
    }

    updateOriginalData(data) {
        this.originalData = JSON.parse(JSON.stringify(data || this.state));
    }

    cloneData(data) {
        this.stateClone = JSON.parse(JSON.stringify(data || this.state));
    }

    updateRightShowField() {
        this.rightShowField = JSON.parse(JSON.stringify(this.state));
    }

    //比对初始数据与提交数据是否有字段不同
    isDiffFields() {
        if (!current_contact_id) return false;
        let isDiff = false;
        let sel = this.getSelectedFields();
        let org = this.getOriginalSelectedFields();
        if (sel.length != org.length) {
            return true;
        } else {
            let flag = sel.every((sf, si)=> {
                let isHas = !org.every((of, oi)=> {
                    return !(of.field_code == sf.field_code);
                });
                return isHas;

            })
            return !flag;
        }
    }

    //比对主键初始数据与提交数据不同
    isPrimaryKeyDiff(keys) {
        let arr = [];
        //keys.forEach((k,i)=>{
        //    arr.push(k);
        //})
        let current_fields = this.getSelectedFields();
        let errorKeys = [];
        keys.every((ak, ai)=> {
            let result = current_fields.every((ck, ci)=> {
                if ((ck.field_code == ak.field_code) && ck.required) {
                    return false;
                }
                return true;
            })
            result && errorKeys.push(ak);
            return true;
        })

        return {
            validate: !!errorKeys.length,
            keys: errorKeys
        };

    }

    //获取选中的field
    getSelectedFields(data) {
        let arr = [];
        this.cloneData();
        let fields = data || this.stateClone.fields;
        fields.forEach((f, i)=> {
            if (f.selected) {
                arr.push(f)
            }
        })
        return arr;
    }

    //获取选中的联系字段
    getSelectedContactFiled() {
        var arr = [];
        this.cloneData();
        this.stateClone.fields.forEach((f, i)=> {
            if (defaultRequiredSelectFieldArr.indexOf(f.field_code) > -1 && f.selected) {
                arr.push(f);
            }
        })
        return arr;
    }

    //获取初始选中的field
    getOriginalSelectedFields() {
        let arr = [];
        this.originalData.fields.forEach((f, i)=> {
            if (f.selected) {
                arr.push(f)
            }
        })
        return arr;
    }

    dragDisabled(type) {
        //true 不能拖拽 false 可以拖拽
        this.DragModel.dragDisable(type);
    }

    openPrimaryKeyWin(keys) {
        let _this = this;
        key_modify_status = 0;
        let win = new Modals.Window({
            id: "modals-fields-key",
            title: '提示',
            content: _.template($(modalsTpl).filter('#modals-primary').html())({
                keys: keys
            }),
            width: 484,
            buttons: [{
                text: '保存', cls: 'accept ', handler: function (thiz) {
                    var value = $('#primary')[0].checked;
                    key_modify_status = value ? 2 : 1;
                    thiz.close();

                    if (_this.isDiffFields()) {
                        _this.openDiffWin(key_modify_status);
                    } else {
                        let arg = _this.getSaveParams({
                            key_modify_status: key_modify_status
                        });
                        _this.dataSaveAction(arg, function () {
                            successMsg();
                        })
                    }
                }
            }, {
                text: '取消', cls: 'decline', handler: function (thiz) {
                    thiz.close();
                }
            }],
            listeners: {
                afterRender: function (thiz) {
                },
                close: function (thiz) {
                    win = null;
                }
            }
        })
    }

    changeStatusContact(status, callBack) {
        let _this = this;
        util.api({
            url: API.updateStatus,
            data: {
                contact_id: current_contact_id,
                contact_status: status || 0
            },
            type: 'post',
            success: function (res) {
                if (!res.code) {
                    callBack && callBack();
                } else {
                    errorAlertMsg("操作失败！");
                }
            },
            error: function () {
                errorAlertMsg("网络问题请联系！");
            }
        })

    }

    changeHomeIcon() {
        var params = util.getLocationParams();
        var data = "{}";
        if (params && params['returnurl']) {
            var home = $('#return-pages');
            home.show().attr("href", BASE_PATH + "/" + params['returnurl']);
        }
    }

    changeStatus(status) {
        this.setState({
            contact_status: status
        });
    }

    startHandler() {
        let _this = this;
        if (!this.state.contact_name) {
            this.editTitle();
            return;
        }
        if (current_contact_id) {
            this.changeStatusContact(1, function (res) {
                $("#contact-start").hide();
                $("#contact-stop").show();
                _this.changeStatus(1);
                _this.page2forminfo();
            })
        } else {
            let arg = _this.getSaveParams();
            _this.dataSaveAction(arg, function () {
                _this.changeStatusContact(1, function (res) {
                    $("#contact-start").hide();
                    $("#contact-stop").show();
                    _this.changeStatus(1);
                    _this.page2forminfo();
                })
            })
        }

    }

    stopHandler() {
        let _this = this;
        new Modals.Confirm({
            title: '停用此表单?',
            content: "<div>表单停用后，将不再收集数据。</div>",
            listeners: {//各种监听
                close: function (type) {
                    if (type) {
                        _this.changeStatusContact(2, function (res) {
                            $("#contact-start").show();
                            $("#contact-stop").hide();
                            _this.changeStatus(2)
                        });
                    }
                }
            }
        });
    }

    openDiffWin(key_modify_status) {
        let _this = this;
        let win = new Modals.Window({
            id: "modals-fields-diff",
            title: '提示',
            content: _.template($(modalsTpl).filter('#modals-diff').html())({}),
            width: 484,
            buttons: [{
                text: '保存', cls: 'accept ', handler: function (thiz) {
                    var value = null;
                    $('#modals-fields-diff input[name="effect"]').each((i, radio)=> {
                        value = radio.value;
                        return !radio.checked;
                    });
                    thiz.close();
                    let arg = _this.getSaveParams({
                        key_modify_status: key_modify_status,
                        column_shown_status: value * 1
                    });
                    _this.dataSaveAction(arg, function () {
                        successMsg()
                    });
                }
            }, {
                text: '取消', cls: 'decline', handler: function (thiz) {
                    thiz.close();
                }
            }],
            listeners: {
                afterRender: function (thiz) {
                },
                close: function (thiz) {
                    win = null;
                }
            }
        })
    }

    dataSaveAction(arg, callBack) {
        let _this = this;
        util.api({
            url: API.saveForm,
            data: arg,
            type: 'post',
            success: function (res) {
                if (!res.code) {
                    current_contact_id = res.data[0].contact_id;
                    _this.updateOriginalData();
                    callBack && callBack(res);
                } else {
                    errorAlertMsg("保存失败！");
                }
                $("#tag-edit").removeClass("rui-disabled");
            },
            error: function (res) {
                $("#tag-edit").removeClass("rui-disabled");
                errorAlertMsg("网络问题请联系管理员！");
            }
        })


    }

    storagePreviewData() {
        let _this = this;
        this.cloneData()
        fieldSDataFormatter.transformPreview(this.stateClone.fields);
        localStorage.setItem("previewData", JSON.stringify({
            field_list: _this.getSelectedFields(this.setFieldIndex(this.stateClone.fields)),
            contact_name: this.stateClone.contact_name,
            contact_title: this.stateClone.contact_title,
            contact_descript: this.stateClone.contact_descript,
            contact_status: _this.stateClone.contact_status
        }));

    }

    page2preview() {
        let _this = this;
        _this.storagePreviewData();
        window.open(BASE_PATH + '/html/asset/contactform-preview.html?key=previewData');
    }

    page2forminfo() {
        this.storagePreviewData();
        window.location.href = BASE_PATH + '/html/form-msg/forminfo.html?key=previewData&contact_id=' + current_contact_id;
    }

    tagHandler() {
        if ($("#tag-edit").hasClass("rui-disabled")) {
            return;
        }
        let _this = this;
        let win = new Modals.Window({
            id: "modals-tag-edit",
            title: '联系人表单标签',
            content: _.template($(modalsTpl).filter('#tpl-modal-tag').html())({}),
            width: 384,
            events: {
                click: function (e) {
                    if (e.$target.hasClass('rui-close')) {
                        var p = e.$target.parent();
                        console.log(p.attr('attr-name'))
                        formatter.delDataInArr(REL_TAG_NAMS, p.attr('attr-name'));
                        p.remove();
                        console.log(REL_TAG_NAMS)
                    }
                }
            },
            buttons: [{
                text: '保存', cls: 'accept', handler: function (thiz) {
                    _this.updateRelTags();
                    thiz.close();
                }
            }, {
                text: '取消', cls: 'decline', handler: function (thiz) {
                    thiz.close();
                }
            }],
            listeners: {
                open: function (thiz) {
                    bindKeydown(true);
                    _this.queryRelTags(renderTagsRel)
                },
                close: function () {
                    bindKeydown(false);
                    tagBtnDisabled(false)
                }
            }
        })
    }

    saveHandler() {
        let _this = this;
        if (!this.state.contact_name) {
            this.editTitle();
            return;
        }

        this.getKeyData(function (keys) {
            var isPrimaryKeyDiff = _this.isPrimaryKeyDiff(keys);
            if (isPrimaryKeyDiff.validate) {
                _this.openPrimaryKeyWin(isPrimaryKeyDiff.keys);
            } else if (_this.isDiffFields()) {
                _this.openDiffWin(0);
            } else {
                let arg = _this.getSaveParams();
                _this.dataSaveAction(arg, function (res) {
                    if (res) {
                        _this.setState({
                            contact_name: arg.contact_name
                        })
                    }
                    successMsg();
                })
            }
        })

    }

    render() {
        this.cloneData();
        return (
            <div className="contact-create">
                <Header data={this.state}
                        editTitle={this.editTitle}
                        saveHandler={this.saveHandler}
                        stopHandler={this.stopHandler}
                        startHandler={this.startHandler}
                        tagHandler={this.tagHandler}/>
                <Content data={this.stateClone}
                         page2preview={this.page2preview}
                         changeSetBox={this.changeSetBox}
                         editFormTitle={this.editFormTitle}
                         fieldClick={this.fieldClick}
                         dragModelControl={this.dragModelControl}/>
                <div id="dropdown-box"></div>
            </div>
        )

    }
}
module.exports = Panel;
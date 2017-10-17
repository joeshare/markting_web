/**
 * Created by lxf on 2016-8-9.
 * 联系人表单-PC端-预览
 */
import PreviewList from 'module/contact-preview/contactform-preview-list';

class PreviewForm {
    constructor(options) {

        this.previewData=null;
        this.state={};
        this.contactId = util.getLocationParams() && util.getLocationParams().contact_id;
        if(!this.contactId){
            this.previewData = $.parseJSON(localStorage.getItem('previewData'));
        }
        this.init();
    }

    init() {
        this.loadData();
        this.events();
    }
    events() {
        $('.header').on('click', 'li', e=> {
            let meEl = $(e.currentTarget);
            $('.header li').removeClass('cur');
            $('.formlist-wrap').hide();
            meEl.addClass('cur');
            $('.' + meEl.data('target')).show();
        });
    }
    loadData() {
        let _this=this;
        if(! _this.contactId&&!this.previewData){
             window.location.href=BASE_PATH+'/html/form-msg/noexist.html';
             return;
        }
        if( _this.contactId){
            util.api({
                data: {
                    contact_id: _this.contactId,
                    method: 'mkt.contact.list.info.get'
                },
                success: function (response) {
                    if (response.code == 0 && !_.isEmpty(response.data)) {
                        if( response.data[0].contact_status*1==2){//表单不可使用状态
                            window.location.href=BASE_PATH+'/html/form-msg/noexist.html';
                        }else {
                            let fieldList = response.data[0].field_list;
                            let contactName = response.data[0].contact_name;
                            let contactTilte = response.data[0].contact_title;
                            let contactDescript = response.data[0].contact_descript;
                            _this.state= {
                                contactName: contactName,
                                contact_title: contactTilte,
                                contact_descript: contactDescript,
                                fields: fieldList
                            };
                        }
                        _this.render();
                    }else{
                        window.location.href=BASE_PATH+'/html/form-msg/noexist.html';
                    }
                },
                error: function () {
                    window.location.href=BASE_PATH+'/html/form-msg/noexist.html';
                }
            })
        }else{
            _this.render();
        }

    }
    render() {
            let _this=this;
            let defaultTitle="联系人表单";
            let defaultDescript="感谢参与信息征集活动，留下您的联系方式。";
            if(_this.contactId){
                $('.title-con').text(_this.state.contact_title||defaultTitle)
                $('.subtitle').text(_this.state.contact_descript||defaultDescript)
                $('.formwrap').each(function (i, m) {
                    ReactDOM.render(<PreviewList fields={_this.state.fields} preview={true}/>, m);
                });
                $('select').material_select();
            }else if(this.previewData){
                $('.title-con').text(this.previewData.contact_title||defaultTitle)
                $('.subtitle').text(this.previewData.contact_descript||defaultDescript)
                $('.formwrap').each(function (i, m) {
                    ReactDOM.render(<PreviewList preview={true}/>, m);
                });
                $('select').material_select();
            }
        }
}
const previewForm = new PreviewForm();


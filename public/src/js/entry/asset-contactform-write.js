/**
 * Created by lxf on 2016-8-9.
 * 联系人表单-PC端-预览
 */
import PreviewList from 'module/contact-preview/contactform-preview-list';
class PreviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.contactId = util.getLocationParams()?util.getLocationParams().contact_id:null;
        this.state={};
        this.init();
        this.loadData=this.loadData.bind(this);
    }
    init() {
        this.loadData();
        this.render();
        this.events();
        this.countPv();
    }
    countPv() {
        let _this=this;
        util.api({
            data: {
                method: 'mkt.contact.list.pv',
                contact_id: _this.contactId
            }
        })
    }
    loadData() {
        let _this=this;
        if(!_this.contactId){
            window.location.href=BASE_PATH+'/html/form-msg/noexist.html';
            return;
        }
        util.api({
            async: false,
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
                        let contactTilte = response.data[0].contact_title|| '联系人表单';
                        let contactDescript = response.data[0].contact_descript|| '感谢参与信息征集活动，留下您的联系方式。';
                        _this.state={
                            contact_name: contactName,
                            contact_title: contactTilte,
                            contact_descript: contactDescript,
                            fields: fieldList
                        };
                    }
                }else{
                    window.location.href=BASE_PATH+'/html/form-msg/noexist.html';
                }
            },
            error: function () {
                window.location.href=BASE_PATH+'/html/form-msg/noexist.html';
            }
        })
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

    render() {

            let _this=this;
            if(_this.state.fields){
                $('#title').text(_this.state.contact_title)
                $('#subtitle').text(_this.state.contact_descript)
                ReactDOM.render(<PreviewList fields={_this.state.fields} preview={false}/>, document.querySelector('.formwrap'));
                $('select').material_select();
            }
    }
}
const previewForm = new PreviewForm();


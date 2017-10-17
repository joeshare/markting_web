/**
 * Created by lxf on 2016-8-9.
 * 联系人表单-移动端-预览
 */
import PreviewList from 'module/contact-preview/contactform-preview-list';
class Preview  extends React.Component {
    constructor(props) {
        super(props);
        this.contactId = util.getLocationParams()?util.getLocationParams().contact_id:null;
        this.state={};
        this.init();
        this.loadData=this.loadData.bind(this);

    }
    componentDidMount(){
        //console.log('componentDidMount')
        //this.init();
    }
    init() {
        this.loadData();
        //this.render();
        //alert(1.3)
        this.events();
        this.componets();
        this.countPv();
    }

    countPv() {
        let _this=this;
        util.api({
            data: {
                method: 'mkt.contact.list.pv',
                contact_id:  _this.contactId
            }
        })
    }

    componets() {
        var LAreaData1 = [{
            "id": "2",
            "name": "辽宁省",
            "child": [{
                "id": "21",
                "name": "营口市",
                "child": [{
                    "id": "211",
                    "name": "鲅鱼圈"
                }, {
                    "id": "212",
                    "name": "老边区"
                }, {
                    "id": "213",
                    "name": "盖州市"
                }]
            }, {
                "id": "22",
                "name": "沈阳"
            }, {
                "id": "23",
                "name": "大连"
            }]
        }];

        var area = new LArea();
        area.init({
            'trigger': '#demo1',//触发选择控件的文本框，同时选择完毕后name属性输出到该位置
            'valueTo': '#value1',//选择完毕后id属性输出到该隐藏的Input的value里面
            'keys': {id: 'id', name: 'name'},//绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
            'data': LAreaData1//数据源
        });
        $('#submit-city').click(function () {
            alert('城市ID:' + $('#value1').val())
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
                    if( response.data[0].contact_status*1==2){
                        window.location.href=BASE_PATH+'/html/form-msg/noexist.html';
                    }else{
                        let fieldList = response.data[0].field_list;
                        let contactName = response.data[0].contact_name;
                        let contactTilte = response.data[0].contact_title||'联系人表单';
                        let contactDescript = response.data[0].contact_descript||'感谢参与信息征集活动，留下您的联系方式。';
                        _this.state={
                            contact_name: contactName,
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
    }
    render() {
        let _this=this;
        if(_this.state.fields){
            $('#title').text(_this.state.contact_title)
            $('#subtitle').text(_this.state.contact_descript)
            $('.formwrap').each(function (i, m) {
                ReactDOM.render(<PreviewList clientType={2} fields={_this.state.fields} preview={false}/>, m);
            });
            $('select').material_select();
        }

    }
}

const previewForm = new Preview();


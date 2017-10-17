/**
 * Created by lxf on 2016-8-11.
 * 表单预览列表模块
 * 外部引用接收的参数
 * clientType 客户端类型 （移动端传2）
 * preview 是否为预览 （用来区别预览和提交）
 */
// /^[\d\w-\u4e00-\u9fa5\uf900-\ufa2d]+$/.test('as123f_-你好')
class FormField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    fieldChange(e) {
        let me = e.currentTarget;
        this.setState({
            value: me.value
        })
    }

    sendCode() {
        alert('已发送')
    }

    fieldCheck(fieldData, e) {
        let $cur = $(e.currentTarget);
        let val = $.trim(e.currentTarget.value);
        let isChecked = fieldData.ischecked;
        let fieldCode = fieldData.field_code;
        let result = true;
        if (isChecked) {

            switch (fieldCode) {
                case 'name':

                    // result = /^[\d\w-\u4e00-\u9fa5\uf900-\ufa2d]+$/.test(val);
                    result = true;
                    break;
                case 'mobile':
                    result = util.sv.isMobileNumber(val);
                    break;
                case 'tel':
                    result = util.isTelephone(val);
                    break;
                case 'email':
                    result = util.sv.isEmail(val);
                    break;
                case 'identify_no':
                    result = util.sv.isIdNumber(val);
                    break;
            }
        }
        if (!result) {
            $cur.closest('.input-block').addClass('err');
        } else {
            $cur.closest('.input-block').removeClass('err');
        }

    }

    /**
     * 通过不同的表单类型返回对应的表单元素
     * @param fieldType
     */
    setInput(fieldType) {
        let clientType = this.props.clientType;
        let fieldData = this.props.fieldData;
        let fieldCode = fieldData.field_code;
        let required = fieldData.required;//（0,1）1为必填项
        let showStar = required ? 'ico-star' : 'ico-star fn-hide';
        //枚举类型 - 0:输入框 1:下拉框 2:日历选择 3:地区联动 4:手机(验证码)
        fieldType = fieldType || 0;
        switch (fieldType) {
            //text
            case 0:
                let lengthNum = '';
                if (fieldCode === 'name') {
                    lengthNum = 12
                } else {
                    lengthNum = ''
                }
                return (
                    <div className="input-block">
                        <div className={showStar}>*</div>
                        <label className="active">{fieldData.field_name}</label>
                        <input maxLength={lengthNum} type="text" className="validate"
                               onBlur={this.fieldCheck.bind(this,fieldData)}
                               data-fieldcode={fieldData.field_code}/>
                    </div>
                );
                break;
            //select
            case 1:
                return (
                    <div className="input-block">
                        <div className={showStar}>*</div>
                        <select data-fieldcode={fieldData.field_code} className="">
                            <option value disabled selected>{fieldData.field_name}</option>
                            {fieldData.select_data.map(m=> {
                                return (
                                    <option value={m.value}>{m.name}</option>
                                )
                            })}
                        </select>
                    </div>
                );
                break;
            //date
            case 2:
                return (
                    <div className="input-block">
                        <div className={showStar}>*</div>
                        <div className="icon iconfont date-ico">&#xe626;</div>
                        <label className="active">{fieldData.field_name}</label>
                        <input type="text" className="validate datepicker" data-fieldcode={fieldData.field_code}/>

                    </div>
                );
                break;
            //mobile
            case 4:
                return (
                    <div className="input-block">
                        <div className={showStar}>*</div>
                        <div className="btn-sendcode fn-hide" onClick={this.sendCode.bind(this)}>发送验证码</div>
                        <label className="active">手机号码</label>
                        <input type="text" className="validate" data-fieldcode={fieldData.field_code}/>
                    </div>
                );
                break;
            //location
            case 3:
                return (
                    <div className="input-block">
                        <div className={showStar}>*</div>
                        <label className="active">地区</label>
                        <input type="text" className="validate" data-fieldcode={fieldData.field_code}/>
                    </div>
                );
                break;
        }
    }

    componentDidMount() {
        this.bindComponent();
    }

    componentDidUpdate() {
        this.bindComponent();
    }

    bindComponent() {
        $('select').material_select();
        //fixbug
        $('.datepicker').pickadate({
            format: 'yyyy-mm-dd',
            onOpen: function () {
                // Using arrays formatted as [YEAR, MONTH, DATE].
                this.set('select', [1990, 0, 1])
            },
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 90 // Creates a dropdown of 15 years to control year
        });

    }

    render() {
        return (
            <div>
                {this.setInput(this.props.fieldData.field_type)}
            </div>
        )
    }
}

class PreviewList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contactName: '',
            fields: []
        };
        this.contactId = util.getLocationParams() && util.getLocationParams().contact_id;
    }

    load() {
        let that = this;
        if (this.props.fields) {
            that.setState({
                fields: that.props.fields
            });
        } else if (this.props.preview) {
            let previewData = $.parseJSON(localStorage.getItem('previewData'));

            that.setState({
                fields: _.sortBy(previewData.field_list, 'index')
            });
        } else {
            util.api({
                // surl: '/apidata/contactform-preview/list.json',
                data: {
                    contact_id: that.contactId,
                    method: 'mkt.contact.list.info.get'
                },
                success: function (response) {
                    if (response.code == 0 && !_.isEmpty(response.data)) {
                        if (response.data[0].contact_status * 1 == 2) {//表单不可使用状态
                            window.location.href = BASE_PATH + '/html/form-msg/noexist.html';
                        } else {
                            let fieldList = response.data[0].field_list;
                            let contactName = response.data[0].contact_name;
                            that.setState({
                                contactName: contactName,
                                fields: fieldList
                            });
                        }
                    } else {
                        window.location.href = BASE_PATH + '/html/form-msg/noexist.html';
                    }
                },
                error: function () {
                    window.location.href = BASE_PATH + '/html/form-msg/noexist.html';
                }

            })
        }


    }

    componentDidMount() {
        this.$el = $(React.findDOMNode(this));
        this.load();
    }

    submit() {
        let that = this;
        let $el = this.$el;
        let $inputs = $el.find('input');
        let postDataArr = [];
        if (this.props.preview)return;
        $inputs.each(function (i, m) {
            let val = m.value;
            let fieldCode = m.getAttribute('data-fieldcode');
            if (!fieldCode) {
                fieldCode = $(m).siblings('select').attr('data-fieldcode');
            }
            postDataArr.push({
                [fieldCode]: val
            });
        });
        let requireArr = [];
        $('.formwrap .ico-star').each((i, dom)=> {
            let $tar = $(dom);
            let name = "";
            if ($tar.parent().children('div.select-wrapper')[0]) {
                name = $tar.parent().find('div.select-wrapper select').attr('data-fieldcode');
            } else {
                name = $tar.parent().find('input').attr('data-fieldcode');
            }
            requireArr.push(name)

        })
        //requireFlag false 表示必填项有值 true 表示必填项无值
        let requireFlag = !requireArr.every((k, i)=> {
            //f false 表示必填项有值 true 表示必填项无值
            let f = postDataArr.every((o, i)=> {
                return !o[k];
            })
            return !f;
        })
        let inputBlock = $('.input-block.err')[0];
        let errFlag = inputBlock ? true : false;
        if (requireFlag || errFlag) {
            return;
        }
        util.api({
            url: "?method=mkt.contacts.commit.save",
            type: 'post',
            data: _.extend({
                contact_templ_id: that.contactId
            }, ...postDataArr),
            success: function (res) {
                var contact_name=that.state.contactName||"联系人表单";
                if (res.code === 0) {
                    window.location.href = '/html/form-msg/success.html?contact_name=' + contact_name;
                } else {
                    window.location.href = '/html/form-msg/error.html?contact_name=' + contact_name;
                }
            }
        });

    }

    comationFuntion(propertyName) {
        return function (object1, object2) {
            var value1 = object1[propertyName] * 1;
            var value2 = object2[propertyName] * 1;
            if (value1 < value2) {
                return -1;
            } else if (value1 > value2) {
                return 1;
            } else {
                return 0;
            }
        };
    }

    render() {
        var fields = [];
        let _this = this;
        let arr = JSON.parse(JSON.stringify(_this.state.fields));
        arr.sort(_this.comationFuntion('index'));
        arr.map(m=> {
            fields.push(<FormField fieldData={m} clientType={this.props.clientType}/>);
        });
        return (
            <table>
                <tbody>
                <tr>
                    <td valign="top" height={20}>
                        {fields}
                    </td>
                </tr>
                <tr>
                    <td className="center submit-btn-wrap">
                        <div className="submit-btn" onClick={this.submit.bind(this)}>提交</div>
                    </td>
                </tr>
                </tbody>
            </table>

        )

    }
}
module.exports = PreviewList;


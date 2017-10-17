/**
 * Created by 刘晓帆 on 2016-4-11.
 * 测试功能专用1
 */
'use strict';

//组件
// let Lcalendar = require('module/lcalendar/lcalendar.js');//活动日历
let MyCavans = require('module/test/canvastest.js');

/*构造页面*/
let Layout = require('module/layout/layout');
//先创建布局1 2
let layout = new Layout({
    index: 0,
    leftMenuCurName: ''
});

//root
class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0//
        };

        // this.setTotal = this.setTotal.bind(this)
    }

    //获取上传文件的接口地址
    getUploadUrlPath() {
        let that = this;
        let result = '';
        util.api({
            data: {
                method: "mkt.materiel.coupon.file.upload.get",
            },
            async: false,
            success: function (res) {
                if (res.code == 0) {
                    result = res.data[0].file_url
                } else {
                    result = '';
                }
            }
        });
        return result;
    }

    //文件上传
    uploadFile() {
        let that = this;
        let formData = new FormData();
        let fileObj = $('#upload-file')[0].files[0];
        let filePathName = $('#upload-file').val();
        let uploadUrl = this.getUploadUrlPath();
        this.setState({
            fileUploadMsg: filePathName
        });

        //单独写请求
        $.ajax({
            url: API_PATH + '?method=' + uploadUrl + '&user_id=' + USER_ID,
            type: 'POST',
            cache: false,
            data: formData.append('file_input', fileObj),//第一个参数的这个名称要和后端对应上
            processData: false,//必填
            contentType: false,//必填
            beforeSend: function () {
                // that.firstBoxState('loading',fileName);
                $('.upload-box').hide();
                $('.file-upload-loading').show();
            },
            success: function (res) {
                if (res.code == 0) {
                    $('.upload-box').hide();
                    $('.file-upload-success').show();
                } else {

                    $('.upload-box').hide();
                    $('.file-upload-fail').show();
                }
                console.info('done', res)
            }
        });
    }

    load() {
        let that = this;
        that.setState({
            totalCount: 1
        });
        util.api({
            data: {
                method: "mkt.data.main.search.get",
                name: '未命名'
            },
            success: function (res) {

                // console.info('', res)
            }
        });
        //util.api({
        //    url: "?method=mkt.data.filter.audiences.get",
        //    type: 'post',
        //    data: {
        //        //"segment_name": "母婴北京vip",
        //        //"publish_status": 0,
        //        md_type: 0,
        //        "task_ids":[1],
        //        "contact_ids":[1],
        //
        //    },
        //    success: function (res) {
        //        console.info(res)
        //    }
        //});
    }

    // 实例化后执行一次,相当于init方法
    componentDidMount() {
        this.$el = $(React.findDOMNode(this));
        this.load();
    }

    //每次渲染之后都要调用
    componentDidUpdate() {
        this.echatsSet()
    }

    //图标示例
    echatsSet() {
        let myChart = echarts.init(document.getElementById('mycharts'));

        // 字符云
        let option = {
            title: {
                text: "词云图",
                link: 'https://github.com/ecomfe/echarts-wordcloud',
                subtext: 'data-visual.cn',
                sublink: 'http://data-visual.cn',
            },
            tooltip: {},
            series: [{
                type: 'wordCloud',
                gridSize: 20,
                sizeRange: [12, 50],
                rotationRange: [0, 0],
                shape: 'circle',
                textStyle: {
                    normal: {
                        color: function () {


                            return 'rgb(' + [
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160)
                                ].join(',') + ')';
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                data: [{
                    name: 'Sam S Club',
                    value: 10000,

                }, {
                    name: 'Macys',
                    value: 6181
                }, {
                    name: 'Amy Schumer',
                    value: 4386
                }, {
                    name: 'Jurassic World',
                    value: 4055
                }, {
                    name: 'Charter Communications',
                    value: 2467
                }, {
                    name: 'Chick Fil A',
                    value: 2244
                }, {
                    name: 'Planet Fitness',
                    value: 1898
                }, {
                    name: 'Pitch Perfect',
                    value: 1484
                }, {
                    name: 'Express',
                    value: 1112
                }, {
                    name: 'Home',
                    value: 965
                }, {
                    name: 'Johnny Depp',
                    value: 847
                }, {
                    name: 'Lena Dunham',
                    value: 582
                }, {
                    name: 'Lewis Hamilton',
                    value: 555
                }, {
                    name: 'KXAN',
                    value: 550
                }, {
                    name: 'Mary Ellen Mark',
                    value: 462
                }, {
                    name: 'Farrah Abraham',
                    value: 366
                }, {
                    name: 'Rita Ora',
                    value: 360
                }, {
                    name: 'Serena Williams',
                    value: 282
                }, {
                    name: 'NCAA baseball tournament',
                    value: 273
                }, {
                    name: 'Point Break',
                    value: 265
                }]
            }]
        };
        myChart.setOption(option);
    }

    testModal() {
        $("#modal1").openModal({
            dismissible: false,
            ready: function () {

            }, // Callback for Modal open
            complete: function () {

            } // Callback for Modal close
        })
    }

    render() {
        return (
            <div className="test">
                <div id="mycharts" style={{
                    width: 700,
                    height: 500
                }}/>
                {/*<MyCavans/>*/}
                <div className="btn" onClick={this.testModal.bind(this)}>测试</div>
                <div id="modal1" className="modal">
                    <div className="modal-content">
                        <h4>Modal Header</h4>
                        <p>A bunch of text</p>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className=" modal-action modal-close waves-effect waves-green btn-flat">同意</a>
                    </div>
                </div>

            </div>
        )
    }
}

//渲染
const test = ReactDOM.render(
    <Test />,
    document.getElementById('page-body')
);

let regExp = /^API_PATH:(.*)com$/;
let aa = '(1){$1}dfd地方sf{$2}sf(1)d(2)sf{$adff}dsf{$12}{$123}{$123()4}dsf{1}{}{a}';
// console.info(util.findVarStrtoArr(aa));

var a = {n: 1}
var b = a;
a.x = a = {n: 2}
console.log(a.x);
console.log(b.x)
$('body').click(function (e) {
    console.info(e.target)
    console.info(e.currentTarget)

})
module.exports = Test;

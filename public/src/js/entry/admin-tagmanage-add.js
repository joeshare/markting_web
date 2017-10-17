/**
 * Created by joeliu on 2016-10-13.
 * 标签添加
 */
'use strict';

let Layout = require('module/layout/layout');
let Modals = require('component/modals.js');
let pagination = require('plugins/pagination')($);//分页插件

//先创建布局
const layout = new Layout({
    index: 999,
    leftMenuCurName: '标签管理'
});


/****二级头部****/
class SubHead extends React.Component{
    gotoLast(){
        window.history.go(-1);
    }
    modalsPreview(e){
        let thisDiv = $(e.currentTarget);
        let thisData,thisId;
        /*初始化变量*/
        let wxAttc = this.props.param.subscriptionName.acct;
        let modalsTitle = this.props.param.subscriptionName.name;
        let chId = this.props.param.channelName.id;
        let chTitle = this.props.param.channelName.name;
        let qrcodeName = this.props.param.qrcodeName.value;
        let fixedCrowd = this.props.param.fixedCrowdInput.value,fixedCrowdShow;
        let failuresTime = this.props.param.failuresTime,failuresTimeShow;
        let comment = this.props.param.textareaText.value,commentshow;
        let tagsAreaDisplay = this.props.param.tagsAreaDisplay;
        let tags = [];
        /*组织modals数据*/
        if(fixedCrowd==''){fixedCrowdShow='无'}else{fixedCrowdShow=fixedCrowd}
        if(failuresTime==''){failuresTimeShow='永久'}else{failuresTimeShow=failuresTime}
        if(comment==''){commentshow='无'}else{commentshow=comment}
        let contentHtml = "";
        let contentHtml1 = "<div class='modals-preview-html'><div class='con-title'>扫一扫</div><div class='qrcode-box'><div class='qrcode'>";
        let contentHtml2 = "";
        let contentHtml3 = "</div></div><div class='channel-box'><div class='channel-title'>"+chTitle+"</div><div class='channel-test'>"+qrcodeName+"</div></div><div class='valid-date-box'>";
        let contentHtml4 = "";
        let contentHtml5 = "</div><div class='fixed-crowd-box'><div class='fixed-crowd-title'>固定人群：</div><div class='fixed-crowd-cont'>"+fixedCrowdShow+"</div></div><div class='tags-area'><div class='tags-title'>关联标签：</div><div class='tags-cont'>";
        let contentHtml6 = "";
        let contentHtml7 = "</div></div><div class='note'>备注："+commentshow+"</div></div>";
        /*整理modals数据*/
        if(tagsAreaDisplay == 'block'){
            tags = this.props.param.tags;
            if(tags.length > 0){
                for(let i=0; i<tags.length; i++){
                    contentHtml6 += "<nobr class='tag'>" + tags[i] + "</nobr>";
                }
            }else{
                contentHtml6 = "无";
            }
        }else{
            contentHtml6 = "无";
        }
        /*输出*/
        if(thisDiv.hasClass('keyong')){
            util.api({
                url: "?method=mkt.weixin.qrcode.create",
                type: 'post',
                data: {
                    wx_acct: wxAttc,
                    wx_name: modalsTitle,
                    ch_code: chId,
                    ch_name: chTitle,
                    qrcode_name: qrcodeName,
                    expiration_time: failuresTime,
                    fixed_audience: fixedCrowd,
                    association_tags: tags,
                    comments: comment
                },
                success: function (res) {
                    if(res.code == 0){
                        thisData = res.data[0];
                        thisId = thisData.id;
                        contentHtml2 = "<img src='"+FILE_PATH+thisData.qrcodePic+"'/>";
                        contentHtml4 = thisData.createtime+"&nbsp;&#126;&nbsp;"+failuresTimeShow;
                        contentHtml = contentHtml1 + contentHtml2 + contentHtml3 + contentHtml4 + contentHtml5 + contentHtml6 + contentHtml7;
                        new Modals.Window({
                            id: "modalsPreviewHtml",
                            title: modalsTitle,
                            content: contentHtml,
                            width: 372,//默认是auto
                            height: 623,//默认是auto
                            buttons: [
                                {
                                    text: '生成二维码',
                                    cls: 'accept',
                                    handler: function (self) {
                                        util.api({
                                            url: "?method=mkt.weixin.qrcode.enable",
                                            type: 'post',
                                            data:{id:thisId},
                                            success: function (res){
                                                //location.href = BASE_PATH+'/html/asset/qrcode-download.html?id='+thisId;
                                                self.close('go');
                                            }
                                        });
                                    }
                                }
                            ],
                            listeners: {//window监听事件事件
                                open: function () {
                                    //console.log("open");
                                },
                                close: function (type) {
                                    //console.log("close");
                                    if(type!='go'){
                                        util.api({
                                            url: "?method=mkt.weixin.qrcode.records.del",
                                            type: 'post',
                                            data:{id:thisId},
                                            success: function (res){}
                                        });
                                    }
                                },
                                beforeRender: function () {
                                    //console.log("beforeRender");
                                },
                                afterRender: function () {
                                    //console.log("afterRender");
                                }
                            }
                        });
                    }
                }
            });
        }
    }
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">新建标签</span>
                </div>
                <div className="button-box icon iconfont">
                    <a className="a keyong" href="javascript:void(0)" title="返回" onClick={this.gotoLast.bind(this)}>&#xe621;</a>
                </div>
            </header>
        )
    }
}



//弹出模版
class AddWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.onTypeclickwin = this.onTypeclickwin.bind(this);
    }

    componentDidMount() {
        $('#select-win-type').dropdown();
    }

    onInputSms(){
        $('.txtleft').hide();
        $('.txtright').text($('.smscontent').val().length);

        var $smstxt = $('.smscontent');
        var dh = $smstxt.attr('defaultHeight') || 0;
        if (!dh) {
            dh = $smstxt[0].clientHeight;
            $smstxt.attr('defaultHeight', dh);
        }
        $smstxt.height(dh);
        var clientHeight = $smstxt[0].clientHeight;
        var scrollHeight = $smstxt[0].scrollHeight;
        if (clientHeight !== scrollHeight) {
            $smstxt.height(scrollHeight);
        }
    }

    onTypeclickwin(param,text){
        $('#select-win-type').text(text);
        this.props.onSelect(param);
    }

    render() {
        return (
            <div className="wincontent">
                <div className="line-box">
                    <div className="line-title">
                        <span>模版类型</span>
                    </div>
                    <div className="line">
                        <div className="qrcode-name">
                            <div className="input-box">
                                <a className='selectbtn dropdown-button' id="select-win-type" data-beloworigin="true" href='#' data-activates='select-tpltype-win'>固定模版</a>
                                <ul id='select-tpltype-win' className='dropdown-content'>
                                    <li onClick={this.onTypeclickwin.bind(this,100,'全部')}><a >全部</a></li>
                                    <li onClick={this.onTypeclickwin.bind(this,0,'固定模版')}><a>固定模版</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

//主数据页面类
class MasterData extends React.Component {
    constructor(props) {
        super(props);
    }

    //初始化
    componentDidMount() {

    }

    onselectClass(){
        let that = this;
        let mdtData = [];
        if (this.customViewModals) {
            this.customViewModals.show();
        } else {
            this.customViewModals = new Modals.Window({
                width:600,
                height:300,
                title: "",
                content: '<div class="con-body"/>',
                buttons: [
                    {
                        text: '提交模版',
                        cls: 'accept',
                        handler: function (self) {

                            let $smscon =  $('.smscontent');
                            if($smscon.val().trim().length<1)
                            {
                                $('.txtleft').text("模版内容不能为空！");
                                $('.txtleft').show();
                            }
                            else {

                                util.api({
                                    url: "?method=mkt.sms.smstemplet.save",
                                    type: 'post',
                                    data: {
                                        channel_type: that.state.channel_type,
                                        type: that.state.typewin,
                                        content: $smscon.val(),
                                        creator: USER_ID,
                                        update_user: null
                                    },
                                    success: function (res) {
                                        if(res.code ==0)
                                        {
                                            self.close();
                                            that.postList();
                                        }
                                        else {
                                            $('.txtleft').show();
                                            $('.txtleft').text("提交失败");
                                        }

                                    }
                                });
                            }
                        }
                    },
                    {
                        text: '取消',
                        cls: 'decline',
                        handler: function (self) {
                            self.close();
                        }
                    }
                ],
                listeners: {
                    beforeRender: function () {
                        this.addtpl = ReactDOM.render(
                            <AddWindow onSelect={that.onSelectTypeWin}/>,
                            $('.con-body', this.$el)[0]
                        );
                    }
                }
            })
        }

    }

    //渲染
    render() {
       // let data = this.state.mainCount;
        return (
            <div className="tagmanageadd">
                <SubHead/>
                <div className="content">
                    <div className="line-box">
                        <div className="line-title">标签名称</div>
                        <div className="line">
                            <div className="input-box">
                                <input  className="input" maxLength="20" type="text"/>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="line-title">生成规则</div>
                        <div className="line">
                            <div className="input-box">
                                <textarea  className="input"  type="text"/>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="line-title">内容值</div>
                        <div className="line">
                            <div className="input-box">
                                <textarea  className="input"  type="text"/>
                            </div>
                            <div className="iconfont dropdown-button tipbut"  data-hover="true" data-activates="hovertipid" data-constrainwidth="false">&#xe66f;</div>
                            <ul id="hovertipid" className="dropdown-content">
                                <li className="hovertip"><p>值标签包含的值，如标签名称为性别，内容值有：男、女、未知</p></li>
                            </ul>
                        </div>
                    </div>

                    <div className="line-box">
                        <div className="line-title">分类</div>
                        <div className="line">
                            <div className="types">
                                <div onClick={this.onselectClass.bind(this)} className="channel dropdown-button">
                                    <div></div>
                                    <div className="arrow-down"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="line-title">标签描述</div>
                        <div className="line">
                            <div className="input-box">
                                <textarea  className="input"  type="text"/>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className="line-box">
                        <div className="btn-area">
                            <div className="btn-box">
                                <div className="but-submit button ">提交开发</div>
                                <div className="but-onlysave button aid min default">仅保存</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//渲染
const masterData = ReactDOM.render(
    <MasterData />,
    document.getElementById('page-body')
);

export default MasterData;


/**
 * Created by AnThen on 2016-8-8.
 * 微信二维码-详情 es6+react版
 */
'use strict';//严格模式

/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'微信二维码'
});

/********插件********/
let Modals = require('component/modals.js');

/********编写页面模块********/
/****二级头部****/
class SubHead extends React.Component{
    gotoLast(){
        window.history.go(-1);
    }
    qrcodeDownload(id,name){
        let that = this;
        let thisData;
        let thisName=name,thisQrcodeImg,thisBig,thisMid,thisSmall,thisUrl;
        if(id){
            util.api({
                data: {method: 'mkt.weixin.qrcode.pic.download',qrcode_id:id},
                success: function (res) {
                    if(res.code == 0){
                        thisData = res.data[0];
                        thisBig = FILE_PATH + thisData.qrcode_pic1;
                        thisMid = FILE_PATH + thisData.qrcode_pic2;
                        thisSmall = FILE_PATH + thisData.qrcode_pic3;
                        thisQrcodeImg = thisSmall;
                        thisUrl = thisBig;/*原值thisData.qrcode_url*/
                        that.qrcodeDownloadShow(thisName,thisQrcodeImg,thisBig,thisMid,thisSmall,thisUrl);
                    }
                }
            });
        }
    }
    qrcodeDownloadShow(name,qrcodeImg,big,mid,small,url){
        let downloadUrl = big;

        let contentHtml = "<div class='modals-qrcode-download'><div class='qrcode-box'><div class='qrcode'><img src='' id='qrcodeImg'/></div></div><div class='select-size-area' id='select-size-area'><div class='select-size-box active' id='bigQrcode'><div class='rideo iconfont'>&#xe610;</div><div class='text'>大 [1200*1200] 适用于线下海报/易拉宝</div></div><div class='select-size-box' id='midQrcode'><div class='rideo iconfont'>&#xe610;</div><div class='text'>中 [800*800] 适用于传单</div></div><div class='select-size-box' id='smallQrcode'><div class='rideo iconfont'>&#xe610;</div><div class='text'>小 [200*200] 适用于插入微信图文、H5活动也或名片</div></div></div><div class='copy-area'><div class='input' id='copyInput' data-clipboard-text=''></div><div class='button-assist-3 copy-but' id='copyBut'>复制链接</div></div></div>";
        new Modals.Window({
            id: "modalsQrcodeDownloadHtml",
            title: name,
            content: contentHtml,
            width: 390,//默认是auto
            height: 540,//默认是auto
            buttons: [
                {
                    text: '下载二维码',
                    cls: 'accept',
                    handler: function (self) {
                        window.location.href = downloadUrl;
                        self.close();
                    }
                }
            ],
            listeners: {//window监听事件事件
                open: function () {
                    //console.log("open");
                },
                close: function () {
                    //console.log("close");
                },
                beforeRender: function () {
                    //console.log("beforeRender");
                },
                afterRender: function () {
                    //console.log("afterRender");
                    $('#select-size-area').on('click','.select-size-box',function(){
                        $('#select-size-area .select-size-box').removeClass('active');
                        $(this).addClass('active');
                        let urlType = $(this).attr('id');
                        switch (urlType){
                            case 'bigQrcode':
                                downloadUrl = big;
                                break;
                            case 'midQrcode':
                                downloadUrl = mid;
                                break;
                            case 'smallQrcode':
                                downloadUrl = small;
                                break;
                        }
                        $('#copyInput').attr('title',downloadUrl).text(downloadUrl);
                        $('#copyBut').attr('data-clipboard-text',downloadUrl);
                    });
                    var clipboard = new Clipboard('#copyBut');
                    clipboard.on('success', function(e) {
                        Materialize.toast('复制成功！', 2000);
                    });

                }
            }
        });
        $('#qrcodeImg').attr('src',qrcodeImg);
        $('#copyInput').text(url).attr('title',url);
        $('#copyBut').attr('data-clipboard-text',url);
    }
    render() {
        let thisId = this.props.id;
        if(thisId){
            return (
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">二维码详情</span>
                    </div>
                    <div className="button-box icon iconfont">
                        <a className="a keyong" href="javascript:void(0)" title="返回" onClick={this.gotoLast.bind(this)}>
                            <span className="icon iconfont">&#xe621;</span>
                            <span className="text">返回</span>
                        </a>
                        <a className="a keyong" href={BASE_PATH+'/html/asset/qrcode-analyze.html?id='+this.props.id} title="图表分析">
                            <span className="icon iconfont">&#xe624;</span>
                            <span className="text">图表分析</span>
                        </a>
                        <a className="a keyong" href="javascript:void(0)" title="调用" onClick={this.qrcodeDownload.bind(this,this.props.id,this.props.name)}>
                            <span className="icon iconfont">&#xe65d;</span>
                            <span className="text">调用</span>
                        </a>
                    </div>
                </header>
            )
        }else{
            return (
                <header className="page-body-header">
                    <div className="text-box">
                        <span className="title">二维码详情</span>
                    </div>
                    <div className="button-box">
                        <a className="a keyong" href="javascript:void(0)" title="返回" onClick={this.gotoLast.bind(this)}>
                            <span className="icon iconfont">&#xe621;</span>
                            <span className="text">返回</span>
                        </a>
                        <a className="a bukeyong" href="javascript:void(0)" title="图表分析">
                            <span className="icon iconfont">&#xe624;</span>
                            <span className="text">图表分析</span>
                        </a>
                        <a className="a bukeyong" href="javascript:void(0)" title="调用">
                            <span className="icon iconfont">&#xe65d;</span>
                            <span className="text">调用</span>
                        </a>
                    </div>
                </header>
            )
        }
    }
}
/****详情****/
class Detail extends React.Component{
    render() {
        return (
            <div className="detail-area">
                <div className="detail-header">
                    <div className="detail-title">名&nbsp;&nbsp;称</div>
                    <div className="detail-text text">内&nbsp;&nbsp;容</div>
                </div>
                <div className="detail-tr">
                    <div className="detail-title title">公众号</div>
                    <div className="detail-text text">{this.props.content.subscription}</div>
                </div>
                <div className="detail-tr">
                    <div className="detail-title title">渠道分类</div>
                    <div className="detail-text text">{this.props.content.channel}</div>
                </div>
                <div className="detail-tr">
                    <div className="detail-title title">二维码名称</div>
                    <div className="detail-text text">{this.props.content.name}</div>
                </div>
                <div className="detail-tr">
                    <div className="detail-title title">创建时间</div>
                    <div className="detail-text text">{this.props.content.setup_date}</div>
                </div>
                <div className="detail-tr">
                    <div className="detail-title title">失效时间</div>
                    <div className="detail-text text">{this.props.content.invalid_date}</div>
                </div>
                <div className="detail-tr">
                    <div className="detail-title title">固定人群</div>
                    <div className="detail-text text">{this.props.content.fixed_crowd}</div>
                </div>
                <div className="detail-tr">
                    <div className="detail-title title">关联标签</div>
                    <div className="detail-text text" title={this.props.content.association_tags}>{this.props.content.association_tags}</div>
                </div>
                <div className="detail-tr">
                    <div className="detail-title title">备注信息</div>
                    <div className="detail-text text" title={this.props.content.note_info}>{this.props.content.note_info}</div>
                </div>
            </div>
        )
    }
}
/********组织页面模块********/
class Manage extends React.Component {
    fetchId(){
        let thisId = util.geturlparam('id');
        if(thisId){
            this.fetch(thisId);
        }
    }
    fetch(id){
        let that = this;
        let thisData,tags=[],thisTags=[];
        util.api({
            data: {method: 'mkt.weixin.qrcode.info',qrcode_id: id},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    thisTags = thisData.custom_tag_list;
                    for(let i=0; i<thisTags.length; i++){
                        tags[i]=thisTags[i].name;
                    }
                    tags = tags.join("，");
                    that.setState({
                        id: id,
                        subscription: thisData.wxmp_name,
                        channel: thisData.ch_name,
                        name: thisData.qrcode_name,
                        setup_date: thisData.create_time,
                        invalid_date: thisData.expiration_time,
                        fixed_crowd: thisData.fixed_audience,
                        association_tags: tags,
                        note_info: thisData.comment
                    });
                }
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            id: false,
            subscription: "",
            channel: "",
            name: "",
            setup_date: "",
            invalid_date: "",
            fixed_crowd: "",
            association_tags: "",
            note_info: ""
        };
    }
    componentDidMount(){
        this.fetchId();
    }
    render() {
        return (
            <div className="qrcode-detail">
                <SubHead id={this.state.id} name={this.state.name}/>
                <div className="content">
                    <Detail content={this.state}/>
                </div>
            </div>
        )
    }
}
/********渲染页面********/
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
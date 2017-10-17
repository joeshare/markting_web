/**
 * Created by AnThen on 2016-8-15.
 * 微信二维码-下载 es6+react版
 */
'use strict';//严格模式

/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'微信二维码'
});

/********编写页面模块********/
/****二级头部****/
class SubHead extends React.Component{
    gotoLast(){
        window.history.go(-1);
    }
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">批量下载二维码</span>
                </div>
                <div className="button-box icon iconfont">
                    <a className="a keyong" href="javascript:void(0)" title="返回" onClick={this.gotoLast.bind(this)}>&#xe621;</a>
                </div>
            </header>
        )
    }
}/****title****/
class Title extends React.Component{
    render() {
        return (
            <div className="download-title-box">
                <div className="download-title">
                    <div className="check iconfont">&#xe610;</div>
                    <div className="title-box">
                        <div className="h1">已批量生成二维码，开始使用它吧！</div>
                        <div className="h2">您可以按照下面的方式下载二维码</div>
                    </div>
                </div>
                <div className="trigon-box">
                    <div className="trigon iconfont">&#xe60e;</div>
                </div>
            </div>
        )
    }
}
/****download-select****/
class DownloadSelect extends React.Component{
    change(url,e){
        $('#select-size-area .select-size-box').removeClass('active');
        $(e.currentTarget).addClass('active');
        this.props.changeUrl(url);
    }
    render() {
        return (
            <div className='select-size-area' id='select-size-area'>
                <div className='select-size-box active' onClick={this.change.bind(this,this.props.big)}>
                    <div className='rideo iconfont'>&#xe610;</div>
                    <div className='text'>大 [1200*1200] 适用于线下海报/易拉宝</div>
                </div>
                <div className='select-size-box' onClick={this.change.bind(this,this.props.mid)}>
                    <div className='rideo iconfont'>&#xe610;</div>
                    <div className='text'>中 [800*800] 适用于传单</div>
                </div>
                <div className='select-size-box' onClick={this.change.bind(this,this.props.small)}>
                    <div className='rideo iconfont'>&#xe610;</div>
                    <div className='text'>小 [200*200] 适用于插入微信图文、H5活动也或名片</div>
                </div>
            </div>
        )
    }
}
/********组织页面模块********/
class Manage extends React.Component {
    fetch(){
        let that = this;
        let thisData,id = util.geturlparam('id');
        let thisQrcodeImg,thisBig,thisMid,thisSmall;
        if(id){
            util.api({
                data: {method: 'mkt.weixin.qrcode.pics.zip.download',batch_id:id},
                success: function (res) {
                    if(res.code == 0){
                        thisData = res.data[0];
                        thisBig = FILE_PATH + thisData.qrcode_pic1_zip;
                        thisMid = FILE_PATH + thisData.qrcode_pic2_zip;
                        thisSmall = FILE_PATH + thisData.qrcode_pic3_zip;
                        thisQrcodeImg = thisSmall;
                        that.setState({
                            qrcodeImgUrl: thisQrcodeImg,
                            big: thisBig,
                            mid: thisMid,
                            small: thisSmall,
                            downloadUrl: thisBig
                        });
                    }
                }
            });
        }
    }
    changeUrl(url){
        this.setState({
            downloadUrl: url
        });
    }
    download(){
        let downloadUrl = this.state.downloadUrl;
        if(downloadUrl){
            window.location.href = downloadUrl;
        }
    }
    constructor(props){
        super(props);
        this.state = {
            qrcodeImgUrl: '',
            big: '',
            mid: '',
            small: '',
            url: '',
            downloadUrl: false
        };
        this.changeUrl = this.changeUrl.bind(this);
    }
    componentDidMount(){
        this.fetch();
    }
    render() {
        return (
            <div className="qrcode-download">
                <SubHead />
                <div className="content">
                    <Title />
                    <div className="qrcode-show-box">
                        <div className="mass"></div>
                    </div>
                    <div className="manipulate-box">
                        <div className="manipulate">
                            <DownloadSelect big={this.state.big} mid={this.state.mid} small={this.state.small} changeUrl={this.changeUrl}/>
                        </div>
                    </div>
                    <div className="download-but-box">
                        <div className="button-main-1" onClick={this.download.bind(this)}>批量下载二维码</div>
                    </div>
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
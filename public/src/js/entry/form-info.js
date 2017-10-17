/*
 * @Author: UEC
 * @Date:   2016-08-09 15:07:25
 * @Last Modified by:   UEC
 * @Last Modified time: 2016-08-29 18:56:24
 */
'use strict';
import PreviewList from 'module/contact-preview/contactform-preview-list';
//组件
var Modals = require('component/modals.js');
// var Lcalendar = require('module/lcalendar/lcalendar.js');
var MyCavans = require('module/test/canvastest.js');
/*构造页面*/
var Layout = require('module/layout/layout');
/*构造页面*/
var layout = new Layout({
	index: 2,
	leftMenuCurName:'联系人表单'
});
let API={
	downLoadUrl:'?method=mkt.contact.list.qrcode.download',
	queryInfo:'?method=mkt.contact.list.info.get'
};
let curren_contact_id=null;
function successMsg(msg){
	Materialize.toast(msg||"保存成功！", 3000)
}
function getFileName(path){
	var pos1 = path.lastIndexOf('/');
	var pos2 = path.lastIndexOf('\\');
	var pos  = Math.max(pos1, pos2);
	var name="",url="";
	if( pos<0 )
		name=path;
	else
		name=path.substring(pos+1);
	url=path.substring(0,pos);
	return [url,name];
}
function save(url,name) {
	var arr=getFileName(url);
	var d=/\.[^\.]+$/.exec(url);
	var alink = document.createElement("a");
	alink.href = url;
	alink.download = name+d;
	alink.click();
}

function contactDownloadPic(href){
	save(href,'二维码');
};
//root
class FormInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			picUrl:"",
			shortUrl:""
		}
		this.previewData = $.parseJSON(localStorage.getItem('previewData'));
		this.init();
	}

	// 实例化后执行一次,相当于init方法
	componentDidMount() {
		var params = util.getLocationParams();
		this.$el = $(React.findDOMNode(this));
		var clipboard = new Clipboard('.copy-btn');
			clipboard.on('success', function(e) {
		    if (e.text!='') {
				successMsg("复制成功！")
		    }
    		e.clearSelection();
		});
		this.bindComponent();
		this.queryInfo();
	}
	selectCondition(index,name){
        $('#select-btn').text(name||'男');
    }
	//每次渲染之后都要调用
	componentDidUpdate() {	
		this.bindComponent();
	}
	bindComponent() {
        // $('select').material_select();
        $('.datepicker').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });
    }
	queryInfo(){
		let _this=this;
		util.api({
			url: API.queryInfo,
			type: 'get',
			data: {
				contact_id: curren_contact_id
			},
			success: function(res) {
				if (res&&!res.code) {
					_this.setState({
						picUrl:res.data[0].qrcode_pic,
						shortUrl:res.data[0].qrcode_shorturl
					})
				}
			},
			error: function(err) {

			}
		})
	}
    downLoadUrl(){
		contactDownloadPic(document.querySelector('#codeImg').src);
    }
	init(){
		$('#page-body').addClass('formInfo-body')
		var params = util.getLocationParams();
		if(params){
			curren_contact_id=params.contact_id;
		}

	}
	render() {
		let picUrl=this.state.picUrl;//../../img/form-msg/code.png
		let shortUrl=this.state.shortUrl;
		let newUrl=BASE_PATH+"/html/asset/contact-create.html";
		return ( <div className = "contact-form-formInfo-wrapper style-v1">
		        	<div className="content">
						<div className="main">
							<div className="phone_info">
								<div className="phone_info_content">
									<img src="../../img/form-msg/topbg.png"/>
									<img src="../../img/form-msg/phone.png"/>
									<div className="content-wrap">
									 <div className="titleText-wrap">
										<div className="titleText">{this.previewData.contact_title||'联系人表单'}</div>
									 </div>
									  <div className="descript-wrap">
										 <div className="descript">{this.previewData.contact_descript||'感谢参与信息征集活动，留下您的联系方式。'}</div>
									  </div>
									  <div className="formwrap-wrap">
										  <div className="formwrap">
											<PreviewList preview={true} />
										  </div>
									  </div>
									</div>
								</div>
								<div className="user_choose">
									<ul>
										<li>快速使用你的表单吧！</li>
										<li>点击“复制网址”后，粘贴到浏览器中，微信自定义菜单，微信图文中即可。</li>
										<li>表单二维码：</li>
										<li><img className="codeImg" id="codeImg" src={FILE_PATH+picUrl}/></li>
										<li><a className="button-main-2" href={FILE_PATH+picUrl} target="_blank">下载二维码</a></li>
										<li>表单网址：</li>
										<li><input style={{'margin-bottom':'25px'}} type="text" name="" className="codeUrl" value={shortUrl}/></li>
										<li><div id="copy-btn" className="button-assist-2 copy-btn" data-clipboard-text={shortUrl}>复制网址</div></li>
										<li><a href={newUrl}>创建联系人表单</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
			    </div>
		)
	}
}

//渲染
const test = ReactDOM.render( <FormInfo/> ,
	document.getElementById('page-body')
);


module.exports = FormInfo;
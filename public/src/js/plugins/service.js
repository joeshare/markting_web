(function(window) {
	var h5qrcodeHost = 'http://172.20.2.86:12000';//测试用接口
//	var h5qrcodeHost = 'http://personal.h5plus.net:12000';
	var h5qrcodePage = h5qrcodeHost + '/views/login.html';
	//var uuid = localStorage.uuid || ""
	var ack = 0;
	var config = {
		ifQRCodeHost: null,
		redirect: null,
		uuid: null
	};
	var urlParamObj = null;
	(function(){
		//参数object化
		var urlParamsToJson = function(urlstr) {
			var obj = {};
			if (urlstr) {
				var strArr = urlstr.split('&');
				for (var i = 0; i < strArr.length; i++) {
					var temArr = strArr[i].split('=');
					var index = strArr[i].indexOf('=');
					obj[strArr[i].substr(0, index)] = strArr[i].substr(index+1);
				}
				return obj;
			} else {
				return {};
			}
		};
		var locationHref = window.location.href;
		urlParamObj = urlParamsToJson((locationHref.split('?')[1])?(locationHref.split('?')[1]):(''));
	})();

	// 二维码方法部分 - start
	var service = {};
	service.getUUID = function() {
		return $.ajax({
			url: h5qrcodeHost + '/api/uuid',
			type: 'get'
			//contentType: 'application/x-www-form-urlencoded'
		}).then(function(res) {
			config.uuid = res;
			return res;
		}).fail(function(er) {
			//alert('生成二维码失败，请重试' + er)
		});
	};
	service.loginConfirm = function(uuid) {
		return $.ajax({
			url: h5qrcodeHost + '/api/login/' + uuid
		});
	};
	service.inbox = function() {
		service.getMsgIn().then(function() {
			setTimeout(function() {
				service.inbox();
			}, 1000)
		});
	};
	var clipParamURL = function(hrefTmp) {
        hrefTmp = hrefTmp.replace(/#[^&]*/g, '');
    	hrefTmp = hrefTmp.replace(/([\?&])((qruuid=[^&]*))/g,'$1').replace(/&+/,'&').replace('?&','?').replace(/&$/,'').replace(/\?$/,'');
        return hrefTmp;
    };
	var redirect = function() {
		var tmpHref = window.location.href;
		tmpHref = clipParamURL(tmpHref);
		window.location.href = h5qrcodePage + '?redirect=' + encodeURIComponent(tmpHref);		
	};

	service.getLoginStatus = function(uuid, callback) {
		if(!callback) {
			callback = function(){};
		}
		return $.ajax({
			url: h5qrcodeHost + '/api/logincheck/' + uuid,
			success: callback
		});
	};
	var main = {
		tempuuid: '',
		/* 生成二维码 */
		login: function() {
			var $this = this;
			return service.getUUID().then(function(uuid) {
				var qrCode = 'https://login.weixin.qq.com/l/'  + uuid;
				//document.getElementById('qrcode').innerHTML = '';
				//document.getElementById('state').innerHTML = '扫描上方二维码登录';
				//new QRCode(document.getElementById('qrcode'), qrCode);
				//$this.checkLogin(uuid);
				$this.tempuuid = uuid;
				return {code:0, data:{qrstring: qrCode, uuid: uuid}, msg:'ok'};
			}).fail(function(){
				return {code: 1, msg: 'fail'}
			});
		},
		/* 生成二维码 */
		checkLogin: function(loginSuccCB) {
			var $this = this;
			return service.loginConfirm($this.tempuuid).then(function(result) {
				var state = result.data.state;
				/*
				if(result == 'scand') {
					document.getElementById('state').innerHTML = '请在手机上确认登录';
				} else if(result == 'login') {
					document.getElementById('state').innerHTML = '登录成功!';
					setTimeout(function() {
						window.location.href = config.redirect +'?qruuid=' + config.uuid;//需要跳转了	
					}, 1000);
					return;
				} else {
					document.getElementById('state').innerHTML = '请扫描上方二维码登录';
				}
				*/
				if(state == 'scand') {
				} else if(state == 'login' && result.data.uin) {
					//document.getElementById('state').innerHTML = '登录成功!';
					//setTimeout(function() {
					//	window.location.href = config.redirect +'?qruuid=' + config.uuid;//需要跳转了	
					//}, 1000);
					loginSuccCB.call(this,result.data.uin);
					return;
				} else {
				}
				setTimeout(function() {
					$this.checkLogin(loginSuccCB);
				}, 1000)
			});
		},
		loginStatus: function(uuid, callback) {
			return service.getLoginStatus(uuid, callback);
		}
	};

	//初始化config中属性
	var host = window.location.host || window.location.hostname;
	var hostReg = new RegExp(host);
	//扫描二维码登录页面，需要有redirecturl参数
	//config.ifQRCodeHost = true;
	//if(!urlParamObj.redirect) {
	//	alert('页面链接缺少参数redirect,请追加redirect作为跳转页面!');
	//	return;
	//}
	//config.redirect = decodeURIComponent(urlParamObj.redirect);
	//main.login();


	window.h5Persona = main;
	// 二维码方法部分 - end
})(window);

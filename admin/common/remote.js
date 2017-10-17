var request = require('request');
var async = require('async');

function remoteCall(opts) {
	if (opts.res) {
		this.res = opts.res;
	}
	if (opts.req) {
		this.req = opts.req;
	}
}

remoteCall.prototype = {
	complete: function(err, remoteResult) {
		remoteResult.msg = remoteResult.message || remoteResult.msg || '';
		delete remoteResult.message;
		this.res.write(JSON.stringify(remoteResult));
		this.res.end();
	},
	execSingle: function(options, rrt, callback) {
		var that = this;
		if (options.beforeRemoting) {
			if (!options.beforeRemoting.call(that, options, rrt)) {
				callback(null, options);
				return;
			}
		}
		if (!options.success || !options.urlPath) {
			callback(null, options);
			return;
		}

		var arr = [];

		if (that.req.session.account && that.req.session.account.sessionId) {
			arr.push('sessionId=' + encodeURIComponent(that.req.session.account.sessionId));
		}
		if (that.req.session.account && that.req.session.account.terminalType) {
			arr.push('terminalType=' + that.req.session.account.terminalType);
		} else if (options.terminalType) {
			arr.push('terminalType=' + options.terminalType);
		}


		if (options.queryParams) {
			for (var param in options.queryParams) {
				arr.push(param + '=' + options.queryParams[param]);
			}
		}
		var url = config.remoteHost + options.urlPath + '?' + arr.join('&');

		console.log('begin remote call "' + url + '"');

		request.post(url, {
			formData: options.formData || ''
		}, function(error, response, body) {

			if (!error && response.statusCode == 200) {

				console.log('remote call success, request body :" ' + response.body + ' "');

				options.remoteResult = JSON.parse(response.body);

				if (options.remoteResult.success) {
					if (!that.req.session.account) {
						that.req.session.account = {};
					}
					that.req.session.account.sessionId = options.remoteResult.sessionId || options.remoteResult.dataObject || null;
					if (options.terminalType) {
						that.req.session.account.terminalType = options.terminalType;
					}

					console.log(that.req.session);
					if (options.onRemoteSuccess) {
						options.onRemoteSuccess.call(that, options.remoteResult, rrt);
					}
				} else {
					if (options.remoteResult.messageCode == 'ERROR_UNLOGIN' || options.remoteResult.messageCode == '100001') {
						that.req.session.account = null;
					}
					if (options.onRemoteFiald) {
						options.onRemoteFiald.call(that, options.remoteResult, rrt);
					}
				}
			} else {
				if (response) {
					console.log('remote call fail, request statusCode:' + response.statusCode + ', body :" ' + response.body + ' "');
				}else{
					console.log('remote call fail');
				}

				options.remoteResult = {
					success: false,
					message: JSON.stringify(response)
				};
				if (options.onRemoteFiald) {
					options.onRemoteFiald.call(that, options.remoteResult, rrt);
				}
			}
			callback(null, options.remoteResult);
		})
	},

	exec: function(options) {
		var that = this;
		var execSingle = that.execSingle;
		var tasks = [];
		var complete = function(err, remoteResult) {
			that.complete.call(that, err, remoteResult);
		}
		if (Array.isArray(options)) {
			tasks = options.map(function(option, index) {
					return index > 0 ? execSingle.bind(this, option) : execSingle.bind(this, option, null);
				}, that)
				//			options.forEach(function(option, index) {
				//				if (index == 0) {
				//					tasks.push((function(opt) {
				//						return function(cb) {
				//							execSingle.call(that, opt, null, cb);
				//						}
				//					})(option));
				//				} else {
				//					tasks.push((function(opt) {
				//						return function(rrt, cb) {
				//							execSingle.call(that, opt, rrt, cb);
				//						}
				//					})(option));
				//				}
				//			});

			async.waterfall(tasks, complete);
		} else {
			execSingle.call(that, options, null, complete);
		}
	}
}

module.exports = remoteCall;
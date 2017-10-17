/**
 * Created by 刘晓帆 on 2016-4-11.
 * 工具箱
 */
var root = window || {};
var showLog = true;

var config = {
    baseUrl: '/',
    baseDir: 'm/',
    appName: 'TETEM',
    versions: '1.1.2', //当前版本号
    API_PATH: 'http://mktdevsrv.rc.dataengine.com/api',//AJAX路径
    UPLOADAIP_PATH: 'http://mktdevsrv.rc.dataengine.com/upload/api',//上传路径
    FILE_PATH: 'http://mktdev.rc.dataengine.com/downloads/',//文件下载服务器路径
    BASE_PATH: '',//根路径
    IMG_PATH: '',//图片服务器路径
    //BASE_PATH: '/mkt',//根路径
    //IMG_PATH: '/mkt',//图片服务器路径
    EMPTY_FN: function () {
    }
};
$.extend(root, config);

var util = {
    /**
     * 窗口大小改变后触发callback
     * @param cb
     */
    onResize: function (cb) {
        window.onresize = _.throttle(cb, 10);
    },
    /**
     * 格式化日期
     * @param val
     * @param type 1：完整显示，2：不显示年,3:不显示分秒
     */
    formatDate: function (val, type) {
        var result = '';
        var d = new Date(val);
        var year = d.getFullYear();
        var month = this.pad(d.getMonth() + 1);
        var day = this.pad(d.getDate());
        var housrs = this.pad(d.getHours());
        var minutes = this.pad(d.getMinutes());
        var seconds = this.pad(d.getSeconds());
        switch (type) {
            case 1:
                result = year + '-' + month + '-' + day + ' ' + housrs + ':' + minutes;
                break;
            case 2:
                result = month + '-' + day + ' ' + housrs + ':' + minutes;
                break;
            case 3:
                result = year + '-' + month + '-' + day;
                break;
        }
        return result;
    },
    /**
     *
     * @param val
     * @param type
     */
    log: function (val, type) {
        if (type) {
            showLog && console[type](val);
        } else {
            showLog && console.info(val);
        }
    },
    /**
     * 取整百分比
     * @param num
     * @param total
     * @returns {number}
     * @constructor
     */
    Percentage: function (num, total) {
        return parseInt((num / total * 10000) / 100);
    },
    /**
     * 补零
     * @param num
     * @returns {string}
     */
    pad: function (num) {
        return new Array(2 - ('' + num).length + 1).join(0) + num;
    },
    /**
     * 随机生成n个1-maxNum之间的值不会重复的整数组，十位补0
     * @param minNum
     * @param maxNum
     * @param n 多少个
     * @param pad 是否需要补0
     * @param repeat 是否可以重复
     * @returns {arr}
     */
    randomIntNum: function (minNum, maxNum, n, pad, repeat) {
        var hash = {};
        var newArr = [];
        var rNum;
        minNum = minNum || 1;
        maxNum = maxNum || 9;
        n = n || 1;
        for (var i = 0; i < n;) {
            rNum = parseInt(Math.random() * maxNum + minNum);
            if (repeat) {
                pad && (rNum < 10) && (rNum = '0' + rNum);
                newArr.push(rNum);
                i++;
            } else {
                if (!hash[rNum]) {
                    hash[rNum] = true;
                    pad && (rNum < 10) && (rNum = '0' + rNum);
                    newArr.push(rNum);
                    i++;
                }
            }

        }
        return newArr;
    },
    /**
     * 获得地址栏传递参数
     * @returns {null}
     * demo.html?cid=1&aa=2
     */
    geturlparam: function (param) {
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
        //匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        //返回参数值
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    getLocationParams: function (href) {
        href = href || location.href;
        var params = null,
            query;
        if (href.indexOf('?') !== -1) {
            query = href.slice(href.indexOf('?') + 1);
            if (query.length > 0) {
                params = {};
                query = query.split('&');
                _.each(query, function (param) {
                    var tempParam = param.split('=');
                    params[tempParam[0]] = decodeURI(param.substring(param.indexOf('=') + 1, param.length));
                });
            }
        }
        return params;
    },
    /**
     * 验证可定义的合法url
     * @url String URI
     * @field String 域
     * @suffix String 域名后缀
     */
    isFieldUrl: function (url, field, suffix) {
        field || (field = '[a-z]+');
        suffix || (suffix = '[a-z]+');
        var rUrl = new RegExp('^(?:https?:\\/\\/)?(?:\\w+\\.)*' + field + '\\.' + suffix + '(?:\\/\\S*)*$', '');
        return rUrl.test(url);
    },
    /**
     * ajax封装
     * @param opts
     * @param customOpts
     * @returns {*}
     */
    api: function (opts, customOpts) {
        var that = this;
        var success = opts.success || root.EMPTY_FN;
        var beforeSend = opts.beforeSend || root.EMPTY_FN;
        var error = opts.error || root.EMPTY_FN;
        var complete = opts.complete || root.EMPTY_FN;
        if (!opts.url) {
            opts.url = ''
        }
        if (opts.surl) {
            opts.url = opts.surl;
        } else {
            opts.url = root.API_PATH + opts.url;
        }
        opts.data = _.extend({
            "ver": root.versions,
            "user_id": localStorage.getItem('user_id') || '',
            //"user_id": 'admin',
            "user_token": localStorage.getItem('user_token') || 1
            //"user_token": '8kuSEtiOY0bs1beXRbDE3YdeZaSCYn2uhmGBe8U5N3Y='
        }, opts.data);

        opts = $.extend({
            timeout: 10000,
            type: 'get',
            autoJumpLogin: true,
            //'processData': false,
            contentType: 'application/json',
            dataType: 'json'
        }, opts, {
            success: function (responseData, textStatus, jqXHR) {
                var status = responseData.status;
                if (status == 401 && opts.autoJumpLogin) {
                    //  dialog  is not defined  暂时注销
                    //dialog.confirm({
                    //    content: "您还没有登录，请先登录！", hasSureHander: function () {
                    //        window.location.href = "/m/html/login.html"
                    //    }
                    //});
                }
                if (responseData.code > 3000 && responseData.code < 3005) {
                    new Modals.Alert({
                        content: "<div>" + responseData.msg + "</div>",
                        listeners: {//各种监听
                            close: function (type) {
                                window.location.href = "/html/signin/login.html";
                            }
                        }
                    });

                    return;
                }
                return success.apply(this, arguments);

            },
            beforeSend: function () {
                return beforeSend.apply(this, arguments);
            },
            error: function (jqXHR, textStatus) {
                //that.showErrorInfo(jqXHR);
                return error.apply(this, arguments);
            },
            complete: function (jqXHR, textStatus) {
                return complete.apply(this, arguments);
            }
        });
        //post数据使用json字符串格式
        if (opts.type.toLowerCase() == "post" && opts.data) {
            opts.data = JSON.stringify(opts.data);

        }
        return $.ajax(opts);

    },
    uuid: function () {
        var i, random;
        var uuid = '';

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                .toString(16);
        }

        return uuid;
    },
    /**
     * 点击非目标区域时执行回调
     * @param jqueryDom
     * @param callback
     */
    bodyClose: function (jqueryDom, callback) {

        $(document).on('click', function (e) {
            var _con = jqueryDom;   // 设置目标区域
            if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
                callback();
            }
        });
    },
    getChartColors: function () {
        return ['#5bd4c7', '#62a9ed', '#8bc34a', '#fabb3d', '#c090ec', '#67c2ef', '#fcdd5f', '#fd7979', '#7381ce'];
    },
    /**
     *  BAS iframe post data
     * @param url String
     * @param iframeName String
     * @param postData String
     */
    postIframeData: function (url, iframeName, postData) {
        var $input = $('<input name="postData" type="hidden" />').val(postData);
        var $form = $('<form style="position:absolute;top:-1200px;left:-1200px;" action="' + url + '" method="POST" target="' + iframeName + '"></form>').appendTo(document.body);
        $form.append($input).submit();
        $form.remove();
    }
};
window.util = util;

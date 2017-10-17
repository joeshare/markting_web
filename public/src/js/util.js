/**
 * Created by 刘晓帆 on 2016-4-11.
 * 工具箱
 */
let Modals = require('component/modals.js');

'use strict';
let root = window || {};
let app = require('app') || window.app;
let showLog = true;
let config = require('./config');
$.extend(root, config);

let util = {
    /**
     * 通用自动消失提示框
     * @param opts
     * 用法 util.toast({...});
     */
    toast: function (opts) {
        let defOpts = Object.assign({
            type: 1,
            closeTime: 3000,
            title: '操作成功！',
            describe: '',
            endingTop: '76px',
            dismissible: false,//点击遮罩不消失
        }, opts || {});
        let iconStr = '';
        let colorStr = '';
        switch (defOpts.type) {
            case 1:
                iconStr = '&#xe63a;';
                colorStr = '#66c1e3';
                break;
            case 2:
                iconStr = '&#xe61a;';
                colorStr = '#fabb3d';
                break;
            case 3:
                iconStr = '&#xe60a;';
                colorStr = '#fd7979';
                break;
            case 4:
                iconStr = '&#xe610;';
                colorStr = '#8bc34a';
                break;
        }
        let contentStr = `<div id="common-toast" class="modal">
                              <div class="title" style="color:${colorStr}">
                                  <div class="icon iconfont" style="color:${colorStr}">${iconStr}</div>
                                  <div class="txtcontent">
                                  <div class="tit">
                                    ${defOpts.title}
                                   </div>
                                   <div class="describe">${defOpts.describe}</div>
                                   </div>
                              </div>
                          </div>`;
        if ($('#common-confirm').length <= 0) $('body').append(contentStr);
        $('#common-toast').openModal(defOpts);
        $('.lean-overlay').remove();
        setTimeout(() => {
            $('#common-toast').closeModal();
        }, defOpts.closeTime)
    },
    /**
     * 通用确认提示框
     * @param opts
     * 用法 util.confirm({...});
     */
    confirm: function (opts) {
        let defOpts = Object.assign({
            title: '确定吗？',
            describe: '',
            btnTxt: '确定',
            dismissible: false,//点击遮罩不消失
            confirm: function () {
            },
            ready: function () {
            },
            complete: function () {
            }
        }, opts || {});
        let contentStr = `<div id="common-confirm" class="modal">
                              <div class="title"><span class="icon iconfont">&#xe63a;</span>${defOpts.title}</div>
                              <div class="describe">${defOpts.describe}</div>
                              <div class="fn-wrap">
                                 <div class="btn-confirm modal-close button-main-3">${defOpts.btnTxt}</div>
                                 <div class="btn-cancel modal-close button-assist-3">取消</div>
                              </div>
                          </div>`;
        if ($('#common-confirm').length <= 0) $('body').append(contentStr);
        $('#common-confirm .btn-confirm').off().click(function (e) {
            defOpts.confirm();
        });
        $('#common-confirm').openModal(defOpts);
    },
    /**
     * 设置分页总数和当前index
     * @param total_count
     * @param index
     */
    setPaginationTotal: function (total_count, index) {
        $('.pagination-wrap').pagination('updateItems', total_count);

        if (index == 1) {
            $('.pagination-wrap li:eq(1) a').click();
            // $('.pagination-wrap').find('.active').removeClass('active');
            // $('.pagination-wrap li:eq(1)').addClass('active');
            // $('.pagination-wrap li:eq(0)').addClass('disabled disable');
        }
    },
    /**
     * 字符串校验函数
     */
    sv: new String.Validator(),
    /**
     * 找到所有{$}里面的数字返回为一个数组
     * @param {string}
     * @returns {Array}
     */
    findVarStrtoArr: function (str = '') {
        let res = [];
        let arr = String(str).match(/\{\$(\d){1,3}\}/g);
        if (arr) {
            res = arr.map(m => m.replace(/\D/g, ''));
        }
        return res;
    },
    /**
     * 座机电话校验(规则见MCPRO-252)
     * @param str
     */
    isTelephone: function (str = '') {
        let res = true;
        let nStr = String(str).split('-');
        switch (nStr.length) {
            case 1:
                res = !!this.sv.isTelNumber(nStr[0]);
                break;
            case 2:
                res = !!(this.sv.isAreaCode(nStr[0]) && this.sv.isTelNumber(nStr[1]));
                break;
            case 3:
                res = !!(this.sv.isAreaCode(nStr[0]) && this.sv.isTelNumber(nStr[1]) && this.sv.isNumber(nStr[2]));
                break;
            default:
                res = false;
                break;
        }
        return res;
    },
    /**
     * 获取服务器时间
     * @param cb
     */
    getSeverTime: function (cb) {
        this.api({
            data: {
                method: 'mkt.material.coupon.systemtime'
            },
            success(res){
                if (res.code == 0) {
                    cb(res.data[0].time);
                }
            }
        })
    },
    /**
     * 特殊字符转义 用于解决React不能直接转义的特殊字符，比如字体图标
     * @param html
     * @returns {string}
     */
    translateHtmlCharater: function (html) {
        let div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent;
    },
    /**
     * 窗口大小改变后触发callback
     * @param cb
     */
    onResize: function (cb) {
        window.onresize = _.throttle(cb, 10);
    },
    /**
     * 格式化日期
     * @param val 时间戳（例如：1477363297）
     * @param type 1：完整显示，2：不显示年,3:不显示分秒
     */
    formatDate: function (val, type = 1) {
        let result = '';
        let timestamp = val;
        let d = new Date();
        d.setTime(timestamp * 1000);
        let year = d.getFullYear();
        let month = this.pad(d.getMonth() + 1);
        let day = this.pad(d.getDate());
        let housrs = this.pad(d.getHours());
        let minutes = this.pad(d.getMinutes());
        let seconds = this.pad(d.getSeconds());
        switch (type) {
            case 1:
                result = year + '-' + month + '-' + day + ' ' + housrs + ':' + minutes + ':' + seconds;
                break;
            case 2:
                result = month + '-' + day + ' ' + housrs + ':' + minutes;
                break;
            case 3:
                result = year + '-' + month + '-' + day;
                break;
            default:
                result = year + '-' + month + '-' + day + ' ' + housrs + ':' + minutes + ':' + seconds;
                break
        }
        return result;
    },
    /**
     * 反向格式化日期
     * @param val 输入YYYY-MM-DD格式时间 返回时间戳（例如：1477363297）
     */
    toDate: function (val) {
        let sd = val.split("-");
        let newDate = new Date(sd[0], sd[1] - 1, sd[2]);
        return (newDate.getTime()) / 1000;
    },
    /**
     * 计算两个日期之间相差的天数
     * @param date1 输入YYYY-MM-DD格式时间
     * @param date2 输入YYYY-MM-DD格式时间
     */
    dateDiff: function (date1, date2) {
        let re;
        let odate1 = util.toDate(date1);
        let odate2 = util.toDate(date2);
        re = parseInt(Math.abs(odate1 - odate2) / 60 / 60 / 24);
        return re;
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
        let hash = {};
        let newArr = [];
        let rNum;
        minNum = minNum || 1;
        maxNum = maxNum || 9;
        n = n || 1;
        for (let i = 0; i < n;) {
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
        let reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
        //匹配目标参数
        let r = window.location.search.substr(1).match(reg);
        //返回参数值
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    getLocationParams: function (href) {
        href = href || location.href;
        let params = null,
            query;
        if (href.indexOf('?') !== -1) {
            query = href.slice(href.indexOf('?') + 1);
            if (query.length > 0) {
                params = {};
                query = query.split('&');
                _.each(query, function (param) {
                    let tempParam = param.split('=');
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
        let rUrl = new RegExp('^(?:https?:\\/\\/)?(?:\\w+\\.)*' + field + '\\.' + suffix + '(?:\\/\\S*)*$', '');
        return rUrl.test(url);
    },
    /**
     * ajax封装
     * @param opts
     * @param customOpts
     * @returns {*}
     */
    api: function (opts, customOpts) {
        let that = this;
        let success = opts.success || root.EMPTY_FN;
        let beforeSend = opts.beforeSend || root.EMPTY_FN;
        let error = opts.error || root.EMPTY_FN;
        let complete = opts.complete || root.EMPTY_FN;
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
            "user_id": USER_ID,
            "user_token": TOKEN
        }, opts.data);

        opts = $.extend({
            timeout: 1000 * 30,
            type: 'get',
            autoJumpLogin: true,
            //'processData': false,
            contentType: 'application/json',
            dataType: 'json'
        }, opts, {
            success: function (responseData, textStatus, jqXHR) {
                let status = responseData.status;
                if (status == 401 && opts.autoJumpLogin) {
                    //  dialog  is not defined  暂时注销
                    //dialog.confirm({
                    //    content: "您还没有登录，请先登录！", hasSureHander: function () {
                    //        window.location.href = "/m/html/login.html"
                    //    }
                    //});
                }
                // if (responseData.code > 3000 && responseData.code < 3005) {
                //     window.location.href = "/html/signin/login.html";
                //     return;
                // }
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
        let i, random;
        let uuid = '';

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
            let _con = jqueryDom;   // 设置目标区域
            if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
                callback();
            }
        });
    },
    getChartColors: function () {
        return ['#5bd4c7', '#62a9ed', '#8bc34a', '#fabb3d', '#c090ec', '#67c2ef', '#fcdd5f', '#fd7979', '#7381ce'];
    },
    /**
     * BAS iframe post data
     * @param url String
     * @param iframeName String
     * @param postData String
     */
    postIframeData: function (url, iframeName, postData) {
        let $input = $('<input name="postData" type="hidden" />').val(postData);
        let $form = $('<form style="position:absolute;top:-1200px;left:-1200px;" action="' + url + '" method="POST" target="' + iframeName + '"></form>').appendTo(document.body);
        $form.append($input).submit();
        $form.remove();
    },
    refreshAuth: function () {
        function fetch(opts) {
            let success = opts.success || root.EMPTY_FN;
            let error = opts.error || root.EMPTY_FN;
            opts.url = opts.url;

            opts.data = _.extend({
                "ver": root.versions,
                "user_id": USER_ID,
                "user_token": TOKEN
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
                    return success.apply(this, arguments);
                },
                error: function (jqXHR, textStatus) {
                    return error.apply(this, arguments);
                }
            });
            //post数据使用json字符串格式
            if (opts.type.toLowerCase() == "post" && opts.data) {
                opts.data = JSON.stringify(opts.data);

            }
            return $.ajax(opts);
        }

        let _this = this, iTime = null;
        fetch({
            url: window.NODE_PATH + '?method=mkt.user.refreshAuth',
            success: function (res) {
                iTime = window.setTimeout(function () {
                    _this.refreshAuth();
                }, 1000 * 60 * 15)
            },
            error: function () {
                console.log('error mkt.user.refreshAuth')
                window.clearTimeout(iTime);
            }
        })
    },
    /**
     * 两个浮点数相乘
     */
    accMul: function (arg1, arg2) {
        let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    /**
     * 判断是否为浮点类型
     */
    ifFloat: function (arg) {
        let rule = /^(-?\d+)(\.\d+)?$/;
        return rule.test(arg)
    },
    /**
     * 数字三位逗号相隔
     */
    numberFormat: function (arg) {
        let number, arg1, arg2, reNum;
        number = arg.toString();
        arg1 = parseInt(number.split(".")[0]);
        arg2 = number.split(".")[1];
        arg1 = _.str.numberFormat(arg1);
        if (arg2) {
            reNum = arg1.toString() + "." + arg2.toString();
        } else {
            reNum = arg1;
        }
        return reNum;
    },

    /**
     * 正则匹配是否只含有中文，下划线，字母，数字，中划线，空格-适用于REACT方式
     * */
    getrexResult(arg){
        return /^([\u4E00-\u9FA5]|[a-zA-Z0-9]|-|_|\s)*$/.test(arg);
    },
    /**
     * 用原生的方式阻止input输入特殊字符
     * demo   $el.on('input', '.input-name ', function (e) { util.specialText(this) })
     * @param input
     */
    specialText(input){
        var illegalString = "\`~@#;,.!#$%^&*()+{}|\\:\"<>?=/,\'";
        var inputValue = input.value;
        var index = inputValue.length - 1;
        var lastStr = inputValue.charAt(index);
        if (illegalString.indexOf(lastStr) >= 0) {
            lastStr = inputValue.substring(0, index);
            input.value = lastStr;
        }
    },

    /**
     * 取得当前浏览器版本
     */
    browser(){
        var browser = {},
            userAgent = navigator.userAgent.toLowerCase(),
            sss,
            version;
        (sss = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = sss[1] :
            (sss = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = sss[1] :
                (sss = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = sss[1] :
                    (sss = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = sss[1] :
                        (sss = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = sss[1] : 0;
        if (browser.ie) {
            version = 'ie ' + browser.ie;
        } else if (browser.firefox) {
            version = 'firefox ' + browser.firefox;
        } else if (browser.chrome) {
            version = 'chrome ' + browser.chrome;
        } else if (browser.opera) {
            version = 'opera ' + browser.opera;
        } else if (browser.safari) {
            version = 'safari ' + browser.safari;
        } else {
            version = '未知浏览器';
        }
        return version;
    }
};
window.util = util;

module.exports = util;

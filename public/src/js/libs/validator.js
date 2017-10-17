/*
 * @name: datejs
 * @version: 1.0.0
 * @description: javascript Date Object extend
 * @author: zbm2001@aliyun.com
 * @license: Apache 2.0
 */
(function () {
'use strict';

var toString = Object.prototype.toString;

function typeOf(object) {
  return toString.call(object).slice(8, -1);
}

var sPop = Array.prototype.pop + '';
var sNativeCode = sPop.slice(sPop.indexOf('{'));

function isNativeFunction(func) {
  return typeOf(func) === 'Function' && sNativeCode === (func += '').slice(func.indexOf('{'));
}

isNativeFunction(Object.assign) ? Object.assign :
  (Object.assign = function assign(target) {
    var arguments$1 = arguments;

    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target), i = 1, l = arguments.length, prop, source;
    for (; i < l; i++) {
      source = arguments$1[i];
      if (source != null) {
        for (prop in source) {
          if (source.hasOwnProperty(prop)) {
            output[prop] = source[prop];
          }
        }
      }
    }
    return output;
  });

function Validator() {}

Object.assign(Validator, {
  // "ro" 前缀表示 regexp only，即字符串从行首到行尾只包含指定的匹配模式
  roNumber: /^\d+$/,
  roInt: /^[-+]?\d+$/,
  roFloat: /^[-+]?\d+(?:\.\d+)?$/,
  rDoubleByte: /[^\x00-\xff]/,
  roDoubleByte: /^[^\x00-\xff]+$/,
  rDoubleBytesG: /([^\x00-\xff]+)/g,
  rZh: /[\u4e00-\u9fa5\uf900-\ufa2d]/,
  roZh: /^[\u4e00-\u9fa5\uf900-\ufa2d]+$/,
  roMobileNumber: /^1\d{10}$/,
  // 电话地区号
  roAreaCode: /^0(?:10|2\d|[3-9]\d{2})$/,
  // 固定电话号码
  roTelNumber: /^[1-9]\d{6,7}$/,
  // 邮政编码
  roPostalcode: /^\d{6}$/,
  // 地区编码
  roAreaNumber: /^(?:[1-6]\d{5}|(?:71|81|82)0{4})$/,
  // 身份证号：前6位是地区编码
  roIdNumber: /^(?:[1-6]\d{5}|(?:71|81|82)0{4})\d{11}[\dxX]$/,
  // 营业执照注册号：前6位是地区编码
  roBusinessLicenseNumber: /^(?:[1-6]\d{5}|(?:71|81|82)0{4})\d{9}$/,
  // 组织机构代码
  roOrgCode: /^[\dA-Z]{8}\-?[\dX]$/,
  // 经济类型代码 economic-category-code
  roEconomicCategoryCode: /^\d{3}$/,

  // 国民经济行业分类代码 national-economy-industry-classification-code
  roNationalEconomyIndustryClassificationCode: /^[A-Z]\d{0,4}$/,

  roEmail: /^[\w-.]+@(?:[\w-]+\.)+[a-z]+$/,
  roUrl: /^(?:[a-zA-Z]+:\/\/)?(?:\w+\.)+[a-z]+(?::\d+)?(?:\/\S*)?$/,
  roQQNumber: /^[1-9]\d{1,10}$/,
  roBloodTypeI: /^(?:[ABO]|AB)$/i,

  // rgb256色
  roHexColorI: /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i,
  roDate: /^\d{4}-(?:(?:0?2-(0[1-9]|[12][0-9]))|(?:0?[13578]|1[02])-(?:0?[1-9]|[1-2]\d|3[01])|(?:0?[469]|11)-(?:0?[1-9]|[1-2]\d|30))|(?:(?:(?:0[1-9]|[12][0-9])\/0?2)|(?:0?[1-9]|[1-2]\d|3[01])\/(?:0?[13578]|1[02])|(?:(?:0?[1-9]|[1-2]\d|30)\/0?[469]|11))\/\d{4}$/,
  roMonth: /^(?:0?[1-9]|1[0-2])$/,
  roWeek: /^(?:0?[1-9]|[1-4]\d|5[0-2])$/,
  roTime: /^(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/,

  roMd5: /^[a-f0-9]{32}$/,
  oRoUuidIs: {
    3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
  },

  roKeyboardCharacter: /^[\w~`!@#$%^&*()_\-+={}[\]|\\:;"<>,.?\/]+$/
});


Object.assign(Validator.prototype, Validator, {
  /**
   * 数字
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isNumber: function(s) {
    return this.roNumber.test(s);
  },

  /**
   * 整型
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isInt: function(s) {
    return this.roInt.test(s);
  },

  /**
   * 浮点类型
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isFloat: function(s) {
    return this.roFloat.test(s);
  },

  /**
   * 包含双字节
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  hasDoubleByte: function(s) {
    return this.rDoubleByte.test(s);
  },

  /**
   * 只包含双字节
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isDoubleByte: function(s) {
    return this.roDoubleByte.test(s);
  },

  /**
   * 包含中文
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  hasZh: function(s) {
    return this.rZh.test(s);
  },

  /**
   * 只包含中文
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isZh: function(s) {
    return this.roZh.test(s);
  },

  /**
   * 手机号码
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isMobileNumber: function(s) {
    return this.roMobileNumber.test(s);
  },

  /**
   * 电话地区号
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isAreaCode: function(s) {
    return this.roAreaCode.test(s);
  },

  /**
   * 固定电话号码
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isTelNumber: function(s) {
    return this.roTelNumber.test(s);
  },

  /**
   * 邮政编码
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isPostalcode: function(s) {
    return this.roPostalcode.test(s);
  },

  /**
   * 中国地区编码
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isAreaNumber: function(s) {
    return this.roAreaNumber.test(s);
  },

  /**
   * 身份证号：前6位是地区编码
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isIdNumber: function(s) {
    return this.roIdNumber.test(s) && this.isAreaNumber(s.slice(0, 6)) && checkDate.bind(this)(s.slice(6, 14)) && s.charAt(17).toUpperCase() === checksum(s.slice(0, 17));

    function checkDate(s) {
      var year = s.slice(0, 4);
      return year >= 1900 && 　year <= new Date().getFullYear() && this.isDate(year + '-' + s.slice(4, 6) + '-' + s.slice(6, 8));
    }

    function checksum(v) {
      var sum = 0;
      v.split('').reverse().forEach(function(n, i) {
        sum += n * (Math.pow(2, (i + 2) - 1) % 11);
      });
      sum = (12 - sum % 11) % 11;
      return sum > 9 ? 'X' : String(sum);
    }
  },

  /**
   * 营业执照注册号：前6位是地区编码
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isBusinessLicenseNumber: function(s) {
    return s.length === 15 && this.roBusinessLicenseNumber.test(s) && checksum(s);
    // 440000000085209
    function checksum(v) {
      var a = [],
        m = 10,
        p = [m],
        s = [],
        i = -1,
        l = v.length,
        t;
      while (++i < l) {
        a[i] = parseInt(v.charAt(i));
        s[i] = (p[i] % (m + 1)) + a[i];
        t = s[i] % m;
        p[i + 1] = (t || 10) * 2;
      }
      return s[l - 1] % m === 1;
    }
  },

  /**
   * 组织机构代码
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isOrgCode: function(s) {
    return this.roOrgCode.test(s) && s.slice(-1) === checksum(s);
    // 73766533-0
    function checksum(v) {
      var code = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        crcs = [3, 7, 9, 10, 5, 8, 4, 2],
        o = {},
        l = code.length,
        c, sum = 0,
        i = -1;
      while (++i < l) {
        o[code[i]] = i;
      }
      i = -1;
      while (++i < 8) {
        c = v.charAt(i);
        sum += o[c] * crcs[i];
      }
      c = sum % 11;
      return c > 1 ? String(11 - c) : c ? 'X' : '0';
    }
  },

  /**
   * 经济类型代码：economic-category-code
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isEconomicCategoryCode: function(s) {
    return this.roEconomicCategoryCode.test(s);
  },

  /**
   * 国民经济行业分类代码：national-economy-industry-classification-code
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isNationalEconomyIndustryClassificationCode: function(s) {
    return this.roNationalEconomyIndustryClassificationCode.test(s);
  },

  /**
   * email 格式
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isEmail: function(s) {
    return this.roEmail.test(s);
  },

  /**
   * url 格式
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isUrl: function(s) {
    return s.length < 2084 && this.roUrl.test(s);
  },

  /**
   * QQ 号
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isQQNumber: function(s) {
    return this.roQQNumber.test(s);
  },

  /**
   * 血型
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isBloodType: function(s) {
    return this.roBloodTypeI.test(s);
  },

  /**
   * rgb256色
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isHexColor: function(s) {
    return this.roHexColorI.test(s);
  },

  /**
   * md5加密串格式
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isMd5: function(s) {
    return this.roMd5.test(s);
  },

  /**
   * uuid格式，分版本号
   * @param {string} s
   * @param {number|string} version
   * @returns {boolean}
   * @api public
   */
  isUuid: function(s, version) {
    var r = this.oRoUuidIs[version];
    return !!r && r.test(s);
  },

  /**
   * 日期格式 maxlength="10"
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isDate: function(s, format) {
    var year = s.slice(0, 4);
    return this.roDate.test(s) && (RegExp.$1 !== '29' || (!(year % 4) && !!(year % 400)));
  },

  /**
   * 月份 1-12
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isMonth: function(s) {
    return this.roMonth.test(s);
  },

  /**
   * 周数 1-52
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isWeek: function(s) {
    return this.roWeek.test(s);
  },

  /**
   * 时间格式 hh:mm:ss SSS
   * @param {string} s
   * @returns {boolean}
   * @api public
   */
  isTime: function(s) {
    return this.roTime.test(s);
  },

  /**
   * 获取字符串的字节长度
   * @param {string} s
   * @returns {number}
   * @api public
   */
  getByteLength: function(s) {
    return s.replace(this.rDoubleBytesG, "$1$1").length;
  },

  /**
   * 验证字符串包含键盘字符的分类数
   *     字符范围分类包括：数字、大小写字母、其他键盘字符
   *     可适用某些密码强度级别验证
   * @param {string} s
   * @param {number} minLength 字符串最小长度限制
   * @param {number} maxLength 字符串最大长度限制
   * @returns {Number} range{0,3}
   *   返回 0 不包含键盘字符
   *   返回 1 包含键盘字符，安全强度低
   *   返回 2 包含键盘字符，安全强度中
   *   返回 3 包含键盘字符，安全强度高
   * @api public
   */
  checkKeyboardCharacterRank: function(s, minLength, maxLength) {

    var l = s.length,
      min = 1,
      max = Infinity;

    (minLength = Number(minLength)) === minLength && (min = minLength < 1 ? 1 : minLength);
    (maxLength = Number(maxLength)) === maxLength && (max = maxLength < min ? min : maxLength);

    // 不包含键盘字符
    if (l < min || l > max || !this.roKeyboardCharacter.test(s)) {
      return 0;
    }
    // 强度低：只包含数字，或只包含特殊字符，或只包含字母
    else if (l < 2 || !/\D/.test(s) || !/\w/.test(s) || !/[^a-zA-Z]/.test(s)) {
      return 1;
    }
    // 强度高：包含全部三种类型字符
    else if (l > 2 && /\d/.test(s) && /[a-zA-Z]/.test(s) && /[\W_]/.test(s)) {
      return 3;
    }
    // 强度中：只包含两种类型字符
    else {
      return 2;
    }

  }

});

String.Validator = Validator;

}());
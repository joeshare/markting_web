/**
 * Created by Kolf on 2016-8-8.
 * dev
 */
module.exports = {
    baseUrl: '/',
    baseDir: 'm/',
    appName: 'MC',
    versions: '1.8.1', //当前版本号
    BASE_PATH: '',//根路径
    IMG_PATH: '',//图片服务器路径
    //BASE_PATH: '/mkt',//根路径
    //IMG_PATH: '/mkt',//图片服务器路径
    COMP_NAME: localStorage.getItem('comp_name') || '',
    COMP_ID: localStorage.getItem('comp_id') || 1,
    USER_ID: localStorage.getItem('user_id') || 1,
    TOKEN: localStorage.getItem('user_token') || 1,
    AUTH_CODE: localStorage.getItem('auth_code') || 1,
    // VCODE_IMG:'http://mc-caas-user.rc.dataengine.com/api/v1/common/vimg',//caas 验证码
    VCODE_IMG:'',//caas 验证码
    API_PATH: 'http://mktdevsrv.cssrv.dataengine.com/api',//AJAX路径
    UPLOADAIP_PATH: 'http://mktdevsrv.cssrv.dataengine.com/upload/api',//上传路径
    FILE_PATH: 'http://mktdevsrv.cssrv.dataengine.com/downloads/',//文件下载服务器路径
    NODE_PATH: 'http://mktdevsrv.cssrv.dataengine.com/users/api',
    EVENT_PATH: 'http://mktdevsrv.cssrv.dataengine.com/event/api',
    EMPTY_FN: function () {
    }
};
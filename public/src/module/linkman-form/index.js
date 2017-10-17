/*
* @Author: UEC
* @Date:   2016-08-10 16:19:50
* @Last Modified by:   UEC
* @Last Modified time: 2016-08-17 18:46:06
*/

'use strict';

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName:'联系人表单'
});
let MainView= require('./view/main.js');
//渲染
const page = ReactDOM.render(
    <MainView />,
    document.getElementById('page-body')
);

module.exports = page;

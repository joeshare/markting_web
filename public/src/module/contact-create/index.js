/**
 * 联系人表单新建 es6+react版
 */
'use strict';//严格模式

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

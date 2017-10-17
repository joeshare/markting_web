/**
 * 受众细分 es6+react版
 */
'use strict';//严格模式

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'受众细分'
});
let MainView= require('./view/main.js');
document.getElementById('container').classList.add("seg-container")
//渲染
const page = ReactDOM.render(
    <MainView />,
    document.getElementById('page-body')
);

module.exports = page;


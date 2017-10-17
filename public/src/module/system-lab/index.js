'use strict';//严格模式

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'系统标签'
});

let MainView= require('./view/main.js');

//渲染
const page = ReactDOM.render(
    <MainView />,
    document.getElementById('page-body')
);

module.exports = page;
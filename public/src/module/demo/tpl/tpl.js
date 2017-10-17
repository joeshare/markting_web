var tpl='<div class="b "><%=name%></div>';
var container=[
   '<div class="main"> </div>',
   '<div class="menu"> </div>'
];
var menuContent=[
    "<ul>",
    '<li ><a href="javascript:void(0);" class="m-flow-node dom-dragable">Node1</a></li>',
    '<li><a href="javascript:void(0);" class="m-flow-node dom-dragable">Node1</a></li>',
    '<li><a href="javascript:void(0);" class="m-flow-node dom-dragable">Node1</a></li>',
    '<li class="space"><div></div></li>',
    '<li><a href="javascript:void(0);" class="m-draw-line" attr-type="line">直线</a></li>',
    '<li><a href="javascript:void(0);" class="m-draw-curve" attr-type="curve">曲线</a></li>',
    '<li class="space"><div></div></li>',
    '<li><a href="javascript:void(0);" class="m-edit">编辑</a></li>',
    '<li><a href="javascript:void(0);" class="m-select">选择</a></li>',
    '<li><a href="javascript:void(0);" class="m-copy">复制</a></li>',
    '<li class="space"><div></div></li>',
    '<li><a href="javascript:void(0);" class="m-layout"  attr-data="h">水平对齐</a></li>',
    '<li><a href="javascript:void(0);" class="m-layout" attr-data="v">垂直对齐</a></li>',
    '<div class="mask"></div>',
    "<ul>",
];
var flowNode=[
    '<div class="dom-dragable c-flow-drag-node" style="display: none;">',
    '<div div class="content c-node">',
    '<div div class="close">×</div>',
    '</div>',
    '</div>'
];
var nextNode=[
    '<div id="next-node" class="next-node" style="display: none;">',
    '</div>'
];
var select=[
    '<div id="select" class="select" >',
    '</div>'
];
module.exports={
    container:container.join(""),
    menu:menuContent.join(""),
    flowNode:flowNode.join(""),
    nextNode:nextNode.join(""),
    select:select.join("")
};
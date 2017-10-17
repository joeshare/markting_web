/**
 * Author LLJ
 * Date 2016-4-14 13:50
 */
//private

var defaults = {
    lineWidth: 2,
    strokeStyle: 'rgba(78, 187, 250, 1)',
    lineCap: 'round',
    canvasWidth: 400,
    canvasHeihgt: 400,
    canvasCls: 'main-graph',
    autoSize: false
};

function extend(target, src) {
    for (var k in src) {
        src.hasOwnProperty(k) && (target[k] = src[k]);
    }
    return target;
}
/**
 * 获取两点距离
 * @param bx
 * @param by
 * @param ex
 * @param ey
 * @returns {number}
 */
function distance(bx, by, ex, ey) {
    var _x = Math.abs(bx - ex);
    var _y = Math.abs(by - ey);
    var sum = Math.pow(_x, 2) + Math.pow(_y, 2);
    return Math.sqrt(sum);
}
/**
 * 根据距离获取默认半径
 * @param dis
 * @returns {number}
 */
function getDefaultR(dis) {
    return Math.sqrt(Math.pow(dis, 2) / 2);
}

/**
 * 获取指定点的夹角弧度
 * @param originalX  原点x
 * @param originalY 原点y
 * @param pointX 某点x
 * @param pointY 某点y
 * @returns {number} 弧度
 */
function angle(originalX, originalY, pointX, pointY) {
    var diff_x = pointX - originalX,
        diff_y = pointY - originalY,
    //返回角度,不是弧度 （Math.atan(diff_y/diff_x) 获取的是弧度）
        rad=Math.atan(diff_y/diff_x);
   if((diff_x <0&&diff_y >=0)||(diff_x <0&&diff_y <0)){
        rad+=Math.PI;
    }else if(diff_x >=0&&diff_y <0){
        rad+=2*Math.PI;
    }
    return rad;
}
/**
 * 根据原点坐标及弧度 获取新坐标点
 * @param orPos 原点坐标 {x,y}
 * @param rad 弧度
 * @param radius 半径
 * @returns {{}}
 */
function getPosByRad(orPos, rad, radius) {
    var x = radius * Math.cos(rad) + orPos.x,
        y = radius * Math.sin(rad) + orPos.y;
    return {
        x: x,
        y: y
    };
}
/**
 *  获取曲线点
 * @param arg
 * @param {} startX int
 * @param {} startY int
 * @param {} endX int
 * @param {} endY int
 * @param dir int 方向 1 顺时 -1 逆时
 * @returns {Array}
 */
function getCurvePoint(arg) {
    var diffX = arg.endX - arg.startX,
        diffY = arg.endY - arg.startY,
        xDir = diffX > 0 ? 1 : -1,
        yDir = diffY > 0 ? 1 : -1,
        xInterval = Math.round(Math.abs(diffX) / 3),
        yInterval = Math.round(Math.abs(diffY) / 3),
        dis = distance(arg.endX, arg.endY, arg.startX, arg.startY),
        //radius = getDefaultR(dis),
        radius =dis/3,
        an1 = angle(arg.startX, arg.startY, arg.endX, arg.endY),
        an2 = angle(arg.endX, arg.endY, arg.startX, arg.startY)-Math.PI,
        arr=[];
    if (arg.dir > 0) {
        an1 -= Math.PI/4;
        an2 -=3*Math.PI/4;
    } else {
        an1 += Math.PI/4;
        an2 +=3*Math.PI/4;
    }
    var pos1 = getPosByRad({x: arg.startX, y: arg.startY}, an1, radius);
    var pos2 = getPosByRad({x: arg.endX, y: arg.endY}, an2, radius);
    arr.push({x: arg.startX, y: arg.startY});
    arr.push({x: pos1.x,y:pos1.y});
    arr.push({x: pos2.x,y:pos2.y});
    arr.push({x: arg.endX, y: arg.endY});
    return arr;
}

//Object
/**
 *
 * @param arg
 * @param {} canvas string example '#canvasId'
 * @param {} lineWidth int 1
 * @param {} strokeStyle string defaults 'rgba(78, 187, 250, 1)'
 * @param {} lineCap string defaults 'round'
 * @param {} renderTo string example '#wrap'
 * @param {} canvasWidth int defaults 400
 * @param {} canvasHeihgt int defaults 400
 * @param {} canvasCls string defaults main-graph //画布大小
 * @param {} autoSize boolean defaults false //大小自动为父节点宽高
 */
function painter(arg) {
    this.opts = extend(defaults, arg);
    var _renderTo = this.opts.renderTo;
    this.wrap = _renderTo ? typeof _renderTo === 'string' ? document.querySelector(_renderTo) : _renderTo : null;
    if (!this.wrap || !this.wrap.appendChild) {
        return;
    }
    this.init();

}
//public
painter.prototype.init = function () {
    this.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.opts.autoSize && this.autoSize();
};
painter.prototype.createCanvas = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.id = this.opts.id;
    this.canvas.width = this.opts.canvasWidth;
    this.canvas.height = this.opts.canvasHeight;
    this.canvas.className = this.opts.canvasCls;
    this.wrap.html = "";
    this.wrap.appendChild(this.canvas);
};
/**
 * 自动大小设置为父节点宽高
 */
painter.prototype.autoSize = function () {
    this.canvas.width = this.canvas.parentNode.clientWidth;
    this.canvas.height = this.canvas.parentNode.clientHeight;
};
/**
 * 设置画布width height
 * @param w int
 * @param h int
 */
painter.prototype.setSize = function (w, h) {
    this.canvas.width = this.opts.canvasWidth = w;
    this.canvas.height = this.opts.canvasHeight = h;
};
/**
 *设置画布width
 * @param w int
 */
painter.prototype.setWidth = function (w) {
    this.canvas.width = this.opts.canvasWidth = w;
};
/**
 *设置画布height
 * @param h int
 */
painter.prototype.setHeight = function (h) {
    this.canvas.height = this.opts.canvasHeight = h;
};
/**
 * 清除指定区域
 * @param x
 * @param y
 * @param width
 * @param height
 */
painter.prototype.clear = function (x, y, width, height) {
    this.ctx.clearRect(0, 0, width, height);
};
/**
 *  clear all
 */
painter.prototype.clearAll = function () {
    this.clear(0, 0, this.canvas.width, this.canvas.height);
};
/**
 * 直线
 * @param arg
 * @param {} startX int
 * @param {} startY int
 * @param {} endX int
 * @param {} endY int
 * @param {} lineWidth int example 1
 * @param {} lineCap string example 'round'
 * @param {} strokeStyle string example '#0000ff'
 */
painter.prototype.drawLine = function (arg) {
    var ctx = this.ctx, opts = this.opts;
    ctx.beginPath();
    ctx.lineWidth = arg.lineWidth || opts.lineWidth;
    ctx.strokeStyle = arg.strokeStyle || opts.strokeStyle;
    ctx.lineCap = arg.lineCap || opts.lineCap;
    ctx.moveTo(arg.startX, arg.startY);
    ctx.lineTo(arg.endX, arg.endY);
    ctx.stroke();
};
/**
 * 弧线
 * @param arg
 * @param {} startX int
 * @param {} startY int
 * @param {} point1X int
 * @param {} point1Y int
 * @param {} point2X int
 * @param {} point2Y int
 * @param {} endX int
 * @param {} endY int
 * @param {} lineWidth int example 1
 * @param {} lineCap string example 'round'
 * @param {} strokeStyle string example '#0000ff'
 */
painter.prototype.drawCurve = function (arg) {

    var ctx = this.ctx, opts = this.opts;
    ctx.beginPath();
    ctx.lineWidth = arg.lineWidth || opts.lineWidth;
    ctx.strokeStyle = arg.strokeStyle || opts.strokeStyle;
    ctx.lineCap = arg.lineCap || opts.lineCap;
    ctx.moveTo(arg.startX, arg.startY);
    ctx.bezierCurveTo(arg.point1X, arg.point1Y, arg.point2X, arg.point2Y, arg.endX, arg.endY);
    ctx.stroke();
};
/**
 * 画笔
 * @param arg
 * @param {} type string 画笔类型 line 直线 ；curve 曲线
 * @param {} startX int
 * @param {} startY int
 * @param {} endX int
 * @param {} endY int
 * @param {} lineWidth int example 1
 * @param {} lineCap string example 'round'
 * @param {} strokeStyle string example '#0000ff'
 * @param {} curveDir int 曲线方向， 1 顺时 -1 逆时
 */
painter.prototype.draw = function (arg) {
    var _this = this;
    switch (arg.type) {
        case 'line':
            _this.drawLine(arg);
            break;
        case 'curve':
            var arr = getCurvePoint(arg);
            arg.point1X = arr[1].x;
            arg.point1Y = arr[1].y;
            arg.point2X = arr[2].x;
            arg.point2Y = arr[2].y;
            _this.drawCurve(arg);
            break;
        default :
            _this.drawLine(arg);
    }
};

module.exports = painter;
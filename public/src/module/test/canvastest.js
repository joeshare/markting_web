/**
 * Created by Kolf on 2016-7-15.
 */
//画布测试
class MyCavans extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0//
        }
        this.canPaint = false;
        // this.setTotal = this.setTotal.bind(this)
    }

    clearAll() {
        let canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left * (canvas.width / rect.width),
            y: e.clientY - rect.top * (canvas.height / rect.height)
        }
    }

    mouseDown(e) {
        this.canPaint = true;
    }

    mouseUp(e) {
        this.canPaint = false;
    }

    mouseMove(e) {
        let canvas = this.canvas;
        let mousePos = this.getMousePos(canvas, e);
        if (this.canPaint) {
            this.paint(mousePos)
        }
    }

    paint(mousePos) {
        let canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        this.clearAll();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // ctx.moveTo(mousePos.x, mousePos.y);
        // ctx.lineTo(mousePos.x + 1, mousePos.y + 1);
        ctx.bezierCurveTo(0, mousePos.y, mousePos.x, 0, mousePos.x, mousePos.y);//起点xy手柄，终点xy手柄，终点坐标xy
        // ctx.closePath();
        ctx.stroke();
        // this.clearAll();
    }


    componentDidUpdate() {
        this.canvas = document.getElementById('myCanvas');
        let canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // ctx.lineTo(200, 200);
    
        ctx.stroke();
        this.clearAll();
    }

    render() {
        return (
            <div className="canvas-wrap">
                <canvas id="myCanvas" height="400" width="800"
                        onMouseMove={this.mouseMove.bind(this)}
                        onMouseDown={this.mouseDown.bind(this)}
                        onMouseUp={this.mouseUp.bind(this)}
                ></canvas>
            </div>
        )
    }
}
module.exports = MyCavans;
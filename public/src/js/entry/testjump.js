/**
 * Created by Joeliu on 2016-11-29.
 * 测试画图
 */
'use strict';
import Layout from 'module/layout/layout';
var DragModel=require('../../module/testjump/dragModel.js');

const layout = new Layout({
    index: 0,
    leftMenuCurName: ''
});

class TestJump extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menulist: [
                {title: "触发", index: 1, style: "trigger"},
                {title: "受众", index: 2, style: "audiences"},
                {title: "决策", index: 3, style: "decisions"},
                {title: "行动", index: 4, style: "activity"}
            ],
            nodelist:[],
            menutip: {id: 1, style: "trigger", list: [{id: 1, name: "预约触发"}, {id: 2, name: "手动触发"}]},
            lineList: [],
            currentline:{sid:0,eid:0,sx: 0, sy: 0, ex: 0, ey: 0},
            dragunit:null,
            dragkey:false,
            divkey:false,
            publicid:0
        }
    }
    componentDidMount() {
        let dragmodel = new DragModel($('.plan'),this);
        let cvsplan=document.querySelector("#main-cavs");
        cvsplan.width =2000;
        cvsplan.height =2000;
        let cvs2d = cvsplan.getContext('2d');
        this.setState({
            dragunit:cvs2d
        });
    }
    tlog(){

    }

    output_MouseDown(params,e){
        $('.plan-node').removeClass("drawing").removeClass('dom-dragable');
        event.cancelBubble =true;

        let targetid  = $(e.nativeEvent.target).parents('.plan-node').attr('id');
        this.setState({currentline:{st:params,sid:targetid,sx: event.x-200, sy: event.y-100, ex: 0, ey: 0},
            dragkey:true
        });
    }
    input_MouseDown(){
        $('.plan-node').removeClass("drawing").removeClass('dom-dragable');
        event.cancelBubble =true;
    }

    output_MouseUP(){

    }
    input_MouseUP(e){
        let psx = this.state.currentline.sx;
        let psy =this.state.currentline.sy;
        let sid = this.state.currentline.sid;
        let st = this.state.currentline.st;
        let targetid = null;
        if($(e.nativeEvent.target).hasClass('plan-node'))
        {
            targetid =$(e.nativeEvent.target).attr('id');
        }else if($(e.nativeEvent.target).parent().hasClass('plan-node')){
            targetid =$(e.nativeEvent.target).parent().attr('id');
        }
        else if($(e.nativeEvent.target).parent().parent().hasClass('plan-node')){
            targetid =$(e.nativeEvent.target).parent().parent().attr('id');
        }
        let linobject  = {st:st,sid:sid,sx:psx, sy:psy,eid:targetid, ex: event.x-200, ey: event.y-100};
        this.setState({currentline:linobject,
            dragkey:false
        });
        this.addlines(linobject);
        let _this =this;
        setTimeout(function () {
            _this.drowlineUnit(_this.state.currentline);
        },10)
    }

    output_keyup(){
        $('.plan-node').addClass("drawing").addClass('dom-dragable');
    }
    input_keyup(){
        $('.plan-node').addClass("drawing").addClass('dom-dragable');
    }
    clearline(){
        this.state.dragunit.clearRect(0, 0, 2000, 2000);

    }
    drowlineUnit(params){
         this.draw({
            strokeStyle: this.getDrawColorByType("output-dot"),
            startX:params.sx,
            startY:params.sy,
            endX: params.ex,
            endY: params.ey
        });
    }

    getDrawColorByType(type) {
        var obj = {
            'output-dot': '#787878',
            'yes-output-dot': '#65bb43',
            'no-output-dot': '#e64646'
        };
        return obj[type] ? obj[type] : obj['output-dot'];
    }
    onMouseMove(e){

        let pointkey = true;
        if(this.state.dragkey)
        {
            pointkey =false;
            let psx = this.state.currentline.sx;
            let psy =this.state.currentline.sy;
            let sid = this.state.currentline.sid;
            let st = this.state.currentline.st;

            let curline = {st:st,sid:sid,sx:psx, sy:psy, ex: event.x-200, ey: event.y-100};



            let _this =this;
            //setTimeout(function () {
            this.clearline();
            this.state.lineList.forEach((el)=>{
                this.drowlineUnit(el);
                });

            console.log(curline);
            this.drowlineUnit(curline);
            //},1)

            this.setState({currentline:curline
            });
        }
        if(this.state.divkey&&pointkey) {
             let pubid = this.state.publicid;

            let linelist = this.state.lineList;

            console.log('444444444444444777',this.state.publicid);
            let $dragdiv  =  $('#'+this.state.publicid+'');
            let px = $dragdiv.position().left+88;
            let py = $dragdiv.position().top;

            linelist.every((el,i,array)=>{
                //console.log('555555555555555',el.eid +'-----'+pubid);
               // console.log(array);
                if(el.sid==pubid)
                {
                    switch(el.st)
                    {
                        case 0:
                            el.sx=px;

                            break;
                        case 1:
                            el.sx=px-34;

                            break;
                        case 2:
                            el.sx=px+35;

                            break;
                    }
                    el.sy=py+49;
                    //console.log(el);
                }

                if(el.eid==pubid)
                {

                   el.ex=px;
                   el.ey=py;
                    //console.log('9090909',$dragdiv.html());
                }
                if(i<linelist.length)
                {return true}
            });
            this.clearline();

           // console.log(linelist);
            linelist.forEach((elt)=>{
                this.drowlineUnit(elt);
            });
            this.setState({lineList:linelist
            });
           // console.log('777777777777777777',linelist);
           // .find
        }
        else {
            //$(e.nativeEvent.target).find('.close').hide();
        }
    }

    addnodes(params){
        let nodelist = this.state.nodelist;
        let rand =('_'+Math.random()*100000000000).split('.')[0];
        let newnode ={id:rand,style:params.style,title:params.title,sty:null};
        nodelist.push(newnode);
        this.setState({nodelist:nodelist
        });
    }
    addlines(params){
        let linelist = this.state.lineList;
       // console.log('777777777777777',linelist);
        linelist = linelist.filter((el)=>{return (el.sid!=params.sid||el.eid!=params.eid)});

       // console.log('9999999999999999',linelist);

        linelist.push(params);
        this.clearline();
        linelist.forEach((el)=>{
            this.drowlineUnit(el);
        });

        this.setState({lineList:linelist
        });
    }

    ondivKeydown(e){
        let targetid = null;
        if($(e.nativeEvent.target).hasClass('plan-node'))
        {
            targetid =$(e.nativeEvent.target).attr('id');
        }else if($(e.nativeEvent.target).parent().hasClass('plan-node')){
            targetid =$(e.nativeEvent.target).parent().attr('id');
        }
        else if($(e.nativeEvent.target).parent().parent().hasClass('plan-node')){
            targetid =$(e.nativeEvent.target).parent().parent().attr('id');
        }

        //$(e.nativeEvent.target).parent('.plan-node').attr('id');
        this.setState({divkey:true,publicid:targetid
        });
    }
    ondivKeyup(){
        this.setState({divkey:false
        });

        let linelist = this.state.lineList;
        linelist.forEach((el)=>{
            this.drowlineUnit(el);
        });
    }

    ondivMove(e){
         $(e.nativeEvent.target).find('.close').show();
    }
    ondivleave(e){

    }
    ondivclose(e)
    {
        let publicid= $(e.nativeEvent.target).parent().attr('id');
        let linelist = this.state.lineList;
        let pnodelist =  this.state.nodelist;
        linelist = linelist.filter((el)=>{return (el.sid!=publicid&&el.eid!=publicid)});

        let newnodelist =[];
        console.log(pnodelist);
        pnodelist.forEach(function (elt) {

            console.log(elt);
            if(elt.id!=publicid)
            {
                newnodelist.push(elt);
            }
        });
        console.log(newnodelist);
        this.setState({nodelist:newnodelist,lineList:linelist});
        this.clearline();
        linelist.forEach((el)=>{
            this.drowlineUnit(el);
        });
    }

    dragline(arg) {
        var ctx = this.state.dragunit;
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.strokeStyle = 'rgb(255,0,0)';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;
        //console.log('fffffffffffffffff');
            let  psult = this.getpointResult(arg);
            var arr=this.getTrianglePoint({x:0,y:0});
            var an=this.angle(psult[0].x,psult[0].y,psult[1].x,psult[1].y);
            var dir=psult[2].y-arg.startY;
            ctx.save();
            ctx.translate(psult[2].x, psult[2].y);
            var rotateAn=isNaN(an)?(dir>=0?(-Math.PI):(Math.PI/2-an)):(Math.PI/2-an);
            ctx.rotate(rotateAn);
            ctx.beginPath();
            ctx.moveTo(arr[0].x, arr[0].y);
            arr.forEach(function(itm,i){
                if(i>0){
                    ctx.lineTo(itm.x, itm.y);
                }
            })
        //console.log('00000000000000000000000000000000000');
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.beginPath();
        ctx.moveTo(arg.startX, arg.startY);
        ctx.bezierCurveTo(arg.point1X, arg.point1Y, arg.point2X, arg.point2Y, arg.endX, arg.endY);
        ctx.stroke();
    }

    getpointResult(arg){
        let mp1=this.getMidpoint(arg.startX,arg.startY,arg.point1X, arg.point1Y);
        let mp2=this.getMidpoint(arg.point1X, arg.point1Y, arg.point2X, arg.point2Y);
        let mp3=this.getMidpoint(arg.point2X, arg.point2Y,arg.endX,arg.endY);
        let mp4=this.getMidpoint(mp1.x,mp1.y,mp2.x,mp2.y);
        let mp5=this.getMidpoint(mp2.x,mp2.y,mp3.x,mp3.y);
        return [mp4,mp5,this.getMidpoint(mp4.x,mp4.y,mp5.x,mp5.y)];

    }

    getMidpoint(x1,y1,x2,y2){
        return {
            x:x2/2+x1/2,
            y:y2/2+y1/2
        };
    }
    getTrianglePoint(pos){
         return [{x:pos.x,y:pos.y-2},{x:pos.x+2,y:pos.y+2},{x:pos.x-2,y:pos.y+2}];
    }

    draw(arg) {
        var _this = this;
        var arr = this.getCurvePoint2(arg);
        var tmp2= $.extend(true,{},arr);
        arg.point1X = arr[1].x;
        arg.point1Y = arr[1].y;
        arg.point2X = arr[2].x;
        arg.point2Y = arr[2].y;
        _this.dragline(arg);
    }
    getCurvePoint2(arg){
        var diffX = arg.endX - arg.startX,
            diffY = arg.endY - arg.startY,
            yDir = diffY > 0 ? 1 : -1,
            diff=Math.abs(diffY),
            pos1={
                x: arg.startX,
                y:arg.startY+diff*yDir
            },
            pos2={
                x: arg.endX,
                y:arg.endY-diff*yDir
            },
            arr=[];
        arr.push({x: arg.startX, y: arg.startY});
        arr.push({x: pos1.x,y:pos1.y});
        arr.push({x: pos2.x,y:pos2.y});
        arr.push({x: arg.endX, y: arg.endY});
        return arr;
    }

    angle(originalX, originalY, pointX, pointY) {
        var diff_x = pointX - originalX,
            diff_y = pointY - originalY,
            rad=Math.atan(diff_y/diff_x);
        if((diff_x <0&&diff_y >=0)||(diff_x <0&&diff_y <0)){
            rad+=Math.PI;
        }else if(diff_x >=0&&diff_y <0){
            rad+=2*Math.PI;
        }
        return rad;
    }

    render() {
        return (
            <div className="plan">
                <header className="page-body-header" id="page-body-header">
                    <div className="text-box"><span className="title">活动编排</span><span className="text">测试</span></div>
                    <div className="button-box icon iconfont">
                        <a className="a keyong return-pages" id="return-pages"  title="返回">&#xe621;</a>
                        <span className="a keyong rui-cursor-pointer" id="plan-save" title="保存">&#xe602;</span>
                        <span className="a keyong plan-stop-icon" id="plan-stop" title="终止活动" href="javascript:void(0);">&#xe655;</span>
                        <a className="a keyong " id="plan-cancel-start" title="取消启动" href="javascript:void(0);">&#xe643;</a>
                        <a className="a keyong " id="plan-start" title="启动" href="javascript:void(0);">&#xe633;</a>
                    </div>
                </header>
                <div className="content">
                    <div className="draw-box" onMouseMove={this.onMouseMove.bind(this)} id="openMacket-draw-animate">
                        <canvas height="3000" width="3000" id="main-cavs"></canvas>
                        <div id="plan-empty-msg">请拖入活动节点</div>

                        {this.state.nodelist.map((m,i)=> {
                            return (
                                <div className={m.style +" plan-node dom-dragable plan-drag dome-drag"}
                                     onMouseLeave={this.ondivleave.bind(this)}
                                     onMouseMove={this.ondivMove.bind(this)} id={m.id}
                                     onMouseDown={this.ondivKeydown.bind(this)}
                                     onMouseUp={this.ondivKeyup.bind(this)}
                                     style={m.sty}  >
                                    <div className="icon iconfont"></div>
                                    <div className="content-wrap">
                                        <div className="title">{m.title}</div>
                                        <div className="desc empty">
                                            请双击开始设置
                                        </div>
                                    </div>
                                    <i className="icon iconfont close remove-node"  onClick={this.ondivclose.bind(this)} ></i>
                                    <i className="output-dot" onMouseDown={this.output_MouseDown.bind(this,0)}
                                       onMouseLeave={this.output_keyup.bind(this)}
                                       onMouseUp={this.output_MouseUP.bind(this)}></i>
                                    <i className="input-dot" onMouseDown={this.input_MouseDown.bind(this)}
                                       onMouseLeave={this.input_keyup.bind(this)}
                                       onMouseUp={this.input_MouseUP.bind(this)}></i>
                                    <i className="yes-output-dot"  onMouseDown={this.output_MouseDown.bind(this,1)}
                                       onMouseLeave={this.output_keyup.bind(this)}
                                       onMouseUp={this.output_MouseUP.bind(this)}></i>
                                    <i className="no-output-dot"  onMouseDown={this.output_MouseDown.bind(this,2)}
                                       onMouseLeave={this.output_keyup.bind(this)}
                                       onMouseUp={this.output_MouseUP.bind(this)}></i>
                                    <i className="icon iconfont error"></i>
                                </div>
                            )
                        })}

                        <div className="plan-node dom-dragable plan-drag audiences dome-drag" id="1480384476107"  style={{top:'246px', left:'232px',zindex:'198910200',display:'none'}}>
                            <div className="icon iconfont"></div>
                            <div className="content-wrap">
                                <div className="title">目标人群</div>
                                <div className="desc empty">
                                    请双击开始设置
                                </div>
                            </div>
                            <i className="icon iconfont close remove-node"></i>
                            <i className="output-dot" onMouseDown={this.output_MouseDown.bind(this)}  onMouseLeave={this.output_keyup.bind(this)}  onMouseUp={this.output_MouseUP.bind(this)}></i>
                            <i className="input-dot" onMouseDown={this.input_MouseDown.bind(this)}  onMouseLeave={this.input_keyup.bind(this)}  onMouseUp={this.input_MouseUP.bind(this)}></i>
                            <i className="yes-output-dot"></i>
                            <i className="no-output-dot"></i>
                            <i className="plan-num num">
                                0
                            </i>
                            <i className="icon iconfont error"></i>
                        </div>

                    </div>
                    <div className="menubar" >
                        <ul>
                            {
                                this.state.menulist.map((m,i)=>{
                                    return (
                                        <li>
                                            <a className={m.style + " btn-floating  waves-effect waves-light"}  onClick={this.addnodes.bind(this,m)}   attr-index={m.index}>{m.title}</a>
                                        </li>
                                    )
                                })
                            }
                       </ul>
                    </div>

                    <div className="mackt-box " id="openMacket-mackt-animate">
                        <div className="header" >
                            <i className="icon iconfont close"  id="mackt-close">&#xe664;</i>
                            <spn className="text">活动安排相关分析</spn>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


//渲染
const testJump = ReactDOM.render(
    <TestJump />,
    document.getElementById('page-body')
);

module.exports = testJump;
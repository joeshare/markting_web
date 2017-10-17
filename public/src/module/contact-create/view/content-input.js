let  formatter=require('../utils/fieldSDataFormatter.js');
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.$el = $(React.findDOMNode(this));
        $('select').material_select();

    }
    componentWillUpdate(){
        let _this=this;
    }
    componentDidUpdate(){
        $('select').material_select();
       // console.log(this.props.height)
       // console.log(this.props.width)
        //this.changeStyle(this.props.width,this.props.height);
    }
    showSetMenu(){
       $("#"+this.props.field.field_code+"-set-menu").show();
    }
    closeSetMenu(){
        $(this.props.field.field_code+"-set-menu").stop().fadeOut();
    }
    changeSetBox(id,code,type){
       this.props.changeSetBox(id,code,type);
    }
    render(){
        let _this=this;
        let field= formatter.inputShowData(this.props.field);
        let id="checked-"+field.field_code;
        /*
         field_name:"姓名"+Math.round(Math.random()*10),
         field_code:"name"+Math.random()*10,
         field_type:Math.round(Math.random()*10),
         selected:Math.round(Math.random()*2),
         index:Math.random()*30,
         required:Math.random()>0.5?1:0,//0-不填
         ischecked:Math.random()>0.5?1:0//0-不校验  1-校验
         <option value="" disabled selected>性别</option>
         <option value="1">未知</option>
         <option value="2">男</option>
         <option value="3">女</option>
         */
        return (
            <div className="input-block-wrapper " id={field.field_code+"-wrapper"}>
                <div className={field.isNew?"input-block dom-dragable new":"input-block dom-dragable"} data-code={field.field_code}>
                    <div className="ico-star">{field.required_show}</div>
                    <div className="drag-move"  dangerouslySetInnerHTML={{__html: field.html}} />
                    <div   onClick={this.showSetMenu.bind(this)} className="icon iconfont date-ico set">&#xe636;</div>
                    <div  id={field.field_code+"-set-menu"} data-parent="0" className="menu-wrapper opt-menu" >
                        <ul className="opt-menu-ul" data-parent="1">
                            <li className="opt-menu-li"  data-parent="2">
                                <input type="checkbox"
                                    data-txt="必填"
                                    data-parent="2"
                                    checked={field.required?"checked":""}
                                    className="filled-in checkitem opt-menu-checkitem" id={"required-"+field.field_code}
                                    onChange={this.changeSetBox.bind(this,"required-"+field.field_code,field.field_code,'required')}
                                />
                                <label  data-parent="3" htmlFor={"required-"+field.field_code} className="mylabel opt-menu-label">必填</label>
                            </li>


                        </ul>
                    </div>

                </div>
            </div>
        )

    }
}
module.exports = panel;
/* 手机需要验证
 {
 (function(){
 if(field.field_code=='mobile'){
 return (
 <li className="opt-menu-li"  data-parent="2">
 <input type="checkbox"
 data-txt="需要验证"
 data-parent="3"
 checked={field.ischecked?"checked":""}
 className="filled-in checkitem opt-menu-checkitem" id={"checked-"+field.field_code}
 onChange={_this.changeSetBox.bind(_this,"checked-"+field.field_code,field.field_code,'ischecked')}
 />
 <label  data-parent="3" htmlFor={"checked-"+field.field_code} className="mylabel opt-menu-label">需要验证</label>
 </li>
 )
 }

 } )()
 }
 */
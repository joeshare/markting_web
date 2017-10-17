let results=(function(){
    let arr=[];
    for(let i=0;i<12;i++){
        arr.push({
            name:util.uuid()+"",
            id:util.uuid()+"",
            status:Math.round(Math.random()*3),
            count:Math.random()*100000
        })
    }

    return arr
})();
let className="card-wrapper col s3";
let Input= require('./content-input.js');
let DragModel= require('../model/dragModel.js');
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
           'listWrapper': {
               clear: 'both',
               position: 'relative'
           },
            listContent:{
                display: 'block',
                position: 'absolute',
                top: 0,
                left: -10,
                right: -10,
                bottom: 0
            }
        };
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));

        //this.DragModel=new DragModel();

    }
    componentWillUpdate(){
        let _this=this;
    }
    componentDidUpdate(){
        // <Input field= {f} />
       // console.log(this.props.height)
       // console.log(this.props.width)
        //this.changeStyle(this.props.width,this.props.height);
    }
    sortFun(a,b){
        return a.index-b.index;
    }
    editFormTitle(){
        this.props.editFormTitle();
    }
    render(){
        let _this=this;
        this.props.data.fields.sort( _this.sortFun);
        return (
            <div className="c-left">
                <div className="c-title" id="form-name">{this.props.data.contact_title||'联系人表单'}<span onClick={this.editFormTitle.bind(this)} className="a keyong icon iconfont round rui-cursor-pointer rui-ico-btn" id="form-title-edit" style={{display:'block','margin-right':20,float:'right'}}>&#xe609;</span></div>

                <div className="form-desc"  id="form-desc">{this.props.data.contact_descript||'感谢参与信息征集活动，留下您的联系方式'}</div>
                <div className="form-body style-v1"  id="form-body"   >
                {
                    this.props.data.fields.map((f)=> {
                          if(f.selected){
                            return (
                                <Input field={f}   changeSetBox={this.props.changeSetBox}/>
                            )
                          }
                         })
                    }
                </div>
            </div>
        )

    }
}
module.exports = panel;
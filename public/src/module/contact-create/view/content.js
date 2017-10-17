'use strict';
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
let i=0;
let className="card-wrapper col s3";
let Left= require('./content-left.js');
let Right= require('./content-right.js');
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));

    }
    componentWillUpdate(){
        let _this=this;
    }
    componentDidUpdate(){
    }
    page2preview(){
        this.props.page2preview();
    }
    render(){
        let _this=this;
        return (
            <div className="content-wrapper">
                <Left  data={this.props.data}  editFormTitle={this.props.editFormTitle}  changeSetBox={this.props.changeSetBox} />
                <Right data={this.props.data} fieldClick={this.props.fieldClick}/>
                <div className="preview ">
                    <a onClick={this.page2preview.bind(this)} className="a icon iconfont keyong rui-cursor-pointer"  id="preview-btn" title="预览" href="javascript:void(0);">&#xe640;</a>
                </div>
            </div>
        )

    }
}
module.exports = panel;
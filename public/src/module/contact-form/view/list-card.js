let Modals = require('component/modals.js');
let guideTpls=require('../tpl/guide.html');

function getFileName(path){
    var pos1 = path.lastIndexOf('/');
    var pos2 = path.lastIndexOf('\\');
    var pos  = Math.max(pos1, pos2);
    var name="",url="";
    if( pos<0 )
        name=path;
    else
        name=path.substring(pos+1);
    url=path.substring(0,pos);
    return [url,name];
}


function successMsg(msg){
    Materialize.toast(msg||"保存成功！", 3000)
}

let clipboardSington=null;

class panel extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isIcon:''
        };

    }
    componentDidMount(){
        $('.dropdown-button').dropdown({
                constrain_width: false,
                gutter: 0,
                belowOrigin: true
            }
        );

    }
    componentWillUpdate(){
    }
    componentDidUpdate(){
    }
    renderTpl(tps,selector,data){
        return _.template($(tps).filter(selector).html())(data||{})
    }
    del(id){
        let _this=this;
        new Modals.Confirm({
            title:'提示',
            content:"<div>确定要删除吗？</div>",
            listeners: {//各种监听
                close: function (type) {
                    if(type){
                        _this.props.delCard(id)
                    }
                }
            }
        });

    }
    copy(id){
        this.props.copyCard(id)
    }
    feedback(id,name){
      if(!$("#opt-list-"+id+ " li:eq(2)").hasClass("rui-disabled")){
                this.props.page2Feedback(id,name);
      }

    }
    showGuide(){

        let _this=this;
        new Modals.Window({
            title:"表单使用指南",
            cls:'contact-guide-w',
            content:_this.renderTpl(guideTpls,"#content",{
              img:FILE_PATH+_this.props.data.qrcode_pic,
              url:_this.props.data.qrcode_shorturl
            }),
            listeners:{
                afterRender:function(){
                    clipboardSington= null;
                    clipboardSington= new Clipboard('.copyBtn');
                    clipboardSington.on('success', function(e) {
                        // console.info('Action:', e.action);
                        // console.info('Text:', e.text);
                        // console.info('Trigger:', e.trigger);
                        if (e.text!='') {
                            successMsg('复制成功');
                           // alert('复制成功');
                        }
                        e.clearSelection();
                    });
                },
                close:function(){
                    clipboardSington.destroy();
                }
            },
            width:'500',//默认是auto
            height:'300'//默认是auto
        })
    }
    page2Preview(id){
        console.log("page2Preview card")
        this.props.page2Preview(id);
    }
    page2Edit(id){
        this.props.page2Edit(id);
    }
    render(){
        this.state.isIcon=this.props.data.contact_status==0?'none':'inline-block';
        let url=BASE_PATH+'/html/asset/contactform-preview.html?contact_id='+this.props.data.contact_id;
        return (
            <div className="card-wrapper col s3 uat-assetcontact-box">
                <div className={this.props.className}>
                    <div className="card-header">
                        <div className="header-title">  {this.props.data.contact_name}</div>
                        <div className="header-opt">
                            <div className="opt-wrapper">
                                <span className="icon iconfont r-btn dropdown-button dropdown-button-more"
                                    data-activates={"opt-list-"+this.props.data.contact_id}
                                    data-gutter="0"
                                    data-constrainwidth="false"
                                    data-beloworigin="true"
                                    title="更多操作"
                                >&#xe675;</span>
                                <ul id={"opt-list-"+this.props.data.contact_id}  className="dropdown-content">
                                    <li>
                                       <a href="javascript:void(0);" onClick={this.copy.bind(this,this.props.data.contact_id)}><i className="icon iconfont">&#xe65c;</i>复制</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);"  onClick={this.page2Edit.bind(this,this.props.data.contact_id)}><i className="icon iconfont">&#xe604;</i>编辑</a>
                                    </li>
                                    <li className={this.props.data.contact_status==0?'rui-disabled':''}>
                                        <a href="javascript:void(0);"   onClick={this.feedback.bind(this,this.props.data.contact_id,this.props.data.contact_name)}> <i className="icon iconfont">&#xe673;</i>反馈信息</a>
                                    </li>
                                    <li >
                                        <a style={{height: '35px !important','line-height':'35px !important','min-height':'35px !important','padding':'0' }} target="_blank" href={url}><i className="icon iconfont">&#xe651;</i>预览</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);"  onClick={this.del.bind(this,this.props.data.contact_id)}><i className="icon iconfont">&#xe674;</i><span >删除</span></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="body-left">
                            <div className="count">
                                {this.props.data.user_count}
                            </div>
                        </div>
                        <div className="body-right" style={{display:this.state.isIcon}}>
                            <ico onClick={this.showGuide.bind(this,this.props.data.contact_id)} className="icon iconfont r-btn dropdown-button dropdown-button-more rui-cursor-pointer"
                                data-activates="morelist" data-constrainwidth="false" title="表单使用指南" >&#xe65a;
                            </ico>

                        </div>
                    </div>
                </div>
            </div>
        )

    }
}
module.exports = panel;
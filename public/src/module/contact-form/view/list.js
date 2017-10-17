let Card= require('./list-card.js');
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
    }
    componentWillUpdate(){
        let _this=this;
        i=0;
    }
    delCard(id){
        this.props.delCard(id);
    }
    componentDidUpdate(){
    }
    render(){
        let _this=this;
        let path=BASE_PATH;
        this.listContentStyle=this.props.data.length?"":"table";
        return (
            <div className="list-wrapper">
                <div className="list-content row uat-assetcontact-boxs" style={{"display":this.listContentStyle}}>
                      {
                          this.props.data.length?this.props.data.map(function(result) {
                              i++;
                              if(i==0||(i-1)%4==0) {
                                 className="card-content  mr10";
                             }else if(i%4==0){
                                  className="card-content  ml10";
                              }else{
                                 className="card-content  mr10 ml10";
                              }
                              className+=(result.contact_status==0||result.contact_status==2)?' disabled':'';
                             return <Card className={className} data={result}
                                 delCard={_this.props.delCard}
                                 copyCard={_this.props.copyCard}
                                 page2Preview={_this.props.page2Preview}
                                 page2Feedback={_this.props.page2Feedback}
                                 page2Edit={_this.props.page2Edit}
                             />;
                          }):(function(){return (<div style={{'display':'table-cell','vertical-align':'middle','text-align':'center','margin':'0 auto',width:'300px'}}>
                              <div className="contact-logo"></div>
                              <div style={{'font-size': '18px','color': '#666','margin-bottom': '10px'}}>您尚未建立联系人表单</div>
                              <div style={{'font-size': '12px','color': '#999','margin-bottom': '20px'}}>点击下方按钮,快速创建表单</div>
                              <a className="button-main-1 contact-new-btn" href={path+"/html/asset/contact-create.html?returnurl=html/asset/contact.html"}>新联系人表单</a>
                          </div>)})()
                      }
                </div>
            </div>
        )

    }
}
module.exports = panel;
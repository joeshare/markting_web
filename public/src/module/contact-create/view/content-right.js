let Field= require('./content-field.js');
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
        this.setState(this.props.fields)

    }
    componentWillUpdate(){
        let _this=this;
    }
    componentDidUpdate(){
       // console.log(this.props.height)
       // console.log(this.props.width)
        //this.changeStyle(this.props.width,this.props.height);
    }
    sortFun(a,b){
        return a.fixed_index-b.fixed_index;
    }
    render(){
        let _this=this;
        let i=0;
        let isM=0;
        this.props.data.fields.sort( _this.sortFun);
        return (
            <div className="c-right">
                <div className="c-title">表单字段设置</div>
                <div className="form-field"  id="form-field">
                  {
                      this.props.data.fields.map(rec=>{
                          isM=i%2==1?1:0;
                          i++;
                          return (
                              <Field field={rec}  isMl={isM} fieldClick={this.props.fieldClick}/>
                          )
                       })
                      }

                </div>
                <div className="form-permission"  id="form-permission" style={{display:'none'}}>
                 <div className="c-title">
                     填写者权限设置
                 </div>
                    <div style={{'padding-left':20}}>
                    <form>
                        <p>
                            <input name="permission" type="radio" id="test1" />
                            <label for="test1">不做限制</label>
                        </p>
                        <p>
                            <input name="permission" type="radio" id="test2" />
                            <label for="test2">每台电脑/手机限填一次</label>
                        </p>
                        <p>
                            <input name="permission" type="radio" id="test3"  />
                            <label for="test3">只在微信中打开</label>
                        </p>
                    </form>
                    </div>
                </div>
            </div>
        )

    }
}
module.exports = panel;
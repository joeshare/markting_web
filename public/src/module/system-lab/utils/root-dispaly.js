//设置优先级
class RootDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custom_root:[],
            root_count:0,
            active:true
        }
    }

    componentDidMount() {
        let _this =this;
        util.api({
            type: 'get',
            data: {
                noly_show:false,
                method: "mkt.tag.custom.taxonomy.root.list.get"
            },
            success: function (res) {
                if (res.code == 0) {
                    let rootcount = 0;
                    res.data.forEach((m, i)=> {
                        if (m.is_show)
                            rootcount += 1;
                    })

                    _this.setState({
                        custom_root: res.data,
                        root_count: rootcount
                    });
                }
            }
        });
    }

    onchangelab(mpara,type){
        let rootarray = this.state.custom_root;

        let rootcount = 0;
        rootarray.every((m,i)=>{
            if(rootcount<10){
                if(mpara.tag_tree_id==m.tag_tree_id)
                {
                    if(type)
                    {
                        m.is_show = false;
                    }
                    else
                    {
                        m.is_show = true;
                        ++rootcount;
                    }
                }
                else {
                    if(m.is_show){  ++rootcount;}
                }
            }
            else {
                if(mpara.tag_tree_id==m.tag_tree_id)
                {
                    if(type)
                    {
                        m.is_show = false;
                    }
                    else
                    {
                        m.is_show = true;

                        rootarray.every((ml)=>{
                            if(ml.is_show)
                            {  ml.is_show = false;}
                            else{
                                return true;
                            }
                        });

                    }
                }
                else {
                    m.is_show = false;
                }
            }
            if(i<rootarray.length)
                return true;
        });

        if(rootcount==0){
            $(".btn-content").find(".accept").addClass("disable");
            this.setState({active:false});
        }
        else {
            $(".btn-content").find(".accept").removeClass("disable");
            this.setState({active:true});
        }

        this.setState({
            custom_root:[]
        },function () {
            this.setState({
                root_count:rootcount,
                custom_root:rootarray
            })
        });
        return false;
    }

    render() {
        return (
            <div className="wincontent">
                <div className="input-list">
                    {this.state.custom_root.map((m,i)=>{
                        if(m.is_show)
                        {
                            return(
                                <div className='li'>
                                    <input type='checkbox' className='filled-in'  id={m.tag_tree_id} checked onChange={this.onchangelab.bind(this,m,true)}/>
                                    <label htmlFor={m.tag_tree_id}>{m.tag_tree_name}</label>
                                </div>
                            )
                        }
                        else {
                            return(
                                <div className='li'>
                                    <input type='checkbox' className='filled-in'  id={m.tag_tree_id}  onChange={this.onchangelab.bind(this,m,false)}/>
                                    <label htmlFor={m.tag_tree_id}>{m.tag_tree_name}</label>
                                </div>
                            )
                        }
                    })}
                </div>
                <div className="input-tips">选择展示的自定义分类：（{this.state.root_count}/10）</div>
            </div>
        )
    }
}

module.exports = RootDisplay;
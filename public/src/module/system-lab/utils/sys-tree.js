//系统组件
class Treelib extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
        if(this.props.datalist!=null)
        {
            return(
                <ul>
                    {
                        this.props.datalist.map((m,i)=> {
                            if(m.children){
                                return(<li>
                                    <div className="ulhiare">
                                        <div className="hitarea collapsable-hitarea"></div>
                                        <span>{m.tag_name +"（"+ m.includeCount+"）"}</span>
                                        <div className="unbtn">
                                        </div>
                                    </div>
                                    <Treelib lab_select={this.props.lab_select} recommit={this.props.recommit.bind(this)} datalist={m.children} onLab_click={this.props.onLab_click.bind(this)}/>
                                </li>)
                            }
                            else {
                                return(<li className="listy" onClick={this.props.onLab_click.bind(this,m)}>
                                    <div className={this.props.lab_select==m.tag_id?"list-div list-divin":"list-div"} >
                                        <div className="fl"><a onClick={this.props.recommit.bind(this,m,1)} className={m.flag?"icon iconfont choose":"icon iconfont nochoose"}>&#xe6af;</a>{m.tag_name}</div>
                                        <div>
                                            <div className="fc">
                                            </div>
                                        </div>
                                        <div className="fr">{m.tag_cover}</div>
                                    </div>
                                </li>)
                            }
                        })
                    }
                </ul>
            )
        }
        else{
            return(null)
        }
    }
}
module.exports = Treelib;
//自定义组件
class Treelib extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
        return(
            <ul>
                {
                    this.props.datalist.map((m,i)=> {
                        if(m.children!=null){
                            return(<li>
                                <div  onClick={this.props.onRoot_click.bind(this,m)}  className={this.props.lab_selectr==m.tag_tree_id? this.props.edit_type==1?"ulhiare ulhiaredoIn ulhiaredo":"ulhiare ulhiaredoIn": this.props.edit_type==1?"ulhiare ulhiaredo":"ulhiare"}>
                                    <div className="hitarea collapsable-hitarea"></div>
                                    <span>{m.tag_tree_name+"（"+ m.tag_count+"）"}</span>
                                    <div className="unbtn">
                                        <ico className="icon iconfont dropdown-button" data-gutter="-110" data-activates={"morelist"+m.tag_tree_id} data-beloworigin="true" data-constrainwidth="false" >&#xe675;</ico>
                                        <ul id={"morelist"+m.tag_tree_id} className="dropdown-content">
                                            <li onClick={this.props.onTree_AddLab.bind(this,m)}>
                                                <a href="javascript:void(0)">添加标签</a>
                                            </li>
                                            <li onClick={this.props.onTree_EditLab.bind(this,m)}>
                                                <a href="javascript:void(0)">编辑名称</a>
                                            </li>
                                            <li onClick={this.props.onTree_DeleteLab.bind(this,m)}>
                                                <a href="javascript:void(0)">删除该分类</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <Treelib edit_type={this.props.edit_type} onRoot_click={this.props.onRoot_click} onLab_click={this.props.onLab_click.bind(this)} recommit={this.props.recommit}  lab_selectr={this.props.lab_selectr}    lab_select={this.props.lab_select}   datalist={m.children} taglist={m.children_tag} onTree_AddLab={this.props.onTree_AddLab} onTree_EditLab={this.props.onTree_EditLab} onTree_DeleteLab={this.props.onTree_DeleteLab} />
                            </li>)
                        }
                        else {
                            return(null)
                        }
                    })
                }
                {
                    this.props.taglist.map((ml,il)=>{
                        return(<li onClick={this.props.onLab_click.bind(this,ml)} className="listy">
                            <div className={this.props.lab_select==ml.tag_id?"list-div list-divin list-divdo":"list-div list-divdo"}>
                                <div className="fl"><a onClick={this.props.recommit.bind(this,ml,3)} className={ml.flag?"icon iconfont choose":"icon iconfont nochoose"}>&#xe6af;</a>{ml.tag_name}
                                </div>
                                <div>
                                    <div className="fc">
                                    </div>
                                </div>
                                <div className="fr">{ml.tag_cover}</div>
                            </div>
                        </li>)
                    })
                }
            </ul>
        )
    }
}
module.exports = Treelib;
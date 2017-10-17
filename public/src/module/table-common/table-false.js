/**
 * Created by AnThen on 2016/11/16.
 * 整站table数据展示使用 "暂无数据" 方式
 */
class TbodyFalse extends React.Component{
    render() {
        let colspan = this.props.colspan;
        let tbodyClassName = this.props.tbodyClassName || 'uat-tbody';
        return (
            <tbody className={tbodyClassName}>
            <tr>
                <td style={{width:'100%',padding:'70px 0',borderBottom:'none'}} colSpan={colspan}>
                    <div style={{margin:'auto',width:'100px'}}>
                        <div className="iconfont" style={{float:'left',width:'24px',marginRight:'10px',color:'#999999'}}>&#xe624;</div>
                        <div style={{float:'left',width:'64px',fontSize:'14px;',color:'#999999'}}>暂无数据</div>
                    </div>
                </td>
            </tr>
            </tbody>
        )
    }
}
module.exports = TbodyFalse;
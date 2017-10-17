/**
 * Created by AnThen on 2016/11/16.
 * 整站table数据展示使用 "Loading" 方式
 */
class TbodyLoading extends React.Component{
    render() {
        let colspan = this.props.colspan;
        let tbodyClassName = this.props.tbodyClassName || 'uat-tbody';
        return (
            <tbody id="loading" className={tbodyClassName}>
            <tr>
                <td style={{width:'100%',padding:'70px 0',borderBottom:'none'}} colSpan={colspan}>
                    <div style={{margin:'auto',width:'100px'}}>
                        <img style={{float:'left',width:'30px',marginRight:'10px'}} src={IMG_PATH+'/img/loading.gif'} width='30'/>
                        <div style={{float:'left',width:'52px',fontSize:'14px;',color:'#999999'}}>加载中...</div>
                    </div>
                </td>
            </tr>
            </tbody>
        )
    }
}
module.exports = TbodyLoading;
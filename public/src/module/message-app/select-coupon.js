/**
 * Created by AnThen on 2016/12/14.
 * 短信平台-选择优惠券
 */
/********集成模块********/
/****table loading****/
import TbodyLoading from 'module/table-common/table-loading';
/****table 暂无数据****/
import TbodyFalse from 'module/table-common/table-false';

/****短信模板表格****/
class SmsCouponTbodyTrue extends React.Component{
    windowCloseTd(target,id,name,price,stock){
        let param = {target:target,id:id,name:name,price:price,stock:stock};
        this.props.windowClose(param);
    }
    render() {
        return (
            <tbody className="uat-configurationmaterial-tbody">
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td className="first uat-configurationmaterial-td">{m.id}</td>
                        <td className="templet uat-configurationmaterial-td" width='20'>{m.name}</td>
                        <td className="uat-configurationmaterial-td">{m.price}</td>
                        <td className="uat-configurationmaterial-td">{m.stock}</td>
                        <td><span className="operation" onClick={this.windowCloseTd.bind(this,m.target,m.id,m.name,m.price,m.stock)}>选择</span></td>
                    </tr>
                )
            })}
            </tbody>
        )
    }
}
/****选择优惠券模板****/
class SmsCoupon extends React.Component{
    windowClose(param){
        this.props.updateMaterial(param);
        this.props.run.close();
    }
    formatTbodyData(total,data){
        let tbodyData=[];
        for(let i=0; i<total; i++){
            tbodyData[i] = {
                target: this.props.name,
                id: data[i].id,
                name: data[i].title,
                price: data[i].amount,
                stock: data[i].stock_total
            };
        }
        this.setState({
            tbodyModule:<SmsCouponTbodyTrue data={tbodyData} windowClose={this.windowClose}/>
        });
    }
    fetch(indexNum,sizeNum,searchText,channelType){
        //mkt.material.coupon.list
        //coupon-list.json
        let that = this;
        let total=0,total_count=0,thisData=[];
        let filter_overdue=(this.props&&this.props.filter_overdue)?true:false;
        util.api({
            data: {
                method: 'mkt.material.coupon.list',
                channel_code:channelType,
                coupon_status:'unused',
                keyword:searchText,
                index:indexNum,
                size:sizeNum,
                filter_overdue
            },
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={5}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); total_count = parseInt(res.total_count); thisData = res.data;
                    if(total>0){
                        that.formatTbodyData(total,thisData);
                        that.setState({totalCount:total_count});
                    }else{
                        that.setState({tbodyModule:<TbodyFalse colspan={5}/>});
                    }
                }else{
                    that.setState({tbodyModule:<TbodyFalse colspan={5}/>});
                }
                $('.pagination-wrap').pagination('updateItems', total_count);
            },
            error: function () {
                that.setState({tbodyModule:<TbodyFalse colspan={5}/>});
            }
        });
    }
    searchTbodyKeyUp(e){
        let thisName = this.props.name;
        let searchInput = "#modale"+thisName+"SearchText";
        let searchText = $(searchInput).val().trim();
        let sizeNum = this.state.size;
        let tabType = this.state.tabType;
        if(e.keyCode == 13){
            this.setState({index:1,search:searchText});
            this.fetch(1,sizeNum,searchText,tabType);
            this.setPagination();
        }
    }
    searchTbodyClick(){
        let thisName = this.props.name;
        let searchInput = "#modale"+thisName+"SearchText";
        let searchText = $(searchInput).val().trim();
        let sizeNum = this.state.size;
        let tabType = this.state.tabType;
        this.setState({index:1,search:searchText});
        this.fetch(1,sizeNum,searchText,tabType);
        this.setPagination();
    }
    tagChange(type,e){
        let thisName = this.props.name;
        let searchInput = "#modale"+thisName+"SearchText";
        let thisTab = $(e.currentTarget);
        let thisParents = thisTab.parents('.tag-box');
        let thisSize=this.state.size;
        thisParents.children('.tag').removeClass('active');
        thisTab.addClass('active');
        $(searchInput).val('');
        this.setState({index:1,search:''});
        this.fetch(1,thisSize,'',type);
        this.setPagination();
    }
    setPagination(){
        let that = this;
        let thisSize=this.state.size,search,tabType;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    search = that.state.search;
                    tabType = that.state.tabType;
                    that.setState({index:pageNumber});
                    that.fetch(pageNumber,thisSize,search,tabType);
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            index: 1, size: 6, search: '',
            tabType:'sms',
            tab:[{type:'sms',name:'短信渠道',count:0,active:' active'}],
            totalCount:0,
            tbodyModule: <TbodyFalse colspan={5}/>
        };
        this.windowClose = this.windowClose.bind(this);
    }
    componentDidMount(){
        this.fetch(1,6,'','sms');
        this.setPagination();
    }
    render(){
        let name = this.props.name;
        let id = 'modale'+name+'SearchText';
        let placeholder = '请输入'+name+'关键字';
        return(
            <div className="modals-smsTemplate-html">
                <div className="subHead">
                    <a className="create-a" href={BASE_PATH+'/html/coupon/list.html'}>＋创建{name}</a>
                    <div className="find-box">
                        <input className="input" id={id} placeholder={placeholder} onKeyUp={this.searchTbodyKeyUp.bind(this)}/>
                        <div className="icon iconfont" onClick={this.searchTbodyClick.bind(this)}>&#xe668;</div>
                    </div>
                </div>
                <div className="tag-area">
                    <div className="tag-box">
                        {this.state.tab.map((m,i)=> {
                            return (
                                <div className={"tag"+m.active} onClick={this.tagChange.bind(this,m.type)}>{m.name}（{m.count}）</div>
                            )
                        })}
                    </div>
                </div>
                <div className="table-area">
                    <table className="page-table-box uat-configurationmaterial-table">
                        <thead>
                        <tr>
                            <th className="first">ID</th>
                            <th>名称</th>
                            <th>金额</th>
                            <th>库存</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        {this.state.tbodyModule}
                    </table>
                    <div className="pagination-wrap pagination"></div>
                </div>
            </div>
        )
    }
}
module.exports = SmsCoupon;
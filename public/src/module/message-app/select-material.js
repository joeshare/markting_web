/**
 * Created by AnThen on 2016/11/15.
 * 短信平台-选择模板
 */

/********集成模块********/
/****table loading****/
import TbodyLoading from 'module/table-common/table-loading';
/****table 暂无数据****/
import TbodyFalse from 'module/table-common/table-false';

/****短信模板表格****/
class SelectMateriaTbodyTrue extends React.Component{
    windowCloseTd(templateContent,id,signId,signContent,materialName,smsType,stockTotal){
        this.props.windowClose(templateContent,id,signId,signContent,materialName,smsType,stockTotal);
    }
    render() {
        return (
            <tbody>
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td className="first">{m.id}</td>
                        <td className="single-text">{m.materialName}</td>
                        <td className="single-text">{m.templateName}</td>
                        <td>{m.smsType}</td>
                        <td><span className="operation" onClick={this.windowCloseTd.bind(this,m.templateContent,m.id,m.signId,m.signContent,m.materialName,m.sms_type,m.materiel_stock_total)}>导入</span></td>
                    </tr>
                )
            })}
            </tbody>
        )
    }
}
/****选择短信模板****/
class SmsMateria extends React.Component{
    windowClose(templateContent,id,signId,signContent,materialName,smsType,stockTotal){
        this.props.updateMsg(templateContent,id,signId,signContent,materialName,smsType,stockTotal);
        this.props.run.close();
    }
    searchTbodyKeyUp(e){
        let searchText = $('#modaleSearchText').val().trim();
        let indexNum = this.state.index,sizeNum = this.state.size;
        let smsType = this.state.tabType;
        if(e.keyCode == 13){
            this.setState({search:searchText});
            this.fetch(indexNum,sizeNum,searchText,smsType);
            this.setPagination();
        }
    }
    searchTbodyClick(){
        let searchText = $('#modaleSearchText').val().trim();
        let indexNum = this.state.index,sizeNum = this.state.size;
        let smsType = this.state.tabType;
        this.setState({search:searchText});
        this.fetch(indexNum,sizeNum,searchText,smsType);
        this.setPagination();
    }
    tagChange(type){
        let thisSize=this.state.size;
        let tabsCount = this.state.tabsCount;
        let smsType = '';

        for(let i=0; i<tabsCount.length; i++){
            tabsCount[i].className = '';
        }
        switch (type){
            case 'aptotic':
                smsType = 0;
                tabsCount[0].className = ' active';
                break;
            case 'varied':
                smsType = 1;
                tabsCount[1].className = ' active';
                break;
            case 'all':
                smsType = -1;
                tabsCount[2].className = ' active';
                break;
        }
        $('#modaleSearchText').val('');
        this.setState({tabType:smsType,search:'',tabsCount:tabsCount});
        this.fetch(1,thisSize,'',smsType);
        this.setPagination();
    }
    fetchTabsCount(){
        let that = this,channelType = this.props.channelType;
        let thisData,fixed,variable,all;

        util.api({
            data: {
                method: 'mkt.sms.smsmaterial.count.get',
                channel_type: channelType
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<thisData.length; i++){
                        if(thisData[i].sms_type == 0){fixed = parseInt(thisData[i].sms_count)}
                        if(thisData[i].sms_type == 1){variable = parseInt(thisData[i].sms_count)}
                    }
                    all = fixed + variable;
                    that.setState({
                        tabsCount:[
                            {className:'',count:fixed},
                            {className:'',count:variable},
                            {className:' active',count:all}
                        ]
                    });
                }
            }
        });
    }
    formatTbodyData(total,data){
        let sms_type,tbodyData=[];
        for(let i=0; i<total; i++){
            switch (data[i].sms_type){
                case 0:
                    sms_type = "固定类型";
                    break;
                case 1:
                    sms_type = "变量类型";
                    break;
            }
            tbodyData[i] = {
                id: data[i].id,
                materialId: data[i].material_id,
                materialName: data[i].material_name,
                signId: data[i].sms_sign_id,
                signContent: data[i].sms_sign_content,
                templateId: data[i].sms_template_id,
                templateName: data[i].sms_template_name,
                templateContent: data[i].sms_template_content,
                smsType:sms_type,
                sms_type:data[i].sms_type,
                materiel_stock_total:data[i].materiel_stock_total
            };
        }
        this.setState({
            tbodyModule:<SelectMateriaTbodyTrue data={tbodyData} windowClose={this.windowClose}/>
        });
    }
    /*
     0:营销短信,1:服务通知,2：短信验证码
     */
    fetch(indexNum,sizeNum,searchText,mouldType){
        let that = this,channelType = this.props.channelType;
        let total=0,total_count=0,thisData=[];
        util.api({
            data: {
                method:'mkt.sms.smsmaterial.getlist',
                index:indexNum,
                page_size:sizeNum,
                search_word:searchText,
                channel_type:channelType,
                sms_type:mouldType
            },
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={5}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); total_count = parseInt(res.total_count); thisData = res.data;
                    if(total>0){
                        that.formatTbodyData(total,thisData);
                    }else{
                        that.setState({tbodyModule:<TbodyFalse colspan={5}/>});
                    }
                }else{
                    total_count = 0;
                    that.setState({tbodyModule:<TbodyFalse colspan={5}/>});
                }
                $('.pagination-wrap').pagination('updateItems', total_count);
            },
            error: function(){
                that.setState({tbodyModule:<TbodyFalse colspan={5}/>});
            }
        });
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
            tabType:-1,
            tabsCount:[
                {className:'',count:0},
                {className:'',count:0},
                {className:' active',count:0}
            ],
            tbodyModule: <TbodyFalse colspan={5}/>
        };
        this.windowClose = this.windowClose.bind(this);
    }
    componentDidMount(){
        this.fetchTabsCount();
        this.fetch(1,6,'',-1);
        this.setPagination();
    }
    render(){
        return(
            <div className="modals-smsTemplate-html">
                <div className="subHead">
                    <a className="create-a" href={BASE_PATH+'/html/message-app/message-material.html'}>＋创建素材</a>
                    <div className="find-box">
                        <input className="input" id="modaleSearchText" onKeyUp={this.searchTbodyKeyUp.bind(this)}/>
                        <div className="icon iconfont" onClick={this.searchTbodyClick.bind(this)}>&#xe668;</div>
                    </div>
                </div>
                <div className="tag-area">
                    <div className="tag-box">
                        <div className={"tag"+this.state.tabsCount[0].className} onClick={this.tagChange.bind(this,'aptotic')}>固定模板（{this.state.tabsCount[0].count}）</div>
                        <div className={"tag"+this.state.tabsCount[1].className} onClick={this.tagChange.bind(this,'varied')}>变量模板（{this.state.tabsCount[1].count}）</div>
                        <div className={"tag"+this.state.tabsCount[2].className} onClick={this.tagChange.bind(this,'all')}>全部（{this.state.tabsCount[2].count}）</div>
                    </div>
                </div>
                <div className="table-area">
                    <table className="page-table-box">
                        <thead>
                        <tr>
                            <th className="first">ID</th>
                            <th>素材名称</th>
                            <th>已选模板</th>
                            <th>模板类型</th>
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
module.exports = SmsMateria;
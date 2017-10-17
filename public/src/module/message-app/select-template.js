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
class SelectTemplateTbodyTrue extends React.Component{
    windowCloseTd(id,templet,type){
        let that = this;
        let thisData = [];
        let materialList = [],materialType,materialTypeText;
        let variable_list = [],variableList = [];
        let thisMaterial = {};

        if(type == 1){
            util.api({
                data: {
                    method:'mkt.sms.smstemplet.id.get',
                    id:id
                },
                success: function (res) {
                    if(res.code == 0){
                        thisData = res.data[0];
                        variable_list = thisData.material_list;
                        for(let i=0; i<variable_list.length; i++){
                            materialTypeText = variable_list[i].material_name;
                            switch (materialTypeText){
                                case '优惠券':
                                    materialType = 0;
                                    break;
                            }
                            materialList[i] = materialTypeText;
                            variableList[i] = {
                                variable_name:variable_list[i].sms_variable_value,
                                variable_value:variable_list[i].material_property_name,
                                variable_type:materialType
                            };
                        }
                        thisMaterial = {actType: 'update',material:materialList,variable:variableList};
                        that.props.windowClose(id,templet,thisMaterial);
                    }
                }
            });
        }else{
            thisMaterial = {actType: 'remove'};
            this.props.windowClose(id,templet,thisMaterial);
        }
    }
    render() {
        return (
            <tbody>
            {this.props.data.map((m,i)=> {
                return (
                    <tr>
                        <td className="first">{m.id}</td>
                        <td className="templet" width='20'>{m.templet}</td>
                        <td>{m.templetType}</td>
                        <td><span className="operation" onClick={this.windowCloseTd.bind(this,m.id,m.templet,m.type,m.material)}>导入</span></td>
                    </tr>
                )
            })}
            </tbody>
        )
    }
}
/****选择短信模板****/
class SmsTemplate extends React.Component{
    windowClose(id,templet,material){
        this.props.updateMsg(id,templet,material);
        this.props.run.close();
    }
    formatTbodyData(total,data){
        let templetType,variable = [],tbodyData=[];
        for(let i=0; i<total; i++){
            switch (parseInt(data[i].channelType)){
                case 0:
                    templetType = "营销短信";
                    break;
                case 1:
                    templetType = "服务通知";
                    break;
                case 2:
                    templetType = "短信验证码";
                    break;
            }
            //if(data[i].type == 1){material = ['优惠券']}
            tbodyData[i] = {
                id: data[i].id,
                templet: data[i].content,
                templetType: templetType,
                type:data[i].type
            };
        }
        this.setState({
            tbodyModule:<SelectTemplateTbodyTrue data={tbodyData} windowClose={this.windowClose}/>
        });
    }
    /*
     0:营销短信,1:服务通知,2：短信验证码
     */
    fetch(indexNum,sizeNum,searchText,tabType){
        let that = this;
        let total=0,total_count=0,thisData=[];
        util.api({
            data: {
                method:'mkt.sms.smstemplet.list.get',
                index:indexNum,
                size:sizeNum,
                name:searchText,
                type:tabType
            },
            beforeSend: function () {
                that.setState({tbodyModule:<TbodyLoading colspan={4}/>});
            },
            success: function (res) {
                if(res.code == 0){
                    total = parseInt(res.total); total_count = parseInt(res.total_count); thisData = res.data;
                    if(total>0){
                        that.formatTbodyData(total,thisData);
                        that.setState({totalCount:total_count});
                    }else{
                        that.setState({tbodyModule:<TbodyFalse colspan={4}/>});
                    }
                }else{
                    that.setState({tbodyModule:<TbodyFalse colspan={4}/>});
                }
                $('.pagination-wrap').pagination('updateItems', total_count);
            },
            error: function () {
                that.setState({tbodyModule:<TbodyFalse colspan={4}/>});
            }
        });
    }
    fetchTabsSecondNum(channelType){
        let that = this;
        let thisData,fixed,variable,all;

        util.api({
            data: {
                method: 'mkt.sms.smstemplet.count.get',
                channel_type: channelType
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data[0];
                    fixed = thisData.fixed;
                    variable = thisData.variable;
                    all = parseInt(fixed) + parseInt(variable);
                    that.setState({tagCount:{aptotic:fixed,varied:variable,total:all}});
                }
            }
        });
    }
    searchTbodyKeyUp(e){
        let searchText = $('#modaleSmsTemplateSearchText').val().trim();
        let indexNum = this.state.index,sizeNum = this.state.size;
        let smsType = this.state.smsType;
        if(e.keyCode == 13){
            this.setState({index:1,search:searchText});
            this.fetch(indexNum,sizeNum,searchText,smsType);
            this.setPagination();
        }
    }
    searchTbodyClick(){
        let searchText = $('#modaleSmsTemplateSearchText').val().trim();
        let indexNum = this.state.index,sizeNum = this.state.size;
        let smsType = this.state.smsType;
        this.setState({index:1,search:searchText});
        this.fetch(indexNum,sizeNum,searchText,smsType);
        this.setPagination();
    }
    tagChange(type,e){
        let thisTab = $(e.currentTarget);
        let thisParents = thisTab.parents('.tag-box');
        let thisSize=this.state.size;
        let smsType = '';

        $('#modaleSmsTemplateSearchText').val('');
        thisParents.children('.tag').removeClass('active');
        thisTab.addClass('active');
        switch (type){
            case 'aptotic':
                smsType = 0;
                break;
            case 'varied':
                smsType = 1;
                break;
            case 'total':
                smsType = -1;
                break;
        }
        this.setState({smsType:smsType,search:''});
        this.fetch(1,thisSize,'',smsType);
        this.setPagination();
    }
    setPagination(){
        let that = this;
        let thisSize=this.state.size,search,smsType;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    search = that.state.search;
                    smsType = that.state.smsType;
                    that.setState({index:pageNumber});
                    that.fetch(pageNumber,thisSize,search,smsType);
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            index: 1, size: 6, search: '',
            smsType:-1,
            tagCount:{aptotic:0,varied:0,total:0},
            totalCount:0,
            tbodyModule: <TbodyFalse colspan={4}/>
        };
        this.windowClose = this.windowClose.bind(this);
    }
    componentDidMount(){
        this.fetchTabsSecondNum(-1);
        this.fetch(1,6,'',-1);
        this.setPagination();
    }
    render(){
        return(
            <div className="modals-smsTemplate-html">
                <div className="subHead">
                    <a className="create-a" href={BASE_PATH+'/html/message-app/message-mould.html'}>＋创建模板</a>
                    <div className="find-box">
                        <input className="input" id="modaleSmsTemplateSearchText" placeholder="请输入模板关键字" onKeyUp={this.searchTbodyKeyUp.bind(this)}/>
                        <div className="icon iconfont" onClick={this.searchTbodyClick.bind(this)}>&#xe668;</div>
                    </div>
                </div>
                <div className="tag-area">
                    <div className="tag-box">
                        <div className="tag" onClick={this.tagChange.bind(this,'aptotic')}>固定模板（{this.state.tagCount.aptotic}）</div>
                        <div className="tag" onClick={this.tagChange.bind(this,'varied')}>变量模板（{this.state.tagCount.varied}）</div>
                        <div className="tag active" onClick={this.tagChange.bind(this,'total')}>全部（{this.state.tagCount.total}）</div>
                    </div>
                </div>
                <div className="table-area">
                    <table className="page-table-box">
                        <thead>
                        <tr>
                            <th className="first">ID</th>
                            <th>模板内容</th>
                            <th>模板通道</th>
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
module.exports = SmsTemplate;
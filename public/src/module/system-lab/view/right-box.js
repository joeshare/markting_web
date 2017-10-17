/*分页插件*/
let pagination = require('plugins/pagination')($);
let TabValue = require('../utils/tab-value');
let Modals = require('component/modals.js');
import TbodyLoading from '../../table-common/table-loading';
class Panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            size:10,
            index:1,
            lab_value_list:[],
            tag_id:'',
            tag_desc:'',
            tag_name:'',
            tag_type:2
        };
    }
    componentDidMount(){
        this.setPagination();
    }
    onTabValue(params){
        $(".btn-content").find(".accept").removeClass("disable");

        $('.content').removeAttr('style');
        if(this.state.tag_type==1){
            let _this = this;
            this.CreateViewModals = new Modals.Window({
                width:600,
                title: "自定义标签值",
                content: '<div class="con-body"/>',
                buttons: [
                    {
                        text: '确定',
                        cls: 'accept',
                        handler: function (self) {
                            let listarray =  self.tabValue.state.valuelist;

                            if(self.tabValue.state.active)
                            {
                                util.api({
                                    url: "?method=mkt.system.tag.value.update",
                                    type: 'post',
                                    data: {
                                        "tagId":_this.state.tag_id,
                                        "elements":listarray
                                    },
                                    success: function (res) {
                                        if(res.code==0) {
                                            _this.onLab_click({tag_id: _this.state.tag_id});
                                            self.close();
                                        }
                                        else {
                                            new Modals.Alert("保存失败!");
                                            self.close();
                                        }
                                    }
                                });
                            }

                        }
                    },
                    {
                        text: '取消',
                        cls: 'decline',
                        handler: function (self) {
                            self.close();
                        }
                    }
                ],
                listeners: {
                    beforeRender: function () {
                        this.tabValue=  ReactDOM.render(
                            <TabValue />,
                            $('.con-body', this.$el)[0]
                        );
                    }
                }
            })
        }
    }

    onLab_click(params){
        let _this= this;

        _this.setState({
            tag_type:2
        });

        //获取标签值
        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.value.list.get",
                tag_id:params.tag_id,
                index:1,
                size:10
            },
            beforeSend: function () {
            $('#loading').show();
            $('#tbody-box').hide();
            },
            success: function (res) {
                if(res.code==0) {
                    $('#loading').hide();
                    $('#tbody-box').show();
                    if (res.data.length > 0) {
                        _this.setState({
                            lab_value_list: res.data[1],
                            tag_id: params.tag_id,
                            tag_name: res.data[0].tag_name,
                            tag_desc: res.data[0].tag_desc,
                            tag_type: res.data[0].update_flag,
                            index: 1
                        });
                        $('.pagination-wrap').pagination('updateItems', res.total_count);
                    }
                }
            }
        });
        this.setPagination();
    }

    //实例化分页插件
    setPagination() {
        var that = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: this.state.size,//最多显示页数
                onPageClick: function (pageNumber, event) {
                    that.postList({
                        index: pageNumber
                    });
                }
            });
        }
    }

    //获取列表数据
    postList(opts) {
        let that = this;
        let defOpts = _.extend(this.state, opts || {});

        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.value.list.get",
                tag_id:this.state.tag_id,
                size: defOpts.size,
                index: defOpts.index,
            },
            success: function (res) {
                if(res.code==0){
                    that.setState({
                        lab_value_list: res.data[1],
                        index:defOpts.index
                    });
                    $('.pagination-wrap').pagination('updateItems', res.total_count);
                }

            }
        });
    }

    thousandbit(num) {
        return num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
    }


    render(){
        return (
            <div className="right-box">
                <div className="right-lab-content">
                    <div className="right-title">
                        <div className="title-f">标签值列表</div>
                        <div className="title-s">{this.state.tag_name}</div>
                    </div>
                    <div className="right-edit">
                        <div className="discript">{this.state.tag_desc}</div>
                        <div className="button"><div className={this.state.tag_type==0?"button-main-2 button-dece":this.state.tag_type==1?"button-main-2 button-show":"button-main-2 button-hide"} onClick={this.onTabValue.bind(this)}>编辑标签值</div></div>
                    </div>
                    <div className="right-list">
                        <table className="tabel-until uat-labelsystem-table">
                            <thead>
                            <tr>
                                <th className="tit-text-l">
                                    <span>序号</span>
                                </th>
                                <th className="tit-text-c">
                                    <span>标签值</span>
                                </th>
                                <th className="tit-text-r">
                                    <span>覆盖人数</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody id="tbody-box uat-labelsystem-tbody">
                                {this.state.lab_value_list.map((m,i)=>{
                                    return(
                                        <tr>
                                            <td className="tit-text-l uat-labelsystem-td">{(this.state.index-1)*this.state.size+i+1}</td>
                                            <td className="smsconttd tit-text-c uat-labelsystem-td"> {m.tag_value}</td>
                                            <td className="tit-text-r uat-labelsystem-td">{this.thousandbit(m.value_count)}人</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <TbodyLoading  colspan={3}/>
                        </table>
                        <div className="pagination-wrap pagination"></div>
                    </div>
                </div>
                <div className="right-lab-empty">
                    <div className="empty-top">
                        <img src="/img/system-lab/labdefault.png"/>
                    </div>
                    <div className="empty-bot">
                        全部标签————MC系统内所有内置的标签
                    </div>
                    <div className="empty-botf">
                        标签是使用数据的一种方式，通过标签您可以
                    </div>
                    <div className="empty-bots">
                        ▪更精准地细分人群 &nbsp; ▪更清晰地了解用户 &nbsp; ▪更便捷地与用户互动
                    </div>
                </div>
            </div>
        )
    }
}
module.exports = Panel;
'use strict';
let Header= require('./header.js');
let List= require('./list.js');
let Searcher= require('./search.js');
let Pager= require('./pager.js');
let pagination = require('plugins/pagination')($);//分页插件
let Modals = require('component/modals.js');
let fieldSDataFormatter = require('../../contact-create/utils/fieldSDataFormatter');//分页插件
let pageSize = 12;//分页插件
const API={
    queryList:'?method=mkt.contact.list.get',
    copyCard:'?method=mkt.contact.list.duplicate ',
    queryFields:'?method=mkt.contact.keylist.get',
    delCard:'?method=mkt.contact.list.del'
};
function successMsg(msg){
    Materialize.toast(msg||"保存成功！", 3000)
}
function errorAlertMsg(msg) {
    new Modals.Alert(msg||"数据获取失败！");
}
class Panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            contactId:"",
            fields:"",
            header:{},
            stateClone:null,
            data:[],
            style:{
                list:{
                    width:0,
                    height:0
                }
            }
        };
        this.params = {};
        let _this=this;
        this.loadList = this.loadList.bind(this);
        this.delCard = this.delCard.bind(this);
        this.copyCard = this.copyCard.bind(this);
        this.page2Preview = this.page2Preview.bind(this);
        this.page2Feedback = this.page2Feedback.bind(this);
        this.page2Edit = this.page2Edit.bind(this);

    }
    setQueryParams(arg){
      $.extend(true,this.params,arg);
    }
    getQueryParams(){
       return this.params;
    }
    loadList(arg){
        let _this=this;
        let params=this.getQueryParams();
        let data=$.extend(true,params,arg);
        this.setQueryParams(data);
        // console.info(data)
        util.api({
            url:API.queryList,
            data:data,
            success:function(res){
                if(res&&!res.code){
                   if(!res.data.length&&data.index>1){
                         _this.loadList({
                             index:1
                         })
                         _this.setPagination();
                   }else{
                       $('.pagination-wrap').pagination('updateItems', res.total_count);
                       _this.setState({
                           data:res.data
                       })
                   }

               }
            },
            error:function(res){

            }
        })
        /**
         * contact_id	int	Y	联系人表单编号
         contact_name
         string
         Y
         联系人表单名称
         qrcode_url	string	Y	二维码URL
         qrcode_pic	string	Y	二维码图片URL
         user_count	int	Y	收集到的人数
         contact_status	int	Y	联系人表单状态
         */
        //_this.setState({
        //    data:(function(){
        //        let arr=[];
        //        for(let i=0;i<12;i++){
        //            arr.push({
        //                name:util.uuid()+"",
        //                id:util.uuid()+"",
        //                status:Math.round(Math.random()*3),
        //                count:Math.random()*100000
        //            })
        //        }
        //        return arr
        //    })()
        //})
    }
    delCard(id){
        let _this=this;
        util.api({
            url:API.delCard,
            type:'post',
            data:{
                contact_id:id
            },
            success:function(res){
               if(!res.code){
                   _this.loadList();
                   successMsg("删除成功！")
               }else{
                   errorAlertMsg("操作失败！")
               }
            },
            error:function(res){
                errorAlertMsg("网络问题请联系！");
            }
        })

    }
    copyCard(id){
        let _this=this;
        util.api({
            url:API.copyCard,
            type:'post',
            data:{
                contact_id:id
            },
            success:function(res){
                if(!res.code){
                    _this.loadList();
                    successMsg("复制成功！")
                }else{
                    errorAlertMsg("操作失败！")
                }
            },
            error:function(res){
                errorAlertMsg("网络问题请联系！");
            }
        })

    }
    setPagination(){
        var _this = this;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//条数
                itemsOnPage: pageSize,//最多显示页数
                onPageClick: function (pageNumber, event) {
                    _this.loadList({
                        index:pageNumber
                    })
                }
            });
        }
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
        this.setState({
            style:{
                list:{
                    width:$(window).width()-$('#page-left').width(),
                    height:$(window).height()-$('#header').height()
                }
            }
        })
        let _this=this;
        util.onResize(function(){
            _this.resize();
        })
        this.setPagination();
        // console.log("-------------")
        this.loadList({
            contact_status:3,
            index:1,
            size:pageSize,
            contact_name:''
        });
        document.onkeydown = function (e) {
            e = e || window.event;
            if ((e.keyCode || e.which) == 13) {
                //addTag();
            }
        }
    }
    getSelectedFields(data){
        let arr=[];
        data.forEach((f,i)=>{
            if(f.selected){
                arr.push(f)
            }
        })
        return arr;
    }
    storagePreviewData(res){
        let _this=this;
        fieldSDataFormatter.transformPreview(res.data)
        localStorage.setItem("previewData",JSON.stringify({
            field_list:_this.getSelectedFields(res.data),
            contact_name:res.contact_name,
            contact_title:res.contact_title,
            contact_descript:res.contact_descript,
            contact_status:res.contact_status
        }));

    }
    queryContactById(arg){//1472114019
        let _this=this;
        util.api({
            url:API.queryFields,
            data:arg,
            success:function(res){
                if(!res.code){
                    _this.storagePreviewData(res)
                    var w=window.open();
                    setTimeout(function(){
                        w.location=BASE_PATH+'/html/asset/contactform-preview.html?key=previewData';
                    }, 100);
                    //window.open(BASE_PATH+'/html/asset/contactform-preview.html?key=previewData');
                }

            },
            error:function(res){

            }
        })
    }
    page2Edit(id){
        window.location.href=BASE_PATH+"/html/asset/contact-create.html?contact_id="+id+"&returnurl=html/asset/contact.html";
    }
    page2Preview(id){
        this.queryContactById({contact_id:id});

    }
    page2Feedback(id,name){
        window.location.href=BASE_PATH+"/html/linkman-form/linkman.html?contact_id="+id+"&returnurl=html/asset/contact.html&contact_name="+name;

    }
    resize(){
        this.setState({
            style:{
                list:{
                    width:$(window).width()-$('#page-left').width(),
                    height:$(window).height()-$('#header').height()
                }
            }
        })
    }
    render(){
        console.info(this.state);
        return ( 

            <div className="asset-contact">
             <Header />
             <Searcher loadList={this.loadList}/>
             <List data={this.state.data}
                 delCard={this.delCard}
                 copyCard={this.copyCard}
                 page2Preview={this.page2Preview}
                 page2Feedback={this.page2Feedback}
                 page2Edit={this.page2Edit}
             />
             <Pager />
             <div id="dropdown-box"></div>
            </div>
        )

    }
}
module.exports = Panel;
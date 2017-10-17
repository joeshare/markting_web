/**
 * Created by AnThen on 2016-9-9.
 * 微信资产 es6+react版
 */
'use strict';//严格模式

/*构造页面*/
import Layout from 'module/layout/layout';

/*先创建布局*/
const layout = new Layout({
    index: 2,
    leftMenuCurName:'微信素材'
});

/********插件********/
let pagination = require('plugins/pagination')($);//分页插件
/********编写页面模块********/
/****二级头部****/
class SubHead extends React.Component{
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">微信素材</span>
                    <span className="text">
                        微信图文<span className="variable">{this.props.listNum}</span>个
                    </span>
                </div>
            </header>
        )
    }
}
/****左侧****/
class CompanyLoading extends React.Component{
    render(){
        return(
            <div className="tags-box-null">
                <img src='../../img/loading.gif' width='40'/>
            </div>
        )
    }
}
class CompanyFalse extends React.Component{
    render(){
        return(
            <div className="tags-box-null">暂无数据</div>
        )
    }
}
/****右侧****/
/*搜索框*/
class Search extends React.Component {
    searchList(){
        let searchValue = $('#search-input').val();
        this.props.resetList(searchValue,'search');
    }
    searchInputList(event){
        if(event.keyCode == 13){
            let searchValue = $('#search-input').val();
            this.props.resetList(searchValue,'search');
        }
    }
    render() {
        return (
            <div className="search-box">
                <input id="search-input" className="input" type="text" placeholder="标题/作者/摘要" onKeyUp={this.searchInputList.bind(this)}/>
                <div className="icon iconfont" onClick={this.searchList.bind(this)}>&#xe668;</div>
            </div>
        )
    }
}
class ListFalse extends React.Component{
    render(){
        return(
            <div className="list-null">暂无数据</div>
        )
    }
}
class ListLoading extends React.Component{
    render(){
        return(
            <div className="list-null">
                <img src='../../img/loading.gif' width='40'/>
            </div>
        )
    }
}
class ListTrue extends React.Component{
    render(){
        let list = this.props.list;
        return(
            <div className="list-box">
                {list.map((m,i)=> {
                    return (
                        <div className="list-li">
                            <div className="list-pic"><img src={m.imgUrl}/></div>
                            <div className="list-conbox">
                                <ListTitle titleList={m.titleList} content={m.content}/>
                                <div className="list-date">{m.date}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
/*列表*/
class ListTitle extends React.Component{
    render() {
        let titleData = this.props.titleList;
        let titleLength = titleData.length;
        let content = this.props.content;
        if(titleLength>1){
            return (
                <div className="list-con">
                    {titleData.map((m,i)=> {
                        return (
                        <div className="title-box">
                            <div className="title">{m.titleText}</div>
                            <nobr className="author">by&nbsp;{m.author}</nobr>
                        </div>
                        )
                    })}
                </div>
            )
        }else{
            return (
                <div className="list-con">
                    <div className="title-box">
                        <div className="title">{titleData[0].titleText}</div>
                        <nobr className="author">by&nbsp;{titleData[0].author}</nobr>
                    </div>
                    <div className="textarea">{content}</div>
                </div>
            )
        }
    }
}
/********组织页面模块********/
class Manage extends React.Component {
    fetchCompany(){
        let that = this;
        let company = [],companyActive = {};
        let thisData,total;
        let active,thisLogoUrl = IMG_PATH+"/img/asset/default-company-logo.png";
        util.api({
            data: {method: 'mkt.asset.wechat.register.list.get'},
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    total = thisData.length;
                    for(let i=0; i<total; i++){
                        if(i==0){
                            active=' active';
                            companyActive={id:thisData[i].wxAcct,name:thisData[i].assetName};
                        }else{active=''}
                        company[i] = {
                            id:thisData[i].wxAcct,
                            logoUrl:thisData[i].imgfileUrl || thisLogoUrl,
                            name:thisData[i].assetName,
                            active:active
                        };
                    }
                    that.setState({company:company,companyActive:companyActive});
                    that.fetchList(companyActive.id,1,'',1,7);
                }
            }
        });
    }
    changeCompany(id){
        let fdata = this.state.company;
        let companyActive = {};
        fdata.map(m=> {
            if (m.id === id) {
                m.active = ' active';
                companyActive = {id:id,name:m.name};
            }else{
                m.active = '';
            }
        });
        this.resetList(companyActive.id,'company');
        this.setState({
            company:fdata,companyActive:companyActive,
            tagActive:{id:this.state.tag[0].id,name:this.state.tag[0].name},
            searchText:''
        });
    }
    resetList(prarm,type){
        let companyParam,typeParam,searchTextParam,indexParam,sizeParam;
        sizeParam = this.state.size;
        switch (type){
            case 'company':
                companyParam = prarm;
                typeParam = this.state.tag[0].id;
                searchTextParam = '';
                indexParam = 1;
                break;
            case 'search':
                companyParam = this.state.companyActive.id;
                typeParam = this.state.tagActive.id;
                searchTextParam = prarm;
                indexParam = 1;
                this.setState({searchText:prarm});
                break;
            case 'page':
                companyParam = this.state.companyActive.id;
                typeParam = this.state.tagActive.id;
                searchTextParam = this.state.searchText;
                indexParam = prarm;
                this.setState({index:prarm});
                break;
        }
        this.fetchList(companyParam,typeParam,searchTextParam,indexParam,sizeParam);
    }
    fetchList(company,type,searchText,index,size){
        /*初始化参数*/
        let that = this;
        let companyParam,typeParam,searchTextParam;
        let list = [],contentText = '',thisImgUrl = '',defaultImgUrl = IMG_PATH+"/img/asset/default-list-img.png";
        let thisData,total,total_count,titleData,titleTotal,imgUrl,titleListData=[];
        let listModule = <ListFalse />;
        /*代码*/
        companyParam = company || this.state.companyActive.id;
        typeParam = type || this.state.tagActive.id;
        searchTextParam = searchText || this.state.searchText;
        util.api({
            data: {
                method: 'mkt.asset.register.imgtext.get',
                type: 0,
                pub_id: companyParam,
                wx_type: typeParam,
                search_key: searchTextParam,
                index: index,
                size: size
            },
            beforeSend: function () {
                that.setState({listModule:<ListLoading />});
            },
            success: function (res) {
                if(res.code == 0){
                    total = res.total;
                    total_count = res.total_count;
                    thisData = res.data;
                    for(let i=0; i<total; i++) {
                        titleData = thisData[i].content;
                        titleTotal = titleData.length;
                        for(let j=0; j<titleTotal; j++){
                            if(j == 0){
                                if(titleData[j].imgfileName){
                                    imgUrl = FILE_PATH+titleData[j].imgfileName;
                                }else{
                                    imgUrl = defaultImgUrl;
                                }
                                contentText = titleData[j].digest;
                                thisImgUrl = imgUrl;
                            }
                            titleListData[j]={
                                titleText:titleData[j].name,
                                author:titleData[j].ownerName
                            };

                        }
                        list[i] = {
                            imgUrl:thisImgUrl,
                            titleList:titleListData,
                            content:contentText,
                            date:thisData[i].create_time
                        };
                        titleListData=[];
                    }
                    if(total > 0){listModule = <ListTrue list={list}/>}
                    that.setState({
                        tag:[{id:1,name:'图文信息',num:total_count}],
                        list:list,listModule:listModule,listNum:total_count
                    });
                    $('.pagination-wrap').pagination('updateItems',total_count);
                }else{
                    that.setState({listModule:<ListFalse />});
                }
            },
            error: function () {
                that.setState({listModule:<ListFalse />});
            }
        });
    }
    setPagination(){
        let that = this;
        let thisSize=this.state.size;
        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                items: 0,//共有条数
                itemsOnPage: thisSize,//最多显示数
                onPageClick: function (pageNumber, event) {
                    that.resetList(pageNumber,'page');
                }
            });
        }
    }
    constructor(props){
        super(props);
        this.state = {
            company:[],
            companyActive:{id:'',name:''},
            tag:[{id:1,name:'图文信息',num:0}],
            tagActive:{id:1,name:'图文信息'},
            searchText:'',
            list:[],listModule:<ListFalse />,listNum:0,
            index: 1, size: 7
        };
        this.resetList = this.resetList.bind(this);
    }
    componentDidMount(){
        this.fetchCompany();
        this.setPagination();
    }
    render() {
        return (
            <div className="wechat">
                <SubHead listNum={this.state.listNum}/>
                <div className="content">
                    <div className="company">
                        <ul className="tags-box" id="tags-box">
                            {this.state.company.map((m,i)=> {
                                return (
                                    <li className={"tag"+ m.active} onClick={this.changeCompany.bind(this,m.id)}>
                                        <div className="cont">
                                            <img className="logo" src={m.logoUrl}/>
                                            <div className="name" title={m.name}>{m.name}</div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="right-content">
                        <div className="header">
                            <div className="tags-area">
                                <ul className="tabs">
                                    {this.state.tag.map((m,i)=> {
                                        return (
                                            <li className="tab col s3"><a href="#">{m.name}（{m.num}）</a></li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="search-area">
                                <Search resetList={this.resetList}/>
                            </div>
                        </div>
                        <div className="list-area">
                            {this.state.listModule}
                            <div className="pagination-wrap pagination"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
/********渲染页面********/
const manage = ReactDOM.render(
    <Manage />,
    document.getElementById('page-body')
);
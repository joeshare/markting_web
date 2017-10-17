/**
 * Created by lxf on 2016-5-11.
 * 自定义标签
 */
import Layout from 'module/layout/layout';
//先创建布局
const layout = new Layout({
    index: 1,
    leftMenuCurName: '自定义标签'
});
const Modals = require('component/modals.js');//弹层插件
const pagination = require('plugins/pagination')($);//分页插件

import CategoryList from '../../module/custom-tag/category-list';//分类列表
import TagList from '../../module/custom-tag/tag-list';//标签列表


class SubHead extends React.Component {
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box">
                    <span className="title">自定义标签</span>
                    <span className="text">
                        自定义标签<span className="variable">{this.props.totalCount}</span>个
                    </span>
                </div>
            </header>
        )
    }
}
//分类下添加标签
class AddTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExist: true,//要添加的标签已存在
            keyWords: '',//标签名
            alreadyExistTags: [],//相关标签列表
            selectedTags: []
        }
    }

    initState() {
        this.setState({
            isExist: true,//要添加的标签已存在
            keyWords: '',//标签名
            alreadyExistTags: [],//相关标签列表
            selectedTags: []
        })
    }

    componentDidMount() {

    }

    submit() {
        let that = this;
        let currentCategory = this.props.root.state.currentCategory;
        let root = this.props.root;

        util.api({
            url: '?method=mkt.customtag.create.tocategory',
            type: 'post',
            data: {
                custom_tag_category_id: currentCategory.custom_tag_category_id,
                custom_tag_category_name: currentCategory.custom_tag_category_name,
                custom_tag_list: this.state.selectedTags
            },
            success(response){
                that.props.self.close();
                that.setState({
                    isExist: false,//要添加的标签已存在
                    keyWords: '',//标签名
                    alreadyExistTags: [],//相关标签列表
                    selectedTags: []
                });
                root.getToatlCount();
                root.getCategoryList(() => {
                    $('.custom-tag .right-lab-unselect').hide();
                    $('.custom-tag .table-list-wrap').show();
                    root.getTagList(currentCategory.custom_tag_category_id);
                    setTimeout(m => {

                    }, 1000)


                });
            }
        })
    }

    searchAlreadyExistTag(e) {
        let that = this;
        let value = $.trim(e.target.value);
        let selectedTags = this.state.selectedTags;
        let alreadyExistTags = this.state.alreadyExistTags;
        let isExist = false;
        selectedTags.map(m => {
            if (m.custom_tag_name == value) isExist = true;
        });
        this.setState({
            keyWords: value,
            isExist: isExist
        });
        if (value == '') {
            that.setState({
                alreadyExistTags: []
            });
            return
        }
        util.api({
            data: {
                method: 'mkt.customtag.fuzzy.name.list',
                custom_tag_category_id: this.props.root.state.currentCategory.custom_tag_category_id,
                custom_tag_name: value
            },
            success(response){
                if (response.code == 0) {
                    response.data.map(m => {
                        if (m== value) isExist = true;
                    });
                    that.setState({
                        isExist: isExist,
                        alreadyExistTags: response.data,
                    })
                }

            }
        })
    }

    addTagToRightList() {
        if (this.state.isExist)return;
        let selectedTags = this.state.selectedTags;
        selectedTags.push({
            custom_tag_name: this.state.keyWords
        });
        this.setState({
            isExist: true,
            keyWords: '',
            selectedTags: selectedTags
        })
    }

    removeSelectedTag(i) {
        let selectedTags = this.state.selectedTags;
        selectedTags.splice(i, 1);
        this.setState({
            selectedTags: selectedTags
        })
    }

    render() {
        let root = this.props.root;
        let aetStr = '';
        let isExistClass = this.state.isExist ? 'disable' : '';
        if (_.isEmpty(this.state.alreadyExistTags)) {
            aetStr = (<li className="t-c fc-666">无标签搜索内容</li>)
        } else {
            aetStr = this.state.alreadyExistTags.map((m, i) => {
                let keywordStr = this.state.keyWords;
                if (m.indexOf(keywordStr) < 0 || keywordStr == '') {
                    return (
                        <li>{m}</li>
                    )
                } else {
                    let str_before = m.slice(0,m.indexOf(keywordStr));
                    let str_after = m.slice(m.indexOf(keywordStr)+keywordStr.length);
                    return (
                        <li>{str_before}<b>{keywordStr}</b>{str_after}</li>
                    )
                }

            })
        }
        return (
            <div className="row add-tag">
                <div className="l col s6">
                    <div className="l-hd">
                        分类：<span className="fc-blue">{root.state.currentCategory.custom_tag_category_name}</span>
                    </div>
                    <div className="l-inputwrap">
                        <input type="text" className="input-box" maxLength="15" value={this.state.keyWords}
                               onChange={this.searchAlreadyExistTag.bind(this)}/>
                        <span className={"button-main-3 " + isExistClass}
                              onClick={this.addTagToRightList.bind(this)}>新建</span>
                        <div className="tip">为了提高使用标签时效率，建议您添加真实、高质的标签。</div>
                    </div>
                    <div className="list-title">分类已存类似标签</div>
                    <ul className="list-wrap"> {aetStr} </ul>
                </div>
                <div className="r col s6">
                    <div className="r-tit">已创建标签</div>
                    <ul className="taglist-wrap">
                        {this.state.selectedTags.map((m, i) => {
                            return (
                                <li>{m.custom_tag_name} <span className="del-btn"
                                                              onClick={this.removeSelectedTag.bind(this, i)}>x</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0,//自定义标签总数
            tabMenuData: [
                //1.7不做
                // {
                //     name: '预置分类',
                //     count: 0
                // },
                {
                    name: '自定义分类',
                    count: 0
                }
            ],
            //当前选中的分类
            currentCategory: {
                custom_tag_category_name: '分类名称',
                custom_tag_category_id: 0
            },
            categoryList: [],//所有分类列表
            tagListData: []//标签列表数据
        }
    }

    //为分类添加标签
    addTag(disableClass) {
        let that = this;
        if (disableClass)return;
        new Modals.Window({
            id: 'addtag-modal',
            title: '为自定义分类添加标签',
            width: 1000,//默认是auto
            buttons: [
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {
                        this.addtag.submit();
                        self.close();
                    }
                },
                {
                    text: '取消',
                    cls: 'decline',
                    handler: function (self) {
                        this.addtag.initState();
                        self.close();
                    }
                }
            ],
            listeners: {
                beforeRender: function (self) {
                    this.addtag = ReactDOM.render(
                        <AddTag root={that} self={self}/>,
                        this.$el.find('.content').get(0)
                    );
                }
            }
        });
    }

//获取自定义分类列表
    getCategoryList(callback) {
        let that = this;
        util.api({
            data: {
                method: "mkt.customtag.category.list",
            },
            success: function (res) {
                if (res.code == 0) {
                    that.setState({
                        categoryList: res.data
                    });
                    $('.custom-tag .right-lab-unselect').show();
                    $('.custom-tag .table-list-wrap').hide();
                    callback && callback();
                }
            }
        });
    }

    //分类id,第几页，多少页
    getTagList(id = 0, index = 1, size = 9, tagCategory = {}) {
        let that = this;
        util.api({
            data: {
                method: "mkt.customtag.list",
                custom_tag_category_id: id,
                index: index,
                size: size
            },
            success: function (res) {
                if (res.code == 0) {
                    that.setState({
                        currentCategory: Object.assign(that.state.currentCategory, tagCategory),
                        tagListData: res.data
                    });
                    util.setPaginationTotal(res.total_count, index);
                }
            }
        });
    }

    //实例化之后
    componentDidMount() {
        this.getCategoryList();
        this.setPagination();
        this.getToatlCount();
    }

    getToatlCount() {
        let _this = this;
        util.api({
            data: {
                method: "mkt.customtag.all.count",
            },
            success: function (res) {
                if (res.code == 0) {
                    _this.setState({
                        totalCount: res.data[0].count
                    });
                }
            }
        });
    }

    //实例化分页插件
    setPagination() {
        let that = this;

        if ($('.pagination-wrap').length > 0) {
            $('.pagination-wrap').pagination({
                itemsOnPage: 9,//一页多少条
                onPageClick: function (pageNumber, event) {
                    that.getTagList(that.state.currentCategory.custom_tag_category_id, pageNumber, 9);
                }
            });
        }
    }

    render() {
        let curCateGoryName = this.state.currentCategory.custom_tag_category_name;
        let disableClass = (curCateGoryName == '未分类') || (curCateGoryName == '分类名称') ? ' disable' : '';
        return (
            <div className="custom-tag">
                <SubHead totalCount={this.state.totalCount}/>
                <div className="content clearfix">
                    <div className="list-left">
                        <CategoryList root={this}/>
                    </div>
                    <div className="page-right">
                        <div className="hd fn-hide clearfix taglist-hd">
                            <span className="titname">标签列表</span>
                            <span className="categoryname">{curCateGoryName}</span>
                            <span className={"addtagbtn button-assist-1 right" + disableClass}
                                  onClick={this.addTag.bind(this, disableClass)}>添加标签</span>
                        </div>
                        <div className="r-list-wrap">
                            <TagList root={this}/>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
const root = ReactDOM.render(
    <Root />,
    document.getElementById('page-body')
);


export default Root;
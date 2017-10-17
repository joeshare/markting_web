/**
 * Created by liuxiaofan on 2017/1/12.
 * 自定义标签-分类列表
 */
const Modals = require('component/modals.js');
class CreatCategoryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    changeName(events) {
        let value = $.trim(events.nativeEvent.target.value);
        if (!util.getrexResult(value))return;
        this.setState({
            value: value
        })
    }

    render() {
        return (
            <div>
                <div className="clearfix">
                    <span className="name left">分类名称</span><input type="text" className="input-name left"
                                                                  value={this.state.value}
                                                                  onChange={this.changeName.bind(this)}
                                                                  maxLength="15"/>
                </div>
                <div className="err-tip fn-hide">
                    <span className="icon iconfont">&#xe60a;</span><span className="txt">请输入分类内容</span>
                </div>
            </div>

        )
    }
}
class CategoryList extends React.Component {


    componentDidUpdate() {
        $('ul.tabs').tabs();
        $('.dropdown-button').dropdown();
    }

    tabBtn(index) {
    }


    //创建分类
    createCategory() {
        let that = this;
        let root = this.props.root;
        new Modals.Window({
            id: 'create-category-modal',
            title: '创建分类',
            content: '',
            width: 390,//默认是auto
            buttons: [
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {
                        let $errtip = self.$el.find('.err-tip');
                        let val = self.$el.find('.input-name').val().trim();
                        if (val == '') {
                            $errtip.show();
                            return;
                        }
                        util.api({
                            url: '?method=mkt.customtag.category.create',
                            type: 'post',
                            data: {
                                custom_tag_category_name: val
                            },
                            success(response){
                                if (response.code == 0) {
                                    root.getCategoryList();//创建成功后调用
                                    self.close();
                                    $('.custom-tag .taglist-hd').hide();
                                } else {
                                    $errtip.show().find('.txt').html(response.msg);
                                }
                            }
                        });


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
            listeners: {//window监听事件事件
                beforeRender: function () {
                    let $el = this.$el;
                    this.creatCategoryModal = ReactDOM.render(
                        <CreatCategoryModal/>,
                        $el.find('.content')[0]
                    );
                }
            }
        })
    }

    //编辑分类
    editTagCategory(tagCategory,e) {
        let that = this;
        let root = this.props.root;
        new Modals.Window({
            id: 'edit-category-modal',
            title: '编辑分类',
            content: '<div class="clearfix"><span class="name left">分类名称</span><input type="text" class="input-name left" value="' + tagCategory.custom_tag_category_name + '" maxlength="15"></div><div class="err-tip fn-hide"><span class="icon iconfont">&#xe60a;</span><span class="txt">请输入分类内容</span></div>',
            width: 390,//默认是auto
            buttons: [
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {
                        let $errtip = self.$el.find('.err-tip');
                        let val = self.$el.find('.input-name').val().trim();
                        if (val == '') {
                            $errtip.show();
                            return;
                        }
                        util.api({
                            url: '?method=mkt.customtag.category.create',
                            type: 'post',
                            data: {
                                custom_tag_category_id: tagCategory.custom_tag_category_id,
                                custom_tag_category_name: val
                            },
                            success(response){
                                if (response.code == 0) {
                                    root.getCategoryList();//创建成功后调用
                                    self.close();
                                } else {
                                    $errtip.show().find('.txt').html(response.msg);
                                }
                            }
                        });

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
            listeners: {//window监听事件事件
                afterRender: function () {

                }
            }
        });
        e.stopPropagation();
    }

    //删除分类
    delTagCategory(tagCategory,e) {
        let that = this;
        let root = this.props.root;
        new Modals.Confirm({
            content: '<div class="clearfix">确认删除当前分类？</div><div style="font-size:12px;line-height:2px;">分类删除后将不可恢复</div>',
            buttons: [
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {

                        util.api({
                            url: '?method=mkt.customtag.category.delete',
                            type: 'post',
                            data: {
                                custom_tag_category_id: tagCategory.custom_tag_category_id,
                                custom_tag_category_name: tagCategory.custom_tag_category_name
                            },
                            success(response){
                                self.close();
                                if (response.code == 0) {
                                    root.getCategoryList();
                                    $('.custom-tag .taglist-hd').hide();
                                } else {
                                    new Modals.Alert({
                                        title: "操作失败",
                                        content: '当前分类下有标签，不能删除'
                                    })
                                }

                            }
                        });

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
        });
        e.stopPropagation();

    }

    selectMe(tagCategory, e) {
        let root = this.props.root;
        let $me = $(e.currentTarget);
        if ($(e.target).is('.dropdown-button'))return;//如果点的是更多按钮就不继续走了
        $('.category-lists li').removeClass('cur');
        $me.addClass('cur');
        $('.custom-tag .right-lab-unselect').hide();
        $('.custom-tag .table-list-wrap').show();
        $('.custom-tag .taglist-hd').show();
console.info(2)
        root.getTagList(tagCategory.custom_tag_category_id, 1, 9, tagCategory);

    }

    render() {
        let categoryList = this.props.root.state.categoryList || [];
        return (
            <div className="list-left-con">
                <div className="tabs-btnwrap">
                    <ul className="tabs">
                        {this.props.root.state.tabMenuData.map((m, i) => {
                            return <li className="tab"><a href="#" onClick={ this.tabBtn.bind(this, i)}>{m.name}</a>
                            </li>
                        })}
                    </ul>
                </div>
                <div className="tabs-boxwrap">
                    <div className="fn-wrap clearfix">
                        <button className="fn-createcategory" onClick={this.createCategory.bind(this)}>创建分类</button>
                    </div>
                    <ul className="category-lists">
                        {categoryList.map((m, i) => {
                            let hideClass = '';
                            if (m.custom_tag_category_name == '未分类') hideClass = ' fn-hide';
                            return (
                                <li onClick={this.selectMe.bind(this, m)}>{m.custom_tag_category_name}({m.custom_tag_count || 0})
                                    <div className={"fn-btn icon iconfont dropdown-button" + hideClass}
                                         data-activates={"morelist" + m.custom_tag_category_id}
                                         data-constrainwidth="false"
                                         data-gutter="-110"
                                         title="更多操作">&#xe675;</div>

                                    <ul id={"morelist" + m.custom_tag_category_id}
                                        className="dropdown-content setuplist">
                                        <li className={''}
                                            onClick={this.editTagCategory.bind(this, m)}>
                                            <i className="icon iconfont">&#xe604;</i>
                                            <a href="javascript:void(0)">编辑</a>
                                        </li>
                                        <li className={''}
                                            onClick={this.delTagCategory.bind(this, m)}>
                                            <i className="icon iconfont">&#xe674;</i>
                                            <a href="javascript:void(0)">删除</a>
                                        </li>
                                    </ul>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }

}
export default CategoryList;
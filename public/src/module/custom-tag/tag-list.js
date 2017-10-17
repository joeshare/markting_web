/**
 * Created by liuxiaofan on 2017/1/20.
 * 标签列表
 */
import PointOut from 'module/point-out/point-out';
const Modals = require('component/modals.js');//弹层插件
class TagList extends React.Component {
    componentDidUpdate() {
        $('.dropdown-button').dropdown();
    }

    //添加标签到分类
    addTagToCategory(tagData) {
        let that = this;
        let root=this.props.root;
        let currentCategory = this.props.root.state.currentCategory;
        new Modals.Window({
            id: 'add-tag-to-category-modal',
            title: '将标签添加到自定义分类',
            content: `<div>
            <div class="sub-tit">请选择一个分类</div>
                <div class="categorylist-wrap"></div>
                <div class="error-notice fn-hide">当前分类下已存在此标签</div>
            </div>`,
            width: 350,//默认是auto
            buttons: [
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {
                        let $curLi=self.$el.find('.categorylist-wrap .cur');
                        if($curLi.length<=0){
                            self.$el.find('.error-notice').show().html('请选择一个分类');
                            return
                        }
                        util.api({
                            url: '?method=mkt.customtag.add.tocategory',
                            type: 'post',
                            data: {
                                custom_tag_old_category_id: currentCategory.custom_tag_category_id,
                                custom_tag_old_category_name: currentCategory.custom_tag_category_name,
                                custom_tag_new_category_id: $curLi.attr('data-id'),
                                custom_tag_new_category_name: $curLi.attr('data-name'),
                                custom_tag_id: tagData.custom_tag_id,
                                custom_tag_name:tagData.custom_tag_name
                            },
                            success(response){
                                if (response.code == 0) {
                                    self.close();
                                    that.props.root.getCategoryList(m => {
                                        that.props.root.getTagList(currentCategory.custom_tag_category_id, 1, 9, currentCategory);
                                        $('.custom-tag .right-lab-unselect').hide();
                                        $('.custom-tag .table-list-wrap').show();
                                    });
                                } else {
                                    self.$el.find('.error-notice').show()
                                }
                            }
                        })

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
                beforeRender: function (self) {
                    let $el = self.$el;
                    $el.on('click', '.categorylist-wrap li', (e) => {
                        $el.find('.categorylist-wrap li').removeClass('cur');
                        $(e.currentTarget).addClass('cur');
                    });
                    util.api({
                        data: {
                            method: 'mkt.customtag.category.less.list'
                        },
                        success(res){
                            let listStr = '';
                            if (res.code == 0) {
                                if (_.isEmpty(res.data)) {

                                } else {
                                    res.data.map((m, i) => {
                                        listStr += `<li data-id=${m.custom_tag_category_id} data-name=${m.custom_tag_category_name}>${m.custom_tag_category_name} <span class="icon iconfont">&#xe610;</span></li>`;
                                    });
                                    $el.find('.categorylist-wrap').html(`<ul>${listStr}</ul>`);
                                }

                            }
                        }
                    })

                }
            }
        })


    }

    //编辑分类
    editTag(tagData) {
        let that = this;
        let currentCategory = this.props.root.state.currentCategory;
        new Modals.Window({
            id: 'edit-tag-modal',
            title: '编辑标签',
            content: '<div class="tips-wrap"></div><div class="clearfix edit-tag-input-wrap"><span class="name left">标签名称</span><input type="text" class="input-name left" value="' + tagData.custom_tag_name + '" maxlength="15"></div><div class="edit-tag-err-tip fn-hide"><span class="icon iconfont">&#xe60a;</span><span class="txt">请输入标签内容</span></div>',
            width: 580,//默认是auto
            buttons: [
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {
                        let $errtip = self.$el.find('.edit-tag-err-tip');
                        let val = self.$el.find('.input-name').val().trim();
                        if (val == '') {
                            $errtip.show();
                            return;
                        }
                        util.api({
                            url: '?method=mkt.customtag.edit',
                            type: 'post',
                            data: {
                                custom_tag_category_id: currentCategory.custom_tag_category_id,
                                custom_tag_category_name: currentCategory.custom_tag_category_name,
                                custom_tag_id: tagData.custom_tag_id,
                                custom_tag_old_name: tagData.custom_tag_name,
                                custom_tag_new_name: val
                            },
                            success(response){
                                if (response.code == 0) {
                                    that.props.root.getTagList(currentCategory.custom_tag_category_id, 1, 9, currentCategory);
                                } else {
                                    new Modals.Alert({
                                        title: '操作失败',
                                        content: res.msg
                                    })
                                }
                            }
                        });

                        self.close();

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
                beforeRender: function (self) {
                    let $tipsWrap = this.$el.find('.tips-wrap');
                    let param = {
                        icon: 'blue',
                        back: '',
                        text: {
                            title: '更名将影响标签本身以及使用到此标签的地方，都将显示为最新名称',//必须
                            text: '例如：标签自身、细分管理、联系人、二维码等各种物料'
                        }
                    };

                    ReactDOM.render(
                        <PointOut param={param}/>,
                        $tipsWrap.get(0)
                    );
                }
            }
        })
    }

    //删除分类
    delTag(tagData) {
        let that = this;
        let currentCategory = this.props.root.state.currentCategory;
        new Modals.Confirm({
            content: '<div class="clearfix">确认删除当前标签？</div><div style="font-size:12px;line-height:2px;">标签删除后将无法找回，请慎重</div>',
            buttons: [
                {
                    text: '确定',
                    cls: 'accept',
                    handler: function (self) {

                        util.api({
                            url: "?method=mkt.customtag.delete",
                            type: 'post',
                            data: {
                                custom_tag_category_id: currentCategory.custom_tag_category_id,
                                custom_tag_category_name: currentCategory.custom_tag_category_name,
                                custom_tag_id: tagData.custom_tag_id,
                                custom_tag_name: tagData.custom_tag_name,
                            },
                            success: function (res) {
                                if (res.code == 0) {

                                    that.props.root.getToatlCount();
                                    that.props.root.getCategoryList(m => {
                                        that.props.root.getTagList(currentCategory.custom_tag_category_id, 1, 9, currentCategory);
                                        $('.custom-tag .right-lab-unselect').hide();
                                        $('.custom-tag .table-list-wrap').show();
                                    });

                                } else {
                                    new Modals.Alert({
                                        title: '操作失败',
                                        content: res.msg
                                    })
                                }
                            }
                        });

                        self.close();
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


    }

    render() {
        let root = this.props.root;
        let tagListData = root.state.tagListData;
        let listData = !_.isEmpty(tagListData) ? tagListData[0].childern_tag : [];
        let tableHideClass = _.isEmpty(listData) ? 'fn-hide' : '';
        let emptyHideClass = !_.isEmpty(listData) ? 'fn-hide' : '';
        let showAddTagToCategoryClass = (root.state.currentCategory.custom_tag_category_name == '未分类') ? '' : 'fn-hide';
        return (
            <div>
                <div className="right-lab-unselect">
                    <div className="empty-top">
                        <img src="/img/system-lab/labdefault.png"/>
                    </div>
                    <div className="empty-bot">
                        自定义标签————针对物料、联系人、活动的主观描述支持
                    </div>
                    <div className="empty-botf">
                        自定义标签是一种更自主的资源描述，通过自定义标签您可以：
                    </div>
                    <div className="empty-botf">
                        ▪扩大人群细分 &nbsp; ▪资源描述更具主观性 &nbsp; ▪更细化的多维度分析
                    </div>
                </div>
                <div className="table-list-wrap fn-hide">
                    <div className={tableHideClass}>
                        <table className="page-table-box allborder uat-labelcustom-table">
                            <thead>
                            <tr>
                                <th width={10} className="t-c">序号</th>
                                <th>标签</th>
                                <th className="t-c">覆盖人数</th>
                                <th className="t-c">覆盖人次</th>
                                <th className="t-c">操作</th>
                            </tr>
                            </thead>
                            <tbody className="uat-labelcustom-tbody">
                            {listData.map((m, i) => {
                                return (
                                    <tr>
                                        <td className="t-c uat-labelcustom-td">{listData.length - i}</td>
                                        <td className="uat-labelcustom-td">{m.custom_tag_name}</td>
                                        <td className="t-r uat-labelcustom-td">{m.cover_number}</td>
                                        <td className="t-r uat-labelcustom-td">{m.cover_frequency}</td>
                                        <td className="ico"><span className="icon iconfont dropdown-button"
                                                                  data-activates={"moretaglist" + m.custom_tag_id}
                                                                  data-constrainwidth="false"
                                        >&#xe675;</span>
                                            <ul id={"moretaglist" + m.custom_tag_id}
                                                className="dropdown-content setuplist">
                                                <li className={showAddTagToCategoryClass}
                                                    onClick={this.addTagToCategory.bind(this, m)}>
                                                    <i className="icon iconfont">&#xe672;</i>
                                                    <a href="javascript:void(0)">添加到分类</a>
                                                </li>
                                                <li className={''}
                                                    onClick={this.editTag.bind(this, m)}>
                                                    <i className="icon iconfont">&#xe604;</i>
                                                    <a href="javascript:void(0)">编辑</a>
                                                </li>
                                                <li className={''}
                                                    onClick={this.delTag.bind(this, m)}>
                                                    <i className="icon iconfont">&#xe674;</i>
                                                    <a href="javascript:void(0)">删除</a>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        <div className="pagination-wrap pagination">...</div>
                    </div>
                    <div className={emptyHideClass + " right-lab-empty"}>
                        <div className="empty-top">
                            <img src="/img/system-lab/labdefault.png"/>
                        </div>
                        <div className="empty-bot">
                            暂无分析标签，请选择其他分类
                        </div>
                        <div className="empty-botf">
                            自定义标签是一种更自主的资源描述，通过自定义标签您可以：
                        </div>
                        <div className="empty-botf">
                            ▪扩大人群细分 &nbsp; ▪资源描述更具主观性 &nbsp; ▪更细化的多维度分析
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}
export default TagList;
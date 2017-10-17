/**
 * Created by richard on 2016-9-12.
 * 左侧菜单
 */

class Left extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuData: {
                home: [
                    {
                        ico: '&#xe657;',
                        name: '首页',
                        active: false
                    }
                ],
                dmp: [
                    {
                        ico: '&#xe638;',
                        name: '数据接入',
                        active: false,
                        subMenu: [
                            {
                                name: '文件接入',
                                active: false,
                                linkUrl: '/html/data-access/file.html'

                            }
                        ]
                    },
                    {
                        ico: '&#xe637;',
                        name: '数据管理',
                        subMenu: [
                            {
                                name: '主数据管理',
                                linkUrl: '/html/data-supervise/master-data.html'

                            }
                        ]
                    },
                    {
                        ico: '&#xe606;',
                        name: '标签管理',
                        subMenu: [
                            {
                                name: '系统标签',
                                linkUrl: '/html/label-management/system.html'

                            },
                            {
                                name: '自定义标签',
                                linkUrl: '/html/label-management/custom.html'

                            }
                        ]
                    },
                    {
                        ico: '&#xe630;',
                        name: '受众管理',
                        subMenu: [

                            {
                                name: '受众细分',
                                linkUrl: '/html/audience/segment.html'

                            },
                            {
                                name: '细分管理',
                                linkUrl: '/html/audience/manage.html'

                            },
                            {
                                name: '人群管理',
                                linkUrl: '/html/audience/crowd.html'

                            }
                        ]
                    }
                ],
                marketing: [
                    {
                        ico: '&#xe64d;',
                        name: '营销活动',
                        subMenu: [
                            {
                                name: '活动编排',
                                linkUrl: '/html/activity/plan.html'

                            },
                            {
                                name: '活动管理',
                                linkUrl: '/html/activity/supervise.html'

                            }
                        ]
                    },
                    {
                        ico: '&#xe639;',
                        name: '数字资产',
                        subMenu: [
                            // {
                            //     name: '图文资产',
                            //     linkUrl: '/html/asset/graphic.html'
                            //
                            // },
                            {
                                name: '联系人表单',
                                linkUrl: '/html/asset/contact.html'

                            },
                            //暂时注销
                            //{
                            //   name: 'H5场景',
                            //   linkUrl: '/html/asset/h5scene.html'
                            //
                            //},
                            {
                                name: '优惠券',
                                linkUrl: '/html/coupon/list.html'

                            }
                        ]
                    },
                    {
                        ico: '&#xe63f;',
                        name: '微信平台',
                        subMenu: [
                            {
                                name: '微信接入',
                                linkUrl: '/html/data-access/weixin.html'

                            },
                            {
                                name: '粉丝管理',
                                linkUrl: '/html/asset/weixin.html'

                            },
                            {
                                name: '微信素材',
                                linkUrl: '/html/asset/wechat.html'

                            },
                            {
                                name: '微信二维码',
                                linkUrl: '/html/asset/qrcode.html'

                            }
                        ]
                    }, {
                        ico: '&#xe66c;',
                        name: '短信平台',
                        subMenu: [
                            {
                                name: '营销短信',
                                linkUrl: '/html/message-app/message-marketingmessage.html'

                            },
                            {
                                name: '服务通知短信',
                                linkUrl: '/html/message-app/message-servemessage.html'

                            },
                            {
                               name: '短信素材',
                               linkUrl: '/html/message-app/message-material.html'

                            },
                            {
                                name: '模板管理',
                                linkUrl: '/html/message-app/message-mould.html'

                            },
                            {
                                name: '任务中心',
                                linkUrl: '/html/message-app/message-taskcenter.html'

                            }
                        ]
                    },{
                        ico: '&#xe6b8;',
                        name: '事件中心',
                        subMenu: [
                            {
                                name: '事件库',
                                linkUrl: '/html/events/warehouse.html'
                            }
                        ]
                    }
                ],
                insight: [
                    {
                        ico: '&#xe654;',
                        name: '数据洞察',
                        subMenu: [
                            {
                                name: '综合分析',
                                linkUrl: '/html/data-lnsight/comprehensive-analysis.html'

                            },
                            {
                                name: '定制报表',
                                linkUrl: '/html/data-lnsight/custom-report.html'

                            }
                        ]
                    },
                ],
                ausm: [
                    {
                        ico: '&#xe637;',
                        name: '数据接入设置',
                        subMenu: [
                            {
                                name: '用户来源管理',
                                linkUrl: '/html/admin/user-source-manage.html'

                            }
                        ]
                    },
                ]
            }
        };
    }

    queryMenuAuth() {

        //TODO 菜单action
        //util.api({
        //    data: {
        //        method: 'mkt.user.resource.batch',
        //        resource_codes: ["home", "data-access-file"]
        //    },
        //    success: function (responseData) {
        //        console.log(responseData)
        //    },
        //    error: function () {
        //        //TODO::
        //        //TODO::
        //    }
        //});

    }

    showSubMenu(e) {
        let $meEl = $(e.currentTarget);
        let allBtn = $('.leftmenu-wrap-s .leftmenu-btn');
        $meEl.find('.subm-con').show();
        allBtn.removeClass('active');
        $meEl.find('.leftmenu-btn').addClass('active');
    }

    hideSubMenu(e) {
        let $meEl = $(e.currentTarget);
        let allBtn = $('.leftmenu-wrap-s .leftmenu-btn');
        allBtn.removeClass('active');
        $meEl.find('.subm-con').hide();
    }

    hideHeaderMenu(param){
        for(let i=0; i<param.length; i++){
            param[i].css('display','none');
        }
    }

    render() {
        //TODO::
        this.queryMenuAuth();

        let index = this.props.index;
        let submenuName = this.props.submenuName;
        let menuData = [];
        let noIconClass = index ? '' : ' noico';
        let hideHeaderMenuId = [],leftRoot,rightRoot,systemSetuplist,setuparr;
        switch (index) {
            case 0:
                menuData = this.state.menuData.home;
                break;
            case 1:
                menuData = this.state.menuData.dmp;
                break;
            case 2:
                menuData = this.state.menuData.marketing;
                break;
            case 3:
                menuData = this.state.menuData.insight;
                break;
            case 99:
                leftRoot = $('#header').children('.left');
                rightRoot = $('#header').children('.rightbtn-wrap');
                hideHeaderMenuId = [
                    leftRoot.children('#menu-btn'),
                    leftRoot.children('#home'),
                    leftRoot.children('#dmp'),
                    leftRoot.children('#marketing'),
                    rightRoot.children('#showuser-li'),
                    rightRoot.children('#backgroundtask-li'),
                    rightRoot.children('#searchinput-li')
                ];
                rightRoot.children('#goback-li').css('display','block');
                this.hideHeaderMenu(hideHeaderMenuId);
                systemSetuplist = rightRoot.children('#system-setuplist-li').children('.system-setuplist');
                setuparr = systemSetuplist.children('.setuparr');
                systemSetuplist.css('right',0);
                setuparr.css('right',2);
                menuData = this.state.menuData.ausm;
                break;
        }
        let arr = [];
        menuData.map(m=> {
            let activeClass = '';
            m.subMenu && m.subMenu.map(mm=> {
                if (mm.name == submenuName) {
                    activeClass = ' active';
                }
                m.active = activeClass
            });
        });

        return (
            <div className="menuwrap">
                <div>
                    <ul className="leftmenu-wrap-s">
                        {menuData.map(m=> {
                            return (
                                <li onMouseEnter={this.showSubMenu.bind(this)}
                                    onMouseLeave={this.hideSubMenu.bind(this)}>
                                    <a href="#" className="leftmenu-btn"><span
                                        className="icon iconfont">{util.translateHtmlCharater(m.ico)}</span></a>
                                    <ul className="subm-con" onMouseLeave={this.hideSubMenu.bind(this)}>
                                        {m.subMenu && m.subMenu.map(m=> {
                                            return (
                                                <li><a href={m.linkUrl}>{m.name}</a></li>
                                            )
                                        })}

                                    </ul>
                                </li>
                            )
                        })}

                    </ul>
                    <ul className="leftmenu-wrap-b collapsible" data-collapsible="expandable">
                        {menuData.map(m=> {
                            return (
                                <li>
                                    <div className={"leftmenu-btn  collapsible-header"+ noIconClass+m.active}>
                                        <span className="icon iconfont">{util.translateHtmlCharater(m.ico)}</span>
                                        <span className="txt">{m.name}</span>
                                    </div>
                                    <ul className="collapsible-body">
                                        {m.subMenu && m.subMenu.map(m=> {
                                            let curClass = m.name == submenuName ? 'cur' : '';
                                            return (
                                                <li className={curClass}><a href={m.linkUrl}>{m.name}</a></li>
                                            )
                                        })}
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

module.exports = Left;
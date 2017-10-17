let Ztree= require('plugins/jquery.treeviewplus.js');
let Treelib = require('../utils/sys-tree');
let TreelibCustom = require('../utils/custom-tree');
/*弹层插件*/
let Modals = require('component/modals.js');
let RootCreate = require('../utils/root-create');
let RootEdit = require('../utils/root-edit');
let RootDisplay = require('../utils/root-dispaly');
let AddLab = require('../utils/add-lab');
class Panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tab_data: [{name: '系统分类', code: 0}, {name: '自定义分类', code: 1}],
            tab_dispay:{sys:'block',self:'none'},
            tab_second: [ ],
            select_title:'全部标签', 
            tab_list_sys_li:[],
            tab_list_sys:[],
            tab_list_custom:[],
            tab_select:0,
            lab_select:'',
            lab_selectr:'',
            custom_root:[],
            custom_select_title:'',
            custom_select_id:'',
            custom_select_tree_id:'',
            custom_select_tree_tag_id:'',
            openwinows:null,
            edit_type:0,

        };
    }
    componentDidMount(){
        this.initList();
    }
    onTabclick(params){
        this.set_Save();

        if(this.state.tab_select != params)
        {
            $('.right-lab-empty').show();
            $('.right-lab-content').hide();
        }

        if(params==0){
           this.setState({
               tab_dispay:{sys:'block',self:'none'},
               tab_select:0
           });
        }
        else {
            let _this =this;
            this.setState({
                tab_dispay:{sys:'none',self:'block'},
                tab_select:1
            },function (e) {
                if(this.state.custom_select_id=='')
                {
                    util.api({
                        type: 'get',
                        data: {
                            noly_show:true,
                            method: "mkt.tag.custom.taxonomy.root.list.get"
                        },
                        success: function (res) {

                            if (res.code == 0) {
                                if (res.data.length == 0) {
                                    _this.empty_traggle(true);
                                } else {
                                    res.data[0].active = 'active';
                                    _this.setState({
                                        custom_select_title: res.data[0].tag_tree_name,
                                        custom_select_id: res.data[0].tag_tree_id,
                                        custom_root: res.data
                                    }, function () {

                                        /*
                                         let hit = $('#tab_second_cus').height();
                                         $('#lab_list_cus').css('top',hit+55);
                                         */

                                        //  let hit = $('#tab_second_cus').height()+55;


                                        let listwidth = $('.lab-content').height() - $('#tab_second_cus').height() - 97;
                                        $('#lab_list_cus').css('height', listwidth);
                                    });

                                    util.api({
                                        type: 'get',
                                        data: {
                                            method: "mkt.tag.custom.taxonomy.list.get",
                                            tag_tree_id: res.data[0].tag_tree_id
                                        },
                                        success: function (res) {
                                            _this.setState({
                                                tab_list_custom: res.data
                                            }, function () {
                                                $('.ulhiare').unbind();
                                                $("#TreelibCustom").treeview();
                                                $(".dropdown-button").dropdown();
                                            });
                                        }
                                    });
                                }

                            }
                        }
                    });
                }
                else {
                   // $('.ulhiare').unbind();
                   // $("#TreelibCustom").treeview();
                }
            });
        }
    }

    //初始化列表
    initList(){
        let _this= this;
        //获取系统一级分类
        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.root.node.list.get"
            },
            success: function (res) {
                if(res.code==0) {
                    res.data[0][0].active = 'active';

                    _this.setState({
                        tab_second: res.data[0]
                    });
                    let hit = $('#tab_second').height();
                    $('#lab_list').css('top', hit + 55);
                }
            }
        });

        //获取标签列表
        util.api({
            type: 'get',
            data: {
                tag_id:0,
                method: "mkt.tag.tree.list.get"
            },
            success: function (res) {
                if(res.code==0) {
                    //console.log(res.data[0]);
                    _this.setState({
                        tab_list_sys_li: res.data[0]
                    });
                    $('.ultree').hide();
                    $('.ullist').show();
                }
            }
        });
    }

    onLab_click(params){
        let _this =this;
        setTimeout(function () {
            if(_this.state.edit_type==0)
            {
                $('.right-lab-empty').hide();
                $('.right-lab-content').show();

                _this.setState({
                    lab_select: params.tag_id
                });
                _this.props.onLab_click(params);
            }
        },10);
    }

    //一级分类 tab
    onTabSeclick(params){
        this.set_Save();
        let taArray = this.state.tab_second;
        taArray.every((m,i)=>{
            if(m.tag_id==params.tag_id){
                m.active ='active';
            }
            else
            {
                m.active ='';
            }

            if(i<taArray.length)
            {return true}
        });

        if(params.tag_id<2)
        {
            $('.ullist').show();
            $('.ultree').hide();
        }else
        {
            $('.ultree').show();
            $('.ullist').hide();
            this.setState({tab_list_sys: []});}

        let _this= this;
        //获取标签列表
        util.api({
            type: 'get',
            data: {
                tag_id:params.tag_id,
                method: "mkt.tag.tree.list.get"
            },
            success: function (res) {
                //$('.hitarea').unbind();
                if(params.tag_id<2)
                {
                    _this.setState({
                        tab_list_sys_li: res.data[0]
                    });
                }
                else {
                    _this.setState({
                        tab_list_sys: res.data[0]
                    },function (e) {
                        $("#treeDemo").treeview();
                    });
                }
            }
        });

        this.setState({
            tab_second:taArray,
            select_title:params.tag_name
        });

    }

    //一级分类 custom
    onTabSeclick_custom(params){

        this.set_Save();
        let taArray = this.state.custom_root;

        taArray.every((m,i)=>{
            if(m.tag_tree_id==params.tag_tree_id){
                m.active ='active';
            }
            else
            {
                m.active ='';
            }

            if(i<taArray.length)
            {return true}
        })

        let _this= this;
        _this.setState({
            tab_list_custom: []
        });

        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.custom.taxonomy.list.get",
                tag_tree_id:params.tag_tree_id
            },
            success: function (res) {

                if(res.code==0) {
                    _this.setState({
                        tab_list_custom: res.data
                    }, function () {
                        $('.ulhiare').unbind();
                        $("#TreelibCustom").treeview();
                        $(".dropdown-button").dropdown();
                    });
                }
            }
        });
        this.setState({
            custom_root:taArray,
            custom_select_id:params.tag_tree_id,
            custom_select_title:params.tag_tree_name
        });

    }

    //根分类
    onDeleteRoot(params){
        $(".btn-content").find(".accept").removeClass("disable");
        $('.content').removeAttr('style');
        this.set_Save();
        let _this = this;
        new Modals.Confirm({
            content:"您确定要删除这个根分类吗？",
            listeners:{
                close:function(type){
                    if(type == true){
                        let rootvalue= $('#edit_root').val();
                        util.api({
                            type: 'get',
                            data: {
                                method: "mkt.tag.custom.taxonomy.list.get",
                                tag_tree_id:_this.state.custom_select_id
                            },
                            success: function (res) {
                                if(res.code==0) {
                                    if (res.data.length > 0) {
                                        new Modals.Alert("删除根分类之前请先删除子分类!");

                                    }
                                    else {
                                        console.log('111111111111');
                                        util.api({
                                            url: "?method=mkt.tag.custom.taxonomy.del",
                                            type: 'post',
                                            data: {
                                                "tag_tree_id": _this.state.custom_select_id
                                            },
                                            success: function (res) {
                                                _this.initCustomroot('delete');
                                            }
                                        });
                                    }
                                }
                            }
                        });

                    }else{
                        //console.log("click cancel");
                    }
                }
            }
        });
    }

    onCreateRoot(params){
        $(".btn-content").find(".accept").removeClass("disable");
        $('.content').removeAttr('style');
        this.set_Save();
        let _this =this;
        this.CreateViewModals = new Modals.Window({
            width:450,
            title: "创建分类",
            content: '<div class="con-body"/>',
            buttons: [
                {
                    text: '确认',
                    cls: 'accept',
                    handler: function (self) {
                       let rootvalue= $('#create_root').val();


                        rootvalue =rootvalue.replace(/(^\s*)|(\s*$)/g,"");
                        if (rootvalue.length==0)
                        {
                            rootvalue= '未命名分类';
                        }

                        util.api({
                            url: "?method=mkt.tag.custom.taxonomy.root.save",
                            type: 'post',
                            data: {
                                "tag_tree_id":"",
                                "tag_tree_name": rootvalue,
                                "children": [{"tag_tree_id":"","tag_tree_name":"自定义分类","children":[],"children_tag":[]}],
                                "children_tag": [ ]
                            },
                            success: function (res) {
                                if(res.code==0) {
                                    _this.initCustomroot('create');
                                }
                                else {
                                    new Modals.Alert("保存失败!");
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
            listeners: {
                beforeRender: function () {
                    ReactDOM.render(
                        <RootCreate />,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        })
    }

    initCustomroot(type){
        let _this=this;
        let _title =  this.state.custom_select_title;
        let _id = this.state.custom_select_id;
        util.api({
            type: 'get',
            data: {
                noly_show:true,
                method: "mkt.tag.custom.taxonomy.root.list.get"
            },
            success: function (res) {
                if(res.code==0) {
                    let resarray = res.data;
                    if (resarray.length > 0) {
                        _this.setState({
                            tab_list_custom: []
                        });

                        _this.empty_traggle(false);
                        if (type == 'create') {
                            resarray.forEach((m, i)=> {
                                resarray[i].active = '';
                            });
                            let Tindex = resarray.length - 1;
                            resarray[Tindex].active = 'active';
                            _title = resarray[Tindex].tag_tree_name;
                            _id = resarray[Tindex].tag_tree_id;
                        }
                        if (type == 'delete') {
                            resarray.forEach((m, i)=> {

                                resarray[i].active = '';
                            });
                            resarray[0].active = 'active';
                            _title = resarray[0].tag_tree_name;
                            _id = resarray[0].tag_tree_id;
                        }
                        if (type == 'edit') {
                            resarray.forEach((m, i)=> {
                                if (m.tag_tree_id == _id) {
                                    resarray[i].active = 'active';
                                    _title = resarray[i].tag_tree_name;
                                    _id = resarray[i].tag_tree_id;
                                }
                                else {
                                    resarray[i].active = '';
                                }
                            });
                        }

                        _this.setState({
                            custom_root: []
                        }, function () {
                            _this.setState({
                                custom_root: resarray,
                                custom_select_title: _title,
                                custom_select_id: _id
                            }, function () {
                                let listwidth = $('.lab-content').height() - $('#tab_second_cus').height() - 97;
                                $('#lab_list_cus').css('height', listwidth);
                                util.api({
                                    type: 'get',
                                    data: {
                                        method: "mkt.tag.custom.taxonomy.list.get",
                                        tag_tree_id: _id
                                    },
                                    success: function (res) {
                                        _this.setState({
                                            tab_list_custom: res.data
                                        }, function () {
                                            $('.ulhiare').unbind();
                                            $("#TreelibCustom").treeview();
                                            $(".dropdown-button").dropdown();
                                        });
                                    }
                                });
                            });
                        });
                    }
                    else {
                        _this.empty_traggle(true);
                    }
                }
            }
        });
    }

    onEditRoot(params){
        $(".btn-content").find(".accept").removeClass("disable");
        $('.content').removeAttr('style');
        this.set_Save();
            let _this =this;
            this.EditViewModals = new Modals.Window({
                width:450,
                title: "编辑分类",
                content: '<div class="con-body"/>',
                buttons: [
                    {
                        text: '确认',
                        cls: 'accept',
                        handler: function (self) {
                            let rootvalue= $('#edit_root').val();
                            rootvalue =rootvalue.replace(/(^\s*)|(\s*$)/g,"");

                            if (rootvalue.length==0)
                            {
                                rootvalue= '未命名分类';
                            }
                            util.api({
                                url: "?method=mkt.tag.custom.taxonomy.root.save",
                                type: 'post',
                                data: {
                                    "tag_tree_id":_this.state.custom_select_id,
                                    "tag_tree_name": rootvalue,
                                    "children": [],
                                    "children_tag": [ ]
                                },
                                success: function (res) {
                                    if(res.code==0) {
                                        _this.initCustomroot('edit');
                                        self.close();
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
                listeners: {
                    beforeRender: function () {
                   ReactDOM.render(
                            <RootEdit editname={_this.state.custom_select_title} />,
                            $('.con-body', this.$el)[0]
                        );
                    }
                }
            })
    }

    onSetupDisplay(params){
        this.set_Save();
        $(".btn-content").find(".accept").removeClass("disable");
        $('.content').removeAttr('style');
        let _this =this;
        this.DisplayViewModals = new Modals.Window({
            width:600,
            title: "设置优先显示",
            content: '<div class="con-body"/>',
            buttons: [
                {
                    text: '确认',
                    cls: 'accept',
                    handler: function (self) {
                       let custom_root =  self.rootDisplay.state.custom_root;

                        let active = self.rootDisplay.state.active;
                        if(active)
                        {
                            let set_root= [];
                            let set_root_obj=[];
                            custom_root.forEach((m,i)=>{
                                if(m.is_show)
                                {
                                    set_root.push(m.tag_tree_id);
                                    set_root_obj.push(m);
                                }
                            });
                            util.api({
                                url: "?method=mkt.tag.custom.taxonomy.show.set",
                                type: 'post',
                                data: {
                                    "tag_tree_id":set_root
                                },
                                success: function (res) {
                                    if(res.code==0) {
                                        _this.initCustomroot('create');
                                    }
                                    else {
                                        new Modals.Alert("保存失败!");
                                    }
                                }
                            });

                            _this.setState({
                                custom_root: set_root_obj
                            });
                            self.close();
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
                    this.rootDisplay = ReactDOM.render(
                        <RootDisplay />,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        })
    }

    //编辑 保存 取消
    onLabTit_Create(params){
        let customtree = this.state.tab_list_custom;

        this.setState({
            tab_list_custom:[]
        });

        let newtree=[];
        let isLast=true;
        let redom ="RD"+ Math.random()*10000000;
        redom=redom.split('.')[0];

        customtree.forEach((m)=>{
            if(m.tag_tree_id==this.state.lab_selectr){
                newtree.push(m);
                newtree.push({"tag_tree_id":redom,"tag_tree_name":"自定义分类","tag_count":0,"level":1,"children_count":0,"children":[],"children_tag":[]});
                isLast=false;
            }else{
                newtree.push(m);
            }
        });

        if(isLast)
        {
            newtree.push({"tag_tree_id":redom,"tag_tree_name":"自定义分类","tag_count":0,"level":1,"children_count":0,"children":[],"children_tag":[]});
        }

        let _this = this;
        _this.setState({
            tab_list_custom:newtree
        },function (e) {
            $('.ulhiare').unbind();
            $("#TreelibCustom").treeview();
            $(".dropdown-button").dropdown();
            $('.ulhiare').addClass('ulhiaredo');
            $('.list-div').removeClass('list-divdo');
        });
    }

    onLabTit_Edit(params){
        this.set_edit();
    }

    onLabTit_Save(params){
        let _this =this;
        util.api({
            url: "?method=mkt.tag.custom.taxonomy.save",
            type: 'post',
            data: {
                "tag_tree_id":_this.state.custom_select_id,
                "children": _this.state.tab_list_custom,
                "children_tag": []
            },
            success: function (res) {
                if(res.code==0) {
                    _this.initCustomroot('edit');
                }
                else {
                    new Modals.Alert("保存失败!");
                }
            }
        });
        this.set_Save();
    }

    onLabTit_Cancel(params){
        this.set_Save();
        this.initCustomroot('edit');
    }

    set_edit(){
        this.setState({
            lab_select:'edit',
            edit_type:1
        },function () {
            $('.flet-save').show();
            $('.flet-edit').hide();
            $('.ulhiare').addClass('ulhiaredo');
            $('.list-div').removeClass('list-divdo');

            $('.right-lab-empty').show();
            $('.right-lab-content').hide();
        });
    }
    set_Save(){
        this.setState({
            lab_selectr:'edit',
            edit_type:0
        },function () {
            $('.flet-save').hide();
            $('.flet-edit').show();
            $('.ulhiare').removeClass('ulhiaredo');
            $('.list-div').addClass('list-divdo');
        });
    }

    //树按钮
    onTree_AddLab(params)
    {

        let _this = this;
        $(".btn-content").find(".accept").removeClass("disable");
        $('.content').removeAttr('style');
        new Modals.Window({
            width:800,
            title: "从系统标签中选择标签",
            content: '<div class="con-body"/>',
            buttons: [
                {
                    text: '确认',
                    cls: 'accept',
                    handler: function (self) {


                        let chooselab=  self.addlab.state.lab_choose;
                        let tag_list = [];
                        chooselab.forEach((m,i)=>{
                           let addobj= {"tag_id":m.tag_id,"tag_name":m.tag_name,"tag_name_eng":m.tag_name_eng,"tag_desc":m.tag_desc,"flag":m.flag,"tag_cover":m.tag_cover};
                            tag_list.push(addobj);
                        });

                        let customtree = _this.state.tab_list_custom;

                        _this.setState({tab_list_custom:[]});
                        let newArray = [];
                        customtree.forEach((m,i)=> {
                            if (m.tag_tree_id == params.tag_tree_id) {
                                m.children_tag = tag_list;
                                m.tag_count = chooselab.length;

                            }
                            m.children.forEach((m1,i1)=>{
                                if (m1.tag_tree_id == params.tag_tree_id) {

                                    m1.children_tag = tag_list;
                                    m1.tag_count = chooselab.length;
                                }

                                m1.children.forEach((m2,i2)=>{
                                    if (m2.tag_tree_id == params.tag_tree_id) {

                                        m2.children_tag = tag_list;
                                        m2.tag_count = chooselab.length;
                                    }

                                });
                            });
                        });
                       _this.setState({tab_list_custom:customtree},function () {
                            $("#TreelibCustom").treeview();
                            $(".dropdown-button").dropdown();
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
            listeners: {
                beforeRender: function () {
                   this.addlab=  ReactDOM.render(
                        <AddLab select_labs={params.children_tag}/>,
                        $('.con-body', this.$el)[0]
                    );
                }
            }
        })
    }

    onTree_DeleteLab(params)
    {
        //比较笨的方法
        let customtree = this.state.tab_list_custom;
        this.setState({tab_list_custom:[]});
        let newArray = [];
        customtree.forEach((m,i)=>{
            if(m.tag_tree_id!=params.tag_tree_id){

                let newArray1 = [];
                m.children.forEach((m1,i1)=>{
                    if(m1.tag_tree_id!=params.tag_tree_id) {

                        let newArray2 = [];
                        m1.children.forEach((m2,i2)=>{
                            if(m2.tag_tree_id!=params.tag_tree_id) {

                                let newArray3 = [];
                                m2.children.forEach((m3,i3)=>{
                                    if(m3.tag_tree_id!=params.tag_tree_id) {


                                        newArray3.push(m3);
                                    }
                                });
                                m2.children =newArray3;

                                newArray2.push(m2);
                            }
                        });
                        m1.children =newArray2;

                        newArray1.push(m1);
                    }
                });
                m.children =newArray1;
                newArray.push(m);
            }
        });
        customtree =newArray;

        this.setState({tab_list_custom:customtree},function () {
         //   $("#TreelibCustom").treeview();
         //   $(".dropdown-button").dropdown();
        });
    }

    onTree_EditLab(params)
    {

        $(".btn-content").find(".accept").removeClass("disable");
        $('.content').removeAttr('style');
       let _this =this;
        this.EditClassViewModals = new Modals.Window({
            width:450,
            title: "编辑分类名称",
            content: '<div class="con-body"><div class="wincontent"><div class="input-div"><span class="input-tip">*</span><span class="input-lab">分类名称</span><span class="input-inp" ><input id="edit_calssName" maxLength="15" value="'+params.tag_tree_name+'" placeholder="请输入分类名称"/></span></div></div></div>',
            buttons: [
                {
                    text: '确认',
                    cls: 'accept',
                    handler: function (self) {

                        let letval = $('#edit_calssName').val();
                        letval =letval.replace(/(^\s*)|(\s*$)/g,"");

                        if (letval.length==0)
                        {
                            letval= '未命名分类';
                        }

                        let customtree = _this.state.tab_list_custom;
                        let newArray = [];

                        customtree.forEach((m,i)=> {
                            if (m.tag_tree_id == params.tag_tree_id) {

                                m.tag_tree_name = letval;
                            }
                            m.children.forEach((m1,i1)=>{
                                if (m1.tag_tree_id == params.tag_tree_id) {

                                    m1.tag_tree_name = letval;
                                }

                                m1.children.forEach((m2,i2)=>{
                                    if (m2.tag_tree_id == params.tag_tree_id) {

                                        m2.tag_tree_name = letval;
                                    }

                                });


                            });

                        });

                        _this.setState({
                            tab_list_custom:customtree
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
            ]
        })
    }

    empty_traggle(params){
        if(params){
            $('.lab-content').hide();
            $('.lab-empty').show();
            $('.right-lab-empty').show();
            $('.right-lab-content').hide();
        }
        else {
            $('.lab-content').show();
            $('.lab-empty').hide();
        }
    }

    recommit(params,type,event){

        this.setState({
            edit_type:1
        });

        let _this=this;
        setTimeout(function () {
            _this.setState({
                edit_type:0
            });
        },100);

        if(type==1)
        {
            event.nativeEvent.stopPropagation();
            let arrlist =this.state.tab_list_sys;
            arrlist.forEach((m,i)=>{
                m.children.forEach((ml)=>{
                    if(ml.tag_id == params.tag_id){

                        util.api({
                            url: '?method=mkt.tag.system.flag.set',
                            type: 'post',
                            data: {
                                'tag_id' :params.tag_id,
                                'flag' : !ml.flag
                            },
                            success: function (res) {
                            }
                        });
                        ml.flag=!ml.flag;

                    }
                });
            });
        }else if(type==2)
        {
            let arrcommit =this.state.tab_list_sys_li;
            arrcommit.forEach((ml,i)=>{
                if(ml.tag_id == params.tag_id){

                    util.api({
                        url: '?method=mkt.tag.system.flag.set',
                        type: 'post',
                        data: {
                            'tag_id' :params.tag_id,
                            'flag' : !ml.flag
                        },
                        success: function (res) {
                        }
                    });
                    ml.flag=!ml.flag;
                }
            });
        }
        else if(type==3){
            let arrcustom=this.state.tab_list_custom;
            arrcustom.forEach((m,i)=>{
                m.children.forEach((ml)=>{

                    ml.children_tag.forEach((ms,i)=>{
                        if(ms.tag_id == params.tag_id){

                            util.api({
                                url: '?method=mkt.tag.system.flag.set',
                                type: 'post',
                                data: {
                                    'tag_id' :params.tag_id,
                                    'flag' : !ms.flag
                                },
                                success: function (res) {
                                }
                            });
                            ms.flag=!ms.flag;
                        }
                    });

                });

                m.children_tag.forEach((ms,i)=>{
                    if(ms.tag_id == params.tag_id){

                        util.api({
                            url: '?method=mkt.tag.system.flag.set',
                            type: 'post',
                            data: {
                                'tag_id' :params.tag_id,
                                'flag' : !ms.flag
                            },
                            success: function (res) {
                            }
                        });
                        ms.flag=!ms.flag;
                    }
                });

            });
            console.log('9981',arrcustom);

        }
        let $target =$(event.target);
        if(!params.flag)
        {
            $target.css('color','#efefef');
            $target.mouseout(function () {
                $target.removeAttr("style");
            });
        }
        else {
            $target.removeAttr("style");
        }
    }

    onRoot_click(params){
        if(this.state.edit_type==1) {
            this.setState({
                lab_selectr:params.tag_tree_id
            });
        }
    }

    render(){
            return (
                <div className="left-box">
                    <div className="tab-content">
                        <div className="tab-btnwrap">
                            <ul className="tabs">
                                {this.state.tab_data.map((m, i)=> {
                                    return <li className="tab" id={'tabsid'+m.code}>
                                        <a href="#0" onClick={this.onTabclick.bind(this,m.code)}>{m.name}</a>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="sys-content" style={{display:this.state.tab_dispay.sys}}>
                        <div className="tab-second" id="tab_second">
                            <ul>
                                {this.state.tab_second.map((m, i)=> {
                                    return <li className={m.active} title={m.tag_name} onClick={this.onTabSeclick.bind(this,m)}>{m.tag_name}</li>
                                })}
                            </ul>
                        </div>
                        <div className="lab-list" id="lab_list">
                            <div className="lab-div">
                                <div className="list-title">{this.state.select_title}</div>
                                <div className="list-content">
                                    <ul className="ullist lists">

                                        {this.state.tab_list_sys_li.map((m,i)=>{
                                            return (
                                                <li className={this.state.lab_select==m.tag_id?"liin":""} onClick={this.onLab_click.bind(this,m)}>
                                                    <div className="fl"><a onClick={this.recommit.bind(this,m,2)} className={m.flag?"icon iconfont choose":"icon iconfont nochoose"}>&#xe6af;</a>{m.tag_name}</div>
                                                    <div>
                                                        <div className="fc">
                                                        </div>
                                                    </div>
                                                    <div className="fr">{m.tag_cover}</div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <div  className="ultree trees">
                                        <div id="treeDemo">
                                            <Treelib lab_select={this.state.lab_select} recommit={this.recommit.bind(this)}  onLab_click={this.onLab_click.bind(this)} datalist={this.state.tab_list_sys} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="self-content"  style={{display:this.state.tab_dispay.self}}>
                        <div className="lab-content">
                            <div className="setup">
                                <ico className="icon iconfont dropdown-button"  data-beloworigin="true"  data-activates="classsetup" data-constrainwidth="false"  title="设置根分类">&#xe629;</ico>
                                <ul className="dropdown-content" id="classsetup">
                                    <li onClick={this.onCreateRoot.bind(this)}><a href="javascript:void(0);">创建根分类</a></li>
                                    <li onClick={this.onEditRoot.bind(this)}><a href="javascript:void(0);">编辑根分类名称</a></li>
                                    <li onClick={this.onDeleteRoot.bind(this)}><a href="javascript:void(0);">删除根分类</a></li>
                                    <li onClick={this.onSetupDisplay.bind(this)}><a href="javascript:void(0);">设置优先显示</a></li>
                                </ul>
                            </div>
                            <div className="tab-second" id="tab_second_cus">
                                <ul>
                                    {this.state.custom_root.map((m,i)=>{
                                        return(
                                            <li  className={m.active} title={m.tag_tree_name}  onClick={this.onTabSeclick_custom.bind(this,m)}>{m.tag_tree_name}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="list-title">
                                <div className="fleft">{this.state.custom_select_title}</div>
                                <div className="fright flet-edit" onClick={this.onLabTit_Edit.bind(this)}>编辑</div>
                                <div className="fright flet-save">
                                    <span  onClick={this.onLabTit_Create.bind(this)}>创建子分类</span>
                                    <span  onClick={this.onLabTit_Save.bind(this)}>保存</span>
                                    <span  onClick={this.onLabTit_Cancel.bind(this)}>取消</span>
                                </div>
                            </div>
                            <div className="lab-list" id="lab_list_cus">

                                <div className="lab-div">

                                    <div className="list-content">
                                        <div  className="trees">
                                            <div id="TreelibCustom">
                                                <TreelibCustom edit_type={this.state.edit_type} onRoot_click={this.onRoot_click.bind(this)} onLab_click={this.onLab_click.bind(this)}  recommit={this.recommit.bind(this)} lab_selectr={this.state.lab_selectr}  lab_select={this.state.lab_select}  onTree_AddLab={this.onTree_AddLab.bind(this)} onTree_EditLab={this.onTree_EditLab.bind(this)} onTree_DeleteLab={this.onTree_DeleteLab.bind(this)} taglist={[]}  datalist={this.state.tab_list_custom} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="lab-empty">
                                <div className="empty-top">
                                    您尚未创建自定义分类
                                </div>
                                <div className="empty-bot">
                                    点击下方按钮快速创建分类
                                </div>
                                <div>
                                    <div className="btn-content">
                                        <a href="javascript:void(0);" className="accept"  onClick={this.onCreateRoot.bind(this)}>创建根分类</a>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            )
        }
}
module.exports = Panel;
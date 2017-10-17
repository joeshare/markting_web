'use strict';
let Ztree= require('plugins/jquery.treeview.js');

//树形组件
class Treelib extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    onLabclick(params,_this){
        if(!_this)
        {
            let argumentsprox = arguments[0].clientY ?arguments[0]:arguments[1];

            _this = argumentsprox;
        }
        this.props.onLabclick(params,_this);
    }
    render(){
        if(this.props.datalist!=null)
        {
        return(
            <ul>
                {
                    this.props.datalist.map((m,i)=> {
                        if(m.children){
                            return(<li>{m.tag_name}
                                <Treelib datalist={m.children} onLabclick={this.onLabclick.bind(this)}/>
                            </li>)
                        }
                        else {
                            return(<li className="lab-sys-li" onClick={this.onLabclick.bind(this,{'tag_id':m.tag_id,'tag_name':m.tag_name,'search_mod':m.search_mod,'type':1,'tag_value':null})}>{m.tag_name}
                                <Treelib datalist={m.children} onLabclick={this.onLabclick.bind(this)}/>
                            </li>)
                        }
                    })
                }
            </ul>
        )
        }
        else{
            return(null)
        }
    }
}

//树形组件CUS
class TreelibCustom extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    onLabclick(params,_this){
        if(!_this)
        {
            let argumentsprox = arguments[0].clientY ?arguments[0]:arguments[1];

            _this = argumentsprox;
        }
        this.props.onLabclick(params,_this);
    }
    render(){
        if(this.props.datalist!=null)
        {
            return(
                <ul>
                    {
                        this.props.datalist.map((m,i)=> {
                            if(m.children!=null){
                                return(<li>{m.tag_tree_name}
                                    <TreelibCustom onLabclick={this.onLabclick.bind(this)} datalist={m.children} taglist={m.children_tag}  />
                                </li>)
                            }
                            else {
                                return(null)
                            }
                        })
                    }
                    {
                        this.props.taglist.map((ml,il)=>{
                            return(<li  className="lab-sys-li"  onClick={this.onLabclick.bind(this,{'tag_id':ml.tag_id,'tag_name':ml.tag_name,'search_mod':ml.search_mod,'type':1,'tag_value':null})}>
                                {ml.tag_name}
                            </li>)
                        })
                    }
                </ul>
            )
        }
        else{
            return(null)
        }
    }
}

class LabModel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tab_data: [{name: '推荐标签', code: 0}, {name: '系统标签', code: 1}, {name: '自定义标签', code:2}],
            tab_list_sys: [], //系统列表
            tab_list_com: [], //推荐列表
            lab_id:'',
            lab_id_old:'',
            lab_edit_id:'editid',
            lab_name:'',
            lab_exclude:0,
            lab_index:0,
            lab_model:0,     //标签模式  1 市区  0其它
            tag_type:0,    //标签类型  1自定义标签  0系统标签
            lab_list:[],     //立京返回过来的标签列表
            lab_value_list:[], //立京返回过来的标签值列表
            lab_count:0,       //覆盖人数
            in_lab: [],      //已选
            out_lab: [],     //未选
            group_id:'',
            search_list: [],
            search_count:0,
            search_text:'',
            search_list_custom: [],
            search_count_custom:0,
            search_text_custom:'',
            search_timecount:-1,  //标签搜索计时器
            search_value_timecount:-1,
            search_timemochine:null,   //值搜索计时器
            search_value_timemochine:null,
            search_isfirstKeydown:true,
            search_value_isfirstKeydown:true,
            tab_second: [],
            current_tab:'全部标签',
            tab_list_custom:[],
            group_list_custom:[]
        }
    }
    componentDidMount(){
        $('#container').on('click',function (e) {
            if($(e.target).parents("#labmodelid").length<=0)
            {
                $('.labmodel').removeClass('show');
                $('.openmodel').hide();
            }
        });
        $('#labmodelid').on('click',function (e) {
            if($(e.target).parents("#search-content-id").length<=0&&$(e.target).parents("#search-box-id").length<=0)
            {
                $('#search-content-id').hide();
            }
        });
        $('body').append("<div class='openmodel'></div>");
        $('.lab-sys').hide();
        $('.lab-sys-select').hide();
        $('.lab-custom').hide();
    }
    componentWillMount(){
        this.initList();
    }
    //初始化
    initList(){
        let _this= this;
        //推荐列表;
        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.system.flag.list.get"
            },
            success: function (res) {

                if (res.data.length <= 0) {

                    $('.empty-group-comman').show();
                }
                else {
                    $('.empty-group-comman').hide();
                }

                _this.setState({
                    tab_list_com: res.data
                });
            }
        });

        this.initDrop();
    }
    initDrop(){
        let _this= this;
        let Rootaray=[];

        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.root.node.list.get"
            },
            success: function (res) {
                res.data[0]=  res.data[0].filter((m)=>{
                   return (m.tag_id !="1");
                });

                res.data[0].forEach((m)=>{
                    m.type =1;
                    Rootaray.push(m);
                });

                util.api({
                    type: 'get',
                    data: {
                        method: "mkt.tag.custom.taxonomy.root.list.get"
                    },
                    success: function (res) {
                        res.data.forEach((m1)=>{
                            let inobject ={type:2,tag_id:m1.tag_tree_id,tag_name:m1.tag_tree_name};
                            Rootaray.push(inobject);
                        });
                        _this.setState({
                            tab_second: Rootaray
                        });

                        $('.dropdown-button').dropdown();
                    }
                });
            }
        });

        //获取标签列表
        util.api({
            type: 'get',
            data: {
                tag_id:0,
                method: "mkt.tag.tree.list.get",
                page_source_type:1
            },
            success: function (res) {
                _this.setState({
                    tab_list_sys: res.data[0]
                },function () {
                    $("#treeDemo").find("ul").css('margin-left',"-18px").end().css('overflow','hidden');
                    $("#treeDemo").find('li').css('line-height','30px');
                    $("#treeDemo").treeview();
                });
            }
        });

        //获取自定义标签值列表
        util.api({
             type: 'get',
             data: {
                 method: "mkt.segment.customtag.category.list"
             },
             success: function (res) {
                 if (res.code == 0) {
                     let grouplist = res.data;
                     if (grouplist.length <= 0) {

                         $('.empty-group').show();
                     }
                     else {
                         $('.empty-group').hide();
                     }
                     grouplist.map(m=> {
                         m.tag_id = m.custom_tag_category_id;
                         m.tag_name = m.custom_tag_category_name;
                         m.children = null;
                     });

                     _this.setState({
                         group_list_custom: grouplist
                     }, function () {
                         $("#treecustom").css('margin-left', "-16px");
                         $("#treecustom").treeview();
                     });
                 }
                 else {
                     $('.empty-group').show();
                 }
             }
         });
    }
    onDropDown(params){
        this.setState({
            current_tab:params.tag_name
        });

        let _this= this;
        _this.setState({
            tab_list_sys:[]
        });

        if(params.type==1){
            $('#treeDemo').show();
            $('#TreelibCustom').hide();

            //获取标签列表
            util.api({
                type: 'get',
                data: {
                    tag_id:params.tag_id,
                    method: "mkt.tag.tree.list.get",
                    page_source_type:1
                },
                success: function (res) {
                    _this.setState({
                        tab_list_sys: res.data[0]
                    },function () {
                        if(params.tag_id<2){
                            $("#treeDemo").find("ul").css('margin-left',"-18px").end().css('overflow','hidden');
                            $("#treeDemo").find('li').css('line-height','30px');
                        }
                        else {
                            $("#treeDemo").find("ul").css('margin-left',"0px").end().css('overflow','');
                            $("#treeDemo").find('li').css('line-height','');
                        }
                        $("#treeDemo").treeview();
                    });
                }
            });
        }
        else {
            $('#treeDemo').hide();
            $('#TreelibCustom').show();

            _this.setState({
                tab_list_custom:[]
            });
            util.api({
                type: 'get',
                data: {
                    method: "mkt.tag.custom.taxonomy.list.get",
                    tag_tree_id:params.tag_id,
                    page_source_type:1
                },
                success: function (res) {
                    _this.setState({
                        tab_list_custom: res.data
                    },function () {
                        $("#TreelibCustom").treeview();
                    });
                }
            });
        }

    }

    //弹出对话框
    showModel(params){
        $('.labmodel').addClass('show');
        $('.openmodel').show();
        this.resetState(params);
        let getarray = params.goup.tag_list;
        this.setState({
            lab_list:getarray,
            group_id:params.goup.group_id,
            lab_id_old:params.tagid
        });

        this.onSearch_close();
        if(params.type)//编辑
        {
            $('.lab-choose').hide();
            $('.lab-value').show();

            let lab_exclude=0,lab_index=0,lab_model=0,lab_name = '',in_lab = [],out_lab = [];
            let _this=this;

            for(let i=0;i<getarray.length;i++) {
                if(getarray[i].tag_id==params.tagid)
                {
                    lab_exclude = getarray[i].tag_exclude;
                    lab_index =getarray[i].tag_index;
                    lab_model=getarray[i].tag_model;
                    lab_name = getarray[i].tag_name;
                    let valuelist = getarray[i].tag_value_list;
                    let postobject= null;
                    if(getarray[i].tag_type==1){
                        postobject={
                            method: "mkt.segment.customtag.get",
                            custom_tag_category_id:params.tagid
                        };
                        $('.value-sys').hide();
                        $('.value-cust').show();
                    }else{
                        postobject= {
                            method: "mkt.tag.system.value.list.get",
                            tag_id:params.tagid
                        };
                        $('.value-sys').show();
                        $('.value-cust').hide();
                    }

                    _this.setState({
                        tag_type:getarray[i].tag_type,
                        lab_edit_id:params.tagid
                    });

                    util.api({
                        type: 'get',
                        data: postobject,
                        success: function (res) {
                            if(getarray[i].tag_type==1){
                                res.data.map((m)=>{
                                    m.tag_value = m.custom_tag_name;
                                    m.tag_value_seq = m.custom_tag_id;
                                    m.value_count = m.cover_number;
                                });
                                out_lab =res.data;
                            }
                            else {
                                out_lab = res.data;
                            }

                            for(let j=0;j<valuelist.length;j++)
                            {
                                let countnum = 0;
                                for(let k=0;k<out_lab.length;k++)
                                {
                                    if(valuelist[j].tag_value_id ==out_lab[k].tag_value_seq)
                                    {
                                        countnum = out_lab[k].value_count;
                                        break;
                                    }
                                }
                                in_lab.push({'tag_value':valuelist[j].tag_value,'tag_value_seq':valuelist[j].tag_value_id,'value_count':countnum,'isin':true,'tag_status':valuelist[j].tag_status});
                            }
                            _this.setState({
                                lab_id:params.tagid,
                                lab_name:lab_name,
                                lab_exclude:lab_exclude,
                                lab_index:lab_index,
                                lab_model:lab_model
                            });
                            _this.addToinList(in_lab);
                            _this.addTooutList(out_lab);
                            _this.showChart();

                            setTimeout(function () {
                                if($('.value-cust .value-content .rui-cursor-pointer').length==$('.value-cust .value-content .selected').length+$('.value-cust .value-content .selected-red').length)
                                {
                                    $('#group-all-custom').prop('checked','checked');
                                }
                                else{
                                    $('#group-all-custom').removeAttr('checked');
                                }
                                if($('.value-sys .value-content .rui-cursor-pointer').length==$('.value-sys .value-content .selected').length)
                                {
                                    $('#group-all').prop('checked','checked');
                                }
                                else{
                                    $('#group-all').removeAttr('checked');
                                }
                            },10);
                        }
                    });
                    break;
                }
            }
        }
        else {//新增
            this.onReturnLab();
            this.onTabclick(0);
        }
    }
    //将数据返回给主页面
    returnValue(params){
        let obj ={
            "tag_id": this.state.lab_id,
            "tag_id_old": this.state.lab_id_old,
            "group_id":this.state.group_id,
            "tag_name": this.state.lab_name,
            "tag_type": this.state.tag_type, // 1自定义标签 0 系统标签
            "tag_exclude": this.state.lab_exclude,
            "tag_index": this.state.lab_index,
            "tag_model": this.state.lab_model,
            "tag_value_list":this.state.lab_value_list
        };
        try{
            if(obj.tag_value_list.length==0)
            {
                obj.tag_type=0;
            }
            this.props.returnValue(obj);
        }catch (e){
            console.log(e)
        }

        this.onclose();
    }
    //关闭对话框
    onclose(e){
        $('.labmodel').removeClass('show');
        $('.openmodel').hide();
    }
    onTabclick(params){
        switch(params)
        {
            case 2:
                $('.lab-custom').show();
                $('.lab-comman').hide();
                $('.lab-sys').hide();
                $('.lab-sys-select').hide();
                $('#tabsid2 a').click();
                break;
            case 1:
                //系统标签
                $('.lab-comman').hide();
                $('.lab-sys').show();
                $('.lab-sys-select').show();
                $('.lab-custom').hide();
                $('#tabsid1 a').click();
                break;
            case 0:
                //推荐标签
                $('.lab-comman').show();
                $('.lab-sys').hide();
                $('.lab-sys-select').hide();
                $('.lab-custom').hide();
                $('#tabsid0 a').click();
                break;
        }
    }
    onLabclick(params,_this){
        let getarray = this.state.lab_list;
            for(let i=0;i<getarray.length;i++) {
                if (getarray[i].tag_id == params.tag_id) {
                    if(params.tag_id!=this.state.lab_edit_id)
                    {
                    let argumentsprox = arguments[0].clientY ?arguments[0]:arguments[1];
                    let event = window.event || argumentsprox;
                    let laby= event.clientY-130;
                    let labx= event.clientX-822;
                    $('.tooltip').css("top",laby);
                    $('.tooltip').css("left",labx);
                    $('.tooltip .txt').html("此标签已选，请选择其它标签");
                    $('.tooltip').show();
                    setTimeout(function () {
                        $('.tooltip').hide();
                    },1000);
                    return false;
                }
            }
        }
            this.resetState();

            if(params.type==1)
            {
                $('.value-sys').show();
                $('.value-cust').hide();
                this.setState({
                    lab_model: params.search_mod,
                    lab_name: params.tag_name,
                    lab_id:params.tag_id,
                    tag_type:0,
                });
                let _that= this;
                util.api({
                    type: 'get',
                    data: {
                        method: "mkt.tag.system.value.list.get",
                        tag_id:params.tag_id
                    },
                    success: function (res) {
                        _that.setState({
                            lab_count:0,
                            in_lab:[]
                        });
                        _that.addTooutList(res.data);
                        _that.showChart();
                    }
                });
            }
            else if(params.type==2)
            {
                $('.value-sys').show();
                $('.value-cust').hide();
                this.setState({
                    lab_id:params.tag_id,
                    lab_name:params.tag_name,
                    tag_type:0,
                    lab_model:params.search_mod,
                    lab_value_list:[{'tag_value_id':params.tag_value_seq,'tag_value':params.tag_value,'tag_status':0}]
                });
                let _that = this;
                setTimeout(function () { _that.returnValue();},10);
            }
            else if(params.type==3) {
                $('.value-sys').hide();
                $('.value-cust').show();
                this.setState({
                    lab_model: 0,
                    lab_name: params.tag_name,
                    lab_id:params.tag_id,
                    tag_type:1
                });
                let _that= this;
                util.api({
                    type: 'get',
                    data: {
                        method: "mkt.segment.customtag.get",
                        custom_tag_category_id:params.tag_id
                    },
                    success: function (res) {
                        _that.setState({
                            lab_count:0,
                            in_lab:[]
                        });
                        res.data.map(m=>{
                            m.tag_value = m.custom_tag_name;
                            m.tag_value_seq = m.custom_tag_id;
                            m.value_count = m.cover_number;
                        })
                        _that.addTooutList(res.data);
                    },
                    error:function (res) {

                    }
                });
            }
            else{
                $('.value-sys').hide();
                $('.value-cust').show();
                this.setState({
                    lab_id:params.tag_id,
                    lab_name:params.tag_name,
                    tag_type:1,
                    lab_model:0,
                    lab_value_list:[{'tag_value_id':params.tag_value_seq,'tag_value':params.tag_value,'tag_status':params.tag_status}]
                });
                let _that = this;
                setTimeout(function () { _that.returnValue();},10);
            }

            $('.lab-choose,#search-content-id').hide();
            $('.lab-value').show();
            this.onSearch_close();
    }
    onReturnLab(){
        //$('.lab-sys').show();
        $('.lab-choose').show();
        $('.lab-value').hide();
    }
    //搜索相关
    onSearch_change(){
        if($('#search-input').val().length==0)
        {
           this.onSearch_close();
        }
        else {
            $('.search-content,#search-input-close').show();
        }
    }
    onSearch_close(){
        $('#search-input').val('');
        $('#search-input-close,.search-content').hide();
        this.setState({
            search_list: [],
           // search_ismu:false,
           // search_index:1,
            search_count:0,
            search_isfirstKeydown:true
        });
    }
    onSearch_click(params){
            let events = window.event || arguments[1];
            if(params=='keyup')
            {
                /*if((typeof(window.event) != "undefined"))
                {
                    if(this.state.search_isfirstKeydown)
                    {
                        this.setState({
                            search_isfirstKeydown:false
                        });
                        return;
                    }

                }*/
                if(events.keyCode != 13){
                    this.setState({
                        search_timecount:10
                    });
                }
                else{
                    this.setState({
                        search_timecount:-1
                    });
                }
            }

            let _this= this;
            if(!this.state.search_timemochine)
            {
                this.state.search_timemochine = setInterval(function(){
                    let timecount = _this.state.search_timecount-1;
                    _this.setState({
                        search_timecount:timecount
                    });
                    if(timecount<0)
                    {
                        _this.onSearch_click();
                        clearInterval(_this.state.search_timemochine);
                        _this.setState({
                            search_timemochine:null
                        });
                    }
               },100);
            }
            if(_this.state.search_timecount<0)
            {
                if($('#search-input').val().length!=0) {
                    util.api({
                        type: 'get',
                        data: {
                            method: "mkt.tag.segment.fuzzy.list",
                            name: $('#search-input').val(),
                        },
                        success: function (res) {

                            let _searchlist = res.data[0].system_tag;
                            _this.setState({
                                search_list: _searchlist,
                                search_text: $('#search-input').val(),
                                search_count: res.data[0].system_total_count
                            });

                            let _searchlist_cus = res.data[0].custom_tag;

                            _this.setState({
                                search_list_custom: _searchlist_cus,
                                search_text_custom: $('#search-input').val(),
                                search_count_custom: res.data[0].custom_total_count
                            });
                        },
                        error:function (res) {

                        }
                    });
                }
            }
    }
    onSearch_close_value(){
        $('#search-input-value').val('');
        $('#search-input-valclose').hide();
        this.setState({
            search_value_isfirstKeydown:true
        });
    }
    onSearch_change_value(){
        let $valclose = $('#search-input-valclose');
        if($('#search-input-value').val().length==0)
        {
            this.onSearch_close_value();
        }
        else {
            $valclose.show();
        }
    }
    onSearch_click_value(params){

        let events = window.event || arguments[1];
        if(params=='keyup')
        {
            if((typeof(window.event) != "undefined"))
            {
                if (this.state.search_value_isfirstKeydown) {
                    this.setState({
                        search_value_isfirstKeydown: false
                    });
                    return;
                }
            }
            if(events.keyCode != 13){
                this.setState({
                    search_value_timecount:10
                });
            }
            else{
                this.setState({
                    search_value_timecount:-1
                });
            }
        }

        let _this= this;

        if(!this.state.search_value_timemochine)
        {
            this.state.search_value_timemochine = setInterval(function(){
                let timecount = _this.state.search_value_timecount-1;

                _this.setState({
                    search_value_timecount:timecount
                });
                if(timecount<0)
                {
                    _this.onSearch_click_value();
                    clearInterval(_this.state.search_value_timemochine);
                    _this.setState({
                        search_value_timemochine:null
                    });
                }
            },100);
        }
        if(_this.state.search_value_timecount<0)
        {
            if($('#search-input-value').val().length!=0) {
                util.api({
                    url: "?method=mkt.segment.secondary.taglist.search",
                    type: 'post',
                    data: {
                        tag_id: _this.state.lab_id,
                        tag_name: _this.state.lab_name,
                        key_word: $('#search-input-value').val(),
                        select_tag_value_list: null
                    },
                    success: function (res) {

                        res.data = res.data.length > 0 ? res.data : [];

                        _this.setState({
                            out_lab: res.data
                        });
                    }
                });
            }
        }
    }
    onselectAll(){
        if($('#group-all').is(':checked'))
        {
            $('#group-all').removeAttr('checked');
            let inlistarray = this.state.in_lab;
            for(let i=0;i<inlistarray.length;i++)
            {
                inlistarray[i].isin =false;
            }
            this.addToinList(inlistarray);
        }
        else {
            $('#group-all').prop('checked','checked');

            let inlistarray = this.state.in_lab;
            for(let i=0;i<inlistarray.length;i++)
            {
                inlistarray[i].isin =true;
            }
            this.addToinList(inlistarray);

            let outlistarray = this.state.out_lab.concat();
            for(let i=0;i<outlistarray.length;i++)
            {
                this.onOuttab_click(outlistarray[i]);
            }
        }
    }
    onselectAllCustom(){
        if($('#group-all-custom').is(':checked'))
        {
            $('#group-all-custom').removeAttr('checked');
            let inlistarray = this.state.in_lab;
            for(let i=0;i<inlistarray.length;i++)
            {
                inlistarray[i].isin =false;
            }
            this.addToinList(inlistarray);
        }
        else {
            $('#group-all-custom').prop('checked','checked');

            let inlistarray = this.state.in_lab;
            for(let i=0;i<inlistarray.length;i++)
            {
                inlistarray[i].isin =true;
            }
            this.addToinList(inlistarray);

            let outlistarray = this.state.out_lab.concat();
            for(let i=0;i<outlistarray.length;i++)
            {
                this.onOuttab_click(outlistarray[i]);
            }
        }
    }
    //标签点击的事件处理
    onOuttab_click(params) {
       let inlistarray = this.state.in_lab;
       let inobject  ={"tag_value":params.tag_value,"tag_value_seq":params.tag_value_seq,"value_count":params.value_count,"isin":true,"tag_status":0};

        for(let i=0;i<inlistarray.length;i++)
        {
            if(inlistarray[i].tag_value_seq == inobject.tag_value_seq)
            {
                let event = window.event || arguments[1];
                //已选
                let $tagobject =  $(event.target).is('div')?$(event.target):$(event.target).parent();
                let laby= $tagobject.position().top+12;
                let labx= $tagobject.position().left-18;
                $('.tooltip').css("top",laby);
                $('.tooltip').css("left",labx);
                $('.tooltip .txt').html("此标签值已选，请选择其它值");
                $('.tooltip').show();
                setTimeout(function () {
                    $('.tooltip').hide();
                },1000);
                return false;
                break;
            }
        }
        inlistarray.push(inobject);
        this.addToinList(inlistarray);
        let outlistarray = this.state.out_lab;
        outlistarray = this.removeListObject(outlistarray,inobject);
        this.addTooutList(outlistarray);
        //设置全选checkbox框
        if($('.value-cust .value-content .rui-cursor-pointer').length==$('.value-cust .value-content .selected').length+$('.value-cust .value-content .selected-red').length+1)
        {
            $('#group-all-custom').prop('checked','checked');
        }
        if($('.value-sys .value-content .rui-cursor-pointer').length==$('.value-sys .value-content .selected').length+1)
        {
            $('#group-all').prop('checked','checked');
        }
    }
    onIntab_click(params) {
        let inlistarray = this.state.in_lab;
        if(params.isin)
        {
            $('#group-all').removeAttr('checked');
            $('#group-all-custom').removeAttr('checked');
        }
        else {
            if($('.value-cust .value-content .rui-cursor-pointer').length==$('.value-cust .value-content .selected').length+$('.value-cust .value-content .selected-red').length+1)
            {
                $('#group-all-custom').prop('checked','checked');
            }
            if($('.value-sys .value-content .rui-cursor-pointer').length==$('.value-sys .value-content .selected').length+1)
            {
                $('#group-all').prop('checked','checked');
            }
        }

        let inval = !params.isin;

        for(let i=0;i<inlistarray.length;i++)
        {
            if(inlistarray[i].tag_value_seq == params.tag_value_seq)
            {
                inlistarray[i].isin = inval;
                break;
            }
        }
        this.addToinList(inlistarray);
    }
    //移除array中存在的object
    removeListObject(array,object) {
        let index = 0;
        for(let i=0;i<array.length;i++)
        {
            if(array[i].tag_value_seq == object.tag_value_seq)
            {
                index = i;
                break;
            }
        }
        if (index > -1) {
            array.splice(index,1);
        }
        return array;
    }
    //将数据添加到已经列表（增加过虑）
    addToinList(inlistarray){
        let covercount = 0;
        let taglist = [];
        for(let i=0;i<inlistarray.length;i++)
        {
            if(inlistarray[i].isin)
            {
                covercount+=inlistarray[i].value_count;
                taglist.push({
                    "tag_value_id":inlistarray[i].tag_value_seq,
                    "tag_value": inlistarray[i].tag_value,
                    "tag_status": inlistarray[i].tag_status
                });
            }
        }
        this.setState({
            lab_count:covercount,
            in_lab:inlistarray,
            lab_value_list:taglist
        });

    }
    //将数据添加到未选列表（增加过虑）
    addTooutList(arrout){
        let inlistarray = this.state.in_lab.concat();
        let outlistarray = arrout.concat();

        for(let j=0;j<arrout.length;j++) {
            for(let i=0;i<inlistarray.length;i++) {
                if(arrout[j].tag_value_seq==inlistarray[i].tag_value_seq)
                {
                    outlistarray = this.removeListObject(outlistarray,arrout[j]);
                }
            }
        }
        this.setState({
            out_lab:outlistarray
        });
    }
    thousandbit(num) {
        return num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
    }
    //显示下面图表
    showChart(){
        //图表脚本
        var options = {
            color: ['#5BD4C7'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top: '-2',
                left:'-25',
                bottom: '15%',
                containLabel: true,
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['采煤', '测试', '测试', '测试', '测试', '测试', '测试'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        interval:0,
                        rotate:49
                    },
                    splitLine:{
                        interval:0,
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{show:false},
                    axisLine:{show:false},
                    axisTick:{show:false}
                }
            ],
            series : [
                {
                    type:'bar',
                    barWidth: '60%',
                    data:[10, 52, 200, 334, 390, 330, 220]
                }
            ]
        };
        let myChart = echarts.init(document.getElementById('chartsid'));
        myChart.showLoading();
        let _this=this;
        util.api({
            type: 'get',
            data: {
                method: "mkt.segment.tagname.tagcount.get",
                tag_ids:_this.state.lab_id
            },
            success: function (res) {
                let _xaxis =[];
                let _series = [];
                let outnum = 0;
                let allcount = 0;
                let allcountkey =false;

                let sevenname ='';
                for(let i=0;i<res.data.length;i++)
                {
                    let tagcount = 0;
                    try{
                        tagcount = res.data[i].tag_count;
                    }
                    catch (ex){}

                    if(i>5)
                    {
                        if(i==6)
                        {
                            sevenname = res.data[i].tag_name;
                        }
                        outnum+=tagcount;
                        allcountkey = true;
                    }
                    else {
                        _xaxis.push(res.data[i].tag_name);
                        _series.push(tagcount);
                        allcount+=tagcount;
                    }
                }

                if(allcountkey)
                {
                    _xaxis.push(sevenname+'及其它');
                    _series.push(outnum);
                    allcount+=outnum;
                }

                if(allcount<=0)
                {
                    options.grid =  {
                        top: '-2',
                        left:'10',
                        bottom: '15%',
                        containLabel: true,
                    };
                }
                options.xAxis  = [
                    {
                        type : 'category',
                        data : _xaxis,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel:{
                            interval:0,
                            rotate:30
                        },
                        splitLine:{
                            interval:0,
                        }
                    }];

                options.series = [
                    {
                        name:'覆盖人数',
                        type:'bar',
                        barWidth: '60%',
                        data:_series
                    }];
                myChart.hideLoading();
                myChart.setOption(options);
            }
        });
        //图表结束
    }
    //重置state数据
    resetState(){
        this.setState(
        {
            lab_id:'',
            lab_name:'',
            lab_exclude:0,
            lab_index:0,
            lab_model:0,
            lab_value_list:[],
            lab_count:0,
            in_lab: [],
            out_lab: [],
            search_list: [],
           // search_index:1,
            search_count:0,
            search_text:'',
           // search_ismu:false,
            search_timecount:-1,
            search_value_timecount:-1,
            search_timemochine:null,
            search_value_timemochine:null,
            search_isfirstKeydown:true,
            search_value_isfirstKeydown:true
        });
        $('#group-all').removeAttr('checked');
        $('#group-all-custom').removeAttr('checked');
    }
    render(){
        let _this=this;
        let stye_search = { display:_this.state.lab_model==1?'block':'none'};
        let event = window.event || arguments[0];
        return (
            <div id="labmodelid" onClick={(event)=>{event.nativeEvent.stopPropagation();}} className="labmodel">
                <div className="title">
                        <div id="search-box-id"  className="search-box">
                            <input id="search-input" className="input" type="text" onKeyUp={this.onSearch_click.bind(this,'keyup')}  onChange={this.onSearch_change.bind(this)} placeholder="标签及标签值搜索人群" />
                            <div className="icon iconfont"  onClick={this.onSearch_click.bind(this,'click')}  >&#xe668;</div>
                            <div id="search-input-close"  onClick={this.onSearch_close.bind(this)} className="ico icon iconfont closeicon">&#xe608;</div>
                        </div>
                        <div id="search-content-id" className="search-content">
                            <div>
                                <div className="search-tit"><span className="search-txt-path">系统标签：</span><span className="search-txt-val">{this.state.search_count}个 &nbsp;</span><span className="search-txt-path">默认显示前10个</span></div>
                                <div className="search-txt">
                                    <ul id="search-txt-ul">
                                        {this.state.search_list.map((m, i)=> {
                                            if(m.is_tag)//是否标签
                                            {
                                                return(
                                                    <li onClick={this.onLabclick.bind(this,{'tag_id':m.tag_id,'tag_name':m.tag_name,'search_mod':m.search_mod,'type':1,'tag_value':null,'tag_value_seq':m.tag_value_seq})}>
                                                        <span className="search-txt-path">{m.tag_path}</span>
                                                        <span className="search-txt-val">{m.tag_name}</span>
                                                    </li>
                                                )
                                            }
                                            else
                                            {
                                                return(
                                                    <li onClick={this.onLabclick.bind(this,{'tag_id':m.tag_id,'tag_name':m.tag_name,'search_mod':m.search_mod,'type':2,'tag_value':m.tag_value,'tag_value_seq':m.tag_value_seq})}>
                                                        <span className="search-txt-path">{m.tag_path}</span>
                                                        <span className="search-txt-val">{m.tag_name+'-'+m.tag_value}</span>
                                                    </li>
                                                )
                                            }
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div style={{marginTop:'10px'}}>
                                <div className="search-tit"><span className="search-txt-path">自定义标签：</span><span className="search-txt-val">{this.state.search_count_custom}个 &nbsp; </span><span className="search-txt-path">默认显示前10个</span></div>
                                <div className="search-txt">
                                    <ul id="search-txt-ul">
                                        {this.state.search_list_custom.map((m, i)=> {
                                            return(
                                                <li onClick={this.onLabclick.bind(this,{'tag_id':m.custom_tag_category_id,'tag_name':m.custom_tag_category_name,'search_mod':0,'type':4,'tag_value':m.custom_tag_name,'tag_value_seq':m.custom_tag_id,'tag_status':0})}>
                                                    <span className="search-txt-path">{m.tag_path}</span>
                                                    <span className="search-txt-val">{m.custom_tag_name}</span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="content">
                    <div className="lab-choose">
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
                        <div className="choose-content">
                            <div className="lab-comman">
                                <ul>{
                                    this.state.tab_list_com.map((m,i)=> {
                                    return(
                                        <li onClick={this.onLabclick.bind(this,{'tag_id':m.tag_id,'tag_name':m.tag_name,'search_mod':m.search_mod,'type':1,'tag_value':null})}>{m.tag_name}</li>
                                    )})}
                                </ul>
                                <div className="empty-group-comman">未找到推荐标签</div>
                            </div>

                            <div className="lab-sys-select">
                                <span className="selectbtn dropdown-button" data-activates="selectdrop" data-beloworigin="false">{this.state.current_tab}</span>
                                <ul id="selectdrop" className="dropdown-content" >
                                    {
                                        this.state.tab_second.map((m,i)=>{
                                            return(
                                                <li onClick={this.onDropDown.bind(this,m)} >{m.tag_name}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>

                            <div className="lab-sys">
                                <div id="treeDemo">
                                    <Treelib datalist={this.state.tab_list_sys}  onLabclick={this.onLabclick.bind(this)}/>
                                </div>

                                <div id="TreelibCustom">
                                    <TreelibCustom datalist={this.state.tab_list_custom}  taglist={[]}  onLabclick={this.onLabclick.bind(this)}/>
                                </div>
                            </div>

                            <div className="lab-custom">
                                <ul>{
                                    this.state.group_list_custom.map((m,i)=> {
                                        return(
                                            <li onClick={this.onLabclick.bind(this,{'tag_id':m.tag_id,'tag_name':m.tag_name,'search_mod':m.search_mod,'type':3,'tag_value':null})}>{m.tag_name}&nbsp;({this.thousandbit(m.custom_tag_count)})</li>
                                        )})}
                                </ul>
                                <div className="empty-group">未找到自定义标签</div>
                            </div>
                        </div>
                    </div>
                    <div className="lab-value">
                        <div className="value-sys">
                            <div className="value-title">
                                <span>标签：</span>
                                <span className="title-txt"><span className="title-txt-area" title={this.state.lab_name}><div><span>{this.state.lab_name}</span></div></span>[覆盖人数<span className="title-txt-area-num" title={this.thousandbit(this.state.lab_count)}><div><span>{this.thousandbit(this.state.lab_count)}</span></div></span>人]</span>
                            <span className="title-txt" onClick={this.onselectAll.bind(this)}>
                                     <input type="checkbox" className="filled-in" id="group-all" />
                                     <label for="group-all">全选</label>
                            </span>
                            </div>
                            <div className="value-search" style={stye_search}>
                                <div className="search-box">
                                    <input id="search-input-value" onKeyUp={this.onSearch_click_value.bind(this,'keyup')} onChange={this.onSearch_change_value.bind(this)} className="input" type="text"  placeholder="请输入标签值搜索" />
                                    <div className="icon iconfont"  onClick={this.onSearch_click_value.bind(this,'click')}>&#xe668;</div>
                                    <div id="search-input-valclose" onClick={this.onSearch_close_value.bind(this)} className="ico icon iconfont closeicon">&#xe608;</div>
                                </div>
                            </div>
                            <div className="value-content">
                                <div className="cont-choose">
                                    {
                                        this.state.in_lab.map((m,i)=> {
                                            if(m.isin)
                                            {
                                                return(
                                                    <div onClick={this.onIntab_click.bind(this,m)} className='contact-field rui-cursor-pointer selected'>
                                                <span className="text">
                                                    {m.tag_value}
                                                </span>
                                                        <span className="a keyong icon iconfont round" id="tag-edit">&#xe610;</span>
                                                        <span className="a keyong icon iconfont round-empty" id="tag-edit"></span>
                                                    </div>)
                                            }
                                            else {
                                                return(
                                                    <div onClick={this.onIntab_click.bind(this,m)} className='contact-field rui-cursor-pointer'>
                                                <span className="text">
                                                    {m.tag_value}
                                                </span>
                                                        <span className="a keyong icon iconfont round" id="tag-edit">&#xe610;</span>
                                                        <span className="a keyong icon iconfont round-empty" id="tag-edit"></span>
                                                    </div>)
                                            }
                                        })}
                                </div>
                                <div className="cont-other">
                                    {
                                        this.state.out_lab.map((m,i)=> {
                                            return(
                                                <div onClick={this.onOuttab_click.bind(this,m)} className='contact-field rui-cursor-pointer'>
                                        <span className="text">
                                            {m.tag_value}
                                        </span>
                                                    <span className="a keyong icon iconfont round" id="tag-edit">&#xe610;</span>
                                                    <span className="a keyong icon iconfont round-empty" id="tag-edit"></span>
                                                </div>
                                            )})}
                                </div>
                                <div className="cont-return">
                                    <div onClick={this.onReturnLab.bind(this)}>&lt;重新选择</div>
                                </div>
                            </div>
                            <div className="value-chart">
                                <div id="chartsid" className="chartview"></div>
                            </div>
                        </div>

                        <div className="value-cust">
                            <div className="value-title">
                                <span>标签：</span>
                                <span className="title-txt"><span className="title-txt-area" title={this.state.lab_name}><div><span>{this.state.lab_name}</span></div></span>[覆盖人数<span className="title-txt-area-num" title={this.thousandbit(this.state.lab_count)}><div><span>{this.thousandbit(this.state.lab_count)}</span></div></span>人]</span>
                                <span className="title-txt" onClick={this.onselectAllCustom.bind(this)}>
                                         <input type="checkbox" className="filled-in" id="group-all-custom" />
                                         <label for="group-all-custom">全选</label>
                                </span>
                            </div>
                            <div className="value-content">
                                <div className="cont-choose">
                                    {
                                        this.state.in_lab.map((m,i)=> {
                                            if(m.isin) {
                                                if (m.tag_status==1) {
                                                    return (
                                                        <div onClick={this.onIntab_click.bind(this,m)}
                                                             className='contact-field rui-cursor-pointer selected-red'>
                                                    <span className="text">
                                                        {m.tag_value+' ('+m.value_count+')'}
                                                    </span>
                                                            <span className="a keyong icon iconfont round-red"
                                                                  id="tag-edit">&#xe610;</span>
                                                            <span className="a keyong icon iconfont round-empty"
                                                                  id="tag-edit"></span>
                                                        </div>)
                                                }
                                                else {
                                                    return (
                                                        <div onClick={this.onIntab_click.bind(this,m)}
                                                             className='contact-field rui-cursor-pointer selected'>
                                                        <span className="text">
                                                             {m.tag_value+' ('+m.value_count+')'}
                                                        </span>
                                                       <span className="a keyong icon iconfont round"
                                                             id="tag-edit">&#xe610;</span>
                                                       <span className="a keyong icon iconfont round-empty"
                                                             id="tag-edit"></span>
                                                        </div>)
                                                }
                                            }
                                            else{
                                                return(
                                                    <div onClick={this.onIntab_click.bind(this,m)} className='contact-field rui-cursor-pointer'>
                                                    <span className="text">
                                                         {m.tag_value+' ('+m.value_count+')'}
                                                    </span>
                                                        <span className="a keyong icon iconfont round" id="tag-edit">&#xe610;</span>
                                                        <span className="a keyong icon iconfont round-empty" id="tag-edit"></span>
                                                    </div>)
                                            }
                                        })}
                                </div>
                                <div className="cont-other">
                                    {
                                        this.state.out_lab.map((m,i)=> {
                                            return(
                                                <div onClick={this.onOuttab_click.bind(this,m)} className='contact-field rui-cursor-pointer'>
                                                    <span className="text">
                                                       {m.tag_value+' ('+m.value_count+')'}
                                                    </span>
                                                    <span className="a keyong icon iconfont round" id="tag-edit">&#xe610;</span>
                                                    <span className="a keyong icon iconfont round-empty" id="tag-edit"></span>
                                                </div>
                                            )})}
                                </div>
                                <div className="cont-return">
                                    <div onClick={this.onReturnLab.bind(this)}>&lt;重新选择</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <div className="btn-content">
                        <a href="javascript:void(0);" onClick={this.returnValue.bind(this)} className="accept">确认</a>
                        <a href="javascript:void(0);" onClick={this.onclose.bind(this)} className="decline">取消</a>
                    </div>
                </div>
                <div className="tooltip">
                    <div className="icon iconfont">&#xe61a;</div>
                    <div className="txt">此标签已设置，请选择其它标签</div>
                    <div className="tipout"></div>
                    <div className="tipin"></div>
                </div>
            </div>
        )
    }
}
module.exports = LabModel;
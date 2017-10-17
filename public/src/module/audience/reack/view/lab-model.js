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

class LabModel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tab_data: [{name: '推荐标签', code: 0}, {name: '系统标签', code: 1}],
            tab_list_sys: [], //系统列表
            tab_list_com: [], //推荐列表
            lab_id:'',
            lab_edit_id:'editid',
            lab_name:'',
            lab_exclude:0,
            lab_index:0,
            lab_model:0,     //标签模式  1 市区  0其它
            lab_list:[],     //立京返回过来的标签列表
            lab_value_list:[], //立京返回过来的标签值列表
            lab_count:0,       //覆盖人数
            group_id:'',
            in_lab: [],      //已选
            out_lab: [],     //未选
            search_list: [],
            search_index:1,
            search_count:0,
            search_size:20,
            search_text:'',
            search_ismu:false,  //是否有多行显示
            search_timecount:-1,  //标签搜索计时器
            search_value_timecount:-1,
            search_timemochine:null,   //值搜索计时器
            search_value_timemochine:null,
            search_isfirstKeydown:true,
            search_value_isfirstKeydown:true
        }
    }
    componentDidMount(){
        $('#container').on('click',function (e) {
            if($(e.target).parents("#labmodelid").length<=0)
            {
                $('.labmodel').removeClass('show');
            }
        });
        $('#labmodelid').on('click',function (e) {
            if($(e.target).parents("#search-content-id").length<=0&&$(e.target).parents("#search-box-id").length<=0)
            {
                $('#search-content-id').hide();
            }
        });
    }
    componentWillMount(){
        this.initList();
    }
    //初始化列表
    initList(){
        let _this= this;
        //系统列表
        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.system.tree.list.get"
            },
            success: function (res) {
                _this.setState({
                    tab_list_sys: res.data
                });
                $("#treeDemo").treeview();
            }
        });

        //推荐列表;
        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.system.flag.list.get"
            },
            success: function (res) {
                _this.setState({
                    tab_list_com: res.data
                });
            }
        });


    }
    showModel(params){

        console.info('00000',params);


       // $('.labmodel').addClass('show');


        this.resetState();

        let getarray = params.goup.tag_list;
        this.setState({
            lab_list:getarray,
            group_id:params.group.id
        });
        this.onSearch_close();
        if(params.type)//编辑
        {
            $('.lab-choose').hide();
            $('.lab-value').show();
            let lab_exclude=0,lab_index=0,lab_model=0,lab_name = '',in_lab = [],out_lab = [];

            let _this=this;
            util.api({
                type: 'get',
                data: {
                    method: "mkt.tag.system.value.list.get",
                    tag_id:params.tagid
                },
                success: function (res) {
                    out_lab = res.data;
                    for(let i=0;i<getarray.length;i++) {
                        if(getarray[i].tag_id==params.tagid)
                        {
                            lab_exclude = getarray[i].tag_exclude;
                            lab_index =getarray[i].tag_index;
                            lab_model=getarray[i].tag_model;
                            lab_name = getarray[i].tag_name;
                            let valuelist = getarray[i].tag_value_list;
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
                                in_lab.push({'tag_value':valuelist[j].tag_value,'tag_value_seq':valuelist[j].tag_value_id,'value_count':countnum,'isin':true});
                            }
                            break;
                        }
                    }
                    _this.setState({
                        lab_id:params.tagid,
                        lab_name:lab_name,
                        lab_exclude:lab_exclude,
                        lab_index:lab_index,
                        lab_model:lab_model,
                        lab_edit_id:params.tagid
                    });
                    _this.addToinList(in_lab);
                    _this.addTooutList(out_lab);
                    _this.showChart();
                }
            });

        }
        else {//新增
            this.onReturnLab();
            this.onTabclick(0);
        }
    }
    returnValue(params){
        console.log("fffffffffffffff");
        let obj ={
            "tag_id": this.state.lab_id,
            "group_id":this.state.group_id,
            "tag_name": this.state.lab_name,
            "tag_exclude": this.state.lab_exclude,
            "tag_index": this.state.lab_index,
            "tag_model": this.state.lab_model,
            "tag_value_list":this.state.lab_value_list
        };
        this.props.returnValue(obj);
        this.onclose();
    }
    onclose(e){
        $('.labmodel').removeClass('show');
    }
    onTabclick(params){
        switch(params)
        {
            case 1:
                //系统标签
                $('.lab-comman').hide();
                $('.lab-sys').show();
                $('#tabsid1 a').click();
                break;
            case 0:
                //推荐标签
                $('.lab-comman').show();
                $('.lab-sys').hide();
                $('#tabsid0 a').click();
                break;
        }
    }
    onLabclick(params,_this){
        let getarray = this.state.lab_list;
        if(params.tag_id!=this.state.lab_edit_id)
        {
            for(let i=0;i<getarray.length;i++) {
                if (getarray[i].tag_id == params.tag_id) {
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
        if(params.type!=2)
        {
            this.setState({
                lab_model: params.search_mod,
                lab_name: params.tag_name,
                lab_id:params.tag_id
            });
            let _this= this;
            util.api({
                type: 'get',
                data: {
                    method: "mkt.tag.system.value.list.get",
                    tag_id:params.tag_id
                },
                success: function (res) {
                    _this.setState({
                        lab_count:0,
                        in_lab:[]
                    });
                    _this.addTooutList(res.data);
                    _this.showChart();
                }
            });
        }
        else
        {
            this.setState({
                lab_id:params.tag_id,
                lab_name:params.tag_name,
                lab_model:params.search_mod,
                lab_value_list:[{'tag_value_id':params.tag_value_seq,'tag_value':params.tag_value}]
            });
            let _this = this;
            setTimeout(function () { _this.returnValue();},10);
        }

        $('.lab-choose,#search-content-id').hide();
        $('.lab-value').show();
        this.onSearch_close();
    }
    onReturnLab(){
        $('.lab-choose').show();
        $('.lab-value').hide();
        this.onTabclick(0);
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
        $('#search-input-close,.search-content,.search-bot-txt').hide();
        this.setState({
            search_list: [],
            search_ismu:false,
            search_index:1,
            search_count:0,
            search_isfirstKeydown:true
        });
    }
    onSearch_click(params){
            let events = window.event || arguments[1];
            if(params=='keyup')
            {
                if((typeof(window.event) != "undefined"))
                {
                    if(this.state.search_isfirstKeydown)
                    {
                        this.setState({
                            search_isfirstKeydown:false
                        });
                        return;
                    }
                }
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

            $('.search-bot-txt').hide();
            $('.search-bot').show();
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
                            method: "mkt.tag.system.fuzzy.list.get",
                            tag_name: $('#search-input').val(),
                            index: _this.state.search_index,
                            size: _this.state.search_size
                        },
                        success: function (res) {
                            $('.search-bot').hide();
                            let _ismu = false;
                            let _searchlist = res.data;
                            if (res.total_count < 20) {
                                _ismu = true;
                            }
                            _this.setState({
                                search_list: _searchlist,
                                search_ismu: _ismu,
                                search_text: $('#search-input').val(),
                                search_count: res.total_count
                            });
                        }
                    });
                }
            }
    }
    onSearch_scroll(){
        let event = window.event || arguments[0];

        let srcolltage = $(event.target);
        if(srcolltage.scrollTop()+srcolltage.height() ==$('#search-txt-ul').height())
        {
            if(!this.state.search_ismu)
            {
                if(this.state.search_index>5)
                {
                    $('.search-bot-txt').show();
                    $('.search-bot').hide();
                    return;
                }
                $('.search-bot').show();
                let _this= this;
                //推荐列表;
                util.api({
                    type: 'get',
                    data: {
                        method: "mkt.tag.system.fuzzy.list.get",
                        tag_name: _this.state.search_text,
                        index:_this.state.search_index,
                        size:_this.state.search_size
                    },
                    success: function (res) {
                        $('.search-bot').hide();
                        let _ismu = false;
                        let _searchlist= _this.state.search_list;
                        let _search_index = _this.state.search_index+1;
                        _searchlist = _searchlist.concat(res.data);
                        if(res.total_count<20)
                        {
                            _ismu=true;
                        }
                        _this.setState({
                            search_list: _searchlist,
                            search_ismu:_ismu,
                            search_index:_search_index
                        });
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
    onOuttab_click(params) {
       let inlistarray = this.state.in_lab;
       let inobject  ={"tag_value":params.tag_value,"tag_value_seq":params.tag_value_seq,"value_count":params.value_count,"isin":true};

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


        if($('.value-content .rui-cursor-pointer').length==$('.value-content .selected').length+1)
        {
            $('#group-all').prop('checked','checked');
        }

    }
    onIntab_click(params) {
        let inlistarray = this.state.in_lab;
        if(params.isin)
        {
            $('#group-all').removeAttr('checked');
        }
        else {
            if($('.value-content .rui-cursor-pointer').length==$('.value-content .selected').length+1)
            {
                $('#group-all').prop('checked','checked');
            }
        }

        let inval = !params.isin;
        let inobject  ={"tag_value":params.tag_value,"tag_value_seq":params.tag_value_seq,"value_count":params.value_count,"isin":inval};

        for(let i=0;i<inlistarray.length;i++)
        {
            if(inlistarray[i].tag_value_seq == inobject.tag_value_seq)
            {
                inlistarray[i].isin = inval;
                break;
            }
        }
        this.addToinList(inlistarray);
    }
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
                    "tag_value": inlistarray[i].tag_value
                });
            }
        }
        this.setState({
            lab_count:covercount,
            in_lab:inlistarray,
            lab_value_list:taglist
        });
    }
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
    showChart(){
        /*图表脚本*/
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
                bottom: '3%',
                containLabel: true,
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['采煤', '测试', '测试', '测试', '测试', '测试', '测试'],
                    axisTick: {
                        alignWithLabel: true
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

                for(let i=0;i<res.data.length;i++)
                {
                    let tagcount = 0;
                    try{
                        tagcount = res.data[i].tag_count;
                    }
                    catch (ex){}

                    if(i>5)
                    {
                        outnum+=tagcount;
                    }
                    else {
                        _xaxis.push(res.data[i].tag_name);
                        _series.push(tagcount);
                        allcount+=tagcount;
                    }
                }

                if(outnum>0)
                {
                    _xaxis.push('其它');
                    _series.push(outnum);
                    allcount+=outnum;
                }

                if(allcount<=0)
                {
                    options.grid =  {
                        top: '-2',
                        left:'10',
                        bottom: '3%',
                        containLabel: true,
                    };
                }
                options.xAxis  = [
                    {
                        type : 'category',
                        data : _xaxis,
                        axisTick: {
                            alignWithLabel: true
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
        /*图表结束*/
    }
    resetState(){
        this.setState(
        {
            lab_id:'',
            lab_name:'',
            lab_exclude:0,
            lab_index:0,
            lab_model:0,
            lab_value_list:[],
            lab_list:[],
            lab_count:0,
            in_lab: [],
            lab_edit_id:'editid',
            out_lab: [],
            group_id:'',
            search_list: [],
            search_index:1,
            search_count:0,
            search_text:'',
            search_ismu:false,
            search_timecount:-1,
            search_value_timecount:-1,
            search_timemochine:null,
            search_value_timemochine:null,
            search_isfirstKeydown:true,
            search_value_isfirstKeydown:true
        });
        $('#group-all').removeAttr('checked');
    }
    render(){
        let _this=this;
        let stye_search = { display:_this.state.lab_model==1?'block':'none'};
        let event = window.event || arguments[0];
        return (
            <div id="labmodelid" onClick={(event)=>{event.nativeEvent.stopPropagation();}} className="labmodel">
                <div className="title">
                        <div id="search-box-id"  className="search-box">
                            <input id="search-input" className="input" type="text" onKeyUp={this.onSearch_click.bind(this,'keyup')}  onChange={this.onSearch_change.bind(this)} placeholder="标签级标签值搜索人群" />
                            <div className="icon iconfont"  onClick={this.onSearch_click.bind(this,'click')}  >&#xe668;</div>
                            <div id="search-input-close"  onClick={this.onSearch_close.bind(this)} className="ico icon iconfont closeicon">&#xe608;</div>
                        </div>
                        <div id="search-content-id" className="search-content">
                            <div className="search-tit"><span className="search-txt-path">搜索结果：</span><span className="search-txt-val">{this.state.search_count}个</span></div>
                            <div className="search-txt" onMouseWheel={this.onSearch_scroll.bind(this)} onScroll={this.onSearch_scroll.bind(this)}>
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
                            <div className="search-bot">
                                <img src="../../img/loading.gif"></img>
                            </div>
                            <div className="search-bot-txt">
                                结果过多，请输入精确条件继续查询...
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
                            </div>
                            <div className="lab-sys">
                                <div id="treeDemo">
                                    <Treelib datalist={this.state.tab_list_sys}  onLabclick={this.onLabclick.bind(this)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lab-value">
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
                </div>
                <div className="footer">
                    <div className="btn-content">
                        <a href="javascript:void(0);" onClick={this.returnValue.bind(this)} className="accept">确认</a>
                        <a href="javascript:void(0);"  onClick={this.onclose.bind(this)}  className="decline">取消</a>
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
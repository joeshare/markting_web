'use strict';

import Layout from 'module/layout/layout';
const layout = new Layout({
    index: 1,
    leftMenuCurName: '细分管理'
});

//loading echarts
let EChartsAxis = require('module/echarts/echarts-axis.js');
let EChartsAnnular = require('module/echarts/echarts-annular.js');
let Ztree= require('plugins/jquery.treeviewplus.js');

//报表图
class Chartstemp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            chinaUser:0,
            otherUser:0
        }
    }
    componentDidMount(){
        //init
        let paraID = this.props.datas.id;
        let paraName = this.props.datas.name;
        let paraObj = this.props.datas.obj[0];
        if(paraObj.population_count.length>0){
            paraObj.show_type=='1'?this.initPIE(paraID,paraName,paraObj):this.initMap(paraID,paraName,paraObj);
        }
    }

    initPIE(paraID,paraName,paraObj){
        let putArray = [];
        let putTitle=[];
        let otherNum = 0;
        paraObj.population_count.forEach((m,i)=>{
            if(i<10)
            {
                let putObj ={
                    name:m.tagvalue_name,
                    value:m.tagvalue_count};
                putArray.push(putObj);
                putTitle.push(m.tagvalue_name);
            }
            else
            {
                otherNum+=m.tagvalue_count;
            }
        });

        if(otherNum>0){
            putArray.push({name:'其它',value:otherNum});
            putTitle.push('其它');
        }

        let myChart = echarts.init(document.getElementById(paraID));
        let chartsData = {
            div: myChart,
            divId: $('#'+paraID+''),
            title: paraName,
            legend: {
                y: 'bottom', orient: 'horizontal',
                data: putTitle
            },
            data: putArray
        };
        EChartsAnnular.annular(chartsData);
    }

    initMap(paraID,paraName,paraObj){

        this.setState({
            chinaUser:paraObj.china_population_count,
            otherUser:paraObj.foreign_population_count
        });

        let putArray = [];
        paraObj.population_count.forEach((m,i)=>{
            let putObj ={
                dimension_name:m.tagvalue_name,
                name:m.tagvalue_name,
                population_count:m.tagvalue_count,
                value:m.tagvalue_count};
            putArray.push(putObj);
        });

         let mapoptions = {
                el: paraID,
                chartsDefOpt: {
                tooltip: {
                    trigger: 'item'
                },
                dataRange: {
                    x: 'center',
                        y: 'bottom',
                        orient: 'horizontal',
                        splitList: [
                        {start: 1500},
                        {start: 200, end: 1500},
                        {start: 0, end: 200},
                        {end: 0}
                    ],
                        color: ['#5BD3C7', '#92CFFE', '#C1DFF7', '#E4E5E7']
                },
                series: [
                    {
                        name: '用户数',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                label: {
                                    show: false,
                                    textStyle: {
                                        color: "rgb(249, 249, 249)"
                                    }
                                }
                            },
                            emphasis: {
                                areaColor: '#FCDD5F',
                                label: {show: false}
                            }
                        },
                        data: [
                        ]
                    }
                ]
            }
        }

        let splitList = [];
        if (!_.isEmpty(putArray)) {
            putArray.map(m=> {
                m.name = m.dimension_name;
                m.value = m.population_count;
            });

            let uniqArr = _.uniq(_.pluck(putArray, 'population_count')); 

            if(uniqArr[uniqArr.length-1]!=0) uniqArr.push(0);

            if (uniqArr.length <= 3) {
                splitList = [
                    {start: uniqArr[2]},
                    {start: 0, end:uniqArr[2]}
                ];
            } else if (uniqArr.length <= 6) {
                splitList = [
                    {start: uniqArr[3]},
                    {start: uniqArr[4], end: uniqArr[3]},
                    {start: 0, end: uniqArr[4]}
                ];
            } else {
                splitList = [
                    {start: uniqArr[3]},
                    {start: uniqArr[4], end: uniqArr[3]},
                    {start: uniqArr[6], end: uniqArr[4]},
                    {start: 0, end: uniqArr[6]}
                ];
            }

            mapoptions.chartsDefOpt.dataRange.splitList = splitList;
        }

        let myCharts = echarts.init(document.getElementById(mapoptions.el));

        myCharts.showLoading();

        mapoptions.chartsDefOpt.series[0].data = putArray;

        myCharts.setOption(mapoptions.chartsDefOpt);

        myCharts.hideLoading();

        myCharts.resize();
    }
    render() {

        if(this.props.datas.obj!=null&&this.props.datas.obj.length>0)
        {

            if(this.props.datas.obj[0].show_type=='3'){
                return ( <div className="col s6 chart-area">
                    <div>&nbsp;</div>
                    <div className="are-text"></div>
                    <div className="china" >
                        <img src="../../img/audience/filler.png"/>
                    </div></div>)
            } else if(this.props.datas.obj[0].population_count.length==0) {
                return (<div className="col s6 chart-area"><div className="area-close" onClick={this.props.closecion.bind(this,this.props.datas)}>×</div>
                    <div>{this.props.datas.name}</div>
                    <div className="are-text"></div>
                    <div className="china" >
                        <img src="../../img/audience/filler.png"/>
                    </div>
                </div>)
            }else {
                if(this.props.datas.obj[0].show_type=='1')
                {
                    return ( <div className="col s6 chart-area">
                        <div className="area-close" onClick={this.props.closecion.bind(this,this.props.datas)}>×</div>
                        <div id={this.props.datas.id} className="chart-pi"></div>
                    </div>)
                }
                if(this.props.datas.obj[0].show_type=='2'){
                    return (<div className="col s6 chart-area"><div className="area-close" onClick={this.props.closecion.bind(this,this.props.datas)}>×</div>
                        <div>{this.props.datas.name}</div>
                        <div className="are-text">
                            <span  className="are-text-left">中国用户：<span className="are-text-spa">{this.state.chinaUser}</span> 人 </span>
                            <span  className="are-text-right">其他及未知区域用户：<span className="are-text-spa">{this.state.otherUser}</span> 人</span>
                        </div>
                        <div id={this.props.datas.id} className="china" >
                        </div>
                    </div>)
                }

            }

        }else {
            return ( <div className="col s6 chart-area">
                <div>&nbsp;</div>
                <div className="are-text"></div>
                <div className="china" >
                    <img src="../../img/audience/filler.png"/>
                </div></div>)
        }
    }
}

//tree
class Treelib extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    returnlab(m)
    {
        let isInarray = false;

        this.props.checklist.map((mac,i)=>{
                if(mac.tag_id==m.tag_id)
                {
                    isInarray = true;
                }
            }
        )

        if(isInarray)
        {
            return (<span className="a keyong icon iconfont round">&#xe610;</span>);
        }
        else
        {
            return (<span className="a keyong icon iconfont round-empty"></span>);
        }


    }
    render(){
        if(this.props.datalist!=null)
        {
            return(
                <ul>
                    {
                        this.props.datalist.map((m,i)=> {
                            if(m.children){
                                return(<li>
                                    <div className="ulhiare">
                                        <div className="hitarea collapsable-hitarea"></div>
                                        <span>{m.tag_name}</span>
                                        <div className="unbtn">
                                        </div>
                                    </div>
                                    <Treelib datalist={m.children}  checklist={this.props.checklist}  onLabclick={this.props.onLabclick.bind(this)}/>
                                </li>)
                            }
                            else {
                                return(<li className="listy" onClick={this.props.onLabclick.bind(this,m)}>
                                    <div className="list-div">
                                        <span className="fl">
                                            {
                                                this.returnlab(m)
                                            }
                                            {m.tag_name}
                                        </span>
                                    </div>
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

//tree Custom
class TreelibCustom extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    returnlab(m)
    {
        let isInarray = false;

        this.props.checklist.map((mac,i)=>{
                if(mac.tag_id==m.tag_id)
                {
                    isInarray = true;
                }
            }
        )

        if(isInarray)
        {
            return (<span className="a keyong icon iconfont round">&#xe610;</span>);
        }
        else
        {
            return (<span className="a keyong icon iconfont round-empty"></span>);
        }
    }
    render(){
        if(this.props.datalist!=null)
        {
            return(
                <ul>
                    {
                        this.props.datalist.map((m,i)=> {
                            if(m.children){
                                return(<li>
                                    <div className="ulhiare">
                                        <div className="hitarea collapsable-hitarea"></div>
                                        <span>{m.tag_tree_name}</span>
                                        <div className="unbtn">
                                        </div>
                                    </div>
                                    <TreelibCustom datalist={m.children} taglist={m.children_tag}  checklist={this.props.checklist}  onLabclick={this.props.onLabclick.bind(this)}/>
                                </li>)
                            }
                        })
                    }
                    {
                        this.props.taglist.map((ml,il)=>{
                            return(<li className="listy" onClick={this.props.onLabclick.bind(this,ml)}>
                                <div className="list-div">
                                        <span className="fl">
                                            {
                                                this.returnlab(ml)
                                            }
                                            {ml.tag_name}
                                        </span>
                                </div>
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

//subhead
class SubTtile extends React.Component {
    constructor(props){
        super(props);
        this.state={
            seName:'',
            seNumber:0
        }
    }
    componentDidMount(){
        let segmentheadid = util.geturlparam('segmentheadid');
        let _this=this;
        util.api({
            type: 'get',
            data: {
                method:"mkt.segment.header.get",
                segment_head_id:segmentheadid
            },
            success: function (res) {
                if(res.code==0) {
                    _this.setState({
                        seName: res.data[0].segment_name,
                        seNumber: res.data[0].cover_count
                    });
                }
            }
        });

    }
    render() {
        return (
            <header className="page-body-header">
                <div className="text-box"><span className="title">细分人众分析</span><span
                    className="text">{this.state.seName}<span className="variable">{this.state.seNumber}</span>人</span>
                </div>
            </header>
        )
    }
}

//word cloud
class WordcloudMap extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    componentDidUpdate() {

    }

    componentDidMount(){
        $('.right-cloud').show();
        let _this =this;

        util.api({
            type: 'get',
            data: {
                method: "mkt.segment.analysis.top.custom.list",
                top_type:0
            },
            success: function (res) {
                if(res.code==0) {
                    let clouddata =res.data;
                    clouddata.map(m=>{
                        m.name = m.tag_name;
                        m.value =  m.cover_count;
                    });
                    _this.showcloud(clouddata);
                    $('.right-cloud').hide();
                }
            }
        });
    }

    showcloud(parms){
        let myChart = echarts.init(document.getElementById('wordCloud'));

        let option = {
            title: {
                text: "热门标签",
                textStyle:{
                    color: '#666666',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontFamily: 'sans-serif',
                    fontSize: 14
                },
                top:6,
                left:3
            },
            tooltip: {},
            series: [{
                type: 'wordCloud',
                gridSize: 20,
                sizeRange: [12, 50],
                rotationRange: [0, 0],
                shape: 'circle',
                textStyle: {
                    normal: {
                        color: function () {
                            let rand = Math.random()*1000;

                            if(rand>500){
                                return 'rgb(153,153,153)';
                            }
                            else
                            {
                                return  'rgb(102,193,227)';
                            }
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                data: parms
            }]
        };
        myChart.setOption(option);
    }
    onChangeSelect(event){
        let selectV =event.target.value;
        let _this = this;
         util.api({
             type: 'get',
             data: {
                 method: "mkt.segment.analysis.top.custom.list",
                 top_type: selectV
             },
             success: function (res) {
                 if (res.code == 0) {
                     let clouddata = res.data;
                     clouddata.map(m=> {
                         m.name = m.tag_name;
                         m.value = m.cover_count;
                     });

                     _this.showcloud(clouddata);
                 }
             }
         });
    }
    render() {
        return (
        <div className="right-cloud">
            <div id="wordCloud">
            </div>
            <select onChange={this.onChangeSelect.bind(this)} className="word-top">
                <option value="0">全部</option>
                <option value="1">Top25</option>
                <option value="2">Top50</option>
                <option value="3">Top100</option>
            </select>
        </div>
        )
    }
}

//内容区
class Content extends React.Component {
    //初始化
    constructor(props) {
        super(props);
        this.state = {
            chart_list: [],
            chart_choose: [],
            chart_list_custom: [],
            chart_choose_custom: [],
            tab_list_sys:[],
            group_list_custom:[],
            tab_second: [],
            current_tab:'全部标签',
            current_group:0,
            segmentheadid:'',
            tab_list_custom:[],
            tab_data: [{name: '系统标签', code: 0}, {name: '自定义标签', code: 1}],
        }
    }

    onLabclick(params){
        let issys = true;
        if(params.custom_tag_category_id)  issys = false;

        let arrCheck =[];
        let chartlist =[];

        if(issys) {
            arrCheck = this.state.chart_choose;
            chartlist = this.state.chart_list;
            $('.css_sys').hide();
        }else
        {
            arrCheck = this.state.chart_choose_custom;
            chartlist = this.state.chart_list_custom;
            $('.css_cus').hide();
        }

        let Isdelete = true;
       // params.tag_id=  '4HAcjGd5';
        // if exist remove it
        arrCheck.forEach((m,i)=>{
            if(params.tag_id==m.tag_id)
            {
                arrCheck.splice(i,1);
                Isdelete =false;
                chartlist.splice(i,1);
            }
        });
        if(Isdelete){
            //add to state list from mkt.segment.audienct.analysis.get
            let _this=this;

            //have choose between custom and system
            if(!issys)
            {
                util.api({
                    type: 'get',
                    data: {
                        method: "mkt.segment.audienct.custom.analysis.get",
                        category_id:params.tag_id,
                        segment_head_id:this.state.segmentheadid
                    },
                    success: function (res) {
                        if(res.code==0) {

                            arrCheck.push(params);
                            let datas = res.data;
                            //transformat data
                            datas[0].population_count.map(m=>{
                                m.tagvalue_name =m.tag_name;
                                m.tagvalue_count=m.tag_count;
                            });
                            chartlist.push({id: params.tag_id, name: params.tag_name,types:'custom', obj: datas});
                            _this.hodeplace(arrCheck, chartlist,issys);
                        }
                    }
                });
                //this.setState({ajaxreq_custom:retreq});
            }
            else {
                 util.api({
                    type: 'get',
                    data: {
                        method: "mkt.segment.audienct.analysis.get",
                        tag_id:params.tag_id,
                        segment_head_id:this.state.segmentheadid
                    },
                    success: function (res) {
                        if(res.code==0) {
                            arrCheck.push(params);
                            let datas = res.data;
                            chartlist.push({id: params.tag_id, name: params.tag_name, types:'sys', obj: datas});
                            _this.hodeplace(arrCheck, chartlist,issys);
                        }
                    }
                });
            }
        }
        else {
            if(issys)
            {
                this.setState({
                    chart_list:[]
                });
            }else {
                this.setState({
                    chart_list_custom:[]
                });
            }

            let _this = this;
            setTimeout(function () {
                _this.hodeplace(arrCheck,chartlist,issys);
            },5);
        }
    }

    hodeplace(arrCheck,chartlist,issys){
        if(issys) {
            this.setState({
                chart_choose: [],
                chart_list: []
            });
        }else
        {
            this.setState({
                chart_choose_custom: [],
                chart_list_custom: []
            });
        }
        arrCheck.forEach((m,i)=>{
            if(m.tag_id=='hodplace')
            {
                arrCheck.splice(i,1);
                chartlist.splice(i,1);
            }
        });

        if(arrCheck.length%2==1)
        {
           arrCheck.push({flag:true,search_mod:null,tag_cover:"0%",
            tag_desc:null,
            tag_id:"hodplace",
            tag_list:null,
            tag_name:"HODE",
            tag_name_eng:null});

            chartlist.push({id:"hodplace",name:"HODE",obj:[{china_population_count:0,
                foreign_population_count:0,
                population_count:[],
                show_type:"3"}]});
        }
        if(issys)
        {
            this.setState({
                chart_choose:arrCheck,
                chart_list:chartlist
            },function () {
                if(arrCheck.length==0)
                {$('.css_sys').show();}
            });

        }else
        {
            this.setState({
                chart_choose_custom:arrCheck,
                chart_list_custom:chartlist
            },function () {
                if(arrCheck.length==0)
                {$('.css_cus').show();}
            });

        }
    }

    componentDidMount() {
        this.initDrop();
        this.initList();
    }

    initList(){
        let _this= this;
        let segmentheadid = util.geturlparam('segmentheadid');
        this.setState({
            segmentheadid: segmentheadid
        });

        util.api({
            type: 'get',
            data: {
                tag_id:0,
                method: "mkt.tag.tree.list.get",
                page_source_type:1
            },
            success: function (res) {
                if(res.code==0) {
                    _this.setState({
                        tab_list_sys: res.data[0]
                    }, function () {
                        $("#treeDemowindow").css('margin-left', "-16px");
                        $("#treeDemowindow").treeview();
                        $('.dropdown-button').dropdown();
                    });
                }
            }
        });

        util.api({
            type: 'get',
            data: {
                method: "mkt.segment.customtag.category.list"
            },
            success: function (res) {
                if(res.code==0) {
                    let grouplist =res.data;
                    if(grouplist.length<=0){
                        $('.empty-group').show();
                    }
                    else {
                        $('.empty-group').hide();
                    }
                    grouplist.map(m=>{
                      m.tag_id = m.custom_tag_category_id;
                      m.tag_name = m.custom_tag_category_name;
                      m.children =null;
                    });

                    _this.setState({
                        group_list_custom:grouplist
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

    initDrop(){
        let _this= this;
        let Rootaray=[];
        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.root.node.list.get"
            },
            success: function (res) {

                res.data[0].forEach((m)=>{
                    m.type =1;
                    Rootaray.push(m);
                });

                util.api({
                    type: 'get',
                    data: {
                        noly_show:true,
                        method: "mkt.tag.custom.taxonomy.root.list.get"
                    },
                    success: function (res) {
                        if(res.code==0) {
                            res.data.forEach((m1)=> {
                                let inobject = {type: 2, tag_id: m1.tag_tree_id, tag_name: m1.tag_tree_name};
                                Rootaray.push(inobject);
                            });
                            _this.setState({
                                tab_second: Rootaray
                            });

                            $('.dropdown-button').dropdown();
                        }
                    }
                });
            }
        });
    }

    onDropDown(params){
        this.setState({
            current_tab:params.tag_name
        });

        let _this= this;

        if(params.type==1)
        {
            $('#treeDemowindow').show();
            $('#treeDemowindowCustom').hide();
            _this.setState({
                tab_list_sys:[]
            });
            //获取标签列表
            util.api({
                type: 'get',
                data: {
                    tag_id:params.tag_id,
                    method: "mkt.tag.tree.list.get",
                    page_source_type:1
                },
                success: function (res) {
                    if(res.code==0) {
                        _this.setState({
                            tab_list_sys: res.data[0]
                        }, function () {
                            if (params.tag_id < 2) {
                                $("#treeDemowindow").css('margin-left', "-16px")
                            }
                            else {
                                $("#treeDemowindow").css('margin-left', "0px")
                            }
                            $("#treeDemowindow").treeview();
                        });
                    }
                }
            });
        }
        else{
            $('#treeDemowindow').hide();
            $('#treeDemowindowCustom').show();
            _this.setState({
                tab_list_custom:[]
            });
            //获取标签列表
            util.api({
                type: 'get',
                data: {
                    tag_tree_id:params.tag_id,
                    method: "mkt.tag.custom.taxonomy.list.get",
                    page_source_type:1
                },
                success: function (res) {
                    if(res.code==0) {
                        _this.setState({
                            tab_list_custom: res.data
                        }, function () {
                            $("#treeDemowindowCustom").css('margin-left', "0px");
                            $("#treeDemowindowCustom").treeview();
                        });
                    }
                }
            });
        }

    }

    onClose(params)
    {
        let issys = true;
        if(params.types)  issys = false;

        let arrCheck =[];
        let chartlist =[];
        if(issys) {
            arrCheck = this.state.chart_choose;
            chartlist = this.state.chart_list;
        }else
        {
            arrCheck = this.state.chart_choose_custom;
            chartlist = this.state.chart_list_custom;
        }

        arrCheck.forEach((m,i)=>{
            if(params.id==m.tag_id)
            {
                arrCheck.splice(i,1);
                chartlist.splice(i,1);
            }
        });

        let _this = this;
        setTimeout(function () {
            _this.hodeplace(arrCheck,chartlist,issys);
        },5);
    }

    onTabclick(params){
        //clear ajax http response
        //if(this.state.ajaxreq_custom) this.state.ajaxreq_custom.abort();
        //if(this.state.ajaxreq_sys) this.state.ajaxreq_sys.abort();

        //$('.right-empty').show();
        if(params==0)
        {
            $('.systemclass').show();
            $('.customclass').hide();
            $('.right-cloud').hide();
            $('.css_custom').hide();
            $('.css_system').show();
        }
        else{
            $('.customclass').show();
            $('.systemclass').hide();
            $('.right-cloud').show();
            $('.css_custom').show();
            $('.css_system').hide();
        }
    }
    render() {
        return (
            <div className="content">
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
                    <div className="systemclass">
                        <div className="left-select">
                            <span className="selectbtn dropdown-button" data-activates="selectdrop" data-beloworigin="true">{this.state.current_tab}</span>
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
                        <div className="drop-list">
                            <div id="treeDemowindow">
                                <Treelib  datalist={this.state.tab_list_sys} checklist={this.state.chart_choose}  onLabclick={this.onLabclick.bind(this)}/>
                            </div>

                            <div id="treeDemowindowCustom">
                                <TreelibCustom taglist={[]} datalist={this.state.tab_list_custom} checklist={this.state.chart_choose}  onLabclick={this.onLabclick.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div className="customclass">
                        <div id="treecustom">
                            <Treelib  datalist={this.state.group_list_custom} checklist={this.state.chart_choose_custom}  onLabclick={this.onLabclick.bind(this)}/>
                        </div>
                        <div className="empty-group">未找到自定义分类或标签</div>
                    </div>
                </div>
                <div className="right-box">

                    <WordcloudMap/>

                    <div className="right-list row css_system">
                        {this.state.chart_list.map((m,i)=>{
                            return( <Chartstemp closecion={this.onClose.bind(this)} datas = {m}/>)
                        })}
                        <div className="right-empty css_sys">
                            <img src="../../img/audience/filler.png"/>
                        </div>
                    </div>

                    <div className="right-list row custom css_custom">
                        {this.state.chart_list_custom.map((m,i)=>{
                            return( <Chartstemp closecion={this.onClose.bind(this)} datas = {m}/>)
                        })}
                        <div className="right-empty css_cus">
                            <img src="../../img/audience/filler.png"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Analyze extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0//受众细分总数
        };
        this.setTotal = this.setTotal.bind(this)
    }

    setTotal(totalCount) {
        this.setState({
            totalCount: totalCount
        })
    }

    render() {
        return (
            <div className="analyze">
                <SubTtile totalCount={this.state.totalCount}/>
                <Content setTotal={this.setTotal}/>
            </div>
        )
    }
}

//渲染
const analyze = ReactDOM.render(
    <Analyze />,
    document.getElementById('page-body')
);

module.exports = Analyze;

let Ztree= require('plugins/jquery.treeviewplus.js');
//添加标签

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
                                        <span>{m.tag_name +"（"+ m.includeCount+"）"}</span>
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

class AddLab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_second: [],
            lab_choose: [],
            current_tab:'全部标签',
            tab_list_sys:[],
            search_list: [],
            search_ismu:false,
            search_index:1,
            search_count:0,
            search_size:20,
            search_timecount:-1,
            search_isfirstKeydown:true
        }
    }

    componentDidMount(){
        $('.content').css('padding-top','0px');
        $('.content').css('padding-bottom','0px');

        this.setState({
            lab_choose:this.props.select_labs
        });
        let _this= this;
        //获取系统一级分类
        util.api({
            type: 'get',
            data: {
                method: "mkt.tag.root.node.list.get"
            },
            success: function (res) {
                if(res.code==0) {
                    $('.dropdown-button').dropdown();
                    _this.setState({
                        tab_second: res.data[0]
                    });
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
                    _this.setState({
                        tab_list_sys: res.data[0]
                    }, function () {
                        $("#treeDemowindow").css('margin-left', "-16px")
                        $("#treeDemowindow").treeview();
                    });
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
        //获取标签列表
        util.api({
            type: 'get',
            data: {
                tag_id:params.tag_id,
                method: "mkt.tag.tree.list.get"
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

    onLabclick(params){
        let arrCheck = this.state.lab_choose;

        let Isdelete = true;

        // if exist remove it
        arrCheck.forEach((m,i)=>{
            if(params.tag_id==m.tag_id)
            {
                arrCheck.splice(i,1);
                Isdelete =false;
               // chartlist.splice(i,1);
            }
        });
        if(Isdelete){
            let _this=this;
            arrCheck.push(params);
            _this.setState({
                lab_choose:arrCheck
            });
        }
        else {

            let _this = this;
            setTimeout(function () {
                _this.setState({
                    lab_choose:arrCheck
                });
            },5);
        }
    }

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
                        size: _this.state.search_size,
                        choice_show:1
                    },
                    success: function (res) {
                        if(res.code==0) {
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
                        size:_this.state.search_size,
                        choice_show:1
                    },
                    success: function (res) {
                        if(res.code==0) {
                            $('.search-bot').hide();
                            let _ismu = false;
                            let _searchlist = _this.state.search_list;
                            let _search_index = _this.state.search_index + 1;
                            _searchlist = _searchlist.concat(res.data);
                            if (res.total_count < 20) {
                                _ismu = true;
                            }
                            _this.setState({
                                search_list: _searchlist,
                                search_ismu: _ismu,
                                search_index: _search_index
                            });
                        }
                    }
                });
            }
        }
    }
    onSearch_Labclick(params){
        console.log(params);
        let newObj = {flag:params.flag,search_mod:params.search_mod,tag_cover:params.tag_cover,
            tag_desc:null,
            tag_id:params.tag_id,
            tag_list:null,
            tag_name:params.tag_name,
            tag_name_eng : null}

        let needclick= true;
        let arrCheck = this.state.lab_choose;

        arrCheck.forEach((m)=>{
            if(m.tag_id==params.tag_id){
                needclick = false;
            }
        });

        if(needclick){
            this.onLabclick(newObj);
        }

        $('.lab-choose,#search-content-id').hide();
        $('.lab-value').show();
        this.onSearch_close();
    }

    render() {
        return (
            <div className="add-lab-wind">
                <div className="wind-left">
                    <div className="left-title">
                        <div id="search-box-id"  className="search-box">
                            <input id="search-input" className="input" type="text" onKeyUp={this.onSearch_click.bind(this,'keyup')}  onChange={this.onSearch_change.bind(this)} placeholder="标签名称搜索标签" />
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
                                                <li onClick={this.onSearch_Labclick.bind(this,m)}>
                                                    <span className="search-txt-path">{m.tag_path}</span>
                                                    <span className="search-txt-val">{m.tag_name}</span>
                                                </li>
                                            )
                                        }
                                        else
                                        {
                                            return(
                                                <li onClick={this.onSearch_Labclick.bind(this,m)}>
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
                    <div className="left-select">
                        <span className="selectbtn dropdown-button" data-activates="selectdrop" data-beloworigin="true">{this.state.current_tab}</span>
                        <ul id="selectdrop" className="dropdown-content">
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
                            <Treelib  datalist={this.state.tab_list_sys}  checklist={this.state.lab_choose}  onLabclick={this.onLabclick.bind(this)}/>
                        </div>
                    </div>
                </div>
                <div className="wind-right">
                    <div className="choose-list">
                        <ul>
                            {
                                this.state.lab_choose.map((m,i)=>{
                                    return(
                                        <li>
                                            <span className="li-text">{m.tag_name}</span><span className="li-close"   onClick={this.onLabclick.bind(this,m)}>×</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = AddLab;
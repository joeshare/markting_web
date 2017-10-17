//标签值弹出框
class TabValue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valuelist:[],
            active:true
        }
    }
    componentDidMount() {
        setTimeout(function () {
            $('.table-set').scrollTop(100000);
            $('.buttonlist').css({'top':$('#Ttabel-until').height()-32}) ;
        },10);
    }

    onChangeInput(params,type,event){

        let inputvalue=  event.target.value;

        if(inputvalue.toString().length!=0)
        {
            if(/^0$|(^[1-9][0-9]*$)/.test(inputvalue))
            {
               if(parseInt(inputvalue)<=0) inputvalue=0;
            }
            else {
                return false;
            }
        }

        let setarrvay  = this.state.valuelist;
        setarrvay.every((m,i)=>{
            if(m.id==params.id){
                if(type=='startValue')
                {
                    //if(inputvalue.toString().length>0){
                        m.startValue = inputvalue;
                    //}
                }
                else {
                    //if(inputvalue.toString().length>0) {
                        m.endValue = inputvalue;
                   // }
                }
            }
            if(i<setarrvay.length)
                return true;
        });

        this.setData(setarrvay);
    }

    onAddline(){
        let setarrvay  =   this.state.valuelist;
        if(setarrvay.length>0)
        {
            let lastobj =setarrvay[setarrvay.length-1];
            let id = lastobj.id+1;
            let F =   lastobj.endValue;
            let L =   0;
            setarrvay.push({id:id,startValue:F,endValue:L});
        }
        else
        {
            setarrvay.push({id:1,startValue:0,endValue:100});
        }
        this.setData(setarrvay);
       // var dtf = document.getElementById('table-set');
       // dtf.scrollTop = dtf.scrollHeight;
        setTimeout(function () {
            $('.table-set').scrollTop(100000);
            $('.buttonlist').css({'top':$('#Ttabel-until').height()-32}) ;
        },10);
    }
    onDeleteline(){
        let setarrvay  =  this.state.valuelist;
        setarrvay.pop();
        this.setData(setarrvay);
        setTimeout(function () {
            $('.table-set').scrollTop(100000);
            $('.buttonlist').css({'top':$('#Ttabel-until').height()-32}) ;
        },10);
    }

    setData(setarrvay){
        let _this=this;
        let isactive = false;
        setarrvay.every((m,i)=>{
            let beture = true;
            if(i==0)
            {
                if(m.endValue.toString().length==0){
                    isactive = false;
                    beture =false;
                    _this.setSdate();
                }
            }
            else if(i==setarrvay.length-1){
                if(m.startValue.toString().length==0){
                    isactive = false;
                    _this.setSdate();
                    beture =false;
                }
            }
            else if(m.startValue.toString().length==0||m.endValue.toString().length==0){
                isactive = false;
                _this.setSdate();
                beture =false;
            }
            if(beture){
                isactive = true;
                return true;
            }
        });

        if(isactive){
            $(".btn-content").find(".accept").removeClass("disable");
            _this.setState({active:true});
        }

        this.setState({
            valuelist:setarrvay
        });
    }
    setSdate(){
        $(".btn-content").find(".accept").addClass("disable");
        this.setState({active:false});
    }
    render() {
        return (
            <div className="tab-value">
                <div className="tab-tips">
                    <div className="tip-infobox">
                        <div className="text-box clearfix">
                            <div className="ico-wrap left">
                                <div className="icon iconfont">&#xe63a;</div>
                            </div>
                            <div className="txt left">更改的便签值，次日生效，在这期间之前的标签值将失效，请谨慎修改</div>
                        </div>
                    </div>
                </div>
                <div className="tab-title"><span>标签：</span><span>总计交易次数</span></div>
                <div id="table-set" className="table-set">
                    <table className="tabel-until" id="Ttabel-until">
                        <thead>
                        <tr>
                            <th>
                                <span className="tit-text">序号</span>
                            </th>
                            <th>
                                <span className="tit-text">标签值</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody id="tbody-box">
                        {this.state.valuelist.map((m,i)=> {
                                return (
                                    <tr>
                                        <td>{m.id}</td>
                                        <td className="value-sets">
                                            <div className="value-div">
                                                <input type="text" value={m.startValue} maxLength="22" onChange={this.onChangeInput.bind(this,m,'startValue')}/>
                                                <span>至</span>
                                                <input type="text" value={m.endValue}  maxLength="22" onChange={this.onChangeInput.bind(this,m,'endValue')}/>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        )}
                        </tbody>
                    </table>
                    <div id="buttonlist" href="#but" className="buttonlist">
                        <div className="icon iconfont" onClick={this.onAddline.bind(this)}>&#xe672;</div>
                        <div className="icon iconfont" onClick={this.onDeleteline.bind(this)}>&#xe674;</div>
                    </div>
                </div>
                <div className="boot-tips">注：区间起始值的规则是小于等于某数值; 区间最大值的规则是大于某数值;<br/>
                    起始值和最大值如果不填，则默认为XX以下或XX以上</div>
            </div>
        )
    }
}

module.exports = TabValue;
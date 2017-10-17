'use strict';
class panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }
    componentDidMount(){
        this.$el = $(React.findDOMNode(this));
    }
    componentWillUpdate(){
        let _this=this;
    }
    componentDidUpdate(){
    }
    render(){
        let _this=this;
        let bodyCls=(this.props.groupData&&this.props.groupData.hasChartData)?'':'no-data';
        let outDateCls = this.props.groupData.tag_list.every(m => {
                let isOut= m.tag_value_list.every(m => m.tag_status == 0);
               return isOut==1;
            })?'': 'out-date';//如果某一条标签的过期状态为1则把样式名变成out-date
        return (
                 <div className="group-right">
                     <div className="group-column-line"><div className="line"></div></div>
                     <div className={'group-center '+bodyCls}>
                         <div className="chart-count">
                             覆盖&nbsp;<span className="num">{this.props.groupData.chartCount||"0"}</span>&nbsp;人
                         </div>
                         <div className={'chart-body '}>


                             <div className="canvas-box" id={this.props.groupData.group_id+"-chart-box"} >
                                 <div className="canvas-area"  id={this.props.groupData.group_id+"-chart"}></div>
                             </div>
                         </div>
                         <div className="chart-legend">
                              <div>
                                  <span  className="chart-legend-icon"></span>
                                  <span>{(this.props.groupData.chartCount||"0")+" 人"}</span>
                              </div>
                         </div>
                         <div className={outDateCls}></div>
                     </div>
                 </div>
        )

    }
}
module.exports = panel;
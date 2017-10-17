/**
 * Created by AnThen on 2016-12-21.
 */
class Tips extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }
    render(){
        let count=Array.isArray( this.props.data)? this.props.data.length:0;
        let tipsData=Array.isArray(this.props.data)?this.props.data.slice(0,10):[];
        this.state.style=count>10?'inline-block':'none';
        return (
            <div className="tips segment-tips">
                <div className="title">所有标签值:</div>
                <div className="tags-con">
                   {
                       tipsData.map((x,i)=>{
                         return (<span>{x.tag_value}</span>);
                     })

                     }
                    <tt style={{display: this.state.style}}>...</tt>
                </div>
            </div>
        )
    }
}
module.exports = Tips;
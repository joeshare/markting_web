/**
 * Created by AnThen on 2017/1/17.
 */

//预览
class PreviewNobrFalse extends React.Component{
    render() {
        return (
            <div className="tags-cont">无</div>
        )
    }
}
class PreviewNobrTrue extends React.Component{
    render() {
        return (
            <div className="tags-cont">
                {this.props.param.map((m,i)=> {
                    return(
                        <nobr className="tag">{m.name}</nobr>
                    )
                })}
            </div>
        )
    }
}
class Preview extends React.Component{
    render() {
        let previewNobr = <PreviewNobrFalse />;
        if((this.props.param.tags).length > 0){previewNobr = <PreviewNobrTrue param={this.props.param.tags}/>}
        return (
            <div className="modals-preview-html">
                <div className="con-title">扫一扫</div>
                <div className="qrcode-box">
                    <div className="qrcode"><img src={this.props.param.qrcodePic}/></div>
                </div>
                <div className="channel-box">
                    <div className="channel-title">{this.props.param.chTitle}</div>
                    <div className="channel-test">{this.props.param.qrcodeName}</div>
                </div>
                <div className="valid-date-box">
                    {this.props.param.createtime}&nbsp;&#126;&nbsp;{this.props.param.failuresTimeShow}
                </div>
                <div className="fixed-crowd-box">
                    <div className="fixed-crowd-title">固定人群：</div>
                    <div className="fixed-crowd-cont">{this.props.param.fixedCrowdShow}</div>
                </div>
                <div className="tags-area">
                    <div className="tags-title">关联标签：</div>
                    {previewNobr}
                </div>
                <div className="note">备注：{this.props.param.commentshow}</div>
            </div>
        )
    }
}

module.exports = Preview;
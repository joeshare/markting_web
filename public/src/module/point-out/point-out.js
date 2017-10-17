/**
 * Created by AnThen on 2017/1/13.
 * 全站整行提示统一设定
 * 参数组合方式
 * pointOut:{
        icon:'',//必须存在；可选项：green、blue、orange、red；默认：orange
        back:'',//必须存在；可选项：green、blue、orange、red、gray；默认：gray
        text:{title:'这是title',text:'本页包含所有'}
        //text有三种形式：字符串、数组、对象
        //字符串：text:'单行提示内容'
        //数组：text:['多行提示内容','多行提示内容','多行提示内容']
        //对象：text:{
                    title:'提示title',//必须
                    text://可是单行字符串也可以是多行数组，具体组织形式同上面字符串和数组
                }
    }
 */

//icon
class IconGreen extends React.Component{
    render() {
        return (
            <div className="icon-box icon-green">
                <div className="iconfont icon">&#xe610;</div>
            </div>
        )
    }
}
class IconBlue extends React.Component{
    render() {
        return (
            <div className="icon-box icon-blue">
                <div className="iconfont icon">&#xe63a;</div>
            </div>
        )
    }
}
class IconOrange extends React.Component{
    render() {
        return (
            <div className="icon-box icon-orange">
                <div className="iconfont icon">&#xe63a;</div>
            </div>
        )
    }
}
class IconRed extends React.Component{
    render() {
        return (
            <div className="icon-box icon-red">
                <div className="iconfont icon">&#xe60a;</div>
            </div>
        )
    }
}

//text
class TextString extends React.Component{
    render() {
        return (
            <div className="text-box alone" title={this.props.param}>
                {this.props.param}
            </div>
        )
    }
}
class TextStringAlone extends React.Component{
    render() {
        return (
            <div className="text-box alone-alone" title={this.props.param}>
                {this.props.param}
            </div>
        )
    }
}
class TextArrayAlone extends React.Component{
    render() {
        return (
            <div className="text-box repeatedly-alone">
                {this.props.param.map((m,i)=> {
                    return (
                        <div>{this.props.param[i]}<br/></div>
                    )
                })}
            </div>
        )
    }
}
class TextArray extends React.Component{
    render() {
        return (
            <div className="text-box repeatedly">
                {this.props.param.map((m,i)=> {
                    return (
                        <div>{this.props.param[i]}<br/></div>
                    )
                })}
            </div>
        )
    }
}
class TextBold extends React.Component{
    render() {
        let thisText = this.props.param.text;
        let text;
        if(thisText.constructor == String){
            text = <TextStringAlone param={thisText}/>;
        }
        if(thisText.constructor == Array){
            text = <TextArray param={thisText}/>;
        }
        return (
            <div>
                <div className="text-box bold" title={this.props.param.title}>
                    {this.props.param.title}
                </div>
                {text}
            </div>
        )
    }
}

class PointOut extends React.Component{
    render() {
        let thisParam = this.props.param;
        let back,icon,text;
        switch (thisParam.back){
            case 'green':
                back = 'back-green';
                break;
            case 'blue':
                back = 'back-blue';
                break;
            case 'orange':
                back = 'back-orange';
                break;
            case 'red':
                back = 'back-red';
                break;
            default:
                back = 'back-gray';
                break;
        }
        switch (thisParam.icon){
            case 'green':
                icon = <IconGreen />;
                break;
            case 'blue':
                icon = <IconBlue />;
                break;
            case 'orange':
                icon = <IconOrange />;
                break;
            case 'red':
                icon = <IconRed />;
                break;
            default:
                icon = <IconOrange />;
                break;
        }
        if((thisParam.text).constructor == String){
            text = <TextString param={thisParam.text}/>;
        }
        if((thisParam.text).constructor == Array){
            text = <TextArrayAlone param={thisParam.text}/>;
        }
        if((thisParam.text).constructor == Object){
            text = <TextBold param={thisParam.text}/>;
        }
        return (
            <div className={"point-out "+back}>
                {icon}
                <div className="point-out-cont">
                    {text}
                </div>
            </div>
        )
    }
}
module.exports = PointOut;
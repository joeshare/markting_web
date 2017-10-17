/**
 * Created by AnThen on 2016-7-18.
 * 404 es6+react版
 */
'use strict';//严格模式

/********组织页面模块********/
class FalsePage extends React.Component {
    backHref(){
        let backHref=history.go(-1);
    }
    constructor(props){
        super(props);
        this.state = {
            data:[
                '1. 您查看的页面无法浏览或已经不存在',
                '2. 输入的网址不存在',
                '3. 系统繁忙或程序发生错误'
            ]
        };
    }
    render() {
        return (
            <div className="page404">
                <div className="content404-box">
                    <div className="theme-box">
                        <div className="theme-background-image"></div>
                        <h1 className="theme-text">
                            <span className="normal-text">页面迷失在</span>
                            <span className="big-text">数据迷宫中...</span>
                        </h1>
                    </div>
                    <div className="point-out">
                        <div className="title">没有找到您要访问的页面，可能的原因有：</div>
                        <div className="cont-text">
                            {this.state.data.map((m,i)=> {
                                return <div className="li">{m}</div>
                            })}
                        </div>
                    </div>
                    <div className="operation">
                        <a className="back" title="返回上一页" href="javascript:void(0)" onClick={this.backHref.bind(this)}>返回上一页</a>
                        <a className="go-index" title="marketing cloud 首页" href="/">marketing cloud 首页</a>
                    </div>
                </div>
            </div>
        )
    }
}
/********渲染页面********/
const falsePage = ReactDOM.render(
    <FalsePage />,
    document.getElementById('falsePage')
);
export default FalsePage;
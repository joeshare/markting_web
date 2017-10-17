/**
 * Created by joeliu on 2016-10-13.
 * 标签编辑
 */
'use strict';

let Layout = require('module/layout/layout');
let Modals = require('component/modals.js');
let pagination = require('plugins/pagination')($);//分页插件

//先创建布局
const layout = new Layout({
    index: 999,
    leftMenuCurName: '标签管理'
});

//主数据页面类
class MasterData extends React.Component {
    constructor(props) {
        super(props);

    }

    //初始化
    componentDidMount() {

    }




    //渲染
    render() {
        let data = this.state.mainCount;
        return (
            <div></div>
        )
    }
}

//渲染
const masterData = ReactDOM.render(
    <MasterData />,
    document.getElementById('page-body')
);

export default MasterData;


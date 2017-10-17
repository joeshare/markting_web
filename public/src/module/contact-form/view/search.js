class panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            val: ''
        };
    }

    componentDidMount() {
        this.$el = $(React.findDOMNode(this));
    }

    selectCondition(index, name) {
        $('#select-btn').text(name || '全部');
        this.setState({
            status: index
        })
        this.props.loadList({
            contact_status: index,
            contact_name: $('#search-input').val()
        })
    }

    selectVal() {
        this.props.loadList({
            status: this.state.status,
            contact_name: $('#search-input').val()
        })
    }

    search() {
        this.props.loadList({
            status: this.state.status,
            contact_name: $('#search-input').val()
        })
    }

    render() {
        return (
            <div className="searcher">
                <div className="text-box">
                    <span className="title">表单状态</span>
                </div>
                <span className="status">
                    <span id="select-btn" className="selectbtn dropdown-button contactway-btn"
                          data-activates="select-list"
                          data-beloworigin="true">全部</span>
                    <ul id="select-list" className="dropdown-content">
                        <li onClick={this.selectCondition.bind(this,3,'全部')}>全部</li>
                        <li onClick={this.selectCondition.bind(this,0,'未启用')}>未启用</li>
                        <li onClick={this.selectCondition.bind(this,1,'启用')}>启用</li>
                        <li onClick={this.selectCondition.bind(this,2,'停用')}>停用</li>
                    </ul>
                </span>
                <div className="search-area">
                    <div className="search-box">
                        <input id="search-input" className="input" placeholder="请输入名称关键字"
                               onChange={this.search.bind(this)}
                        />
                        <div className="icon iconfont"></div>
                    </div>
                </div>

            </div>
        )

    }
}
/**
 * //功能暂时隐藏
 <div className="input-box rui-search-box">
 <input placeholder="表单名称" id="search-input" type="text" className="search-input " />
 <div id="search-ico" className=" ico icon iconfont search-ico" onClick={this.selectVal.bind(this)}>&#xe60b;</div>
 </div>
 */
module.exports = panel;
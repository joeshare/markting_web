//创建弹出框
class RootCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valtext:''
        }
    }

    onchange(event){
        let inputvalue=  event.target.value;

        if(inputvalue.length<16){
            this.setState({
                valtext:inputvalue
            });
        }
    }

    componentDidMount() {

    }
    render() {
        return (
            <div className="wincontent">
                <div className="input-div">
                    <span className="input-tip">*</span>
                    <span className="input-lab">分类名称</span>
                    <span className="input-inp" ><input id="create_root" value={this.state.valtext} onChange={this.onchange.bind(this)} maxLength="15" placeholder="请输入分类名称"/></span>
                </div>
            </div>
        )
    }
}

module.exports = RootCreate;
//编辑弹出框
class RootEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editname:''
        }
    }

    componentDidMount() {
        this.setState({
            editname:this.props.editname
        });
    }

    ontextchange(event){ 
        let changevalue= event.target.value;
        if(changevalue.length<16) {
            this.setState({
                editname: changevalue
            });
        }
    }
    render() {
        return (
            <div className="wincontent">
                <div className="input-div">
                    <span className="input-tip">*</span>
                    <span className="input-lab">分类名称</span>
                    <span className="input-inp" ><input id="edit_root" value={this.state.editname} maxLength="15" onChange={this.ontextchange.bind(this)} placeholder="请输入分类名称"/></span>

                </div>
            </div>
        )
    }
}

module.exports = RootEdit;
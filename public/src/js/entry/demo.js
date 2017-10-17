/**
 * Created by 刘晓帆 on 2016-4-11.
 */
var HelloMessage = React.createClass({
    render: function() {
        return (
            <div>Hello {this.props.name}</div>

            )
    }
});

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.body
);

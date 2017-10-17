'use strict';
var Header = require('./header.js');
var LeftBox = require('./left-box.js');
var RightBox = require('./right-box.js');

class Panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    componentDidMount(){

    }

    onLab_click(params){
        this.refs.rtbox.onLab_click(params);
    }

    render(){
        return (
            <div className="system">
                <Header/>
                <div className="content">
                    <LeftBox onLab_click={this.onLab_click.bind(this)}/>
                    <RightBox ref="rtbox"/>
                </div>
            </div>
        )
    }
}
module.exports = Panel;
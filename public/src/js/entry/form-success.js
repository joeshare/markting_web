/*
 * @Author: UEC
 * @Date:   2016-08-09 15:07:25
 * @Last Modified by:   UEC
 * @Last Modified time: 2016-08-26 17:35:23
 */
'use strict';

class Success{

	constructor(props) {
		this.init();


		// this.setTotal = this.setTotal.bind(this)
	}
	init() {
        this.render();
    }
	// 实例化后执行一次,相当于init方法
	componentDidMount() {
	
		

	}

	//每次渲染之后都要调用
	componentDidUpdate() {	

	}

	render() {
		var params = util.getLocationParams();

        if (params !=null) {
            $('.peo').text(params.contact_name);
        }
	}
}
 
const success=new Success();
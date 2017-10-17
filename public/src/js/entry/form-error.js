/*
 * @Author: UEC
 * @Date:   2016-08-09 15:07:25
 * @Last Modified by:   UEC
 * @Last Modified time: 2016-08-26 17:31:21
 */
'use strict';
class Test {

    constructor(options) {
        this.init();
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
            $('#contact_name').text(params.contact_name);
        }
        
        $('.btn_back').on('click', function() {
            history.go(-1);
        });
    }
}
const test=new Test();
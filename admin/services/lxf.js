var serviceHandler = require('../serviceHandler');
var jData = [
    {
        name: 'A',
        id: 1
    },
    {
        name: 'B',
        id: 2
    },
    {
        name: 'C',
        id: 3
    },
    {
        name: 'D',
        id: 4
    },
    {
        name: 'E',
        id: 5
    },
    {
        name: 'F',
        id: 6
    },
    {
        name: 'G',
        id: 7
    },
    {
        name: 'H',
        id: 8
    },
    {
        name: 'I',
        id: 9
    }
]
var lxfApi = serviceHandler.send('/api/add', 'get', function (req, res, next) {
    console.log(req.body)//form表单请求参数
    var query = req.query;//请求参数对象

    return {
        success: true,
        data: (query.id == 0 || !query.id) ? jData : jData[Number(query.id)-1]
    }
}).send('/api/list', 'get', function (req, res, next) {
    console.log(req.body)//form表单请求参数
    var query = req.query;//请求参数对象
    return {
        success: true,
        data:"接口请求成功，我是data数据！"
    }
}).callback('/services/test', 'get', function (req, res, next, callback) {
    // callback({success:true,data:[]});
});
module.exports = lxfApi;
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
var fs = require('fs');
// 加载编码转换模块
var iconv = require('iconv-lite');
function writeFile(str,callBack){
    var arr = iconv.encode(str, 'gbk');
    // appendFile，如果文件不存在，会自动创建新文件
    // 如果用writeFile，那么会删除旧文件，直接写新文件
    fs.appendFile(_filename+"plan.json", arr, function(err){
        if(err)
            console.log("fail " + err);
        else
            console.log("写入文件ok");
    });
}
var api = serviceHandler.send('/api/query', 'get', function (req, res, next) {
    console.log(req.body)//form表单请求参数
    var query = req.query;//请求参数对象
    console.log("-----",query.id)
    return {
        success: true,
        data: query.id == 0? "ok" : "No"
    }
}).send('/api/savePlan', 'get', function (req, res, next) {
    var query = req.query;//请求参数对象
    console.log("-----",query)
    return {
        success: true,
        data: query.id == 0? "ok" : "No"
    }
})
module.exports = api;
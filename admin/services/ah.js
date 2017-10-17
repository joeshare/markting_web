/**
 * Created by AnThen on 2016/4/12.
 */
var serviceHandler = require('../serviceHandler');
var ahApi = serviceHandler.send('/api/ah', 'get', function (req, res, next) {

    return {
        success: true,
        data: 1
    }
})
module.exports = ahApi;
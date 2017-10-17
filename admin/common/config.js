var host = require('../common/host');
var environment = 'dev'; // dev:开发环境, release:上线环境
host = host[process.env.ENV || 'dev'];
console.log(process.env.ENV);
var config = {
    rootPath: host.rootUrl + ':' + host.appPort,
    projectName: 'bas',
    dbUser: 'bas',
    dbPass: 'bas',
    dbAddress: host.dbAddress,
    dbPort: '27017',
    dbName: 'basdb',
    email: 'webMaster@rongcapital.cn',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    remoteHost:'http://api.bas.ruixuesoft.com'
}
module.exports = config;
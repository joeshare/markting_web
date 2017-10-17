function registor(app) {
    var path = require('path');
    var requires = [
    './routes/index',
    './routes/captcha',
    './routes/login',
    './routes/doLogin',
    './routes/logout',
    './routes/registUser',
    './routes/regist',
    './routes/main/data-overview/analysis-list',
    './routes/main/data-overview/behavior',
    './routes/main/data-overview/overview-list',
    './routes/main/user-analysis/behavior/analysis',
    './routes/main/user-analysis/behavior/index',
    './routes/main/user-analysis/funnel/analysis',
    './routes/main/user-analysis/funnel/index',
    './routes/main/user-analysis/retained/analysis',
    './routes/main/user-analysis/retained/index',
    './routes/main/user-analysis/revisit/analysis',
    './routes/main/user-analysis/revisit/index',
    './routes/main/user-analysis/spread/analysis',
    './routes/main/user-analysis/spread/index',
    './routes/error'
    ];

    requires.forEach(function (item, index) {
        var route = require(item);
        app.use('/', route);
    })
}
module.exports = registor;

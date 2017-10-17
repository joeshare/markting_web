var express = require('express');
var path = require('path');
//var ejs = require('ejs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require(('express-session'));
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
//var MongoStore = require('connect-mongo')(session);

var routerRegister = require('./registRoutes');
var serviceRegister = require('./registServices');
var auth = require('./common/authentication');
global.config = require('./common/config');
var app = express();
//配置和缓存

//var mongooseConnection='mongodb://' + config.dbUser + ':' + config.dbPass + '@' + config.dbAddress + ':' + config.dbPort + '/' + config.dbName;

// 指定视图目录
//app.set('views', path.join(__dirname, 'views'));
//指定视图引擎
//app.engine('.html', require('./common/ejs'));
//app.set('view engine', 'html');
// 指定网站图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({
    secret: '12345',
    name: 'uba', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {
        maxAge: config.cookie.maxAge //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    },
    resave: false,
    saveUninitialized: true//,
    //store: new MongoStore({ //创建新的mongodb数据库
    //    /*host: config.dbAddress, //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
    //    port: config.dbPort, //数据库的端口号
    //    db: 'uba-session' //数据库的名称。
    //    user:'uba',
    //    pwd:'uba'*/
    //   url: mongooseConnection
    //})
}));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(function(req,res,next){
    //跨域设置
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Powered-By','User Analysis System');
    next();
})
//app.use('/resources', express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'views')));

//app.all('*', auth.Authentication);

//注册路由
//routerRegister(app);
//注册服务
serviceRegister(app);

// 404错误处理
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.redirect('/error');
    //next(err);
});

//开发环境错误提示
if (app.get('env') === 'dev') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//生产环境错误提示
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//连接数据库
//mongoose.connect(mongooseConnection);

module.exports = app;
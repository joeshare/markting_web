/**
 * Created by 刘晓帆 on 2016-4-11.
 * gulp配置
 */
'use strict';
//引入插件
var del = require('del');
var shell = require('gulp-shell');
var connect = require('gulp-connect');
var Proxy = require('gulp-connect-proxy');
var livereload = require('gulp-livereload');
var replace = require('gulp-replace');
var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var md5 = require("gulp-md5-plus");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var htmlmin = require('gulp-htmlmin');
var gulpSequence = require('gulp-sequence');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var opts = {
    mainVersion: '1.0.0',//主版本号
    allFileSrc: ['**/*.*'],
    srcDir: './src',
    rootPath: '/',
    buildDir: './dist'
};

gulp.task("webpack-dev-server", shell.task(['webpack-dev-server --inline --progress --colors --hot --display-error-details --content-base src/']));
gulp.task("server:dev", function () {
    //开发版80端口
    connect.server({
        root: opts.srcDir,
        port: 80,
        livereload: true,
        middleware: function (connect, opt) {
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });
    //压缩版8088端口
    connect.server({
        root: opts.buildDir,
        port: 8088,
        livereload: true,
        middleware: function (connect, opt) {
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });

});

gulp.task("webpack", shell.task(['webpack -p --progress --colors']));
//gulp.task('watch', function () {
//    livereload.listen();
//    gulp.watch(opts.srcDir + '/**/*.html', ['html']);
//});

gulp.task('copy:m', function (cb) {
    gulp.src([
        opts.srcDir + '/m/**/**.*'
    ])
        .pipe(gulp.dest(opts.buildDir + '/m'))
        .on('finish', cb);
});
gulp.task('copy:js', function (cb) {
    gulp.src([
        opts.srcDir + '/js/**/libs/*.js',
        opts.srcDir + '/js/**/plugins/*.js'
    ])
        .pipe(gulp.dest(opts.buildDir + '/js/'))
        .on('finish', cb);
});
gulp.task('copy:img', function (cb) {
    gulp.src([
        opts.srcDir + '/img/**/*.*'
    ])
        .pipe(gulp.dest(opts.buildDir + '/img'))
        .on('finish', cb);
});
gulp.task('copy:download', function (cb) {
    gulp.src([
        opts.srcDir + '/download/**/*.*'
    ])
        .pipe(gulp.dest(opts.buildDir+'/download'))
        .on('finish', cb);
});
gulp.task('copy:ico', function (cb) {
    gulp.src([
        opts.srcDir + '/favicon.ico'
    ])
        .pipe(gulp.dest(opts.buildDir))
        .on('finish', cb);
});
gulp.task('copy:json', function (cb) {
    gulp.src([
        opts.srcDir + '/apidata/**/*.*'
    ])
        .pipe(gulp.dest(opts.buildDir + '/apidata'))
        .on('finish', cb);
});
gulp.task('copy:css', function (cb) {
    gulp.src([
        opts.srcDir + '/css/**/*.css',
        opts.srcDir + '/css/**/*.eot',
        opts.srcDir + '/css/**/*.ttf',
        opts.srcDir + '/css/**/*.woff',
        opts.srcDir + '/css/**/*.woff2'
    ])
        .pipe(gulp.dest(opts.buildDir + '/css'))
        .on('finish', cb);
});
//gulp.task('md51', function (cb) {
//    gulp.src([opts.buildDir + '/js/*.js'])
//        .pipe(md5(1, opts.buildDir + '/**/*.html'))
//        .pipe(gulp.dest(opts.buildDir + '/js'))
//        .on('finish', cb);
//});
gulp.task('md510', function (cb) {
    gulp.src([opts.buildDir + '/js/*.js'])
        .pipe(md5(9, opts.buildDir + '/**/*.html'))
        .pipe(gulp.dest(opts.buildDir + '/js'))
        .on('finish', cb);
});
gulp.task('replace', function () {
    var indexV = gulp.src([opts.srcDir + '/index.html'])
        .pipe(replace('http://localhost:8080/', './'))
        .pipe(gulp.dest(opts.buildDir));
    var htmlV = gulp.src([opts.srcDir + '/html/**/*.html', '!/**/tpl.html'])
        .pipe(replace('http://localhost:8080/', '../../'))
        .pipe(gulp.dest(opts.buildDir + '/html'));
    var MV = gulp.src([opts.srcDir + '/m/**/*.html', '!/**/tpl.html'])
        .pipe(replace('http://localhost:8080/', '../../'))
        .pipe(gulp.dest(opts.buildDir + '/m'));
});

//新服务器
gulp.task('changetodev', function (cb) {
    gulp.src([opts.srcDir + '/js/config.js'])
        .pipe(replace(/^(\s*API_PATH\s*:\s*)'[^']*'/m, "$1'http://mktdevsrv.cssrv.dataengine.com/api'"))
        .pipe(replace(/^(\s*UPLOADAIP_PATH\s*:\s*)'[^']*'/m, "$1'http://mktdevsrv.cssrv.dataengine.com/upload/api'"))
        .pipe(replace(/^(\s*FILE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktdevsrv.cssrv.dataengine.com/downloads/'"))
        .pipe(replace(/^(\s*NODE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktdevsrv.cssrv.dataengine.com/users/api'"))
        .pipe(gulp.dest(opts.srcDir + '/js/'))
        .on('finish', cb);
});
//老服务器
gulp.task('changetoOlddev', function (cb) {
    gulp.src([opts.srcDir + '/js/config.js'])
        .pipe(replace(/^(\s*API_PATH\s*:\s*)'[^']*'/m, "$1'http://mktdevsrv.rc.dataengine.com/api'"))
        .pipe(replace(/^(\s*UPLOADAIP_PATH\s*:\s*)'[^']*'/m, "$1'http://mktdevsrv.rc.dataengine.com/upload/api'"))
        .pipe(replace(/^(\s*FILE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktdev.rc.dataengine.com/downloads/'"))
        .pipe(replace(/^(\s*NODE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktdevsrv.rc.dataengine.com/users/api'"))
        .pipe(gulp.dest(opts.srcDir + '/js/'))
        .on('finish', cb);
});

gulp.task('changetoprod', function (cb) {

    gulp.src([opts.srcDir + '/js/config.js'])
        .pipe(replace(/^(\s*API_PATH\s*:\s*)'[^']*'/m, "$1'http://mc6666srv.ruixuesoft.com/api'"))
        .pipe(replace(/^(\s*UPLOADAIP_PATH\s*:\s*)'[^']*'/m, "$1'http://mc6666srv.ruixuesoft.com/upload/api'"))
        .pipe(replace(/^(\s*FILE_PATH\s*:\s*)'[^']*'/m, "$1'http://mc6666srv.ruixuesoft.com/downloads/'"))
        .pipe(replace(/^(\s*NODE_PATH\s*:\s*)'[^']*'/m, "$1'http://mc6666srv.ruixuesoft.com/users/api'"))
        .pipe(gulp.dest(opts.srcDir + '/js/'))
        .on('finish', cb);
});
//微信
gulp.task('changetowxsrv', function (cb) {

    gulp.src([opts.srcDir + '/js/config.js'])
        .pipe(replace(/^(\s*API_PATH\s*:\s*)'[^']*'/m, "$1'http://mktwxsrv.cssrv.dataengine.com/api'"))
        .pipe(replace(/^(\s*UPLOADAIP_PATH\s*:\s*)'[^']*'/m, "$1'http://mktwxsrv.cssrv.dataengine.com/upload/api'"))
        .pipe(replace(/^(\s*FILE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktwxsrv.cssrv.dataengine.com/downloads/'"))
        .pipe(replace(/^(\s*NODE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktwxsrv.cssrv.dataengine.com/users/api'"))
        .pipe(gulp.dest(opts.srcDir + '/js/'))
        .on('finish', cb);
});

gulp.task('changetotest', function (cb) {
    gulp.src([opts.srcDir + '/js/config.js'])
        .pipe(replace(/^(\s*API_PATH\s*:\s*)'[^']*'/m, "$1'http://mktsrv.cssrv.dataengine.com/api'"))
        .pipe(replace(/^(\s*UPLOADAIP_PATH\s*:\s*)'[^']*'/m, "$1'http://mktsrv.cssrv.dataengine.com/upload/api'"))
        .pipe(replace(/^(\s*FILE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktsrv.cssrv.dataengine.com/downloads/'"))
        .pipe(replace(/^(\s*NODE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktsrv.cssrv.dataengine.com/users/api'"))
        .pipe(replace(/^(\s*EVENT_PATH\s*:\s*)'[^']*'/m, "$1'http://mkt-event-test.cssrv.dataengine.com/event/api'"))
        .pipe(gulp.dest(opts.srcDir + '/js/'))
        .on('finish', cb);
});

gulp.task('changetomc0000', function (cb) {
    gulp.src([opts.srcDir + '/js/config.js'])
        .pipe(replace(/^(\s*API_PATH\s*:\s*)'[^']*'/m, "$1'http://mc0000srv.ruixuesoft.com/api'"))
        .pipe(replace(/^(\s*UPLOADAIP_PATH\s*:\s*)'[^']*'/m, "$1'http://mc0000srv.ruixuesoft.com/upload/api'"))
        .pipe(replace(/^(\s*FILE_PATH\s*:\s*)'[^']*'/m, "$1'http://mc0000srv.ruixuesoft.com/downloads/'"))
        .pipe(replace(/^(\s*NODE_PATH\s*:\s*)'[^']*'/m, "$1'http://mc0000srv.ruixuesoft.com/users/api'"))
        .pipe(gulp.dest(opts.srcDir + '/js/'))
        .on('finish', cb);
});
gulp.task('changetomc0001', function (cb) {
    gulp.src([opts.srcDir + '/js/config.js'])
        .pipe(replace(/^(\s*API_PATH\s*:\s*)'[^']*'/m, "$1'http://mc0000srv.ruixuesoft.com/api'"))
        .pipe(replace(/^(\s*UPLOADAIP_PATH\s*:\s*)'[^']*'/m, "$1'http://mc0000srv.ruixuesoft.com/upload/api'"))
        .pipe(replace(/^(\s*FILE_PATH\s*:\s*)'[^']*'/m, "$1'http://mc0000srv.ruixuesoft.com/downloads/'"))
        .pipe(replace(/^(\s*NODE_PATH\s*:\s*)'[^']*'/m, "$1'http://mc0000srv.ruixuesoft.com/users/api'"))
        .pipe(gulp.dest(opts.srcDir + '/js/'))
        .on('finish', cb);
});

gulp.task('changetolocal', function (cb) {
    gulp.src([opts.srcDir + '/js/config.js'])
        .pipe(replace(/^(\s*API_PATH\s*:\s*)'[^']*'/m, "$1'http://localhost:8066/api'"))
        .pipe(replace(/^(\s*UPLOADAIP_PATH\s*:\s*)'[^']*'/m, "$1'http://mktsrv.cssrv.dataengine.com/upload/api'"))
        .pipe(replace(/^(\s*FILE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktsrv.cssrv.dataengine.com/downloads/'"))
        .pipe(replace(/^(\s*NODE_PATH\s*:\s*)'[^']*'/m, "$1'http://mktsrv.cssrv.dataengine.com/users/api'"))
        .pipe(gulp.dest(opts.srcDir + '/js/'))
        .on('finish', cb);
});

gulp.task('html:min', function (cb) {
    gulp.src(opts.buildDir + '/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(opts.buildDir))
        .on('finish', cb);
});
gulp.task("clean", function (cb) {
    gulp.src(opts.buildDir)
        .pipe(clean({read: false}))
        .on('finish', cb);
});

gulp.task('watchsass', function () {
    gulp.watch(opts.srcDir + '/css/**/*.scss', ['sassfile']);
});

gulp.task('sassfile', function () {
    return gulp.src(opts.srcDir + '/css/**/*.scss')
        .pipe(sass().on('error', sass.logError)).pipe(gulp.dest(opts.srcDir + '/css/'));
});
gulp.task('htmlfile', function () {
    gulp.src(opts.buildDir + '/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(opts.buildDir))
});
gulp.task('default', ['server:dev', 'webpack-dev-server', 'sassfile', 'watchsass']);
gulp.task('copyall',  ['copy:json', 'copy:css', 'copy:img', 'copy:js', 'copy:ico','copy:download']);
gulp.task('builddev', gulpSequence(
    'clean',
    'sassfile',
    'changetodev',
    'copyall',
    'webpack',
    'replace',
    //'md51',
    'html:min'
    //'md510',
));
gulp.task('buildolddev', gulpSequence(
    'clean',
    'sassfile',
    'changetoOlddev',
    'copyall',
    'webpack',
    'replace',
    //'md51',
    'html:min'
    //'md510',
));
gulp.task('buildprod', gulpSequence(
    'clean',
    'sassfile',
    'changetoprod',
    'copyall',
    'webpack',
    'replace',
    //'md51',
    'html:min'
    //'md510',
));
gulp.task('buildwxsrv', gulpSequence(
    'clean',
    'sassfile',
    'changetowxsrv',
    'copyall',
    'webpack',
    'replace',
    //'md51',
    'html:min'
    //'md510',
));
gulp.task('buildtest', gulpSequence(
    'clean',
    'sassfile',
    'changetotest',
    'copyall',
    'webpack',
    'replace',
    //'md51',
    'html:min'
    //'md510',
));
gulp.task('buildmc0000', gulpSequence(
    'clean',
    'sassfile',
    'changetomc0000',
    'copyall',
    'webpack',
    'replace',
    //'md51',
    'html:min'
    //'md510',
));
gulp.task('buildmc0001', gulpSequence(
    'clean',
    'sassfile',
    'changetomc0000',
    'copyall',
    'webpack',
    'replace',
    //'md51',
    'html:min'
    //'md510',
));


gulp.task('changetointernal', function (cb) {
    gulp.src([opts.srcDir + '/js/config.js'])
        .pipe(replace(/^(\s*API_PATH\s*:\s*)'[^']*'/m, "$1'http://mcsrv.internal.ruixuesoft.com/api'"))
        .pipe(replace(/^(\s*UPLOADAIP_PATH\s*:\s*)'[^']*'/m, "$1'http://mcsrv.internal.ruixuesoft.com/upload/api'"))
        .pipe(replace(/^(\s*FILE_PATH\s*:\s*)'[^']*'/m, "$1'http://mcsrv.internal.ruixuesoft.com/downloads/'"))
        .pipe(replace(/^(\s*NODE_PATH\s*:\s*)'[^']*'/m, "$1'http://mcsrv.internal.ruixuesoft.com/users/api'"))
        .pipe(replace(/^(\s*EVENT_PATH\s*:\s*)'[^']*'/m, "$1'http://mcsrv.internal.ruixuesoft.com/event/api'"))
        .pipe(gulp.dest(opts.srcDir + '/js/'))
        .on('finish', cb);
});


gulp.task('buildinternal', gulpSequence(
    'clean',
    'sassfile',
    'changetointernal',
    'copyall',
    'webpack',
    'replace',
    //'md51',
    'html:min'
    //'md510',
));







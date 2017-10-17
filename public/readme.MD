
jenkins脚本配置

    发tags方式
         refs/tags/1.1.35
    发分支方式
         */dev
功能覆盖：

    1.文件合并
    2.文件压缩
    3.图片转BASE64
    4.scss预编译
    5.es6/react预编译
    6.md5清缓存机制
    7.包管理
    8.基于backbone的MVC开发模式（后期会过渡为react）
    9.本地接口代理服务(解决ajax跨域问题)
    
项目使用方法：

     启动服务脚本：
       $ gulp

     打包部署(开发环境、测试环境、生产环境)
       $ gulp builddev
       $ gulp buildpro
       $ gulp buildpub


     注：如果系统内gulp没有安装到全局可以到node_modules/.bin/下运行 gulp

    访问地址：
        开发版访问地址为http://localhost/
        压缩版访问地址为http://localhost:8088/


git 开发流程
    1.在远端创建分支

webpack 参数： 
   
    webpack 最基本的启动webpack命令
    webpack -w 提供watch方法，实时进行打包更新
    webpack -p 对打包后的文件进行压缩
    webpack -d 提供SourceMaps，方便调试
    webpack --colors 输出结果带彩色，比如：会用红色显示耗时较长的步骤
    webpack --profile 输出性能数据，可以看到每一步的耗时
    webpack --display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块

常用Plugins介绍

    代码热替换, HotModuleReplacementPlugin
    生成html文件，HtmlWebpackPlugin
    将css成生文件，而非内联，ExtractTextPlugin
    报错但不退出webpack进程，NoErrorsPlugin
    代码丑化，UglifyJsPlugin，开发过程中不建议打开
    多个 html共用一个js文件(chunk)，可用CommonsChunkPlugin
    清理文件夹，Clean
    调用模块的别名ProvidePlugin，例如想在js中用$，如果通过webpack加载，需要将$与jQuery对应起来

html-webpack-plugin 配置说明：

    title: 用来生成页面的 title 元素
    filename: 输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
    template: 模板文件路径，支持加载器，比如 html!./index.html
    inject: true | 'head' | 'body' | false  ,注入所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中。
    favicon: 添加特定的 favicon 路径到输出的 HTML 文件中。
    minify: {} | false , 传递 html-minifier 选项给 minify 输出
    hash: true | false, 如果为 true, 将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS 文件，对于解除 cache 很有用。
    cache: true | false，如果为 true, 这是默认值，仅仅在文件修改之后才会发布文件。
    showErrors: true | false, 如果为 true, 这是默认值，错误信息会写入到 HTML 页面中
    chunks: 允许只添加某些块 (比如，仅仅 unit test 块)
    chunksSortMode: 允许控制块在添加到页面之前的排序方式，支持的值：'none' | 'default' | {function}-default:'auto'
    excludeChunks: 允许跳过某些块，(比如，跳过单元测试的块) 
       


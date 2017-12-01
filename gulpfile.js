var gulp = require('gulp')
var connect = require('gulp-connect')
var Mock = require('mockjs')
var URL = require('url')
var mockData = require('./mockData.js')

var urlCallback = function( /*connect, opt*/ ) {
    return [
        // https://github.com/senchalabs/connect/#use-middleware
        function mock(req, res, next) {
            //跨域处理
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            // 在这里检测根据 req 的路径和类型，执行相应的 Mock.mock
             var url = URL.parse(req.url,true);
             var data =  JSON.stringify(
                        Mock.mock(
                            mockData[url.pathname]
                        )
                    )
            if (mockData[url.pathname]) {
                //jquery跨域处理
                if(url.query.callback){
                    res.end(url.query.callback+'('+data+')')
                }else{
                     res.end(data)
                }
            }
            next()
        }
    ]
}

// 多个server处理
//host加上 127.0.0.1 api.com
//端口默认80
gulp.task('mockserver1', function() {
    connect.server({
        port:80,
        host:'api.com',
        middleware: urlCallback
    })
})

gulp.task('mockserver2', function () {
  connect.server({
    name: 'mockserver2',
    root: 'dist',
    port: 80,
    livereload: true,
    middleware: urlCallback
  });
});

gulp.task('default', ['mockserver1','mockserver2'])
/*
const { series, parallel } = require('gulp');
// function defaultTask(cb) {
//     // place code for your default task here
//     console.log('hello gulp')
//     cb();
// }

// exports.default = defaultTask

// 每一个方法相叫一个任务， cb 表示任务结束
function html(cb) {
    console.log('html');
    cb();
}
function css(cb) {
    console.log('css');
    cb();
}
function js(cb) {
    console.log('js');
    cb();
}
// series从左到右依次执行任务
// exports.default = series(html, css, js);
// parallel会同时执行任务
// exports.default = parallel(html, css, js);
// series和parallel可以相互嵌套
const uglify = require('gulp-uglify'); //用于压缩文件的插件
const rename = require('gulp-rename'); // 用于修改文件名
const { src, dest } = require('gulp');
// src读取文件，dest写入文件
// src读取文件后的每一步操作使用.pipe(),src需要卸载return语句里
*/
const { series, src, dest, watch } = require('gulp');
const htmlClean = require('gulp-htmlclean'); // 对html文件进行压缩
const less = require('gulp-less'); // 将less代码转换类css代码
const cleanCss = require('gulp-clean-css'); //将css文件压缩
const uglify = require('gulp-uglify'); // 压缩js代码
const imgMin = require('gulp-imagemin');
const connect = require('gulp-connect'); //设置服务器
const folder = {
    src: 'src/',
    dist: "dist/"
}

function html() {
    return src(folder.src + 'html/*')
        .pipe(htmlClean())
        .pipe(dest(folder.dist + 'html/'))
        .pipe(connect.reload()); //重新加载页面
}
function css() {
    return src(folder.src + 'css/*')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(dest(folder.dist + 'css/'))
        .pipe(connect.reload());
}
function js() {
    return src(folder.src + 'js/*')
        .pipe(uglify())
        .pipe(dest(folder.dist + 'js/'))
        .pipe(connect.reload());
}
// function image() {
//     return src(folder.src + 'images/*')
//         .pipe(imgMin())
//         .pipe(dest(folder.dist + 'images/'))
// }
function server(cb) {
    connect.server({
        port: '12306', // 端口号
        livereload: true //自动刷新
    })
    cb()
}
// 监听html文件，发生变化时执行函数
watch(folder.src+'html/*',function(cb){
    html();
    cb()
});
watch(folder.src+'css/*',function(cb){
    css();
    cb()
});
watch(folder.src+'js/*',function(cb){
    js();
    cb()
});

exports.default = series(html, css, js, server);
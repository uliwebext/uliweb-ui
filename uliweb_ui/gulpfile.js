/**
 * Created by HoseaLee on 16/11/25.
 */

var gulp = require("gulp"),
    concat = require("gulp-concat"), //文件合并
    minifycss = require("gulp-clean-css"), //css压缩
    uglify = require("gulp-uglify"), //js压缩
    //jshint = require("gulp-jshint"), //js检测
    //htmlmin = require("gulp-htmlmin"), //html压缩
    //imagemin = require("gulp-imagemin"), //图片压缩
    //pngcrush = require("imagemin-pngcrush"),
    rename = require("gulp-rename"),    //文件更名
    notify = require("gulp-notify");    //提示信息

var node_ini = require("node-ini"); //node读写ini文件组件
var minimist = require("minimist"); //命令行

var knownOptions = {
    string: 'dist',
    string: 'settings'
};

var options = minimist(process.argv.slice(2), knownOptions);

if((!options.dist) || (!options.settings)){
    console.log("Please give two arguments(--dist, --settings)");
    return false;
}

/*settings配置文件的格式:
    [template_use.jqueryui]
    toplinks[] = /Users/HoseaLee/Workspace/Uliwebext/uliweb-ui/uliweb_ui/static/modules/jquery-ui/1.11.4/jquery-ui.min.css
    toplinks[] = ...
    .
    .
    .
    dist = common-ui

    ps:[template_use.xxx] 插件名称以template_use开头, .xxx是插件名字,此版本不做他用,只用来区分插件
        toplinks[] = xxx 插件中的一个文件,xxx是文件路径
        dist = xxx 处理文件后归集到的文件名称的前缀,例如 dist = abc ,归集后js文件放到abc.js, css文件放到abc.css

    文件归集的位置默认在./dist下, 如果gulp cli时以参数传入,则使用参数,且每次gulp都按照文件类型分类到js、css文件夹
* */
gulp.task("css", function () {
    var default_options = {
        dist: "common"
    };
    node_ini.parse(options.settings, function (err, data) {
        var dists = [];
        for (var k in data) {
            var dist = data[k]['dist'];
            if(!dist){
                //如果没设置dist, 使用默认dist
                dist = default_options.dist;
            }
            if (!dists[dist]) {
                dists[dist] = {'css': [], 'js': []};
            }
            if (!data[k].toplinks)
                data[k].toplinks = []
            for (var i = 0, len = data[k]['toplinks'].length; i < len; i++) {
                var link = data[k]['toplinks'][i];
                if (link.indexOf(".css") > 0) {
                    dists[dist]['css'].push(link);
                } else if (link.indexOf(".js") > 0) {
                    dists[dist]['js'].push(link);
                }
            }
        }
        for (var k in dists) {
            var css_list = dists[k]['css'];
            var js_list = dists[k]['js'];
            gulp.src(css_list)
                .pipe(concat(k + ".css"))
                .pipe(gulp.dest(options.dist));
            gulp.src(js_list)
                .pipe(concat(k + ".js"))
                .pipe(gulp.dest(options.dist));
        }
    });
});

gulp.task("default", ['css']);

/**
 * Created by HoseaLee on 16/11/25.
 */

var gulp = require("gulp"),
    concat = require("gulp-concat"), //文件合并
    minifycss = require("gulp-minify-css"), //css压缩
    uglify = require("gulp-uglify"), //js压缩
    //jshint = require("gulp-jshint"), //js检测
    htmlmin = require("gulp-htmlmin"), //html压缩
    imagemin = require("gulp-imagemin"), //图片压缩
    pngcrush = require("imagemin-pngcrush"),
    rename = require("gulp-rename"),    //文件更名
    notify = require("gulp-notify");    //提示信息

var node_ini = require("node-ini"); //node读写ini文件组件
var minimist = require("minimist"); //命令行

var knownOptions = {
    string: 'dist',
    string: 'settings',
};

var options = minimist(process.argv.slice(2), knownOptions);

if((!options.dist) || (!options.settings)){
    console.log("Please give two arguments(--dist, --settings)");
    return false;
}

//ui和layout
var path = {
    uliweb_ui: '/Users/HoseaLee/Workspace/Uliwebext/uliweb-ui/uliweb_ui',
    uliweb_layout: '/Users/HoseaLee/Workspace/Uliwebext/uliweb-layout/uliweb_layout/'
};

//插件版本信息,需要时从该对象中取
var ui_versions = {
    'ui.bootstrap3': '3.3.6',
    'ui.fontawesome': '4.6.3',
    'ui.ionicons': '2.0.1',
    'ui.jquery': '1.12.4',
    'ui.jqueryui': '1.11.4',
    'ui.lodash': '3.10.1',
    'ui.riot': '2.6.2',
    'ui.ag-grid': '4.2.5',
    'ui.ueditor': '1.4.3.3',
    'ui.echarts': '3.2.3',
    'ui.ztree': '3.5.24'
};

var common_css_list = [
    {
        project: "ui",
        path: path['uliweb_ui'] + '/static/modules/jquery-ui/' + ui_versions['ui.jqueryui'] + '/jquery-ui.min.css'
    },
    {
        project: "ui",
        path: path['uliweb_ui'] + '/static/modules/bootstrap/' + ui_versions['ui.bootstrap3'] + '/css/bootstrap.min.css'
    },
    {
        project: "ui",
        path: path['uliweb_ui'] + '/static/modules/font-awesome/' + ui_versions['ui.fontawesome'] + '/css/font-awesome.min.css'
    },
    {
        project: "ui",
        path: path['uliweb_ui'] + '/static/modules/ionicons/' + ui_versions['ui.ionicons'] + '/css/ionicons.min.css'
    },
    {project: "layout", path: path['uliweb_layout'] + '/layout/static/adminlte/2.3.2/css/AdminLTE.min.css'},
    {project: "layout", path: path['uliweb_layout'] + '/layout/static/adminlte/2.3.2/css/skins/_all-skins.min.css'},
    {project: "layout", path: path['uliweb_layout'] + '/layout/static/layout.css'}
];

gulp.task("css_old", function () {

    var ui = [], //存储uliweb_ui中需要拼接的css文件路径
        layout = []; //存储uliweb_layout中需要拼接的css文件路径

    //遍历common_css_list, 根据属性project判断属于ui还是layout,并将属性path的值放入对应数组待处理
    for (var i = 0, len = common_css_list.length; i < len; i++) {
        (common_css_list[i]['project'] == "ui") ? ui.push(common_css_list[i]['path']) : '';
        (common_css_list[i]['project'] == "layout") ? layout.push(common_css_list[i]['path']) : '';
    }

    gulp.src(ui)
        .pipe(concat("uliweb_ui.css"))
        .pipe(gulp.dest("./dist"));

    gulp.src(layout)
        .pipe(concat("uliweb_layout.css"))
        .pipe(gulp.dest("./dist"));

});

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

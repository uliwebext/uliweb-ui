var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    del = require('del'),
    riot = require('gulp-riot'),
    livereload = require('gulp-livereload');


gulp.task('css', function() {
  // 将你的默认的任务代码放在这
  return gulp.src('uliweb_ui/src/utils/css/*.css')
    .pipe(concat('uliweb-ui.css'))
    .pipe(gulp.dest('uliweb_ui/static/modules/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('uliweb_ui/static/modules/'))
    // .pipe(notify({ message: 'css process completed!' }));
});

gulp.task('js', function() {
  return gulp.src(['uliweb_ui/src/utils/js/*.js'])
    // .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('uliweb-ui.js'))
    .pipe(gulp.dest('uliweb_ui/static/modules/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
    .pipe(gulp.dest('uliweb_ui/static/modules/'))
    // .pipe(notify({ message: 'js-main task complete' }));
});

gulp.task('tags', function() {
  return gulp.src(['uliweb_ui/src/tags/*.tag'])
    .pipe(riot())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('uliweb_ui/static/modules/tags/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
    .pipe(gulp.dest('uliweb_ui/static/modules/tags/'))
    // .pipe(notify({ message: 'js-rest task complete' }));
});

gulp.task('tags-js', function() {
  return gulp.src(['uliweb_ui/src/tags/*.js'])
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('uliweb_ui/static/modules/tags/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
    .pipe(gulp.dest('uliweb_ui/static/modules/tags/'))
    // .pipe(notify({ message: 'js-rest task complete' }));
});

gulp.task('watch', function() {
  gulp.watch('uliweb_ui/src/tags/*.tag', ['tags']);
  // Watch .css files
  gulp.watch('uliweb_ui/src/utils/css/*.css', ['css']);
  // Watch .js files
  gulp.watch('uliweb_ui/src/utils/js/*.js', ['js']);

});

gulp.task('default', function() {
    gulp.start('css', 'js', 'tags', 'tags-js');
});

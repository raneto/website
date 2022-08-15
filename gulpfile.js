
'use strict';

// Modules
var gulp        = require('gulp');
var concat      = require('gulp-concat');
var minify_css  = require('gulp-clean-css');
var minify_html = require('gulp-htmlmin');
var replace     = require('gulp-string-replace');
var sitemap     = require('gulp-sitemap');
var pkgjson     = require('./package.json');

// Settings
var build  = 'v' + pkgjson.version;
var prefix = build;
var domain = 'raneto.com';

// Debug Output
console.log('BUILD:', build);
console.log('PREFIX:', prefix);

// HTML
gulp.task('html', function () {
  // Not including other files for now
  return gulp.src('./src/html/index.html')
    .pipe(minify_html({
      collapseWhitespace : true,
      removeComments     : true
    }))
    .pipe(replace(new RegExp('@prefix@', 'g'), prefix))
    .pipe(gulp.dest('./public/'));
});

// CSS
gulp.task('css', function () {
  return gulp
    .src([
      './src/css/*.css'
    ])
    .pipe(minify_css({ compatibility : 'ie9' }))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./public/' + build + '/css/'));
});

// Static Files
gulp.task('static', function () {
  return gulp
    .src('./src/static/**/*', { base : './src/static' })
    .pipe(gulp.dest('./public/' + build + '/'));
});

// Sitemap
gulp.task('sitemap', function () {
  return gulp.src('public/**/*.html', {
    read: false
  })
  .pipe(sitemap({
    siteUrl: 'https://' + domain
  }))
  .pipe(minify_html({
    collapseWhitespace : true,
    removeComments     : true
  }))
  .pipe(gulp.dest('./public/'));
});

// Main Task
gulp.task('default', gulp.series([
  'html',
  'css',
  'static',
  'sitemap'
]));

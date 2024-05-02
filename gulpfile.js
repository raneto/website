"use strict";

// Modules
const gulp = require("gulp");
const concat = require("gulp-concat");
const minify_css = require("gulp-clean-css");
const minify_html = require("gulp-htmlmin");
const replace = require("gulp-string-replace");
const sitemap = require("gulp-sitemap");
const pkgjson = require("./package.json");

// Settings
const build = "v" + pkgjson.version;
const prefix = build;
const domain = "raneto.com";

// Debug Output
console.log("BUILD:", build);
console.log("PREFIX:", prefix);

// HTML
gulp.task("html", function () {
  // Not including other files for now
  return gulp
    .src("./src/html/index.html")
    .pipe(
      minify_html({
        collapseWhitespace: true,
        removeComments: true,
      }),
    )
    .pipe(replace(new RegExp("@prefix@", "g"), prefix))
    .pipe(gulp.dest("./public/"));
});

// CSS
gulp.task("css", function () {
  return gulp
    .src(["./src/css/*.css"])
    .pipe(minify_css({ compatibility: "ie9" }))
    .pipe(concat("main.min.css"))
    .pipe(gulp.dest("./public/" + build + "/css/"));
});

// Static Files
gulp.task("static", function () {
  return gulp
    .src("./src/static/**/*", { encoding: false, base: "./src/static" })
    .pipe(gulp.dest("./public/" + build + "/"));
});

// Sitemap
gulp.task("sitemap", function () {
  return gulp
    .src("public/**/*.html", {
      read: false,
    })
    .pipe(
      sitemap({
        siteUrl: "https://" + domain,
      }),
    )
    .pipe(
      minify_html({
        collapseWhitespace: true,
        removeComments: true,
      }),
    )
    .pipe(gulp.dest("./public/"));
});

// Main Task
gulp.task("default", gulp.series(["html", "css", "static", "sitemap"]));

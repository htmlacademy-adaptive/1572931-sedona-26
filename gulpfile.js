import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import csso from "postcss-csso";
import htmlmin from "gulp-htmlmin";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import rename from "gulp-rename";
import squoosh from "gulp-libsquoosh";
import svgo from "gulp-svgo";
import svgstore from "gulp-svgstore";
import { deleteAsync } from "del";

// Styles
export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// HTML
export const html = () => {
  return gulp
    .src("./source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./build"));
};

// Images
export const optimizeImages = () => {
  return gulp
    .src("./source/img/**/*.{jpg,png}")
    .pipe(squoosh())
    .pipe(gulp.dest("./build/img"));
};

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg}").pipe(gulp.dest("build/img"));
};

// WebP
export const createWebp = () => {
  return gulp
    .src("./source/img/**/*.{jpg,png}")
    .pipe(squoosh({ webp: {} }))
    .pipe(gulp.dest("./build/img"));
};

// SVG
export const svg = () => {
  return gulp
    .src(["./source/img/**/*.svg", "!./source/img/icons/sprite/*.svg"])
    .pipe(svgo())
    .pipe(gulp.dest("./build/img"));
};

// SVG sprite
export const svgSprite = () => {
  return gulp
    .src("./source/img/icons/sprite/*.svg")
    .pipe(svgo())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("./build/img/icons/sprite"));
};

// Copy
export const copy = () => {
  return gulp
    .src(
      [
        "./source/fonts/*.{woff2,woff}",
        "./source/*.ico",
        "./source/*.webmanifest",
      ],
      { base: "source" }
    )
    .pipe(gulp.dest("./build"));
};

// Clean
export const clean = () => {
  return deleteAsync("./build");
};

// Scripts
export const scripts = () => {
  return gulp
    .src("./source/js/*.js")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./build/js"));
};

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Reload
const reload = (done) => {
  browser.reload();
  done();
};

// Watcher
const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/script.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
};

// Build
export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(styles, html, scripts, svg, svgSprite, createWebp)
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(html, styles, scripts, svg, svgSprite, createWebp),
  gulp.series(server, watcher)
);

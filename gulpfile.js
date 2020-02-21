var destination = process.env.GULP_DESTINATION || 'static';

// Load plugins
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  livereload = require('gulp-livereload'),
  del = require('del'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  streamqueue = require('streamqueue');
  sass.compiler = require('node-sass');


// Styles
gulp.task('styles', function () {
  return gulp.src('themes/duffle/static/sass/styles.scss', {style: 'compressed'})
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination + '/css'))
    .pipe(gulp.dest('static/css/'))
    .pipe(notify({message: 'Styles compiled.'}));
});


// Images
gulp.task('images', function () {
  return streamqueue({objectMode: true},
    gulp.src('themes/duffle/static/img/**/*{.jpg, .png, .gif}')
      .pipe(notify({message: 'Images moved.'}))
      .pipe(gulp.dest(destination + '/img'))
  )
});


// Copy
gulp.task('copy', function () {
  return gulp.src('themes/duffle/static/fonts/*')
    .pipe(gulp.dest(destination + '/fonts'))
    .pipe(notify({message: 'Fonts moved.'}));
});
gulp.task('copyall', function () {
  return gulp.src('static/**/*')
    .pipe(gulp.dest('public'))
    .pipe(notify({message: 'Copied all.'}));
});


// Clean
gulp.task('clean', function () {
  return del([
    destination + '/**/*'
  ], {force: true});
});


// 'gulp' default task to build the site assets
gulp.task('default', gulp.series('styles', 'images', 'copy', 'copyall'), function () {});

// 'gulp watch' to watch for changes during dev
gulp.task('watch', function () {

  gulp.watch('themes/duffle/static/sass/**/*.scss', gulp.series('styles'));

  livereload.listen();

  gulp.watch([destination + '/**', destination + '/**']).on('change', livereload.changed);
});
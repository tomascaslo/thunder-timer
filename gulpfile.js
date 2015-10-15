var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('transpile', function() {
  return gulp.src('src/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(concat('thundertimer.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(['./index.js', 'src/**/*.js'], ['transpile']);
});

gulp.task('default', ['transpile', 'watch']);

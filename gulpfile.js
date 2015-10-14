var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('transpile', function() {
	return gulp.src('src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('all.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
	gulp.watch(['./index.js', 'src/*.js'], ['transpile']);
});

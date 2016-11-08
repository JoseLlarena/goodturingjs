const gulp = require('gulp'),
    linter = require('gulp-jshint'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'), 
    del = require('del'),
    streamqueue = require('streamqueue'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify');
	
const task = (name, _) => gulp.task(name, _), {src, dest} = gulp;

task('js', _ =>
{
	return  src(['good-turing.js'])
            .pipe(linter())
            .pipe(linter.reporter('default')) 
    	    .pipe(babel({presets: ['es2015']}))
            .pipe(uglify())
            .pipe(rename('good-turing.min.js'))
			.pipe(dest('.'));
});

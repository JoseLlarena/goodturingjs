const gulp = require('gulp'),
    task = (name, deps, fn) => gulp.task(name, deps, fn), {src: src, dest: dst} = gulp,
    linter = require('gulp-jshint'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    babel = require('babelify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');
	
task('lint', _ => src(['good-turing.js']).pipe(linter()).pipe(linter.reporter('default')));

task('compile', ['lint'],  _ =>
            browserify('./good-turing.js', {debug: true, standalone: 'good_turing'})
            .transform(babel, {presets: ['es2015']})
            .bundle()
            .pipe(source('good-turing.js'))
            .pipe(buffer())           
            .pipe(uglify())            
            .pipe(rename('good-turing.min.js')) 
			.pipe(dst('.')));

task('default', ['compile']);
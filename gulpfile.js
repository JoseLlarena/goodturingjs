const gulp = require('gulp'),
    task = (name, deps, fn) => gulp.task(name, deps, fn), {src: src, dest: dst, watch: watch} = gulp,
    linter = require('gulp-jshint'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    babel = require('babelify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    mocha = require('gulp-mocha'),
    jsdoc = require('gulp-jsdoc3');
	
task('lint', _ => src(['good-turing.js', 'good-turing-cli.js', 'test.js']).pipe(linter()).pipe(linter.reporter('default')));

task('compile', ['lint'],  _ =>
            browserify('./good-turing.js', {debug: true, standalone: 'good_turing'})
            .transform(babel, {presets: ['es2015']})
            .bundle()
            .pipe(source('good-turing.js'))
            .pipe(buffer())           
            .pipe(uglify())            
            .pipe(rename('good-turing.min.js')) 
			.pipe(dst('.')));

task('test', ['compile'],  _ => src(['test.js']).pipe(mocha({reporter: 'spec'})));

task('doc', ['test'], _ => src(['README.md', 'good-turing.js'], {read: false}).pipe(jsdoc(require('./jsdoc.json'))));

task('watch', _ =>  gulp.watch(['good-turing.js', 'good-turing-cli.js', 'test.js', 'README.md'], ['doc']));

task('default', ['watch']);

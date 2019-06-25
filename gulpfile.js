const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
// const minify = require('gulp-babel-minify');
const webpack = require('webpack-stream');
const rename = require('gulp-rename');

function lint() {
  return gulp.src(['src/**/*.js',
    '!node_modules/**',
    '!build/**',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function watch() {
  gulp.watch('src/**/*.js', ['lint']);
}

function runWebpack() {
  return gulp.src('src/**/*.js')
    .pipe(webpack())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(rename('player.js'))
    .pipe(gulp.dest('./'));
}

gulp.task('lint', lint);
gulp.task('watch', watch);
gulp.task('webpack', runWebpack);
gulp.task('default', ['lint', 'webpack']);

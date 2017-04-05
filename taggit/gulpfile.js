/**
 * Created by lixinwei on 17/3/28.
 */
"use strict";

var gulp = require('gulp');
var GulpSSH = require('gulp-ssh');
var del = require('del');

// push test server
var configGeli = {
    host: '172.17.254.124',
    port: 22,
    username: 'root',
    password: 'MTcyLjE2LjI0NS4xMTQK'
};

var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: configGeli
});

gulp.task('exec', function() {
    return gulpSSH
        .exec(['uptime', 'ls -a', 'pwd'], { filePath: 'commands.log' })
        .pipe(gulp.dest('logs'))
});

gulp.task('res-deploy', function() {
    var destFile = './dest/**/*';

    return gulp.src(destFile)
        .pipe(gulpSSH.dest('/home/upload/new-res/'))
});

gulp.task('copy', ['clean'], function() {
    var destFile = './dest/';
    var srcFile = [
        './index_prod.html',
        './favicon.png',
        './*dist/*'
    ];
    return gulp.src(srcFile)
        .pipe(gulp.dest(destFile));
});

gulp.task('clean', function(cb) {
    var destFile = './dest/**/*';
    return del(destFile, cb);
});

gulp.task('clean-dist', function(cb) {
    var destFile = './dist/**/*';
    return del(destFile, cb);
});
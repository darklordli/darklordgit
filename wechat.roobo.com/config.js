/**
 * @description: config.js
 * @author: lixinwei
 * @version: V1.0.2
 * @update: 16/4/12
 */

"use strict";

module.exports = function(){
    var config = {
        src: {
            html: [
                'ssc/*.html',
                'ssc/templates*/*.html'
            ],
            relhtml: [
                'rev/**/*.json',
                'ssc/*.html'
            ],
            less: [
                'ssc/less/*.less'
            ],
            allless: [
                'ssc/less/**/*.less'
            ],
            sass: [
                'ssc/sass/**/*.scss'
            ],
            css: [
                'ssc/css/**/*.css'
            ],
            js: [
                'ssc/js/**/*.js'
            ],
            img: [
                'ssc/img/**/*'
            ],
            fonts: [
                'ssc/fonts/**/*'
            ],
            data: [
                'ssc/data/**/*'
            ]

        },
        output: 'dist/',
        input: 'ssc/',
        root: ''

        
    };

    return config;
};
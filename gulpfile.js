var gulp = require('gulp'),
    //nodemon = require('gulp-nodemon'),
    gulpMocha = require('gulp-mocha'),
    env = require('gulp-env'),
    mainBowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    del = require('del'),
    supertest = require('supertest');


var paths = {
    temp: 'temp',
    tempVendor: 'temp/vendor',
    tempIndex: 'temp/index.html',

    index: 'app/index.html',
    appSrc: ['app/**/*', '!app/index.html'],
    bowerSrc: 'bower_components/**/*'
};

gulp.task('default', ['copyAll']);

gulp.task('copyAll', function () {
    var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tempVendor));

    var appFiles = gulp.src(paths.appSrc).pipe(gulp.dest(paths.temp));

    return gulp.src(paths.index)
        .pipe(gulp.dest(paths.temp))
        .pipe(inject(tempVendors, {
            relative: true,
            name: 'vendorInject'
        }))
        .pipe(inject(appFiles, {
            relative: true
        }))
        .pipe(gulp.dest(paths.temp));

});

gulp.task('clean', function () {
    del([paths.temp]);
});




//gulp.task('default', function(){
//    nodemon({
//        script: 'app.js',
//        ext: 'js',
//        env: {
//            PORT:8000
//        },
//        ignore: ['./node_modules/**']
//    })
//    .on('restart', function(){
//        console.log('Restarting');
//    });
//});

gulp.task('test', function(){
    env({vars: {ENV:'Test'}});
    gulp.src('tests/*.js', {read: false})
        .pipe(gulpMocha({reporter: 'nyan'}))
});
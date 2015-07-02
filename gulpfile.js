var gulp = require('gulp'),
    //nodemon = require('gulp-nodemon'),
    mocha = require('gulp-mocha'),
    env = require('gulp-env'),
    mainBowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    gutil = require('gulp-util'),
    del = require('del'),
    react = require('gulp-react'),
    zip = require('gulp-zip');


var paths = {
    temp: 'temp',
    tempVendor: 'temp/vendor',
    tempIndex: 'temp/index.html',

    index: 'app/index.html',
    appSrc: ['app/*.jsx'],
    styleSrc: 'app/*.css',
    bowerSrc: 'bower_components/**/*'
};

gulp.task('default', ['copyAll']);



gulp.task('react', function () {
    return gulp.src('app/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('app'));
});



gulp.task('copyAll', function () {


    var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tempVendor));

    var appFiles = gulp.src(paths.appSrc).pipe(react()).pipe(gulp.dest(paths.temp));

    var styleFiles = gulp.src(paths.styleSrc).pipe(gulp.dest(paths.temp));

    return gulp.src(paths.index)
        .pipe(gulp.dest(paths.temp))
        .pipe(inject(tempVendors, {
            relative: true,
            name: 'vendorInject'
        }))
        .pipe(inject(appFiles, {
            relative: true
        }))
        .pipe(inject(styleFiles, {
            relative: true
        }))
        .pipe(gulp.dest(paths.temp));

});

gulp.task('clean', function () {
    del([paths.temp]);
});


gulp.task('webjob', function() {

    var webjob = "feedFetcher.zip";

    del(webjob)

    return gulp.src(['parsers/*.js', 'package.json', 'feedFetcher.js'], {base: "."})
        .pipe(zip(webjob))
        .pipe(gulp.dest('.'));
});

gulp.task('test', function(){
    env({vars: {ENV:'Test'}});
    gulp.src('test/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
});

gulp.task('test', function() {
    env({vars: {ENV:'Test'}});
    return gulp.src(['test/*.js'], {read:false})
        .pipe(mocha({reporter: 'nyan'}))
        .on('error', gutil.log);
});

gulp.task('watch-test', function() {
    gulp.run('mocha');
    gulp.watch(['./**/*.js', 'test/**/*.js'], ['mocha']);
});

//gulp.task('default', ['watch-test']);
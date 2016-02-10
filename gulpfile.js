var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var annotate = require('gulp-ng-annotate');

var config = {
    client: {
        entryFile: './src/app.js',
        outputDir: './dist/client',
        outputFile: 'app.js'
    },
    server: {
        entryFile: '/angularonserver.es7.js',
        outputDir: './dist/server',
        outputFile: 'app.server.js'
    }
};

// clean the output directory
gulp.task('cleanClient', function(cb){
    rimraf(config.client.outputDir, cb);
});
gulp.task('cleanServer', function(cb){
    rimraf(config.server.outputDir, cb);
});


var bundlerClient;
function getBundlerClient() {
    if (!bundlerClient) {
        bundlerClient = watchify(browserify(config.client.entryFile, _.extend({ debug: true }, watchify.args)));
    }
    return bundlerClient;
};


var bundlerServer;
function getBundlerServer() {
    if (!bundlerServer) {
        bundlerServer = watchify(browserify(config.server.entryFile, _.extend({ debug: true }, watchify.args)));
    }
    return bundlerServer;
};


function bundleClient() {
    return getBundlerClient()
        .transform(babelify)
        .bundle()
        .on('error', function(err) { console.log('Error: ' + err.message); })
        .pipe(source(config.client.outputFile))
        .pipe(annotate())
        .pipe(gulp.dest(config.client.outputDir))
        .pipe(reload({ stream: true }));
}

function bundleServer() {
    return getBundlerServer()
        .transform(babelify)
        .bundle()
        .pipe(annotate())
        .on('error', function(err) { console.log('Error: ' + err.message); })
        .pipe(source(config.server.outputFile))
        .pipe(gulp.dest(config.server.outputDir));
}


gulp.task('build-persistent-client', ['cleanClient'], function() {
    return bundleClient();
});

gulp.task('build-client', ['build-persistent-client'], function() {
    process.exit(0);
});


gulp.task('build-server', ['cleanServer'], function() {
    return bundleServer();
});


gulp.task('watch-client', ['build-persistent-client'], function() {

    getBundlerClient().on('update', function() {
        gulp.start('build-persistent-client')
    });
});


gulp.task("server", function () {
    return gulp
        .src([
            'angularonserver.es7.js'
        ])
        .pipe(babel())
        .pipe(concat("app.server.js"))
        .pipe(gulp.dest("./"));
});
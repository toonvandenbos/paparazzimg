var gulp = require("gulp"),
    del = require("del"),
    help = require("gulp-task-listing"),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    jshint = require("gulp-jshint"),
    rename = require("gulp-rename"),
    merge = require("merge-stream");


/**
 *   Plumber error template
 */

var plumberOpts = {

    "errorHandler": notify.onError({
        "title": "Error",
        "message": "<%=error.message %>"
    })

};


/**
 *   Import configuration
 */

var config = require('./config.json');


/**
 *   Help task
 */

gulp.task('help', help);


/**
 *   Default task
 */

gulp.task("default", config.tasks.default);


/**
 *   Clean tasks
 */

gulp.task("clean", config.tasks.clean);

gulp.task("clean:js", function (next) {

    del(config.scripts.files.map(function (item) {

        return item.dist;

    }), next);

});


/**
 *   Build tasks
 */

gulp.task("build", config.tasks.build);

gulp.task("build:js", function () {
    return merge.apply(null, config.scripts.files.map(function (script) {
        return gulp
            .src(script.src)
            .pipe(plumber(plumberOpts))
            .pipe(concat(script.filename))
            .pipe(gulp.dest(script.dist))
            .pipe(rename(script.minfilename))
            .pipe(uglify(config.scripts.options.uglify))
            .pipe(gulp.dest(script.dist))
            .pipe(notify({
                "title": "Build Paparazzimg complete",
                "message": script.filename
            }));
    }));
});

/**
 *   Watch tasks
 */

gulp.task("watch", config.tasks.watch);

gulp.task("watch:js", function () {

    gulp.watch(config.scripts.watch, ["build:js"]);

});

/**
 *   Lint tasks
 */

gulp.task("lint:js", function () {
    return merge.apply(null, config.scripts.files.map(function (script) {
        return gulp
            .src(script.src)
            .pipe(jshint(config.scripts.options.jshint || {}))
            .pipe(plumber(plumberOpts));
    }));
});

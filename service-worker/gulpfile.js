"use strict";

// Load plugins
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const del = require("del");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cleancss = require('gulp-clean-css');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const touch = require('gulp-touch-fd');
const workboxBuild = require('workbox-build');


// directory variables

const distDir = 'dist/';
const devDir = 'dev/';

const jsSrc = `${devDir}js`;
const scssSrc = `${devDir}scss/service-worker-example.scss`;
const imgSrc = `${devDir}img`;
const fontsSrc = `${devDir}fonts`;
const swSrc = `${devDir}service-worker-scripts`;

const scriptOutputName = 'service-worker-example.js';

// this process uses google workbox to generate the required service-worker.js file into the root of the assets directory
// really needs to be done after the build has taken place
// so gulp build is a series in that order
// this uses the constructed file in src/js/service-worker/service-worker js to loop through the assets, and views
// directory and glob any files in the pattern
// it then injects a file manifest for the workbox service worker to be generated.




// simple task to copy over the service worker registration code
gulp.task('copyServiceWorkerDependencies', () => {
    return gulp.src([`${swSrc}/siteCacheValues.js`,`${swSrc}/registerServiceWorker.js`,`${swSrc}/workbox-sw.js`,`${swSrc}/workbox-window.js`])
        .pipe(gulp.dest(`${distDir}js`))
});

// simple task to copy over the service worker registration code
// have commneted this out for noe, but it's handy if moving from old appCache strategy to Service Worker - to bust the old app cache
// supply an empty manifest, and the service worker can take over

// gulp.task('copyAppCacheClear', () => {
//     return gulp.src(`${swSrc}/removeCache.appcache`)
//         .pipe(gulp.dest(`${distDir}appCache`))
// });


// this task does the hard lifting for the service worker generation
// the basis is to generate a manifest entry for the assets, but we also pass in the routes via manifestTransforms
// so that the app & the assets are all held in local storage
gulp.task('generate-service-worker', () => {
    return workboxBuild.injectManifest({
        swSrc: `${swSrc}/service-worker.js`,
        swDest: 'service-worker.js',
        globDirectory: distDir,
        globPatterns: [
            '**\/*.{eot,svg,ttf,woff,woff2,otf,png,jpg,jpeg,gif,html,css,js}',
        ],
        modifyURLPrefix : {'css/' : `${distDir}css/`, 'js/' : `${distDir}js/`, 'img/' : `${distDir}img/`}
    }).then(({count, size, warnings}) => {
        // Optionally, log any warnings and details.
        //warnings.forEach(console.warn);
        console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
});


// BrowserSync
function browserSync(done) {
    browsersync.init({
        injectChanges: true,
        server : {
            baseDir : "./"
        }

    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}


// clean up static asset folders before re-build
function clean() {
    return del([`${distDir}css/**`, `${distDir}js/**`, `${distDir}img/**`]);
}

function copyFonts () {

    return gulp.src(`${fontsSrc}/**/*`)
        .pipe(gulp.dest(`${distDir}fonts/`));
}

function createCss () {
    return gulp.src(scssSrc)
        .pipe(plumber({ errorHandler: function(err) {
                notify.onError({
                    title: "Gulp  CSS error in " + err.plugin,
                    message:  err.toString()
                })(err);
            }}))
        .pipe(sass())
        .pipe(browsersync.stream())
        .pipe(gulp.dest(`${distDir}/css`))
        .pipe(touch())
        .pipe(rename({suffix: '.min'}))
        .pipe(cleancss({level: {1: {specialComments: 0}}}))
        .pipe(gulp.dest(`${distDir}/css`))
        .pipe(touch())
        .pipe(notify({ message: 'createCSS complete' }))

}



function createImages() {
    // compress amy image assets so that we are nive and tidy for a prod release
    return gulp.src(`${imgSrc}/**/*.{gif,jpg,png,svg}`)
        .pipe(newer(`${distDir}/img`))
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest(`${distDir}/img`))
        .pipe(notify({ message: 'Image Compression complete' }));
}

function lintScripts () {
    return gulp.src([`${jsSrc}/custom-scripts/*.js`,`${jsSrc}/plugins/*.js`])
        .pipe(plumber({ errorHandler: function(err) {
                notify.onError({
                    title: "Gulp  Lint error in " + err.plugin,
                    message:  err.toString()
                })(err);
            }}))
        .pipe(jshint({esnext: true}))
        .pipe(jshint.reporter('default'))

}

function createScripts() {

    return gulp.src([`${jsSrc}/vendor/*.js`,`${jsSrc}/vendor/plugins/*.js`,`${jsSrc}/helper-functions/*.js`,`${jsSrc}/plugins/*.js`,`${jsSrc}/custom-scripts/*.js`])
        .pipe(plumber({ errorHandler: function(err) {
                notify.onError({
                    title: "Gulp  JS Compile error in " + err.plugin,
                    message:  err.toString()
                })(err);
            }}))
        .pipe(babel({
            presets: ['@babel/preset-env', {sourceType: "unambiguous" }]
        }))
        .pipe(concat(scriptOutputName))
        .pipe(gulp.dest(`${distDir}/js`))
        .pipe(touch())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${distDir}/js`))
        .pipe(touch())
        .pipe(notify({ message: 'createScripts task complete' }))
        .pipe(browsersync.stream());
}

function copyStandaloneScripts () {

    return gulp.src(`${jsSrc}//standalone/**/*.js`)
        .pipe(gulp.dest(`${distDir}/js`));
}



function watchFiles() {
    gulp.watch(`${devDir}scss/**/*`, createCss);
    gulp.watch(`${devDir}img/**/*`, createImages);
    gulp.watch(`${devDir}js/**/*`, gulp.series(lintScripts,createScripts, copyStandaloneScripts));
    gulp.watch(`${devDir}fonts/**/*`, copyFonts);


    gulp.watch( "*.html",gulp.parallel(browserSyncReload));

}


// Tasks
gulp.task("images", createImages);
gulp.task("css", createCss);
gulp.task("js", gulp.series(lintScripts,createScripts, copyStandaloneScripts));
gulp.task("clean", clean);

gulp.task('buildServiceWorker', gulp.series('copyServiceWorkerDependencies','generate-service-worker'));


gulp.task("build", gulp.series(clean, gulp.parallel(createCss, createImages, "js", copyFonts), "buildServiceWorker"));

gulp.task("run", gulp.parallel("build",browserSync, watchFiles));



import gulp from 'gulp';
import cleanCss from 'gulp-clean-css';
import gPluginsModu from 'gulp-load-plugins';
const gPlugins = gPluginsModu();
import path from 'path';
import jshSty from 'jshint-stylish';
import del from 'del';

// import browserify   from 'browserify';
// import vinylBuffer  from 'vinyl-buffer';
// import vinylSource  from 'vinyl-source-stream';
import watchify from 'watchify';
import browserSync from 'browser-sync';
const bsReload = browserSync.reload;

const nodeModule = './node_modules';

// path options
const opts = {
    tq: String.fromCharCode(9775),
    htmlIdxSrc: './asserts/index.html',
    htmlTmplsSrc: './asserts/templates/**/*.html',
    htmlTmplsDest: './pjdist/templates/',
    product: './pjdist/',
    imgSrc: './asserts/images/**/*',
    imgDist: './pjdist/images/',
    cssOg: './asserts/sass/',
    cssMin: './pjdist/mincss/',
    bsFontsSrc: `${nodeModule}/bootstrap-sass/assets/fonts/bootstrap/**/*`,
    bsFontDest: './pjdist/mincss/fonts/bootstrap/',
    npmJs: `${nodeModule}/`,
    app: './asserts/app/',
    bminApp: './pjdist/jsBuild/minapp/',
    bminlibs: './pjdist/jsBuild/minlibs/',
    pdJs: './pjdist/pdjs/'
};

// Clean Cache and old Images.
gulp.task('cleanCacheAndOldImages', () => {
    gPlugins.cache.clearAll();

    // var cleanSrc = [
    //     opts.imgMin+'**/*',
    //     opts.cssMin+'**/*',
    //     opts.jsMetaMid+'**/*.js'
    // ];
    let allPictures = `${opts.imgDist}**/*`;
    return gulp.src(allPictures, { read: false })
        .pipe(gPlugins.clean());
});

// Clean Cache and old css.
gulp.task('cleanCacheAndOldCss', () => {
    gPlugins.cache.clearAll();
    return gulp.src(`${opts.cssMin}**/*`, { read: false })
        .pipe(gPlugins.clean());
});

// clean and then move all static images
gulp.task('images', ['cleanCacheAndOldImages'], () => {
    let imgCollection = opts.imgSrc;
    console.log(`line 58 ${opts.tq} minify images... original path is ${opts.imgSrc}`);

    // return
    gulp.src(imgCollection)
        .pipe(gPlugins.changed(opts.imgSrc))
        .pipe(gPlugins.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(opts.imgDist))
        .pipe(gPlugins.size());
});

gulp.task('cpIdxHtml', () => {
    gulp.src(opts.htmlIdxSrc)
        .pipe(gPlugins.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(opts.product));
});

gulp.task('moveTmpls', () => {
    gulp.src(opts.htmlTmplsSrc)
        .pipe(gPlugins.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(opts.htmlTmplsDest));
});

gulp.task('cpBsFont', () => {
    gulp.src(opts.bsFontsSrc)
        .pipe(gulp.dest(opts.bsFontDest));
});

// modifies styles
gulp.task('styles', ['cleanCacheAndOldCss'], () => {
    let traitSrc = opts.cssOg + 'main.scss';
    console.log('88 -- original path is: ' + opts.cssOg);

    gulp.src(traitSrc)
        .pipe(gPlugins.sourcemaps.init({ largeFile: true }))
        .pipe(gPlugins.sass({
            errLogToConsole: true,
            // outputStyle: 'compact'
            outputStyle: 'compressed'
            // outputStyle: 'nested'
            // outputStyle: 'expanded'
        }))
        // .pipe(gPlugins.autoprefixer(pfxVer))
        .pipe(gPlugins.rename('app_min.css'))
        .pipe(cleanCss())
        .on('error', gPlugins.util.log.bind(
            gPlugins.util, '103 -- Browserify-Sass_Error'))
        .pipe(gPlugins.sourcemaps.write('.'))
        .pipe(gulp.dest(opts.cssMin))
        // only match to update .css file.
        .pipe(browserSync.stream({ match: "**/*.css" }))
        .pipe(bsReload({ stream: true }))
        .pipe(gPlugins.size());
});

const jq = opts.npmJs + 'jquery/dist/jquery.min.js';
const shim = opts.npmJs + 'core-js/client/shim.min.js';
const zonejs = opts.npmJs + 'zone.js/dist/zone.min.js';
const rxjs = opts.npmJs + 'rxjs/bundles/Rx.min.js';
const momentJs = opts.npmJs + 'moment/min/moment.min.js';
const bs3Js = opts.npmJs + 'bootstrap-sass/assets/javascripts/bootstrap.min.js';

const anguCore = opts.npmJs + '@angular/core/bundles/core.umd.min.js';
const anguCommon = opts.npmJs + '@angular/common/bundles/common.umd.min.js';
const anguCompiler = opts.npmJs + '@angular/compiler/bundles/compiler.umd.min.js';
const anguBrowser = opts.npmJs + '@angular/platform-browser/bundles/platform-browser.umd.min.js';
const anguBrowserDyanmic = opts.npmJs + '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js';
const anguRouter = opts.npmJs + '@angular/router/bundles/router.umd.min.js';
const anguForm = opts.npmJs + '@angular/forms/bundles/forms.umd.min.js';
const anguHttp = opts.npmJs + '@angular/http/bundles/http.umd.min.js';
const anguUpgrade = opts.npmJs + '@angular/upgrade/bundles/upgrade.umd.min.js';

// js lib collection
const basicJs = [jq, shim, zonejs, rxjs, momentJs, bs3Js];
const anguRelated = [anguCore, anguCommon, anguCompiler, anguBrowser, anguBrowserDyanmic, anguRouter, anguForm, anguHttp, anguUpgrade];

const libjsArr = basicJs.concat(anguRelated);

gulp.task('libjsCompile', () => {
    gulp.src(libjsArr)
        .pipe(gPlugins.concat('lib-compiled.js'))
        .pipe(gPlugins.uglify({ mangle: false }))
        .pipe(gulp.dest(opts.bminlibs));
    // .on('end', () => {
    //     bsReload();
    // })
    // .pipe(gPlugins.size());
});

// because angular4 requires file order.
// in angular4 component must be loaded before app.js && the smaller piece must be imported first.
const quoteService = opts.app + 'quote.service.js';
const randomQuoteComp = opts.app + 'random-quote.component.js';
const appComp = opts.app + 'app.component.js';

const appModule = opts.app + 'app.module.js';
const appSelf = opts.app + 'main.js';

const appjsArr = [quoteService, randomQuoteComp, appComp, appModule, appSelf];

gulp.task('appJsConcat', () => {
    gulp.src(appjsArr)
        .pipe(gPlugins.jshint())
        .pipe(gPlugins.jshint.reporter(jshSty))
        // .pipe(gPlugins.jshint.reporter('fail'))
        .pipe(gPlugins.sourcemaps.init({ largeFile: true }))
        .on('error', gPlugins.util.log.bind(
            gPlugins.util, '162 -- Browserify Error.'))
        .pipe(gPlugins.concat('app-compiled.js'))
        .pipe(gPlugins.sourcemaps.write('.'))
        .pipe(gulp.dest(opts.bminApp))
        .on('end', () => {
            bsReload();
        })
        .pipe(gPlugins.size());
});


const libJs = opts.bminlibs + 'lib-compiled.js';
const appJs = opts.bminApp + 'app-compiled.js';
const concatJsArr = [libJs, appJs];
// ['libjsCompile', 'appJsConcat'],

gulp.task('pdJsMin', () => {
    let miniJs = opts.pdJs;
    console.log(`180 -- minify pj js files ${opts.tq} -- concat compiled js files and uglify them.`);

    gulp.src(concatJsArr)
        .pipe(gPlugins.sourcemaps.init({ largeFile: true }))
        .pipe(gPlugins.concat('app.min.js'))
        // .pipe(gPlugins.uglify({mangle: false}))
        .pipe(gPlugins.sourcemaps.write('.', {
            lodaMaps: true
        }))
        .pipe(gulp.dest(miniJs))
        .on('end', () => {
            bsReload();
        })
        .pipe(gPlugins.size());
});


gulp.task('browser-sync', () => {
    // files: [opts.imgOg, opts.cssOg],
        browserSync.init({
            logPrefix: 'browserSyn_Says:',
            logFileChanges: true,
            port: 8000,
            // sample for multiple base server, donot use it.
            // server: [opts.imgOg, opts.cssOg, opts.jsDir]
            // server must be the folder contains index.html file
            server: {
                // __dirname = "./"
                baseDir: __dirname + '/pjdist'
            }
        });
});


// watches files
gulp.task('watch', ['browser-sync'], () => {
    let imgFiles = opts.imgSrc;
    let ogCss = `${opts.cssOg}**/*.scss`;

    gulp.watch(imgFiles, ['images']);

    gulp.watch(ogCss, ['styles']);

    gulp.watch(appjsArr, ['appJsConcat']);

    gulp.watch(concatJsArr, ['pdJsMin']);

    gulp.watch(opts.htmlIdxSrc).on('change', bsReload);

    gulp.watch(opts.htmlTmplsSrc).on('change', bsReload);

});

const styleFontTasks = ['images', 'styles', 'cpIdxHtml', 'moveTmpls', 'cpBsFont'];
const jsTasks = ['libjsCompile', 'appJsConcat'];
const allTasks = styleFontTasks.concat(jsTasks);

gulp.task('pjinit', allTasks);
gulp.task('prodjs', ['pdJsMin']);

gulp.task('default', ['watch']);
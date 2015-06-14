'use strict';
var COMPRESS = false;       // false = skip minification. Useful for debugging

// gulp control variables
var gulp = require('gulp');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var livereload = require('gulp-livereload');

// image optimizer & resize
var pngquant = require('imagemin-pngquant');
var optipng = require('imagemin-optipng');
var gifsicle = require('imagemin-gifsicle');
var jpegtran = require('imagemin-jpegtran');
var jpegoptim = require('imagemin-jpegoptim');
var imgResize = require('gulp-image-resize');

// code optimizers
var stripDebug = require('gulp-strip-debug');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var minifyJS = require('gulp-uglify');

// code linters & testing
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jasmine = require('gulp-jasmine');

// shell execution
var shell = require('gulp-shell')

// paths
var SRC = "./src";
var DEST = "./dist";
var paths = {
    js: [
         'js/**/*.js*'
        ,'../components/jquery/dist/jquery.js'
        ,'../components/knockout/dist/knockout.js'
        ,'../components/underscore/underscore.js'
        ,'../components/backbone/backbone.js'
        ,'../components/backbone.localStorage/backbone.localStorage.js'
        ,'../components/bootstrap/dist/js/bootstrap.js'
        ,'!_spec/*.js'
        ,'!db/**/*.js'
    ],
    css: [
         'css/*.css'
        ,'../components/bootstrap/dist/css/bootstrap.css'
        ,'../components/bootstrap/dist/css/bootstrap-theme.css '
        //,'...'
    ],
    html: [
         '**/*.html'
        ,'!_spec/*.html'
        ,'!db/**/*.html'
    ],
    img: [
        'assets/**/*.{jpg,jpeg,gif,png,svg}'
    ],
    db: [
         'db/*.js'
        ,'db/*.html'
    ],
    others: [
        '**/*.ico'
    ],
};

// Aux function. Append SRC prefix to paths specified above
function sourceDir(path_array) {
    return path_array.map(function(el) {
        var prefix = '';
        if (el[0]==='!') {      // preserve the ! ('not') operator in front of paths
            prefix = '!';
            el = el.split('!')[1];
        }
        return (prefix + SRC + "/" + el); });
}

//--------------------
// All Gulp tasks
//
gulp.task('default',
    [
    //'lint',
    'minify_js'
    ,'minify_html'
    ,'minify_css'
    ,'create_db'
    ,'compress_images'
    ,'test_jasmine'
    ,'others'
    ,'watch' //optional, if you want Gulp to keep monitoring your folders
    ],  function() {
    // nothing
});

gulp.task('lint', function() {
  return gulp.src( sourceDir(paths.js) )
    .pipe( jshint() )
    .pipe( jshint.reporter(stylish) )

});

gulp.task('minify_js', function() {
    return gulp.src( sourceDir(paths.js) )
    .pipe( changed( DEST ) )
    .pipe( gulpif( COMPRESS, minifyJS() ) )
    .pipe( gulpif( COMPRESS, stripDebug() ) )
    .pipe( gulp.dest( DEST + "/js" ) )
    .pipe(livereload());
});

gulp.task('minify_html', function() {
    return gulp.src( sourceDir(paths.html) )
    .pipe( changed(DEST) )
    .pipe( gulpif( COMPRESS, minifyHTML({
        conditionals: true,
        spare: true })))
    .pipe( gulp.dest( DEST ) )
    .pipe(livereload());
});

gulp.task('minify_css', function() {
    return gulp.src( sourceDir(paths.css) )
    .pipe( changed( DEST ) )
    .pipe( gulpif( COMPRESS, minifyCSS( { keepBreaks:true } ) ) )
    .pipe( gulp.dest( DEST + "/css" ) )
    .pipe(livereload());
});

gulp.task('create_db', function() {
    return gulp.src( sourceDir(paths.db) )
    .pipe(shell([ SRC + '/db/createdb.sh ' + DEST + '/db' ]))
    .pipe(livereload());
});

gulp.task('compress_images', function() {
    return gulp.src( sourceDir(paths.img) )
    .pipe( gifsicle( { interlaced: true } )() )
    .pipe( pngquant( { quality: '50-60', speed: 1 } )() )
    .pipe( optipng( { optimizationLevel: 3 } )() )
    .pipe( jpegoptim( {max: 70} )() )
    .pipe( jpegtran( { progressive: true, optimize: true } )() )
    .pipe( gulp.dest( DEST + "/assets" ) )
    .pipe(livereload());
});

gulp.task('others', function () {
    return gulp.src( sourceDir(paths.others) )
    .pipe( gulp.dest( DEST ) );
});

// -------


gulp.task('test_jasmine', function () {
    return gulp.src( SRC + '/spec/test.js' )
    .pipe( jasmine() );
});

gulp.task('watch', function() {
    //gulp.watch( SRC + '/**/*.js',   ['minify_js'] );
    //gulp.watch( SRC + '/**/*.html',    ['minify_html'] );
    //gulp.watch( SRC + '/**/*.css',  ['minify_css'] );
    //gulp.watch( SRC + '/**/assets/*',  ['compress_images'] );
    gulp.watch( sourceDir(paths.js),   ['minify_js'] );
    gulp.watch( sourceDir(paths.html), ['minify_html'] );
    gulp.watch( sourceDir(paths.css),  ['minify_css'] );
    gulp.watch( sourceDir(paths.img),  ['compress_images'] );
    gulp.watch( sourceDir(paths.db),   ['create_db'] );
 });


// Create small thumbnails for a specific image
// gulp.task('create_thumbnail', ['compress_images'], function() {
//     return gulp.src(SRC + '**/largeimage.jpg', {base: SRC})
//     .pipe(imgResize({ width : 100 }))
//     .pipe(jpegoptim({max: 70})())
//     .pipe(jpegtran({ progressive: true, optimize: true })())
//     .pipe(rename({ extname: '-thumb.jpg' }))
//     .pipe(gulp.dest(DEST));
// });


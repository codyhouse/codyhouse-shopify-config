var gulp = require('gulp');
var sass = require('gulp-sass');
sass.compiler = require('sass-embedded');
var sassGlob = require('gulp-sass-glob');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer'); 
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var purgecss = require('gulp-purgecss');

// js file paths
var utilJsPath = 'node_modules/codyhouse-framework/main/assets/js';
var componentsJsPath = 'js/components/*.js'; // component js files
var scriptsJsPath = 'assets'; //folder for final scripts.js/scripts.min.js files

// css file paths
var cssFolder = 'assets'; // folder for final style.css/style-custom-prop-fallbac.css files
var scssFilesPath = 'scss/**/*.scss'; // scss files to watch

gulp.task('sass', function() {
  return gulp.src(scssFilesPath)
  .pipe(sassGlob())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(rename('style.css.liquid'))
  .pipe(replace('"{{', '{{'))
  .pipe(replace('}}"', '}}'))
  .pipe(gulp.dest(cssFolder));
});

gulp.task('scripts', function() {
  return gulp.src([utilJsPath+'/util.js', componentsJsPath])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest(scriptsJsPath))
  .pipe(rename('scripts.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(scriptsJsPath));
});

gulp.task('watch', gulp.series(['sass', 'scripts'], function () {
  gulp.watch(scssFilesPath, gulp.series(['sass']));
  gulp.watch(componentsJsPath, gulp.series(['scripts']));
}));

/* Gulp purgeCSS task */
gulp.task('purgeCSS', function(){
  gulp.src(cssFolder+'/style.css.liquid')
  .pipe(purgecss({
    // 👇 include all shopify directories
    content: ['templates/*.liquid', 'layout/*.liquid', scriptsJsPath+'/scripts.min.js'],
    safelist: {
      standard: ['.is-hidden', '.is-visible'],
      deep: [/class$/],
      greedy: []
    },
    defaultExtractor: content => content.match(/[\w-/:%@]+(?<!:)/g) || []
  }))
  .pipe(gulp.dest(cssFolder));
});

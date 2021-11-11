const gulp = require('gulp');
//Adding sass compiler(require('sass')) for new version
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');

//Minified css
gulp.task('css', function (done) {
  console.log('minifying css...');
  gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())   //pipe is a function which is calling all submiddleware in gulp
    .pipe(gulp.dest('./assets.css'));

  gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
  done();
});

//Minified js
gulp.task('js', function (done) {
  console.log('minifying js...');
  gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
  done();
});

//Minified images
gulp.task('images', function (done) {
  console.log('compressing images...');
  gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
  done();
});

// //Whenever server will restart all old work done by gulp will be deleted and it will perform all the tasks and minification again
// gulp.task('clean:assets', function (done) {
//   del.sync('./public/assets');
//   done();
// });

// //Run all tasks one by one independently
// gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function (done) {
//   console.log('Building assets');
//   done();
// });
// minify dorm.js using closure compiler
var gulp = require('gulp')
var plumber = require('gulp-plumber')
var notify = require('gulp-notify')
var compiler = require('google-closure-compiler-js').gulp()
var options = {
  base: './',
  input: 'dorm.js',
  output: 'dorm.min.js',
  notification: {
    title: 'Dorm.js compilation',
    success: 'Minified successfully',
    error: '<%= error.message %>',
  },
}

gulp.task('compile', function () {
  return gulp.src(options.input, {base: options.base})
    .pipe(plumber({errorHandler: function (error) {
      notify.onError({
        title: options.notification.title,
        message: options.notification.error,
      })(error)
      this.emit('end')
    }}))
    .pipe(compiler({
      compilationLevel: 'SIMPLE',
      warningLevel: 'DEFAULT',
      jsOutputFile: options.output,
      createSourceMap: false,
    }))
    .pipe(gulp.dest(options.base))
    .pipe(notify({
      title: options.notification.title,
      message: options.notification.success,
    }))
})

gulp.task('watch', function () {
  gulp.watch('dorm.js', ['compile'])
})

gulp.task('default', ['compile', 'watch'])

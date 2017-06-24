var gulp 				= require('gulp'),
	gutil 				= require('gulp-util'),
	sass        	= require('gulp-sass'),
	cssmin      	= require('gulp-minify-css'),
	uglify 				= require('gulp-uglify'),
	imagemin 			= require('gulp-imagemin'),
	rename 				= require('gulp-rename'),
	concat 				= require('gulp-concat'),
	notify 				= require('gulp-notify'),
	cache 				= require('gulp-cache'),
	del 					= require('del'),
	plumber     	= require('gulp-plumber'),
	size       		= require('gulp-size'),
	processhtml 	= require('gulp-processhtml'),
	livereload 		= require('gulp-livereload'),
	ftp 					= require('vinyl-ftp');

var distFolder = 'dist/';

var onError = function(err) {
  notify.onError({
      title:    "Gulp",
      subtitle: "Failure!",
      message:  "Error: <%= error.message %>",
      sound:    "Beep"
  })(err);
  this.emit('end');
};

gulp.task('scss', function() {
  return gulp.src('sass/app.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass({
			style: 'expanded',
			sourceComments: 'normal'
		}))
    .pipe(rename('app.css'))
    .pipe(gulp.dest('css'))
    .pipe(livereload())
});

gulp.task('scss-build', function() {
  return gulp.src('sass/app.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(rename('app.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
});


gulp.task('scripts', function() {
  return gulp.src(['js/vendor/*.js', 'js/lib/*.js', 'js/modules/*.js', 'js/scripts.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('js'))
		.pipe(livereload())
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('scripts-build', function() {
  return gulp.src(['js/vendor/*.js', 'js/lib/*.js', 'js/modules/*.js', 'js/scripts.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(distFolder + 'js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
		.pipe(size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest(distFolder + 'js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('copyfonts', function() {
    return gulp.src('./fonts/**/*.{ttf,woff,eof,svg,otf}')
        .pipe(gulp.dest(distFolder + 'fonts'));
});
gulp.task('copyfonts2', function() {
    return gulp.src('./font/**/*.{ttf,woff,eof,svg,woff2}')
        .pipe(gulp.dest(distFolder + 'font'));
});

gulp.task('copyscripts', function() {
    return gulp.src('./js/polyfills/*.js')
        .pipe(gulp.dest(distFolder + 'js/polyfills'));
});

gulp.task('copy-partials', function() {
    return gulp.src('./act/*.php')
        .pipe(gulp.dest(distFolder + '/act'));
});
gulp.task('copy-css', function() {
    return gulp.src('./css/{font-awesome.min.css, materialize.css}')
        .pipe(gulp.dest(distFolder + '/css'));
});
gulp.task('copy-inc', function() {
    return gulp.src('./inc/*.php')
        .pipe(gulp.dest(distFolder + '/inc'));
});
gulp.task('copy-data', function() {
    return gulp.src('./data/*.php')
        .pipe(gulp.dest(distFolder + '/data'));
});
// gulp.task('copy-js', function() {
//     return gulp.src('./js/*.js')
//         .pipe(gulp.dest(distFolder + '/js'));
// });

gulp.task('html', function () {
    return gulp.src('./*.php')
        .pipe(processhtml({}))
        .pipe(gulp.dest(distFolder));
});

gulp.task('clean', function() {
    return del([distFolder + 'css', distFolder + 'js', distFolder + 'images']);
});

gulp.task('reload', function() {
	livereload.reload();
});

gulp.task('upload', function() {

	var conn = ftp.create( {
			host:     'ftp.anfessa.com',
			user:     '134769_drago',
			password: 'testing',
			parallel: 10,
			log: gutil.log
	} );

	var globs = [
		'dist/**'
	];

	// using base = '.' will transfer everything to /public_html correctly
	// turn off buffering in gulp.src for best performance

	return gulp.src( globs, { base: './dist/', buffer: false } )
			.pipe( conn.newer( '/' ) ) // only upload newer files
			.pipe( conn.dest( '/' ) );
});

gulp.task('watch', function() {
	livereload.listen();
  gulp.watch('sass/**/*.scss', ['scss']);
  gulp.watch(['js/vendor/*.js', 'js/polyfills/*.js', 'js/lib/*.js', 'js/modules/*.js', 'js/*.js'], ['scripts']);
  gulp.watch('images/*', ['images']);
	gulp.watch('*.php', ['reload']);
});

gulp.task('default', ['scss', 'scripts', 'copyfonts', 'copyfonts2', 'html', 'watch']);

gulp.task('build', ['clean'], function() {
    gulp.start('scss-build', 'scripts-build', 'copyscripts', 'images', 'copyfonts',  'copyfonts2', 'copy-partials', 'copy-inc', 'copy-data', 'html');
});

// Deploy via ftp
gulp.task('deploy', function() {
	gulp.start('upload');
});

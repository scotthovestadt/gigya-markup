const gulp = require('gulp');
const _gulp = require('load-plugins')('gulp-*', { strip: ['gulp'] });
const postcss = require('postcss');
const _postcss = require('load-plugins')('postcss-*', { strip: ['postcss'] });
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const stringify = require('stringify');
const _ = require('lodash');
const bindIf = require('./src/method/if.js');
const bindClick = require('./src/method/click.js');
const bindUi = require('./src/method/ui.js');
const transformTools = require('browserify-transform-tools');
const globby = require('globby');

/**
 * Paths used in build process.
 */
const paths = {};
paths.build = './dist/';
paths.out = 'gy.js';
paths.src = './src/';
paths.main = paths.src + 'main.js';
paths.css = paths.src + 'css/';
paths.cssGlob = paths.css + '*.css';

/**
 * Log error and beep.
 */
function onError(err) {
  _gulp.util.log(_gulp.util.colors.red(err.message));
  _gulp.util.beep();
  this.emit('end');
}

/**
 * Browserify transformer: Compile CSS into JS.
 */
function transformCss() {
  // Create custom selectors.
  // Example: @custom-select :--gy-click .gy-click-share, .gy-click-screen-set, ...
  let customSelectors = '';
  [bindIf.rules, bindClick.rules, bindUi.rules].forEach((rules) => {
    _.uniq(_.pluck(rules, 'element')).forEach((element) => {
      customSelectors += `@custom-selector :--${element}`;
      rules.forEach((rule) => {
        if(rule.element === element) {
          customSelectors += ` ${rule._selector()},`;
        }
      });
      customSelectors = customSelectors.substr(0, customSelectors.length - 1) + ';';
    });
  });

  return transformTools.makeStringTransform(
    'transformCss',
    { includeExtensions: ['.css'] },
    (content, transformOptions, done) => {
      // Append custom selectors to top of every CSS file.
      content = customSelectors + content;

      // Transform CSS4 to CSS3.
      content = postcss([
        // Replace custom selectors with CSS3 selectors.
        _postcss.customSelectors()
      ]).process(content).css;

      // Convert file to Javascript that is automatically inserted into the DOM.
      content = `
        const $ = require('jquery');
        const css = \`${content}\`;
        $('head').append('<style type="text/css">' + css + '</script>');
      `;

      done(null, content);
    }
  );
}

/**
 * Compile JS distributable.
 */
function compileScripts(watch, compress) {
  // Create browserify bundler.
  const bundler = browserify({
    // Entry points.
    entries: globby.sync([paths.main, paths.cssGlob]),

    // Enable errors.
    debug: true,

    transform: [
      // Transform CSS to ES6 JS.
      transformCss(),

      // Compile all ES6 to ES5.
      babelify.configure({ extensions: ['.js', '.css'] })
    ]
  });

  function rebundle() {
    // Bundle main files.
    // Return stream so gulp knows when we've finished.
    return bundler.bundle()
      // Log error and beep.
      .on('error', onError)

      // Output files to directory.
      .pipe(source(paths.out))

      // Convert from stream to vinyl file object.
      .pipe(buffer())

      // Generate source map.
      .pipe(_gulp.sourcemaps.init({ loadMaps: true }))
          // Transform functions here:

          // Log error and beep.
          .on('error', onError)

          // Uglify code, currently breaks source map with no workaround.
          .pipe(_gulp.if(compress, _gulp.uglify()))

      // Write source map file.
      .pipe(_gulp.sourcemaps.write('./'))

      // Output to build dir.
      .pipe(gulp.dest(paths.build));
  }

  // If watch enabled, build on update.
  if(watch) {
    // Emits update when files are changed.
    watchify(bundler)
      .on('update', () => rebundle())
      .on('log', (message) => _gulp.util.log(_gulp.util.colors.green(message)));
  }

  // Build.
  return rebundle();
}

gulp.task('build', () => compileScripts(false, false));
gulp.task('watch', () => compileScripts(true, false));
gulp.task('build-prod', () => compileScripts(false, true));
gulp.task('watch-prod', () => compileScripts(true, true));
gulp.task('default', ['watch']);
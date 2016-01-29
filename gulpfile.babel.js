import gulp from 'gulp';
import loadPlugins from 'load-plugins';
import postcss from 'postcss';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import stringify from 'stringify';
import transformTools from 'browserify-transform-tools';
import globby from 'globby';
import _ from 'lodash';
const _gulp = loadPlugins('gulp-*', { strip: ['gulp'] });
const _postcss = loadPlugins('postcss-*', { strip: ['postcss'] });

/**
 * Paths used in build process.
 */
const paths = {};
paths.build = `${__dirname}/dist/`;
paths.out = 'gy.js';
paths.src = `${__dirname}/src/`;
paths.main = `${paths.src}main.js`;
paths.css = `${paths.src}css/`;
paths.cssGlob = `${paths.css}*.css`;

/**
 * Log error and beep.
 *
 * @param {Error} err
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
  // The include paths are relative, which makes this difficult.
  require('app-module-path').addPath(paths.src);
  const bindIf = require('./src/method/if.js');
  const bindClick = require('./src/method/click.js');
  const bindUi = require('./src/method/ui.js');

  // Create custom selectors.
  // Example: @custom-select :--gy-click .gy-click-share, .gy-click-screen-set, ...
  let customSelectors = '';
  [bindIf.rules, bindClick.rules, bindUi.rules].forEach((rules) => {
    _.uniq(_.map(rules, 'element')).forEach((element) => {
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
 *
 * @param {Boolean} watch - If true, compile and watch for further changes.
 * @param {Boolean} compress - If true, compress JavaScript.
 */
function compileScripts(watch, compress) {
  // Create browserify bundler.
  const bundler = browserify({
    // Entry points.
    entries: globby.sync([paths.main, paths.cssGlob]),

    // Array of paths, equivalent of setting NODE_PATH environmental variable.
    paths: [paths.src],

    // Enable errors.
    debug: true,

    transform: [
      // Transform CSS to ES6 JS.
      transformCss(),

      // Compile all ES6 to ES5.
      babelify.configure({
        extensions: ['.js', '.css']
      })
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
'use strict';
const {task, series, src, dest} = require('gulp');
const del = require('del');
const {rollup} = require('rollup');
const babel = require('rollup-plugin-babel');
const {readFileSync, writeFileSync, mkdirSync, unlinkSync} = require('fs');
let cache;

task('clean', cb => {
  del.sync(['.tmp', 'bin']);
  cb();
});

task('rollup', () => {
  return rollup({
     entry: 'src/index.js',
     // Use the previous bundle as starting point.
     cache: cache
   }).then(bundle => {
      var result = bundle.generate({
        // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
        format: 'iife',
				moduleName: 'injectTemplateCli',
        plugins: [babel()]
      });
     // Cache our bundle for later use (optional)
     cache = bundle;
     mkdirSync('.tmp');
     writeFileSync('.tmp/index.js', result.code);
   });
});

task('inject', cb => {
  let string = readFileSync('.tmp/index.js').toString();
  string = string.replace('(function', `#!/usr/bin/env node
(function`);
  unlinkSync('.tmp/index.js');
  writeFileSync('.tmp/index.js', string);
  return cb();
});

task('copy', () => {
  return src('.tmp/*').pipe(dest('bin'));
});

task('build', series('clean', 'rollup', 'inject', 'copy'))

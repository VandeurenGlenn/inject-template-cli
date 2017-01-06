#!/usr/bin/env node
(function () {
'use strict';

// @bin
process.title = 'inject';
const commander = require('commander');
const {injectSync} = require('inject-template');
const {writeFileSync} = require('fs');
let file;

commander
.version('0.0.0')
.option('-p, --path <arg>',
  'The path for the file containing the @template tag')
.option('-d, --destination <arg>', 'Destination to write')
.option('-l, --log', 'Log the result')
.parse(process.argv);

let path = commander.path;
let destination = commander.destination;
let log = commander.log;

if (path) {
  file = injectSync({path: path});
}
if (destination) {
  writeFileSync(destination, file);
} else if (destination === null || destination === undefined ||
          destination === false && log === false) {
  console.log(file);
}
if (log) {
  console.log(file);
}

}());

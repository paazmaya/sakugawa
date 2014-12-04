#!/usr/bin/env node
/* @flow */
/**
 * Sakugawa
 * https://github.com/paazmaya/sakugawa
 *
 * Copyright (c) Juga Paazmaya
 * Licensed under the MIT license.
 */

'use strict';

// Usually first variables defined are the ones requiring native Node.js modules
var fs = require('fs'),
  path = require('path'),
  util = require('util');

// It might be good for organisation, to have another variable set for other modules
var Bossy = require('bossy'),
  sakugawa = require('../lib');

// Default command line options
var cmdOptions = {
  h: {
    description: 'Show help',
    alias: 'help',
    type: 'boolean'
  },
  V: {
    description: 'Show version information',
    alias: 'version',
    type: 'boolean'
  },
  n: {
    description: 'Maximum number of CSS selectors per output file',
    alias: 'max-selectors',
    type: 'number',
    default: 4090
  },
  s: {
    description: 'Output CSS file suffix',
    alias: 'suffix',
    type: 'number',
    default: '_'
  },
  m: {
    description: 'Media query handling, separation to different file (separate) or ignorance (ignore). By default included',
    alias: 'media-queries',
    type: 'string',
    valid: ['separate', 'ignore']
  }
};

// Initialise and parse command line arguments against the default options
var args = Bossy.parse(cmdOptions);

// In case parsing failed, stop execution with an error
if (args instanceof Error) {
  util.error(args.message);
  return;
}

// In case help or version information is specifically requested, only that should be outputted
if (args.h) {
  util.puts(Bossy.usage(cmdOptions, 'sakugawa [options] huge-stylesheet.css [more CSS files]'));
  return;
}
if (args.V) {
  var json = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8');
  var pkg = JSON.parse(json);
  util.puts('v' + pkg.version);
  return;
}

// files, an array or string
if (args._) {
  var files = args._;
  if (typeof files === 'string') {
    files = [files];
  }
  files = files.filter(function filterFiles(file) {
    return fs.existsSync(file);
  });

  var opts = {
    maxSelectors: args.n,
    mediaQueries: args.m
  };

  files.forEach(function eachFiles(file) {
    util.puts('Reading ' + file);
    var styles = fs.readFileSync(file, 'utf8');
    var pages = sakugawa(styles, opts);
    pages.forEach(function eachPages(page, index) {
      // page is a CSS string
      var pageFile = file.replace(/\.css$/, args.s + (index + 1) + '.css');
      util.puts('Writing ' + pageFile);
      fs.writeFileSync(pageFile, page, 'utf8');
    });
  });
}
else {
  util.error('No files defined');
}

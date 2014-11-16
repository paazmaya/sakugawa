#!/usr/bin/env node

/**
 * Sakugawa
 * https://github.com/paazmaya/sakugawa
 *
 * Copyright (c) Juga Paazmaya
 * Licensed under the MIT license.
 */

'use strict';

var Bossy = require('bossy'),
  sakugawa = require('../lib'),
  fs = require('fs'),
  path = require('path'),
  util = require('util');

var options = {
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

var args = Bossy.parse(options);

if (args instanceof Error) {
  util.error(args.message);
  return;
}

if (args.h) {
  util.puts(Bossy.usage(options, 'sakugawa [options] huge-stylesheet.css [more CSS files]'));
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
  files = files.filter(function (file) {
    return fs.existsSync(file);
  });
  util.log(util.inspect(files));
  
  var opts = {
    maxSelectors: args.n,
    mediaQueries: args.m
  };
  
  sakugawa(files, opts);
}
else {
  util.error('No files defined');
}

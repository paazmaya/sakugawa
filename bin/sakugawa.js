#!/usr/bin/env node
/* @flow */
/**
 * Sakugawa
 * https://github.com/paazmaya/sakugawa
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license.
 */


// Usually first variables defined are the ones requiring native Node.js modules
const fs = require('fs'),
  path = require('path');

// It might be good for organisation, to have another variable set for local modules
const Bossy = require('bossy');

// Local files
const sakugawa = require('../index');

// Default command line options
const cmdOptions = {
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
  i: {
    description: 'Maximum number of @import rules per output file',
    alias: 'max-imports',
    type: 'number',
    default: 4
  },
  s: {
    description: 'Output CSS file suffix',
    alias: 'suffix',
    type: 'string',
    default: '_'
  },
  M: {
    description: 'Minimum number of output CSS files',
    alias: 'minimum-files',
    type: 'number',
    default: 1
  },
  m: {
    description: 'Media query handling, separation to different file (separate) or ignorance (ignore). By default included (normal)',
    alias: 'media-queries',
    type: 'string',
    valid: ['separate', 'ignore', 'normal']
  }
};

// Initialise and parse command line arguments against the default options
const args = Bossy.parse(cmdOptions);

// In case parsing failed, stop execution with an error
if (args instanceof Error) {
  console.error(args.message);

  return;
}

if (args.V) {
  const json = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8');
  try {
    const pkg = JSON.parse(json);
    console.log(pkg.version);
  }
  catch (error) {
    console.error('Could not parse "package.json", very strange...');
  }

  return;
}

// In case help or version information is specifically requested, only that should be outputted
if (args.h || !args._) {
  console.log(Bossy.usage(cmdOptions, 'sakugawa [options] huge-stylesheet.css [more CSS files]'));

  return;
}

// files, an array or string
if (args._) {
  let files = args._;
  if (typeof files === 'string') {
    files = [files];
  }
  files = files.filter((file) => {
    return fs.existsSync(file);
  });

  const opts = {
    maxSelectors: args.n,
    minSheets: args.M,
    mediaQueries: args.m
  };

  files.forEach((file) => {
    console.log('Reading ' + file);
    const styles = fs.readFileSync(file, 'utf8');
    const pages = sakugawa(styles, opts);
    pages.forEach(function eachPages(page, index) {
      // page is a CSS string
      const pageFile = file.replace(/\.css$/u, args.s + (index + 1) + '.css');
      console.log('Writing ' + pageFile);
      fs.writeFileSync(pageFile, page, 'utf8');
    });
  });
}

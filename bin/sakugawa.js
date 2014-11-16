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
  sakugawa = require('../lib');

var options = {
  h: {
    description: 'Show help',
    alias: 'help',
    type: 'boolean'
  },
  n: {
    description: 'Show your name',
    alias: 'name'
  }
};

var args = Bossy.parse(options);


if (args instanceof Error) {
  console.error(args.message);
  return;
}

if (args.h || !args.n) {
  console.log(Bossy.usage(options, 'hello -n <name>'));
  return;
}

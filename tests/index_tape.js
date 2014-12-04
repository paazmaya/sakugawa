/* @flow weak */
/**
 * Sakugawa
 * https://github.com/paazmaya/sakugawa
 *
 * Copyright (c) Juga Paazmaya
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var tape = require('tape');
var sakugawa = require('../lib/index');

var pure = fs.readFileSync(__dirname + '/fixtures/pure.css', 'utf8');
var expected1 = fs.readFileSync(__dirname + '/expected/pure_1.css', 'utf8');
var expected2 = fs.readFileSync(__dirname + '/expected/pure_2.css', 'utf8');

tape('dummy test', function (test) {
    test.plan(2);

    test.equal(typeof sakugawa, 'function');

    var styles = 'body { color: rebeccapurple; }';
    test.equal(sakugawa(styles), [styles]);
});


tape('pure test', function (test) {
    test.plan(1);

    var pages = sakugawa(pure);
    test.equal(pages, [expected1, expected2]);
});
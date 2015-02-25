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

// This CSS file has 5 selectors
var twenty = fs.readFileSync(__dirname + '/fixtures/twenty.css', 'utf8');


var saveResults = function (results, prefix) {
	for (var i = 0; i < results.length; ++i) {
		var stuff = results[i];
		//fs.writeFileSync(__dirname + '/expected/' + prefix + '_' + (i + 1) + '.css', stuff, 'utf8');
	}
};



tape('dummy test', function (test) {
  test.plan(2);

  test.equal(typeof sakugawa, 'function');

  var styles = 'body {\n  color: rebeccapurple;\n}';
  test.deepEqual(sakugawa(styles), [styles]);
});

/*
tape('pure test', function (test) {
  test.plan(1);

	var pure = fs.readFileSync(__dirname + '/fixtures/pure.css', 'utf8');
	var expected1 = fs.readFileSync(__dirname + '/expected/pure_1.css', 'utf8');
	var expected2 = fs.readFileSync(__dirname + '/expected/pure_2.css', 'utf8');
  var pages = sakugawa(pure);
  test.equal(pages, [expected1, expected2]);
});
*/

tape('max selectors lower than total', function (test) {
  test.plan(2);

  var name = 'max-selectors-lower';
	var options = {
		maxSelectors: 16
	};
	var result = sakugawa(twenty, options);
	saveResults(result, name);
  test.equal(result.length, 2);

	var expected1 = fs.readFileSync(__dirname + '/expected/' + name + '_1.css', 'utf8');
	test.equal(result[0], expected1);
});


tape('max selectors higher than total', function (test) {
  test.plan(1);

  var name = 'max-selectors-higher';
	var options = {
		maxSelectors: 24
	};
	var result = sakugawa(twenty, options);
	saveResults(result, name);
  test.equal(result.length, 1);

});

tape('max selectors same as total', function (test) {
  test.plan(1);

  var name = 'max-selectors-same';
	var options = {
		maxSelectors: 20
	};
	var result = sakugawa(twenty, options);
	saveResults(result, name);
  test.equal(result.length, 1);

});

tape('media queries separated', function (test) {
  test.plan(1);

  var name = 'media-queries-separated';
	var options = {
		maxSelectors: 50,
		mediaQueries: 'separate'
	};
	var result = sakugawa(twenty, options);
	saveResults(result, name);
  test.equal(result.length, 2);

});

tape('media queries ignored', function (test) {
  test.plan(1);

  var name = 'media-queries-ignored';
	var options = {
		maxSelectors: 18,
		mediaQueries: 'ignore'
	};
	var result = sakugawa(twenty, options);
	saveResults(result, name);
  test.equal(result.length, 1);

});
/*
tape('filename option gets used', function (test) {
  test.plan(1);

	var options = {
		filename: 'very-secret.css'
	};

});
*/

tape('two empty files due to minimum number of sheets being high', function (test) {
  test.plan(1);

  var name = 'min-sheets-higher';
	var options = {
		maxSelectors: 12,
		minSheets: 4
	};
	var result = sakugawa(twenty, options);
	saveResults(result, name);
  test.equal(result.length, 4);
});

tape('minSheets irrelevant when lower than resulting number', function (test) {
  test.plan(1);

  var name = 'min-sheets-lower';
	var options = {
		maxSelectors: 7,
		minSheets: 2
	};
	var result = sakugawa(twenty, options);
	saveResults(result, name);
  test.equal(result.length, 3);

});

tape('minSheets irrelevant when same as resulting number', function (test) {
  test.plan(1);

  var name = 'min-sheets-same';
	var options = {
		maxSelectors: 5,
		minSheets: 4
	};
	var result = sakugawa(twenty, options);
	saveResults(result, name);
  test.equal(result.length, 4);

});

/* @flow weak */
/**
 * Sakugawa
 * https://github.com/paazmaya/sakugawa
 *
 * Copyright (c) Juga Paazmaya
 * Licensed under the MIT license.
 */

'use strict';

var profiler = require('v8-profiler');
var heapdump = require('heapdump');

var time = function(){
  return (new Date()).getTime();
};
var fs = require('fs');
var memwatch = require('memwatch');

memwatch.on('leak', function(info) {
  //console.dir(info);
  fs.writeFileSync('memwatch.leak' + (time()) + '.json', JSON.stringify(info, null, '  '), 'utf8');
});
memwatch.on('stats', function(stats) {
  //console.dir(stats);
  fs.writeFileSync('memwatch.stats' + (time()) + '.json', JSON.stringify(stats, null, '  '), 'utf8');
});

var css = require('css');

function Sakugawa(styles, options) {
  if (typeof styles !== 'string') {
    throw new Error('styles must be a string');
  }

  if (styles.length < 1) {
    throw new Error('styles must not be empty');
  }
  var hd = new memwatch.HeapDiff();

  profiler.startProfiling('css.parse');

  console.time('css.parse');
  this.ast = css.parse(styles);
  console.timeEnd('css.parse');

  heapdump.writeSnapshot();

  var cpuProfile = profiler.stopProfiling('css.parse');
  //console.dir(cpuProfile);
  fs.writeFileSync(time() + '.cpuprofile', JSON.stringify(cpuProfile, null, '  '), 'utf8');

  var diff = hd.end();
  fs.writeFileSync('memwatch.HeapDiff' + time() + '.json', JSON.stringify(diff, null, '  '), 'utf8');

  if (typeof this.ast !== 'object' || typeof this.ast.stylesheet !== 'object' || typeof this.ast.stylesheet.rules !== 'object') {
    throw new Error('Could not parse styles');
  }

  options = options || {};
  this.maxSelectors = options.maxSelectors || 4090;
  this.mediaQueries = options.mediaQueries || 'normal';
}

Sakugawa.prototype._clone = function clone(ast) {

  console.time('_clone');
  // Store temporarily elsewhere to speed up JSON conversion
  var origRules = ast.stylesheet.rules;
  ast.stylesheet.rules = [];
  var clone = JSON.parse(JSON.stringify(ast));
  ast.stylesheet.rules = origRules;

  console.timeEnd('_clone');

  clone.stylesheet.rules = [];
  return clone;
};

Sakugawa.prototype._countSelectors = function countSelectors(rule, includeMedia) {
  var total = 0,
    _self = this;

  if (rule.type == 'rule' && typeof rule.selectors === 'object') {
    total += rule.selectors.length;
  }
  else if (includeMedia && rule.type == 'media' && rule.rules) {
    rule.rules.forEach(function eachMediaRule(media) {
      total += _self._countSelectors(media, true); // even while media should not contain media...
    });
  }

  return total;
};

Sakugawa.prototype._generatePages = function generatePages(rules, ast) {
  var pages = [],
    _self = this,
    clone,
    selectorsForThisPage = 0;

  console.time('_generatePages');
  rules.forEach(function eachRule(rule) {
    var selectorCount = _self._countSelectors(rule, true);

    if (clone && selectorsForThisPage + selectorCount <= _self.maxSelectors) {
      selectorsForThisPage += selectorCount;
      clone.stylesheet.rules.push(rule);
    }
    else {
      // Restart
      selectorsForThisPage = selectorCount;
      clone = _self._clone(ast);
      clone.stylesheet.rules.push(rule);
      pages.push(clone);
    }
  });

  console.timeEnd('_generatePages');
  return pages;
};

Sakugawa.prototype.createPages = function createPages() {
  var pages = [],
    rules = this.ast.stylesheet.rules;

  console.time('createPages');
  // Remove media queries from the first iteration when not needed there
  if (this.mediaQueries !== 'normal') {
    rules = rules.filter(function filterNonMediaRules(rule) {
      return rule.type !== 'media';
    });
  }

  pages = this._generatePages(rules, this.ast);

  // Separate media queries
  if (this.mediaQueries === 'separate') {
    var mediaRules = this.ast.stylesheet.rules.filter(function filterMediaRules(rule) {
      return rule.type === 'media';
    });

    pages = pages.concat(this._generatePages(mediaRules, this.ast));
  }

  console.timeEnd('createPages');
  return pages;
};

Sakugawa.prototype.getPages = function getPages() {
  var pages = this.createPages();
  return pages.map(function mapPages(page) {

    console.time('css.stringify');
    var str = css.stringify(page);
    console.timeEnd('css.stringify');

    return str;
  });
};

module.exports = function exports(styles, options) {
  var s = new Sakugawa(styles, options);
  return s.getPages();
};

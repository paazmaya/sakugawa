/* @flow weak */
/**
 * Sakugawa
 * https://github.com/paazmaya/sakugawa
 *
 * Copyright (c) Juga Paazmaya
 * Licensed under the MIT license.
 */

'use strict';

var css = require('css');
// var postcss = require('postcss');

var Sakugawa = function Sakugawa(styles, options) {
  if (typeof styles !== 'string') {
    throw new Error('styles must be a string');
  }

  if (styles.length < 1) {
    throw new Error('styles must not be empty');
  }

  options = options || {};
  this.maxSelectors = options.maxSelectors || 4090;
  this.maxImports = options.maxImports || 4;
  this.mediaQueries = options.mediaQueries || 'normal';
  this.filename = options.filename || 'input.css';
  this.minSheets = options.minSheets || 1;

  this.ast = css.parse(styles);
};

Sakugawa.prototype._clone = function createClone(ast) {

  // Store temporarily elsewhere to speed up JSON conversion
  var origRules = ast.stylesheet.rules;
  ast.stylesheet.rules = [];
  var clone = JSON.parse(JSON.stringify(ast));
  ast.stylesheet.rules = origRules;

  clone.stylesheet.rules = [];

  // Handle charset copying, if such exists
  var charsetRules = origRules.filter(function filterCharsetRules(rule) {
    return rule.type === 'charset';
  });
  if (charsetRules.length > 0) {
    clone.stylesheet.rules = charsetRules;
  }
  return clone;
};

Sakugawa.prototype._countSelectors = function countSelectors(rule, includeMedia) {
  var total = 0,
    _self = this;

  if (rule.type === 'rule' && typeof rule.selectors === 'object') {
    total += rule.selectors.length;
  }
  else if (includeMedia && rule.type === 'media' && rule.rules) {
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

  // Remove charset rules since they are added when clone is created
  rules = rules.filter(function filterNonCharsetRules(rule) {
    return rule.type !== 'charset';
  });

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

  return pages;
};

Sakugawa.prototype.createPages = function createPages() {
  var pages = [],
    rules = this.ast.stylesheet.rules;

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

  return pages;
};

Sakugawa.prototype.getPages = function getPages() {
  var pages = this.createPages();
  var sheets = pages.map(function mapPages(page) {
    var str = css.stringify(page);
    return str;
  });
  while (sheets.length < this.minSheets) {
    sheets.push('');
  }
  return sheets;
};

module.exports = function exports(styles, options) {
  var s = new Sakugawa(styles, options);
  return s.getPages();
};

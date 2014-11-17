/**
 * Sakugawa
 * https://github.com/paazmaya/sakugawa
 *
 * Copyright (c) Juga Paazmaya
 * Licensed under the MIT license.
 */

'use strict';

var css = require('css');

function Sakugawa(styles, options) {
  if (typeof styles !== 'string') {
    throw new Error('styles must be a string');
  }

  if (styles.length < 1) {
    throw new Error('styles must not be empty');
  }

  this.ast = css.parse(styles);

  if (typeof this.ast !== 'object' || typeof this.ast.stylesheet !== 'object' || typeof this.ast.stylesheet.rules !== 'object') {
    throw new Error('Could not parse styles');
  }

  this.maxSelectors = options.maxSelectors || 4090;
  this.mediaQueries = options.mediaQueries || 'normal';
}


Sakugawa.prototype._clone = function (ast) {
  var clone = JSON.parse(JSON.stringify(ast));
  clone.stylesheet.rules = [];
  return clone;
};

Sakugawa.prototype._countSelectors = function (rule, includeMedia) {
  var total = 0,
    _self = this;

  if (rule.type == 'rule' && typeof rule.selectors === 'object') {
    total += rule.selectors.length;
  }
  else if (rule.type == 'media' && rule.rules && includeMedia) {
    rule.rules.forEach(function (media) {
      total += _self._countSelectors(media, true); // even while media should not contain media...
    });
  }

  return total;
};

Sakugawa.prototype._generatePages = function (rules, ast) {
  var pages = [],
    _self = this,
    clone,
    selectorsForThisPage = 0;

  rules.forEach(function (rule) {
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

Sakugawa.prototype._toPages = function () {
  var pages = [],
    rules = this.ast.stylesheet.rules;

  // Remove media queries from the first iteration when not needed there
  if (this.mediaQueries !== 'normal') {
    rules = rules.filter(function (rule) {
      return rule.type !== 'media';
    });
  }

  pages = this._generatePages(rules, this.ast);

  // Separate media queries
  if (this.mediaQueries === 'separate') {
    var mediaRules = ast.stylesheet.rules.filter(function (rule) {
      return rule.type === 'media';
    });

    pages = pages.concat(this._generatePages(mediaRules, this.ast));
  }

  return pages;
};

Sakugawa.prototype.getPages = function () {
  var pages = this._toPages();
  return pages.map(function (page) {
    return css.stringify(page);
  });
};

module.exports = function (styles, options) {
  var s = new Sakugawa(styles, options);
  return s.getPages();
};

/**
 * Sakugawa
 * https://github.com/paazmaya/sakugawa
 *
 * Copyright (c) Juga Paazmaya
 * Licensed under the MIT license.
 */

'use strict';

var css = require('css');

function Sakugawa(files, options) {
  this.files = files;
  this.maxSelectors = options.maxSelectors;
  this.mediaQueries = options.mediaQueries;
}

// public
Sakugawa.prototype.split = function (cssString) {

    var ast = this._parseCSS(cssString);

    return this._splitCSS(ast);
};

Sakugawa.prototype._parseCSS = function (cssString) {
    if(typeof cssString !== 'string') {
        throw new Error('cssString must be a string');
    }

    if(cssString.length < 1) {
        throw new Error('cssString must not be empty');
    }

    return css.parse(cssString);
};


Sakugawa.prototype._splitCSS = function (ast) {
    var pages = this._toPages(ast);
    return pages.map(function (page) {
        return css.stringify(page);
    });
};

Sakugawa.prototype._initClone = function (ast) {
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
            clone = _self._initClone(ast);
            clone.stylesheet.rules.push(rule);
            pages.push(clone);
        }
    });

    return pages;
};

Sakugawa.prototype._toPages = function (ast) {
    if (typeof ast !== 'object' || typeof ast.stylesheet !== 'object' || typeof ast.stylesheet.rules !== 'object') {
        return false;
    }

    var pages = [],
      rules = ast.stylesheet.rules;

    // Remove media queries from the first iteration when not needed there
    if (this.mediaQueries !== 'normal') {
        rules = rules.filter(function (rule) {
            return rule.type !== 'media';
        });
    }

    pages = this._generatePages(rules, ast);

    // Separate media queries
    if (this.mediaQueries === 'separate') {
        var mediaRules = ast.stylesheet.rules.filter(function (rule) {
            return rule.type === 'media';
        });

        pages = pages.concat(this._generatePages(mediaRules, ast));
    }

    return pages;
};

module.exports = function (files, options) {
    return new Sakugawa(files, options);
};

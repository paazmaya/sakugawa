# Sakugawa (佐久川)

> CSS splitter, filter and organiser for IE9 and before

![Mr Sakugawa](logo.png)

[![Dependency Status](https://david-dm.org/paazmaya/sakugawa/status.svg)](https://david-dm.org/paazmaya/sakugawa)
[![devDependency Status](https://img.shields.io/david/dev/paazmaya/sakugawa.svg?style=flat-square)](https://david-dm.org/paazmaya/sakugawa#info=devDependencies)
[![wercker status](https://app.wercker.com/status/d1673adc6fdf3e5c3e4234986517ebc3/s/master "wercker status")](https://app.wercker.com/project/byKey/d1673adc6fdf3e5c3e4234986517ebc3)
[![Windows build status](https://ci.appveyor.com/api/projects/status/67kt1qypoltk3dqf/branch/master?svg=true)](https://ci.appveyor.com/project/paazmaya/sakugawa/branch/master)
[![codecov.io](https://codecov.io/github/paazmaya/sakugawa/coverage.svg?branch=master)](https://codecov.io/github/paazmaya/sakugawa?branch=master)

[Internet Explorer versions from 6 up to 9 come with a limitation][ieinternals] for
selectors present in a single CSS file. This limitation of 4095 selectors created the
need for CSS splitter, which might be the main use case of this task runner plugin.

Those versions also come with other number related limits, such as the amount of
`@import` rules used in a single file. That limit is 31 for sheets and the imported
sheet can have descending imports up to 4 levels total.

Since IE8 and earlier, do not support media queries, but IE9 does, there is an option for handling
media queries differently, based on the targeted IE version. By separating media queries in
to a different file, it will allow the to include that CSS file [conditionally][] only when
IE9 is being used. Ideally this would reduce the amount of bytes downloaded by IE8, which
cannot handle the media queries anyhow, and thus prevent downloading something that is not
even used.

## Background for the name

[Mr Sakugawa (佐久川 寛賀, first name Kanga)](http://en.wikipedia.org/wiki/Sakugawa_Kanga)
was a martial artist living in Okinawa, Japan.
He was very important figure in the evolution of the Ryukyu martial arts known today as
Karate and Ryukyu Kobujutsu. In the latter, there are forms named after him,
in which a long six feet wooden staff is used.

The three forms are called `Sakugawa no kon sho`, `Sakugawa no kon chu`, and `Sakugawa no kon dai`.
[Here is a Youtube video of one of those forms.](https://www.youtube.com/watch?v=KF4nERzknmI)

## Installation

Install globally, in order to use the command line tool.
Might need to use `sudo`, depending of your setup:

```sh
npm install --global sakugawa
```

For local installation, in which you could use `--save` or `--save-dev`:

```sh
npm install sakugawa
```

Please note that the minimum supported version of [Node.js](https://nodejs.org/en/) is `10.13.0`, which is [the active Long Term Support (LTS) version](https://github.com/nodejs/Release#release-schedule).

## Command line usage

```sh
Usage: sakugawa [options] huge-stylesheet.css [more CSS files]

Options:

  -h, --help             Show help
  -V, --version          Show version information
  -n, --max-selectors    Maximum number of CSS selectors per output file
  -i, --max-imports      Maximum number of @import rules per output file
  -s, --suffix           Output CSS file suffix
  -M, --minimum-files    Minimum number of output CSS files
  -m, --media-queries    Media query handling, separation to different file (separate) or ignorance (ignore). By default included (normal)
```

Example with [Pure CSS](http://purecss.io/ "A set of small, responsive CSS modules that you can use in every web project"):

```sh
sakugawa -n 400 -m separate pure-min.css
```

Would result in creating files `pure-min_1.css` and `pure-min_2.css` in which the latter contains all media queries.

Please note that the resulting files are not minified.

The CSS file used in the example can be retrieved with:

```sh
wget http://yui.yahooapis.com/pure/0.5.0/pure-min.css
```


## Use as a npm module

First [require][] the `sakugawa` module, which exports itself as a function.

```js
var sakugawa = require('sakugawa');
```

Later on in the script use the `sakugawa` function:

```js
var styles = fs.readFileSync('pure.css', 'utf8');

var options = {
  maxSelectors: 400,
  mediaQueries: 'separate'
};

var separated = sakugawa(styles, options);
// Separated is an array of CSS strings

separated.forEach(function eachPages(css, index) {
  fs.writeFileSync('pure_' + (index + 1) + '.css', css, 'utf8');
});
```

Available options are shown below and assigned to their default values:

```js
var options = {
  maxSelectors: 4090,
  mediaQueries: 'normal',
  filename: 'input.css', // Not used at the moment for anything
  minSheets: 1
};
```

The above used options map to the same as used via command line and thus have the same
defaults and allowed values. Please note however, that the `minSheets` is used as
`--minimum-files` via command line, since the command line version is touching files,
while the API provided is only touching strings.


## Task runners

* [gulp-sakugawa](https://github.com/paazmaya/gulp-sakugawa "Run Sakugawa via gulp, for CSS splitting, filtering and organising")
* [grunt-sakugawa](https://github.com/paazmaya/grunt-sakugawa "Run Sakugawa via Grunt, for CSS splitting, filtering and organising")

## Contributing

["A Beginner's Guide to Open Source: The Best Advice for Making your First Contribution"](http://www.erikaheidi.com/blog/a-beginners-guide-to-open-source-the-best-advice-for-making-your-first-contribution/).

[Also there is a blog post about "45 Github Issues Dos and Don’ts"](https://davidwalsh.name/45-github-issues-dos-donts).

Linting is done with [ESLint](http://eslint.org) and can be executed with `npm run lint`.
There should be no errors appearing after any JavaScript file changes.

Unit tests are written with [`tape`](https://github.com/substack/tape) and can be executed with `npm test`.
Code coverage is inspected with [`nyc`](https://github.com/istanbuljs/nyc) and
can be executed with `npm run coverage` after running `npm test`.
Please make sure it is over 90% at all times.

## Version history

- Run tests also against Node.js version 14. Now versions 10 (Wercker), 12 (AppVeyor), and 14 () of Node.js are covered

* `v0.6.0` (2019-01-26)
  - Minimum Node.js version lifted from `4.2.0` to `8.11.1`
  - Use [`npm-shrinkwrap.json`](https://docs.npmjs.com/files/shrinkwrap.json) for locking the working set of 3rd party dependencies
* `v0.5.3` (2016-08-08)
  - Start testing with Windows at AppVeyor
  - Move code coverage from `instanbul` to `nyc`
  - Document the default value for `--media-queries` command line option
* `v0.5.2` (2016-07-10)
  - ~~Use `Object.assign()` for cloning AST object, #26~~, did not work as assumed
* `v0.5.1` (2015-12-04)
  - Code coverage report at codecov #24
  - ES2015 variable usage. Was going to use destructuring, but it's not released yet in Node.js
* `v0.5.0` (2015-11-16)
  - Limit the number of `@import` rules, #2
  - Version outputs only `0.5.0`
  - Require minimum of Node.js LTS version `4.2.0`
* `v0.4.1` (2015-03-11)
  - One `var` too many in the previous release
* `v0.4.0` (2015-03-11)
  - Preserve `@charset` rules, #5
* `v0.3.2` (2015-02-25)
  - Minimum number of CSS sheets was not followed
  - Code coverage with unit tests at 100%, #1 and #8
* `v0.3.1` (2015-02-23)
  - Use latest `css` version, namely `2.2.0`, which was release five days ago
* `v0.3.0` (2015-02-23)
  - Possibility to specify minimum amount of generated CSS, #7
* `v0.2.1` (2014-12-05)
  - Better documentation and command line bin path configured so now usable via global install
* `v0.2.0` (2014-11-19)
  - Speed improvements
* `v0.1.0` (2014-11-17)
  - Initial release with splitting against selector count and media query filtering

## License

Copyright (c) [Juga Paazmaya](https://paazmaya.fi) <paazmaya@yahoo.com>

Licensed under the [MIT license](LICENSE).


[ieinternals]: http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/10164546.aspx "Stylesheet Limits in Internet Explorer"
[conditionally]: http://www.quirksmode.org/css/condcom.html "Conditional comments"
[require]: http://nodejs.org/api/modules.html#modules_module_require_id "The module.require method provides a way to load a module as if require() was called from the original module"

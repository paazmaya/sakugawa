# Sakugawa (佐久川)

> CSS splitter, filter and organiser

![Mr Sakugawa](./logo.png)
[![Analytics](https://ga-beacon.appspot.com/UA-2643697-15/sakugawa/index)](https://github.com/igrigorik/ga-beacon)
[![Dependency Status](https://david-dm.org/paazmaya/sakugawa.svg)](https://david-dm.org/paazmaya/sakugawa)
[![devDependency Status](https://david-dm.org/paazmaya/sakugawa/dev-status.svg)](https://david-dm.org/paazmaya/sakugawa#info=devDependencies)

## Background for the name

[Mr Sakugawa (佐久川 寛賀, first name Kanga)](http://en.wikipedia.org/wiki/Sakugawa_Kanga)
was a martial artist living in Okinawa, Japan.
He was very important figure in the evolution of the Ryukyu martial arts known today as
Karate and Ryukyu Kobujutsu. In the latter, there are forms named after him,
in which a long six feet wooden staff is used.

The three forms are called `Sakugawa no kon sho`, `Sakugawa no kon chu`, and `Sakugawa no kon dai`.
[Here is a Youtube video of one of those forms.](https://www.youtube.com/watch?v=KF4nERzknmI)

## Command line usage

```sh
Usage: sakugawa [options] huge-stylesheet.css [more CSS files]

Options:

  -h, --help             Show help
  -V, --version          Show version information
  -n, --max-selectors    Maximum number of CSS selectors per output file
  -s, --suffix           Output CSS file suffix
  -m, --media-queries    Media query handling, separation to different file (separate) or ignorance (ignore). By default included
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

## Task runners

* [gulp-sakugawa](https://github.com/paazmaya/gulp-sakugawa "Run Sakugawa via gulp, for CSS splitting, filtering and organising")
* [grunt-sakugawa](https://github.com/paazmaya/grunt-sakugawa "Run Sakugawa via Grunt, for CSS splitting, filtering and organising")

## Version history

v0.2.0 (2014-11-19) Speed improvements
v0.1.0 (2014-11-17) Initial release with splitting against selector count and media query filtering

## License

Copyright (c) Juga Paazmaya <olavic@gmail.com>

Licensed under the [MIT license](LICENSE).

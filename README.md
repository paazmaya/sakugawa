# Sakugawa (佐久川)

> CSS splitter, filter and organiser

![Mr Sakugawa](./sakugawa-logo.png)
[![Analytics](https://ga-beacon.appspot.com/UA-2643697-15/sakugawa/index)](https://github.com/igrigorik/ga-beacon)

## Background for the name

(佐久川 寛賀)
http://en.wikipedia.org/wiki/Sakugawa_Kanga

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
wget http://yui.yahooapis.com/pure/0.5.0/pure-min.css

sakugawa -n 400 -m separate pure-min.css
```

Would result in creating files `pure-min_1.css` and `pure-min_2.css` in which the latter contains all media queries.

Please note that the resulting files are not minified.

## Task runners

* [gulp-sakugawa](https://github.com/paazmaya/gulp-sakugawa "Run Sakugawa via gulp, for CSS splitting, filtering and organising")
* [grunt-sakugawa](https://github.com/paazmaya/grunt-sakugawa "Run Sakugawa via Grunt, for CSS splitting, filtering and organising")

## Version history

v0.1.0 (2014-11-17) Initial release with splitting against selector count and media query filtering

## License

Copyright (c) Juga Paazmaya <olavic@gmail.com>

Licensed under the [MIT license](LICENSE).

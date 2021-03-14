# Version history for Sakugawa (佐久川)

This changelog covers the version history and possible upcoming changes.
It follows the guidance from https://keepachangelog.com/en/1.0.0/.

## Unreleased

## `v0.7.0` (2021-02-16)
- Minimum Node.js version lifted from `8.11.1` to `10.13.0`
- Run tests also against Node.js version 14. Now versions 10 (Wercker), 12 (AppVeyor), and 14 (GitHub Actions) of Node.js are covered
- Suffix option did not accept strings because it was configured as `number` #40. Fixed by @gluecksmensch #41

## `v0.6.0` (2019-01-26)
- Minimum Node.js version lifted from `4.2.0` to `8.11.1`
- Use [`npm-shrinkwrap.json`](https://docs.npmjs.com/files/shrinkwrap.json) for locking the working set of 3rd party dependencies

## `v0.5.3` (2016-08-08)
- Start testing with Windows at AppVeyor
- Move code coverage from `instanbul` to `nyc`
- Document the default value for `--media-queries` command line option

## `v0.5.2` (2016-07-10)
- ~~Use `Object.assign()` for cloning AST object, #26~~, did not work as assumed

## `v0.5.1` (2015-12-04)
- Code coverage report at codecov #24
- ES2015 variable usage. Was going to use destructuring, but it's not released yet in Node.js

## `v0.5.0` (2015-11-16)
- Limit the number of `@import` rules, #2
- Version outputs only `0.5.0`
- Require minimum of Node.js LTS version `4.2.0`

## `v0.4.1` (2015-03-11)
- One `var` too many in the previous release

## `v0.4.0` (2015-03-11)
- Preserve `@charset` rules, #5

## `v0.3.2` (2015-02-25)
- Minimum number of CSS sheets was not followed
- Code coverage with unit tests at 100%, #1 and #8

## `v0.3.1` (2015-02-23)
- Use latest `css` version, namely `2.2.0`, which was release five days ago

## `v0.3.0` (2015-02-23)
- Possibility to specify minimum amount of generated CSS, #7

## `v0.2.1` (2014-12-05)
- Better documentation and command line bin path configured so now usable via global install

## `v0.2.0` (2014-11-19)
- Speed improvements

## `v0.1.0` (2014-11-17)
- Initial release with splitting against selector count and media query filtering

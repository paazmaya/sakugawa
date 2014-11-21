
var test = require('tape');
var sakugawa = require('../lib/index');

test('timing test', function (t) {
    t.plan(1);

    t.equal(typeof sakugawa, 'function');

});


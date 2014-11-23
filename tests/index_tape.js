
var test = require('tape');
var sakugawa = require('../lib/index');

test('timing test', function (t) {
    t.plan(2);

    t.equal(typeof sakugawa, 'function');

    var styles = 'body { color: rebeccapurple; }';
    t.equal(sakugawa(styles), [styles]);

});


'use strict';

const { test } = require('tap');
const Client = require('../');

test('development mode true', t => {
    const c = new Client({
        path: './test/mocks/assets-1.json',
        development: true,
    });

    t.same(c.js, [
        {
            type: 'esm',
            value: 'http://my-dev-assets/scripts.js',
            development: true,
        },
    ]);
    t.same(c.css, [
        {
            type: 'default',
            value: 'http://my-dev-assets/styles.css',
            development: true,
        },
    ]);
    t.end();
});

test('development mode false', t => {
    const c = new Client({
        path: './test/mocks/assets-1.json',
        development: false,
    });

    t.same(c.js, [
        {
            type: 'esm',
            value: 'http://localhost:4001/my-org/js/my-app-name/1.0.0/index.js',
        },
    ]);
    t.same(c.css, [
        {
            type: 'default',
            value:
                'http://localhost:4001/my-org/css/my-app-name/1.0.0/index.css',
        },
    ]);
    t.end();
});

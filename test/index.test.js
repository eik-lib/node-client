'use strict';

const { test } = require('tap');
const Client = require('../');

test('development mode true', t => {
    const c = new Client({
        path: './test/mocks/assets-1.json',
        development: true,
    });

    t.same(JSON.parse(JSON.stringify(c.js)), [
        {
            type: 'module',
            value: 'http://my-dev-assets/scripts.js',
        },
    ]);
    t.same(JSON.parse(JSON.stringify(c.css)), [
        {
            type: 'text/css',
            value: 'http://my-dev-assets/styles.css',
            rel: 'stylesheet',
        },
    ]);
    t.end();
});

test('development mode true, custom properties', t => {
    const c = new Client({
        path: './test/mocks/assets-2.json',
        development: true,
    });

    t.same(JSON.parse(JSON.stringify(c.js)), [
        {
            type: 'module',
            defer: true,
            value: 'http://my-dev-assets/scripts.js',
        },
    ]);
    t.same(JSON.parse(JSON.stringify(c.css)), [
        {
            type: 'text/css',
            value: 'http://my-dev-assets/styles.css',
            rel: 'stylesheet',
        },
    ]);
    t.end();
});

test('development mode false', t => {
    const c = new Client({
        path: './test/mocks/assets-1.json',
        development: false,
    });

    t.same(JSON.parse(JSON.stringify(c.js)), [
        {
            type: 'module',
            value: 'http://localhost:4001/my-org/js/my-app-name/1.0.0/index.js',
        },
    ]);
    t.same(JSON.parse(JSON.stringify(c.css)), [
        {
            type: 'text/css',
            value:
                'http://localhost:4001/my-org/css/my-app-name/1.0.0/index.css',
            rel: 'stylesheet',
        },
    ]);
    t.end();
});

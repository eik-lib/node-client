'use strict';

const { test } = require('tap');
const Client = require('../');

test('development mode true - relative paths', t => {
    const c = new Client({
        js: '/assets/scripts.js',
        css: '/assets/styles.css',
        path: './test/mocks/assets-1.json',
        development: true
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                type: 'module',
                value: '/assets/scripts.js'
            }
        ],
        'client.js should return JS assets object'
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                type: 'text/css',
                value: '/assets/styles.css',
                rel: 'stylesheet'
            }
        ],
        'client.css should return CSS assets object'
    );
    t.end();
});

test('development mode true - absolute paths', t => {
    const c = new Client({
        js: 'http://my-dev-assets/scripts.js',
        css: 'http://my-dev-assets/styles.css',
        path: './test/mocks/assets-1.json',
        development: true
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                type: 'module',
                value: 'http://my-dev-assets/scripts.js'
            }
        ],
        'client.js should return JS assets object'
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                type: 'text/css',
                value: 'http://my-dev-assets/styles.css',
                rel: 'stylesheet'
            }
        ],
        'client.css should return CSS assets object'
    );
    t.end();
});

test('development mode true, setting options', t => {
    const c = new Client({
        js: 'http://my-dev-assets/scripts.js',
        css: 'http://my-dev-assets/styles.css',
        path: './test/mocks/assets-2.json',
        development: true
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                value: 'http://my-dev-assets/scripts.js',
                type: 'module',
                defer: true
            }
        ],
        'client.js should return JS assets object'
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                value: 'http://my-dev-assets/styles.css',
                type: 'text/css',
                rel: 'stylesheet'
            }
        ],
        'client.css should return CSS assets object'
    );
    t.end();
});

test('development mode false', t => {
    const c = new Client({
        path: './test/mocks/assets-1.json',
        development: false
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                type: 'module',
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.js'
            },
            {
                type: 'iife',
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/ie11/index.js'
            }
        ],
        'client.js should return JS assets object'
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                type: 'text/css',
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.css',
                rel: 'stylesheet'
            }
        ],
        'client.css should return CSS assets object'
    );
    t.end();
});

test('development mode false, setting options', t => {
    const c = new Client({
        path: './test/mocks/assets-3.json',
        development: false
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.js',
                async: true,
                defer: true,
                type: 'module'
            },
            {
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/ie11/index.js',
                async: true,
                defer: true,
                type: 'iife'
            }
        ],
        'client.js should return JS assets object'
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                title: 'my title',
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.css',
                type: 'text/css',
                rel: 'stylesheet'
            }
        ],
        'client.css should return CSS assets object'
    );
    t.end();
});

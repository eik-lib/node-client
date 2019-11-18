'use strict';

const { test } = require('tap');
const Client = require('../');

test('development mode true - relative paths', t => {
    const c = new Client({
        js: '/assets/scripts.js',
        css: '/assets/styles.css',
        path: './test/mocks/assets-1.json',
        development: true,
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                type: 'module',
                value: '/assets/scripts.js',
            },
        ],
        'client.js should return JS assets object',
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                type: 'text/css',
                value: '/assets/styles.css',
                rel: 'stylesheet',
            },
        ],
        'client.css should return CSS assets object',
    );
    t.end();
});

test('development mode true - absolute paths', t => {
    const c = new Client({
        js: 'http://my-dev-assets/scripts.js',
        css: 'http://my-dev-assets/styles.css',
        path: './test/mocks/assets-1.json',
        development: true,
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                type: 'module',
                value: 'http://my-dev-assets/scripts.js',
            },
        ],
        'client.js should return JS assets object',
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                type: 'text/css',
                value: 'http://my-dev-assets/styles.css',
                rel: 'stylesheet',
            },
        ],
        'client.css should return CSS assets object',
    );
    t.end();
});

test('development mode true, setting options from assets.json', t => {
    const c = new Client({
        js: 'http://my-dev-assets/scripts.js',
        css: 'http://my-dev-assets/styles.css',
        path: './test/mocks/assets-2.json',
        development: true,
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                value: 'http://my-dev-assets/scripts.js',
                type: 'module',
                defer: true,
            },
        ],
        'client.js should return JS assets object',
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                value: 'http://my-dev-assets/styles.css',
                type: 'text/css',
                rel: 'stylesheet',
            },
        ],
        'client.css should return CSS assets object',
    );
    t.end();
});

test('development mode true, overriding options', t => {
    const c = new Client({
        js: {
            value: 'http://my-dev-assets/scripts.js',
            type: 'iife',
            async: true,
            defer: true,
        },
        css: {
            value: 'http://my-dev-assets/styles.css',
            type: 'text/css',
            title: 'some title',
        },
        path: './test/mocks/assets-2.json',
        development: true,
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                value: 'http://my-dev-assets/scripts.js',
                type: 'iife',
                defer: true,
                async: true,
            },
        ],
        'client.js should return JS assets object',
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                value: 'http://my-dev-assets/styles.css',
                type: 'text/css',
                rel: 'stylesheet',
                title: 'some title',
            },
        ],
        'client.css should return CSS assets object',
    );
    t.end();
});

test('development mode false', t => {
    const c = new Client({
        path: './test/mocks/assets-1.json',
        development: false,
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                type: 'module',
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.js',
            },
            {
                type: 'iife',
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/ie11/index.js',
                nomodule: true,
            },
        ],
        'client.js should return JS assets object',
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                type: 'text/css',
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.css',
                rel: 'stylesheet',
            },
        ],
        'client.css should return CSS assets object',
    );
    t.end();
});

test('development mode false, setting options', t => {
    const c = new Client({
        path: './test/mocks/assets-3.json',
        development: false,
    });

    t.same(
        JSON.parse(JSON.stringify(c.js)),
        [
            {
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.js',
                async: true,
                defer: true,
                type: 'module',
            },
            {
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/ie11/index.js',
                async: true,
                defer: true,
                type: 'iife',
                nomodule: true,
            },
        ],
        'client.js should return JS assets object',
    );
    t.same(
        JSON.parse(JSON.stringify(c.css)),
        [
            {
                title: 'my title',
                value:
                    'http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.css',
                type: 'text/css',
                rel: 'stylesheet',
            },
        ],
        'client.css should return CSS assets object',
    );
    t.end();
});

test('development mode false, scripts and styles', t => {
    const c = new Client({
        path: './test/mocks/assets-1.json',
        development: false,
    });

    t.same(
        JSON.parse(JSON.stringify(c.scripts)),
        `<script src="http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.js" type="module"></script>
<script src="http://localhost:4001/my-org/pkg/my-app-name/1.0.0/ie11/index.js" nomodule></script>`,
        'client.scripts should return JS scripts markup',
    );
    t.same(
        JSON.parse(JSON.stringify(c.styles)),
        `<link href="http://localhost:4001/my-org/pkg/my-app-name/1.0.0/main/index.css" type="text/css" rel="stylesheet">`,
        'client.styles should return CSS styles markup',
    );
    t.end();
});

test('development mode true, assets.json not required', t => {
    const c = new Client({
        js: '/js',
        css: '/css',
        development: true,
    });

    t.equals(c.js[0].value, '/js', 'client.js should return JS path');
    t.equals(c.css[0].value, '/css', 'client.css should return CSS path');

    t.end();
});

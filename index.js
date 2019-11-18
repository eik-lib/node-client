'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const pkgDir = require('pkg-dir');
const { AssetJs, AssetCss } = require('@podium/utils');
const { schemas } = require('@eik/common');

const scripts = Symbol('assets:scripts');
const styles = Symbol('assets:styles');

function validateMeta(meta) {
    const { value, error } = schemas.assets(meta);

    if (error) {
        throw new Error(error);
    }

    return value;
}

function readAssetsJson(path) {
    const metaPath = join(pkgDir.sync(), path);
    const metaString = readFileSync(metaPath, 'utf8');
    return validateMeta(JSON.parse(metaString));
}

module.exports = class Client {
    constructor({ js, css, development = false, path = './assets.json' }) {
        this[scripts] = [];
        this[styles] = [];

        try {
            this.meta = readAssetsJson(path);
        } catch (err) {
            this.meta = { js: {}, css: {} };
        }

        const {
            server,
            js: { input: jsInput, options: jsOptions },
            css: { input: cssInput, options: cssOptions },
            organisation,
            name,
            version,
        } = this.meta;

        if (development) {
            if (js) {
                let script = {};
                if (typeof js !== 'string') {
                    script = new AssetJs(js);
                } else {
                    script = new AssetJs({
                        type: 'module',
                        value: js,
                        ...jsOptions,
                    });
                }

                this[scripts].push(script);
            }
            if (css) {
                let style = {};
                if (typeof css !== 'string') {
                    style = new AssetCss(css);
                } else {
                    style = new AssetCss({ value: css, ...cssOptions });
                }

                this[styles].push(style);
            }
            return;
        }

        if (jsInput) {
            this[scripts].push(
                new AssetJs({
                    type: 'module',
                    ...jsOptions,
                    value:
                        server +
                        join(
                            '/',
                            organisation,
                            'pkg',
                            name,
                            version,
                            `/main/index.js`,
                        ),
                }),
            );
            this[scripts].push(
                new AssetJs({
                    ...jsOptions,
                    type: 'iife',
                    nomodule: true,
                    value:
                        server +
                        join(
                            '/',
                            organisation,
                            'pkg',
                            name,
                            version,
                            `/ie11/index.js`,
                        ),
                }),
            );
        }
        if (cssInput) {
            this[styles].push(
                new AssetCss({
                    ...cssOptions,
                    value:
                        server +
                        join(
                            '/',
                            organisation,
                            'pkg',
                            name,
                            version,
                            `/main/index.css`,
                        ),
                }),
            );
        }
    }

    get js() {
        return this[scripts];
    }

    get css() {
        return this[styles];
    }

    get scripts() {
        return this.js.map(s => s.toHTML()).join('\n');
    }

    get styles() {
        return this.css.map(s => s.toHTML()).join('\n');
    }
};

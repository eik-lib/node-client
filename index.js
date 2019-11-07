'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const pkgDir = require('pkg-dir');
const { AssetJs, AssetCss } = require('@podium/utils');
const { schemas } = require('@asset-pipe/common');

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
        const meta = readAssetsJson(path);

        const {
            server,
            js: { input: jsInput, options: jsOptions },
            css: { input: cssInput, options: cssOptions },
            organisation,
            name,
            version,
        } = meta;
        this._scripts = [];
        this._styles = [];

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

                this._scripts.push(script);
            }
            if (css) {
                let style = {};
                if (typeof css !== 'string') {
                    style = new AssetCss(css);
                } else {
                    style = new AssetCss({ value: css, ...cssOptions });
                }

                this._styles.push(style);
            }
            return;
        }

        if (jsInput) {
            this._scripts.push(
                new AssetJs({
                    type: 'module',
                    ...jsOptions,
                    value: `${server}/${organisation}/pkg/${name}/${version}/main/index.js`,
                }),
            );
            this._scripts.push(
                new AssetJs({
                    ...jsOptions,
                    type: 'iife',
                    value: `${server}/${organisation}/pkg/${name}/${version}/ie11/index.js`,
                }),
            );
        }
        if (cssInput) {
            this._styles.push(
                new AssetCss({
                    ...cssOptions,
                    value: `${server}/${organisation}/pkg/${name}/${version}/main/index.css`,
                }),
            );
        }
    }

    get js() {
        return this._scripts;
    }

    get css() {
        return this._styles;
    }

    get scripts() {
        return this.js.map(s => s.toHTML()).join('\n');
    }

    get styles() {
        return this.css.map(s => s.toHTML()).join('\n');
    }
};

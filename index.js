'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const pkgDir = require('pkg-dir');
const { AssetJs, AssetCss } = require('@podium/utils');

function validateMeta(meta) {
    if (!meta) throw new Error('invalid asset definition file');
    if (!meta.server)
        throw new Error('asset definition file missing required key "server"');
    if (!meta.inputs)
        throw new Error('asset definition file missing required key "inputs"');
    if (!meta.name)
        throw new Error('asset definition file missing required key "name"');
    if (!meta.version)
        throw new Error('asset definition file missing required key "version"');
    if (!meta.organisation)
        throw new Error(
            'asset definition file missing required key "organisation"'
        );
    return meta;
}

function readAssetsJson(path) {
    const metaPath = join(pkgDir.sync(), path);
    const metaString = readFileSync(metaPath, 'utf8');
    return validateMeta(JSON.parse(metaString));
}

module.exports = class Client {
    constructor({ development = false, path = './assets.json' }) {
        let meta = readAssetsJson(path);
        const {
            server,
            inputs,
            organisation,
            name,
            version,
            tagOptions = {},
        } = meta;
        this.scripts = [];
        this.styles = [];

        if (development && meta.development) {
            if (meta.development.js) {
                let script = {};
                if (typeof meta.development.js !== 'string') {
                    script = new AssetJs(meta.development.js);
                } else {
                    script = new AssetJs({
                        type: 'module',
                        value: meta.development.js,
                    });
                }

                this.scripts.push(script);
            }
            if (meta.development.css) {
                let style = {};
                if (typeof meta.development.css !== 'string') {
                    style = new AssetCss(meta.development.css);
                } else {
                    style = new AssetCss({ value: meta.development.css });
                }

                this.styles.push(style);
            }
            return;
        }

        if (inputs.js) {
            this.scripts.push(
                new AssetJs({
                    ...tagOptions.js,
                    value: `${server}/${organisation}/js/${name}/${version}/index.js`,
                    type: 'module',
                })
            );
        }
        if (inputs.css) {
            this.styles.push(
                new AssetCss({
                    ...tagOptions.css,
                    value: `${server}/${organisation}/css/${name}/${version}/index.css`,
                })
            );
        }
    }

    get js() {
        return this.scripts;
    }

    get css() {
        return this.styles;
    }
};

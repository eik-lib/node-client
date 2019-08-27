'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const pkgDir = require('pkg-dir');

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
        const { server, inputs, organisation, name, version } = meta;
        this.scripts = [];
        this.styles = [];

        if (development && meta.development) {
            if (meta.development.js) {
                this.scripts.push({
                    type: 'esm',
                    value: meta.development.js,
                    development: true,
                });
            }
            if (meta.development.css) {
                this.styles.push({
                    type: 'default',
                    value: meta.development.css,
                    development: true,
                });
            }
            return;
        }

        if (inputs.js) {
            this.scripts.push({
                value: `${server}/${organisation}/js/${name}/${version}/index.js`,
                type: 'esm',
            });
        }
        if (inputs.css) {
            this.styles.push({
                type: 'default',
                value: `${server}/${organisation}/css/${name}/${version}/index.css`,
            });
        }
    }

    get js() {
        return this.scripts;
    }

    get css() {
        return this.styles;
    }
};

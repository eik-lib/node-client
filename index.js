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
}

module.exports = class Client {
    constructor({ js, css, development = false }) {
        let meta = null;
        this.scripts = [];
        this.styles = [];

        if (development) {
            if (js) {
                this.scripts.push({
                    type: 'esm',
                    value: js,
                    development: true,
                });
            }
            if (css) {
                this.styles.push({
                    value: css,
                    development: true,
                });
            }
            return;
        }

        try {
            const metaPath = join(pkgDir.sync(), 'assets.json');
            const metaString = readFileSync(metaPath, 'utf8');
            meta = JSON.parse(metaString);
        } catch (err) {}

        if (meta) {
            validateMeta(meta);

            const { server, inputs, organisation, name, version } = meta;

            if (inputs.js) {
                this.scripts.push({
                    value: `${server}/${organisation}/bundle/${name}/${version}/index.js`,
                    type: 'esm',
                });
            }
            if (inputs.css) {
                this.styles.push({
                    value: `${server}/${organisation}/bundle/${name}/${version}/index.css`,
                });
            }
        }
    }

    get js() {
        return this.scripts;
    }
    get css() {
        return this.styles;
    }
};

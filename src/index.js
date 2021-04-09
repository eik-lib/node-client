import { helpers } from '@eik/common';
import { join } from 'path';
import fetch from 'node-fetch';
import EikAsset from './asset.js';

const isUrl = (value = '') => value.startsWith('http');

const fetchImportMaps = async (urls = []) => {
    try {
        const maps = urls.map((map) => fetch(map).then((result) => {
            if (result.status === 404) {
                throw new Error('Import map could not be found on server');
            } else if (result.status >= 400 && result.status < 500) {
                throw new Error('Server rejected client request');
            } else if (result.status >= 500) {
                throw new Error('Server error');
            }
            return result.json();
        }));
        return await Promise.all(maps);
    } catch (err) {
        throw new Error(
            `Unable to load import map file from server: ${err.message}`,
        );
    }
};

export default class EikNodeClient {
    constructor({
        development = false,
        base = '',
        path = process.cwd(),
    } = {}) {
        this.pDevelopment = development;
        this.pConfig = {};
        this.pPath = path;
        this.pBase = base;
        this.pMaps = [];
    }

    async load({
        maps = false,
    } = {}) {
        this.pConfig = await helpers.getDefaults(this.pPath);
        if (maps) {
            this.pMaps = await fetchImportMaps(this.pConfig.map);
        }
    }

    get name() {
        if (this.pConfig.name) return this.pConfig.name;
        return '';
    }

    get version() {
        if (this.pConfig.version) return this.pConfig.version;
        return '';
    }

    get type() {
        if (this.pConfig.type && this.pConfig.type === 'package') return 'pkg';
        if (this.pConfig.type) return this.pConfig.type;
        return '';
    }

    get server() {
        if (this.pConfig.server) return this.pConfig.server;
        return '';
    }

    get pathname() {
        return join('/', this.type, this.name, this.version);
    }

    file(file = '') {
        const asset = new EikAsset();

        if (this.pDevelopment) {
            if (isUrl(this.pBase)) {
                const base = new URL(this.pBase);
                asset.value = new URL(join(base.pathname, file), base).href;
            } else {
                asset.value = join(this.pBase, file);
            }
        } else {
            asset.value = new URL(join(this.pathname, file), this.server).href;
        }
        
        return asset;
    }

    maps() {
        return this.pMaps;
    }
}

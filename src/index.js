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
    #development;
    #config
    #path;
    #base;
    #maps;
    constructor({
        development = false,
        base = '',
        path = process.cwd(),
    } = {}) {
        this.#development = development;
        this.#config = {};
        this.#path = path;
        this.#base = base;
        this.#maps = [];
    }

    async load({
        maps = false,
    } = {}) {
        this.#config = await helpers.getDefaults(this.#path);
        if (maps) {
            this.#maps = await fetchImportMaps(this.#config.map);
        }
    }

    get name() {
        if (this.#config.name) return this.#config.name;
        return '';
    }

    get version() {
        if (this.#config.version) return this.#config.version;
        return '';
    }

    get type() {
        if (this.#config.type && this.#config.type === 'package') return 'pkg';
        if (this.#config.type) return this.#config.type;
        return '';
    }

    get server() {
        if (this.#config.server) return this.#config.server;
        return '';
    }

    get pathname() {
        return join('/', this.type, this.name, this.version);
    }

    file(file = '') {
        const asset = new EikAsset();

        if (this.#development) {
            if (isUrl(this.#base)) {
                const base = new URL(this.#base);
                asset.value = new URL(join(base.pathname, file), base).href;
            } else {
                asset.value = join(this.#base, file);
            }
        } else {
            asset.value = new URL(join(this.pathname, file), this.server).href;
        }
        
        return asset;
    }

    maps() {
        return this.#maps;
    }
}

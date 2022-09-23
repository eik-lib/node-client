/* eslint-disable no-restricted-syntax */
import { request } from 'undici';
import { join } from 'path';
import loader from '@eik/common-config-loader';
import Asset from './asset.js';

const trimSlash = (value = '') => {
    if (value.endsWith('/')) return value.substring(0, value.length - 1);
    return value;
};

const fetchImportMaps = async (urls = []) => {
    try {
        const maps = urls.map(async (map) => {
            const { statusCode, body } = await request(map, {
                maxRedirections: 2,
            });

            if (statusCode === 404) {
                throw new Error('Import map could not be found on server');
            } else if (statusCode >= 400 && statusCode < 500) {
                throw new Error('Server rejected client request');
            } else if (statusCode >= 500) {
                throw new Error('Server error');
            }
            return body.json();
        });
        return await Promise.all(maps);
    } catch (err) {
        throw new Error(
            `Unable to load import map file from server: ${err.message}`,
        );
    }
};

export default class NodeClient {
    #development;
    #loadMaps;
    #config;
    #path;
    #base;
    #maps;
    constructor({
        development = false,
        loadMaps = false,
        base = '',
        path = process.cwd(),
    } = {}) {
        this.#development = development;
        this.#loadMaps = loadMaps;
        this.#config = {};
        this.#path = path;
        this.#base = trimSlash(base);
        this.#maps = [];
    }

    async load() {
        this.#config = await loader.getDefaults(this.#path);
        if (this.#loadMaps) {
            this.#maps = await fetchImportMaps(this.#config.map);
        }
    }

    get name() {
        if (this.#config.name) return this.#config.name;
        throw new Error('Eik config was not loaded before calling .name');
    }

    get version() {
        if (this.#config.version) return this.#config.version;
        throw new Error('Eik config was not loaded before calling .version');
    }

    get type() {
        if (this.#config.type && this.#config.type === 'package') return 'pkg';
        if (this.#config.type) return this.#config.type;
        throw new Error('Eik config was not loaded before calling .type');
    }

    get server() {
        if (this.#config.server) return this.#config.server;
        throw new Error('Eik config was not loaded before calling .server');
    }

    get pathname() {
        if (this.#config.type && this.#config.name && this.#config.version)
            return join('/', this.type, this.name, this.version);
        throw new Error('Eik config was not loaded before calling .pathname');
    }

    base() {
        if (this.#development) return this.#base;
        return `${this.server}${this.pathname}`;
    }

    file(file = '') {
        const base = this.base();
        return new Asset({
            value: `${base}${file}`,
        });
    }

    maps() {
        if (this.#config.version && this.#loadMaps) return this.#maps;
        throw new Error(
            'Eik config was not loaded or "loadMaps" is "false" when calling .maps()',
        );
    }

    mapping(dependency) {
        let mapping = null;
        for (const map of this.maps()) {
            if (map?.imports[dependency]) mapping = map.imports[dependency];
        }
        return mapping;
    }
}

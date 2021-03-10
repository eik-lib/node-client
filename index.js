import { helpers } from '@eik/common';
import { join } from 'path';

const isUrl = (value = '') => value.startsWith('http')

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
    }

    async load() {
        this.pConfig = await helpers.getDefaults(this.pPath);
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
        if (this.pDevelopment) {
            if (isUrl(this.pBase)) {
                const base = new URL(this.pBase);
                return new URL(join(base.pathname, file), base).href;
            }
            return join(this.pBase, file);
        }
        return new URL(join(this.pathname, file), this.server).href;
    }
};

import { mkdtemp, writeFile } from 'fs/promises';
import { helpers } from '@eik/common';
import path from 'path';
import http from 'http';
import tap from 'tap';
import os from 'os';

import NodeClient from '../src/index.js';

const FIXTURE_PATH = `${process.cwd()}/fixtures`;
const FIXTURE_FILE = await helpers.getDefaults(FIXTURE_PATH);

const writeTempConfig = async (address) => {
    const pathname = await mkdtemp(path.join(os.tmpdir(), `eik-${address.port.toString()}-`));
    const config = JSON.parse(JSON.stringify(FIXTURE_FILE));
   
    config.server = `http://${address.address}:${address.port}`;
    config['import-map'] = [
        `http://${address.address}:${address.port}/map/mod-a/v2`,
        `http://${address.address}:${address.port}/map/mod-b/v1`
    ];

    await writeFile(path.join(pathname, 'eik.json'), JSON.stringify(config));

    return pathname;
}

class Server {
    constructor() {
        this.server = http.createServer((req, res) => {
            if (req.url.startsWith('/map/mod')) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    imports: {
                      eik: "/src/eik.js",
                    }
                }));
                return;
            }

            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not found');
        });
    }

    listen() {
        return new Promise((resolve) => {
            const connection = this.server.listen(0, 'localhost', () => {
                resolve(connection);
            });
        });
    }

    close() {
        return new Promise((resolve) => {
            this.server.close(() => {
                resolve();
            });
        });
    }
}

tap.beforeEach(async (t) => {
    const server = new Server();    
    t.context.server = await server.listen();
    
    const address = t.context.server.address();
    const fixture = await writeTempConfig(address);

    t.context.address = `http://${address.address}:${address.port}`;
    t.context.fixture = fixture;
});

tap.afterEach(async (t) => {
    await t.context.server.close()
});

tap.test('Client - Default settings - Config is not loaded', (t) => {
    const client = new NodeClient();

    t.throws(() => {
        // eslint-disable-next-line no-unused-vars
        const val = client.name;
    }, /Eik config was not loaded before calling .name/, 'Should throw');

    t.throws(() => {
        // eslint-disable-next-line no-unused-vars
        const val = client.version;
    }, /Eik config was not loaded before calling .version/, 'Should throw');

    t.throws(() => {
        // eslint-disable-next-line no-unused-vars
        const val = client.type;
    }, /Eik config was not loaded before calling .type/, 'Should throw');

    t.throws(() => {
        // eslint-disable-next-line no-unused-vars
        const val = client.server;
    }, /Eik config was not loaded before calling .server/, 'Should throw');

    t.throws(() => {
        // eslint-disable-next-line no-unused-vars
        const val = client.pathname;
    }, /Eik config was not loaded before calling .pathname/, 'Should throw');

    t.throws(() => {
        // eslint-disable-next-line no-unused-vars
        const val = client.maps();
    }, /Eik config was not loaded or \"loadMaps\" is \"false\" calling .maps()/, 'Should throw');


    t.end();
});

tap.test('Client - Default settings - Config is loaded', async (t) => {
    const client = new NodeClient({
        path: t.context.fixture,
    });
    await client.load();

    t.equal(client.name, 'eik-fixture', 'Should be same as "name" in eik.json');
    t.equal(client.version, '1.0.2', 'Should be same as "version" in eik.json');
    t.equal(client.type, 'pkg', 'Should be "pkg" in eik.json');
    t.equal(client.server, t.context.address, 'Should be same as "server" in eik.json');
    t.equal(client.pathname, '/pkg/eik-fixture/1.0.2', 'Should be composed path based on "type", "name" and "version"');
    t.end();
});

tap.test('Client - Default settings - Config is loaded and development mode is set to "true"', async (t) => {
    const client = new NodeClient({
        development: true,
        path: t.context.fixture,
    });
    await client.load();

    t.equal(client.name, 'eik-fixture', 'Should be same as "name" in eik.json');
    t.equal(client.version, '1.0.2', 'Should be same as "version" in eik.json');
    t.equal(client.type, 'pkg', 'Should be "pkg" in eik.json');
    t.equal(client.server, t.context.address, 'Should be same as "server" in eik.json');
    t.equal(client.pathname, '/pkg/eik-fixture/1.0.2', 'Should be composed path based on "type", "name" and "version"');
    t.end();
});

tap.test('Client - Retrieve a file path - Development mode is set to "false"', async (t) => {
    const client = new NodeClient({
        path: t.context.fixture,
    });
    await client.load();

    const file = '/some/path/foo.js';
    const resolved = client.file(file);

    t.equal(`${client.server}${client.pathname}${file}`, resolved.value);
    t.end();
});

tap.test('Client - Retrieve a file path - Development mode is set to "true"', async (t) => {
    const client = new NodeClient({
        development: true,
        path: t.context.fixture,
    });
    await client.load();

    const resolved = client.file('/some/path/foo.js');

    t.equal('/some/path/foo.js', resolved.value);
    t.end();
});

tap.test('Client - Retrieve a file path - Development mode is set to "true"', async (t) => {
    const client = new NodeClient({
        development: true,
        base: 'http://localhost:7777/prefix/',
        path: t.context.fixture,
    });
    await client.load();

    const resolved = client.file('/some/path/foo.js');

    t.equal('http://localhost:7777/prefix/some/path/foo.js', resolved.value);
    t.end();
});

tap.test('Client - Load maps', async (t) => {
    const client = new NodeClient({
        loadMaps: true,
        path: t.context.fixture,
    });
    await client.load();
    
    const maps = client.maps();
    t.same([
        { imports: { eik: '/src/eik.js' } },
        { imports: { eik: '/src/eik.js' } }
    ], maps, 'Should return maps');

    t.end();
});

import { mkdtemp, writeFile } from "fs/promises";
import { helpers } from "@eik/common";
import path from "node:path";
import http from "node:http";
import { describe, test, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import os from "node:os";

import Eik from "../src/index.js";

const FIXTURE_PATH = `${process.cwd()}/fixtures`;
const FIXTURE_FILE = await helpers.getDefaults(FIXTURE_PATH);

/**
 * @param {import('net').AddressInfo} address
 */
const writeTempConfig = async (address) => {
	const pathname = await mkdtemp(
		path.join(os.tmpdir(), `eik-${address.port.toString()}-`),
	);
	const config = JSON.parse(JSON.stringify(FIXTURE_FILE));

	config.server = `http://${address.address}:${address.port}`;
	config["import-map"] = [
		`http://${address.address}:${address.port}/map/mod-a/v2`,
		`http://${address.address}:${address.port}/map/mod-b/v1`,
	];

	await writeFile(path.join(pathname, "eik.json"), JSON.stringify(config));

	return pathname;
};

class Server {
	constructor() {
		this.server = http.createServer((req, res) => {
			if (req.url && req.url.startsWith("/map/mod")) {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.end(
					JSON.stringify({
						imports: {
							eik: "/src/eik.js",
						},
					}),
				);
				return;
			}

			res.statusCode = 404;
			res.setHeader("Content-Type", "text/plain");
			res.end("Not found");
		});
	}

	listen() {
		return new Promise((resolve) => {
			const connection = this.server.listen(0, "127.0.0.1", () => {
				resolve(connection);
			});
		});
	}

	/** @returns {Promise<void>} */
	close() {
		return new Promise((resolve) => {
			this.server.close(() => {
				resolve();
			});
		});
	}
}

describe("Eik client", () => {
	let app;
	let address;
	let fixture;

	beforeEach(async () => {
		const server = new Server();
		app = await server.listen();
		const addr = /** @type {import('net').AddressInfo} */ (app.address());
		fixture = await writeTempConfig(addr);
		address = `http://${addr.address}:${addr.port}`;
	});

	afterEach(async () => {
		await app.close();
	});

	test("Client - Default settings - Config is not loaded", () => {
		const client = new Eik();

		assert.throws(
			() => {
				// eslint-disable-next-line no-unused-vars
				const val = client.name;
			},
			/Eik config was not loaded before calling .name/,
			"Should throw",
		);

		assert.throws(
			() => {
				// eslint-disable-next-line no-unused-vars
				const val = client.version;
			},
			/Eik config was not loaded before calling .version/,
			"Should throw",
		);

		assert.throws(
			() => {
				// eslint-disable-next-line no-unused-vars
				const val = client.type;
			},
			/Eik config was not loaded before calling .type/,
			"Should throw",
		);

		assert.throws(
			() => {
				// eslint-disable-next-line no-unused-vars
				const val = client.server;
			},
			/Eik config was not loaded before calling .server/,
			"Should throw",
		);

		assert.throws(
			() => {
				// eslint-disable-next-line no-unused-vars
				const val = client.pathname;
			},
			/Eik config was not loaded before calling .pathname/,
			"Should throw",
		);

		assert.throws(
			() => {
				// eslint-disable-next-line no-unused-vars
				const val = client.maps();
			},
			/Eik config was not loaded or "loadMaps" is "false" when calling .maps()/,
			"Should throw",
		);
	});

	test("Client - Default settings - Config is loaded", async () => {
		const client = new Eik({
			path: fixture,
		});
		await client.load();

		assert.strictEqual(
			client.name,
			"eik-fixture",
			'Should be same as "name" in eik.json',
		);
		assert.strictEqual(
			client.version,
			"1.0.2",
			'Should be same as "version" in eik.json',
		);
		assert.strictEqual(client.type, "pkg", 'Should be "pkg" in eik.json');
		assert.strictEqual(
			client.server,
			address,
			'Should be same as "server" in eik.json',
		);
		assert.strictEqual(
			client.pathname,
			"/pkg/eik-fixture/1.0.2",
			'Should be composed path based on "type", "name" and "version"',
		);
	});

	test('Client - Default settings - Config is loaded and development mode is set to "true"', async () => {
		const client = new Eik({
			development: true,
			path: fixture,
		});
		await client.load();

		assert.strictEqual(
			client.name,
			"eik-fixture",
			'Should be same as "name" in eik.json',
		);
		assert.strictEqual(
			client.version,
			"1.0.2",
			'Should be same as "version" in eik.json',
		);
		assert.strictEqual(client.type, "pkg", 'Should be "pkg" in eik.json');
		assert.strictEqual(
			client.server,
			address,
			'Should be same as "server" in eik.json',
		);
		assert.strictEqual(
			client.pathname,
			"/pkg/eik-fixture/1.0.2",
			'Should be composed path based on "type", "name" and "version"',
		);
	});

	test('Client - Retrieve a file path - Development mode is set to "false"', async () => {
		const client = new Eik({
			path: fixture,
		});
		await client.load();

		const file = "/some/path/foo.js";
		const resolved = client.file(file);

		assert.strictEqual(
			resolved.value,
			`${client.server}${client.pathname}${file}`,
		);
	});

	test('Client - Retrieve a file path - Development mode is set to "true" - Base is unset', async () => {
		const client = new Eik({
			development: true,
			path: fixture,
		});
		await client.load();

		const resolved = client.file("/some/path/foo.js");

		assert.strictEqual(resolved.value, "/some/path/foo.js");
	});

	test('Client - Retrieve a file path - Development mode is set to "true" - Base is set to absolute URL', async () => {
		const client = new Eik({
			development: true,
			base: "http://localhost:7777/prefix/",
			path: fixture,
		});
		await client.load();

		const resolved = client.file("/some/path/foo.js");

		assert.strictEqual(
			resolved.value,
			"http://localhost:7777/prefix/some/path/foo.js",
		);
	});

	test("Client - Load maps", async () => {
		const client = new Eik({
			loadMaps: true,
			path: fixture,
		});
		await client.load();

		const maps = client.maps();
		assert.deepStrictEqual(
			maps,
			[
				{ imports: { eik: "/src/eik.js" } },
				{ imports: { eik: "/src/eik.js" } },
			],
			"Should return maps",
		);

		const combined = maps.reduce((map, acc) => ({ ...acc, ...map }), {});

		assert.deepStrictEqual(combined, { imports: { eik: "/src/eik.js" } });

		const html = `<script type="importmap">
${JSON.stringify(combined, null, 2)}
</script>`;

		assert.deepStrictEqual(
			html,
			`<script type="importmap">
{
  "imports": {
    "eik": "/src/eik.js"
  }
}
</script>`,
		);
	});

	test('Client - Retrieve a base - Development mode is set to "true" - Base is unset', async () => {
		const client = new Eik({
			development: true,
			path: fixture,
		});
		await client.load();

		const resolved = client.base();

		assert.strictEqual(resolved, "", "Should be an empty string");
	});

	test('Client - Retrieve a base - Development mode is set to "true" - Base is set to a relative URL', async () => {
		const client = new Eik({
			development: true,
			base: "/prefix",
			path: fixture,
		});
		await client.load();

		const resolved = client.base();

		assert.strictEqual(resolved, "/prefix");
	});

	test('Client - Retrieve a base - Development mode is set to "true" - Base is set to a absolute URL', async () => {
		const client = new Eik({
			development: true,
			base: "http://localhost:7777/prefix/some/path/",
			path: fixture,
		});
		await client.load();

		const resolved = client.base();

		assert.strictEqual(resolved, "http://localhost:7777/prefix/some/path");
	});

	test('Client - Retrieve a base - Development mode is set to "false"', async () => {
		const client = new Eik({
			path: fixture,
		});
		await client.load();

		const resolved = client.base();

		assert.strictEqual(resolved, `${address}/pkg/eik-fixture/1.0.2`);
	});

	test("Client - toHTML - import maps merged and script tag created", async () => {
		const client = new Eik({
			loadMaps: true,
			path: fixture,
		});
		await client.load();

		const resolved = client.toHTML();

		assert.deepStrictEqual(
			resolved,
			`<script type="importmap">${JSON.stringify({ imports: { eik: "/src/eik.js" } })}</script>`,
			"Should return an import map script tag",
		);
	});
});

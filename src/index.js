import { helpers } from "@eik/common";
import { request } from "undici";
import { join } from "path";
import { Asset } from "./asset.js";

const trimSlash = (value = "") => {
	if (value.endsWith("/")) return value.substring(0, value.length - 1);
	return value;
};

const fetchImportMaps = async (urls = []) => {
	try {
		const maps = urls.map(async (map) => {
			const { statusCode, body } = await request(map, {
				maxRedirections: 2,
			});

			if (statusCode === 404) {
				throw new Error("Import map could not be found on server");
			} else if (statusCode >= 400 && statusCode < 500) {
				throw new Error("Server rejected client request");
			} else if (statusCode >= 500) {
				throw new Error("Server error");
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

/**
 * @typedef {object} Options
 * @property {string} [base=null]
 * @property {boolean} [development=false]
 * @property {boolean} [loadMaps=false]
 * @property {string} [path=process.cwd()]
 */

/**
 * @typedef {object} ImportMap
 * @property {Record<string, string>} imports
 */

/**
 * An Eik utility for servers running on Node. With it you can:
 *  - generate different URLs to assets on an Eik server depending on environment (development vs production).
 *  - get the import maps you have configured in `eik.json` from the Eik server, should you want to use them in the HTML response.
 *
 * @example
 * ```js
 * // Create an instance, then load information from `eik.json` and the Eik server
 * import Eik from "@eik/node-client";
 *
 * const eik = new Eik();
 * await eik.load();
 * ```
 * @example
 * ```js
 * // Serve a local version of a file from `./public`
 * // in development and from Eik in production
 * import path from "node:path";
 * import Eik from "@eik/node-client";
 * import fastifyStatic from "@fastify/static";
 * import fastify from "fastify";
 *
 * const app = fastify();
 * app.register(fastifyStatic, {
 *    root: path.join(process.cwd(), "public"),
 *    prefix: "/public/",
 * });
 *
 * const eik = new Eik({
 *    development: process.env.NODE_ENV === "development",
 *    base: "/public",
 * });
 *
 * // load information from `eik.json` and the Eik server
 * await eik.load();
 *
 * // when development is true script.value will be /public/script.js.
 * // when development is false script.value will be
 * // https://{server}/pkg/{name}/{version}/script.js
 * // where {server}, {name} and {version} are read from eik.json
 * const script = eik.file("/script.js");
 *
 * app.get("/", (req, reply) => {
 *    reply.type("text/html; charset=utf-8");
 *    reply.send(`<html><body>
 *      <script
 *        src="${script.value}"
 *        ${script.integrity ? `integrity="${script.integrity}"` : ""}
 *        type="module"></script>
 *    </body></html>`);
 * });
 *
 * app.listen({
 *    port: 3000,
 * });
 *
 * console.log("Listening on http://localhost:3000");
 * ```
 */
export default class Eik {
	#development;
	#loadMaps;
	#config;
	#path;
	#base;
	#maps;

	/**
	 * @param {Options} options
	 */
	constructor({
		development = false,
		loadMaps = false,
		base = "",
		path = process.cwd(),
	} = {}) {
		this.#development = development;
		this.#loadMaps = loadMaps;
		this.#config = {};
		this.#path = path;
		this.#base = trimSlash(base);
		this.#maps = [];
	}

	/**
	 * Reads the Eik config from disk into the object instance, used for building {@link file} links in production.
	 *
	 * If {@link Options.loadMaps} is `true` the import maps
	 * defined in the Eik config will be fetched from the Eik server for
	 * use in {@link maps}.
	 */
	async load() {
		this.#config = await helpers.getDefaults(this.#path);
		if (this.#loadMaps) {
			this.#maps = await fetchImportMaps(this.#config.map);
		}
	}

	/**
	 * The `"name"` field from the Eik config
	 * @throws if read before calling {@link load}
	 */
	get name() {
		if (this.#config.name) return this.#config.name;
		throw new Error("Eik config was not loaded before calling .name");
	}

	/**
	 * The `"version"` field from the Eik config
	 * @throws if read before calling {@link load}
	 */
	get version() {
		if (this.#config.version) return this.#config.version;
		throw new Error("Eik config was not loaded before calling .version");
	}

	/**
	 * The `"type"` field from the Eik config mapped to its URL equivalent (eg. "package" is "pkg").
	 * @throws if read before calling {@link load}
	 */
	get type() {
		if (this.#config.type && this.#config.type === "package") return "pkg";
		if (this.#config.type) return this.#config.type;
		throw new Error("Eik config was not loaded before calling .type");
	}

	/**
	 * The `"server"` field from the Eik config
	 * @throws if read before calling {@link load}
	 */
	get server() {
		if (this.#config.server) return this.#config.server;
		throw new Error("Eik config was not loaded before calling .server");
	}

	/**
	 * The pathname to the base on Eik (ex. /pkg/my-app/1.0.0/)
	 * @throws if read before calling {@link load}
	 */
	get pathname() {
		if (this.#config.type && this.#config.name && this.#config.version)
			return join("/", this.type, this.name, this.version).replace(/\\/g, "/");
		throw new Error("Eik config was not loaded before calling .pathname");
	}

	/**
	 * Similar to {@link file}, this method returns a path to the base on Eik
	 * (ex. https://eik.store.com/pkg/my-app/1.0.0), or {@link Options.base}
	 * if {@link Options.development} is true.
	 *
	 * You can use this instead of `file` if you have a directory full of files
	 * and you don't need {@link Asset.integrity}.
	 *
	 * @returns {string} The base path for assets published on Eik
	 * @throws when {@link Options.development} is false if called before calling {@link load}
	 */
	base() {
		if (this.#development) return this.#base;
		return `${this.server}${this.pathname}`;
	}

	/**
	 * Get a link to a file that is published on Eik when running in production.
	 * When {@link Options.development} is `true` the pathname is prefixed
	 * with the {@link Options.base} option instead of pointing to Eik.
	 *
	 * @param {string} pathname pathname to the file relative to the base on Eik (ex: /path/to/script.js for a prod URL https://eik.store.com/pkg/my-app/1.0.0/path/to/script.js)
	 * @returns {import('./asset.js').Asset}
	 * @throws when {@link Options.development} is false if called before calling {@link load}
	 *
	 * @example
	 * ```js
	 * // in production
	 * const eik = new Eik({
	 *   development: false,
	 * });
	 * await eik.load();
	 *
	 * const file = eik.file("/path/to/script.js");
	 * // {
	 * //   value: https://eik.store.com/pkg/my-app/1.0.0/path/to/script.js
	 * //   integrity: sha512-zHQjnD-etc.
	 * // }
	 * // where the server URL, app name and version are read from eik.json
	 * // {
	 * //   "name": "my-app",
	 * //   "version": "1.0.0",
	 * //   "server": "https://eik.store.com",
	 * // }
	 * ```
	 * @example
	 * ```js
	 * // in development
	 * const eik = new Eik({
	 *   development: true,
	 *   base: "/public",
	 * });
	 * await eik.load();
	 *
	 * const file = eik.file("/path/to/script.js");
	 * // {
	 * //   value: /public/path/to/script.js
	 * //   integrity: undefined
	 * // }
	 * ```
	 */
	file(pathname = "") {
		const base = this.base();
		return new Asset({
			value: `${base}${pathname}`,
		});
	}

	/**
	 * When {@link Options.loadMaps} is `true` and you call {@link load}, the client
	 * fetches the configured import maps from the Eik server.
	 *
	 * This method returns the import maps that were fetched during `load`.
	 *
	 * @returns {ImportMap[]}
	 * @throws if {@link Options.loadMaps} is not `true` or called before calling {@link load}
	 *
	 * @example
	 * ```js
	 * // generate a <script type="importmap">
	 * // for import mapping in the browser
	 * const client = new Eik({
	 *   loadMaps: true,
	 * });
	 * await client.load();
	 *
	 * const maps = client.maps();
	 * const combined = maps
	 *   .map((map) => map.imports)
	 *   .reduce((map, acc) => ({ ...acc, ...map }), {});
	 *
	 * const html = `
	 * <script type="importmap">
	 * ${JSON.stringify(combined, null, 2)}
	 * </script>
	 * `;
	 * ```
	 */
	maps() {
		if (this.#config.version && this.#loadMaps) return this.#maps;
		throw new Error(
			'Eik config was not loaded or "loadMaps" is "false" when calling .maps()',
		);
	}

	/**
	 * Function that generates and returns an import map script tag for use in an document head.
	 *
	 * Only a single import map is allowed per HTML document.
	 * A key (ex. `react`) can only be defined once.
	 * If multiple import maps defined in `eik.json` use the same key the last one wins.
	 *
	 * @example
	 * ```
	 * const importMap = eik.toHTML();
	 *
	 * <head>
	 *   ...
	 *   ${importMap}
	 *   ...
	 * </head>
	 * ```
	 *
	 * @returns {string}
	 */
	toHTML() {
		const allImportMapKeyValuePairs = this.maps().flatMap((map) =>
			Object.entries(map.imports),
		);
		const mergedAndDedupedImportMapObject = Object.fromEntries(
			new Map(allImportMapKeyValuePairs).entries(),
		);
		return `<script type="importmap">${JSON.stringify({
			imports: mergedAndDedupedImportMapObject,
		})}</script>`;
	}
}

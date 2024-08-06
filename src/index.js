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
 * //  Serve a local version of a file from `./public` in development and from Eik in production
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
 * // when development is false script.value will be https://{server}/pkg/{name}/{version}/script.js
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

	async load() {
		this.#config = await helpers.getDefaults(this.#path);
		if (this.#loadMaps) {
			this.#maps = await fetchImportMaps(this.#config.map);
		}
	}

	get name() {
		if (this.#config.name) return this.#config.name;
		throw new Error("Eik config was not loaded before calling .name");
	}

	get version() {
		if (this.#config.version) return this.#config.version;
		throw new Error("Eik config was not loaded before calling .version");
	}

	get type() {
		if (this.#config.type && this.#config.type === "package") return "pkg";
		if (this.#config.type) return this.#config.type;
		throw new Error("Eik config was not loaded before calling .type");
	}

	get server() {
		if (this.#config.server) return this.#config.server;
		throw new Error("Eik config was not loaded before calling .server");
	}

	get pathname() {
		if (this.#config.type && this.#config.name && this.#config.version)
			return join("/", this.type, this.name, this.version);
		throw new Error("Eik config was not loaded before calling .pathname");
	}

	base() {
		if (this.#development) return this.#base;
		return `${this.server}${this.pathname}`;
	}

	/**
	 * Get a link to a file that is published on Eik when running in production.
	 * When `development` is true, the pathname is prefixed with the `base` option.
	 * You can use this feature to serve a local version when developing.
	 *
	 * @param {string} pathname pathname to the file relative to the root on Eik (ex: /path/to/script.js for a prod URL https://eik.store.com/pkg/my-app/1.0.0/path/to/script.js)
	 * @returns {import('./asset.js').Asset}
	 */
	file(pathname = "") {
		const base = this.base();
		return new Asset({
			value: `${base}${pathname}`,
		});
	}

	maps() {
		if (this.#config.version && this.#loadMaps) return this.#maps;
		throw new Error(
			'Eik config was not loaded or "loadMaps" is "false" when calling .maps()',
		);
	}
}

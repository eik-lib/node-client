# @eik/node-client

This is a utility for getting assets and import maps from [Eik servers](https://github.com/eik-lib/service#readme) in Node web applications. For publishing and managing assets to an Eik server from Node scripts, see [`@eik/cli`](https://github.com/eik-lib/cli#readme).

## Install

```sh
npm install @eik/node-client
```

## Usage

The most common use case for this module is linking to a file. When developing you typically want to use a local version of the file, then link to the published version on Eik when running in production.

For that you use the [`file()` method](#filepathname), which returns an object `{ value, integrity }` where `value` is the link to the file.

When running in production the link will point to the file on Eik. When `development` is `true` the pathname is prefixed with the `base` option instead of pointing to Eik, so your app can use a local version.

```js
// Serve a local version of a file from `./public`
// in development and from Eik in production
import path from "node:path";
import Eik from "@eik/node-client";
import fastifyStatic from "@fastify/static";
import fastify from "fastify";

const app = fastify();

// Serve the contents of the ./public folder on the path /public
app.register(fastifyStatic, {
	root: path.join(process.cwd(), "public"),
	prefix: "/public/",
});

const eik = new Eik({
	development: process.env.NODE_ENV === "development",
	// base is only used when `development` is `true`
   base: "/public",
});

// load information from `eik.json` and the Eik server
await eik.load();

// when development is true script.value will be /public/script.js
// when development is false script.value will be
// https://{server}/pkg/{name}/{version}/script.js
// where {server}, {name} and {version} are read from eik.json
const script = eik.file("/script.js");

app.get("/", (req, reply) => {
	reply.type("text/html; charset=utf-8");
	reply.send(`
<html>
	<body>
		<script
      	src="${script.value}"
			${script.integrity ? `integrity="${script.integrity}"` : }
			type="module"
      ></script>
	</body>
</html>`);
});

app.listen({
	port: 3000,
});

console.log("Listening on http://localhost:3000");
```

### Include a `<script type="importmap">`

This module can also download the import maps defined in Eik config so you can include them in your HTML responses.

```js
const client = new Eik({
	loadMaps: true,
});
await client.load();

const maps = client.maps();
const combined = maps.reduce((map, acc) => ({ ...acc, ...map }), {});

const html = `
<script type="importmap">
${JSON.stringify(combined, null, 2)}
</script>
`;
```

## Constructor

Use the default export to create a new instance.

You must call `load` before using the instance so it can read from `eik.json` and your Eik server.

```js
import Eik from "@eik/node-client";

const eik = new Eik();
await eik.load();
```

### options

| option      | default         | type      | required | details                                                                                                     |
| ----------- | --------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| base        | `null`          | `string`  | `false`  | Base root to be used for returned asset files.                                                              |
| isLocalhost | `false`         | `boolean` | `false`  | Determines whether the client produces links to localhost (f. ex. during development) or to the Eik server. |
| development | `false`         | `boolean` | `false`  | (deprecated) Same as isLocalhost                                                                            |
| loadMaps    | `false`         | `boolean` | `false`  | Specifies whether import maps defined in the config should be loaded from the Eik server or not.            |
| path        | `process.cwd()` | `string`  | `false`  | Path to directory containing an eik.json file or package.json with eik config.                              |

## API

### async .load()

Reads the Eik config from disk into the object instance.

If `loadMaps` was set to `true` the import maps defined in the config will be fetched from the Eik server.

### .file(pathname)

Get a link to a file that will differ based on environment (development vs production).

When running in production the returned link will point to the file on Eik.

```js
// in production
const eik = new Eik({
	development: false,
});
await eik.load();

const file = eik.file("/path/to/script.js");
// {
//   value: https://eik.store.com/pkg/my-app/1.0.0/path/to/script.js
//   integrity: sha512-zHQjnD-etc.
// }
// where the server URL, app name and version are read from eik.json
// {
//   "name": "my-app",
//   "version": "1.0.0",
//   "server": "https://eik.store.com",
// }
```

When `development` is `true` the pathname is prefixed with the `base` option instead of pointing to Eik.

```js
// in development
const eik = new Eik({
	development: true,
	base: "/public",
});
await eik.load();

const file = eik.file("/path/to/script.js");
// {
//   value: /public/path/to/script.js
//   integrity: undefined
// }
```

#### arguments

| option   | default | type     | details                                                                                                                                   |
| -------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| pathname | `null`  | `string` | Pathname relative to the base on Eik (ex: `/path/to/script.js` for a prod URL `https://eik.store.com/pkg/my-app/1.0.0/path/to/script.js`) |

#### returns

Returns an object with `value` and `integrity`:

```js
{
  integrity: 'sha512-zHQjnDpMW7IKVyTpT9cOPT1+xhUSOcbgXj6qHCPSPu1CbQfgwDEsIniXU54zDIN71zqmxLSp3hfIljpt69ok0w==',
  value: 'https://eik.store.com/pkg/my-app/1.0.0/path/to/script.js'
}
```

`integrity` is `undefined` if `development` is `true`:

```js
{
  integrity: undefined,
  value: '/public/path/to/script.js'
}
```

### .maps()

When `loadMaps` is `true` and you call `load`, the client fetches the configured import maps from the Eik server.

This method returns the import maps that were fetched during `load`.

```js
const client = new Eik({
	loadMaps: true,
});
await client.load();

const maps = client.maps();
```

#### returns

A list of Eik import maps.

```json
[
	{
		"imports": {
			"date-fns": "https://eik.store.com/npm/date-fns/v3/index.js",
			"lodash": "https://eik.store.com/npm/lodash/v4/index.js"
		}
	},
	{
		"imports": {
			"lit": "https://eik.store.com/npm/lit/v3/index.js"
		}
	}
]
```

### .base()

Constructs a URL to the base of a package of assets. The returned value will differ depending on if development mode is set to true or not.

When in non development mode, the returned value will be built up by the values found in the loaded Eik config and provide a URL to where the files can be expected to be on the Eik server.

```js
const client = new Eik({
	development: false,
	base: "http://localhost:8080/assets",
});
await client.load();

client.base(); // https://cdn.eik.dev/pkg/mymodue/2.4.1
```

When in development mode, the returned value will be equal to whats set on the `base` argument on the constructor.

```js
const client = new Eik({
	development: true,
	base: "http://localhost:8080/assets",
});
await client.load();

client.base(); // http://localhost:8080/assets
```

### .toHTML()

Constructs an HTML import map script tag for use in the document head when doing import mapping.

```js
const client = new Eik({
	loadMaps: true,
	...
});
await client.load();

const html = `
	<html>
	<head>
		...
		${client.toHTML()}
		...
	</head>
	<body>
		...
	</body>
	</html>
`;
```

Due to browsers being restricted to a single import map, all import maps registered in eik.json or package.json will be merged down into a single import map with last in winning in case of duplicate keys.

## License

Copyright (c) 2021 FINN.no

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

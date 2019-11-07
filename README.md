# Asset Pipe Node Client

The Asset Pipe Node.js client facilitates switching between local and production assets in Node.js apps based on values
provided by an `assets.json` metafile.

## Install

```sh
npm install @asset-pipe/node-client
```

## Basic usage

### include the client in your node apps

```js
const Client = require('@asset-pipe/node-client');
```

### in production mode the client will build an object pointing to production assets

The client will read your local `assets.json` file and build a object based on the values found therein.

```js
const client = new Client();

// client.js will be an object of the form:
/* 
[
    { type: 'module', value: 'http://<asset server>/finn/js/my-app/1.0.0/main/index.js' },
    { type: 'iife', value: 'http://<asset server>/finn/js/my-app/1.0.0/ie11/index.js' },
]
*/

// client.css will be an object of the form:
/*
[
    { type: 'text/css', value: 'http://<asset server>/finn/css/my-app/1.0.0/index.css' }
]
*/
```

In both cases, each object in the array also has a `toHTML()` method that can be used to render out the appropriate HTML tag
for the object.

```js
const client = new Client();

client.js[0].toHTML();
// <script type="module" src="http://<asset server>/finn/js/my-app/1.0.0/main/index.js"><script>

client.js[1].toHTML();
// <script src="http://<asset server>/finn/js/my-app/1.0.0/ie11/index.js"><script>

client.css[0].toHTML();
// <link rel="stylesheet" type="text/css" href="http://<asset server>/finn/js/my-app/1.0.0/main/index.css">
```

### in development mode the client will build an object pointing to development assets provided

```js
const client = new Client({ js: '/assets/scripts.js', css: '/assets/styles.css' development: true });

// client.js will be an array of the form [{ type: 'module', value: '/assets/script.js' }]
// client.css will be an array of the form [{ type: 'text/css', value: '/assets/styles.css' }]
```

It's up to you to make sure that these assets are available to the app.
In an express app you might use `express-static` to serve the assets with your app

_Example: Express app using express-static_

```js
app.use('/assets', express.static('assets'));

const client = new Client({
    js: '/assets/scripts.js',
    css: '/assets/styles.css'
    development: true
});
```

Or you might use webpack or some other bundling system that can also serve the assets in development mode for you
(remembering to set appropriate CORS headers)

_Example: Setup when using Webpack dev server_

```js
const client = new Client({
    js: 'http://localhost:8080/scripts.bundle.js',
    development: true
});
```

Or you might just use an HTTP server to serve your files on a port such as `4000`. (remembering to set appropriate CORS headers)

_Example: Setup when using a standalone web server_

```js
const client = new Client({
    js: 'http://localhost:4000/assets/scripts.js',
    css: 'http://localhost:4000/assets/styles.css'
    development: true
});
```

## API

### Client

```js
new Client(opts);
```

Creates a new instance of the client. Created instance have the accessor properties `.js` and `.css` as described below.

#### opts

| name        | description                                                                                                                            | type            | default         | required |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------- | -------- |
| development | switches the client between development and non development modes                                                                      | `boolean`       | `false`         | `false`  |
| path        | modifies the default path to the `assets.json` meta file                                                                               | `string`        | `./assets.json` | `false`  |
| js          | URL or path to location of JavaScript assets to be used in development mode. An object can also be passed for additional configuration | `string|object` |                 | `false`  |
| css         | URL or path to location of CSS assets to be used in development mode. An object can also be passed for additional configuration        | `string|object` |                 | `false`  |

_Example_

```js
const client = new Client({
    path: './some/other/assets.json',
    development: true,
    js: '/assets/scripts.js',
    css: '/assets/styles.css'
});
```

_Example_

```js
const client = new Client({
    development: true,
    js: { value: '/assets/scripts.js', type: 'module', async: true },
    css: { value: '/assets/styles.css', type: 'text/css' }
});
```

### client.js

Returns an array of JavaScript asset objects for the given mode (development or non development) based on values in `assets.json`
As asset object can be serialized using `JSON.stringify` or converted into an HTML script tag using the method `.toHTML()`

_Examples_

```js
client.js; // [{ type: 'module', value: 'http://<asset server>/finn/js/my-app/1.0.0/index.js' }]
```

```js
client.js[0].toHTML(); // <script type="module" src="http://<asset server>/finn/js/my-app/1.0.0/index.js">
```

### client.css

Returns an array of CSS asset objects for the given mode (development or non development) based on values in `assets.json`
As asset object can be serialized using `JSON.stringify` or converted into an HTML link tag using the method `.toHTML()`

_Example_

```js
client.css; // [{ type: 'default', value: 'http://<asset server>/finn/css/my-app/1.0.0/index.css' }]
```

```js
client.css[0].toHTML(); // <link type="text/stylesheet" rel="stylesheet" href="http://<asset server>/finn/css/my-app/1.0.0/index.css">
```

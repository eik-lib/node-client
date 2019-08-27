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

### in development mode the client will build an object pointing to development assets

```js
const client = new Client({ development: true });

// client.js will be an array of the form [{ type: 'esm', value: 'http://<localhost>:<port>/assets/script.js' }]
// client.css will be an array of the form [{ type: 'default', value: 'http://<localhost>:<port>/assets/styles.css' }]
```

### in production mode the client will build an object pointing to production assets

The client will read your local `assets.json` file and build a object based on the values found therein.

```js
const client = new Client({ development: false });

// client.js will be an object of the form [{ type: 'esm', value: 'http://<asset server>/finn/js/my-app/1.0.0/index.js' }]
// client.css will be an object of the form [{ type: 'default', value: 'http://<asset server>/finn/css/my-app/1.0.0/index.css' }]
```

## API

### Client

```js
new Client(opts);
```

Creates a new instance of the client. Created instance have the accessor properties `.js` and `.css` as described below.

#### opts

| name        | description                                                       | type    | default         | required |
| ----------- | ----------------------------------------------------------------- | ------- | --------------- | -------- |
| development | switches the client between development and non development modes | boolean | false           | false    |
| path        | modifies the default path to the `assets.json` meta file          | string  | `./assets.json` | false    |

Example

```js
const client = new Client({
    path: './some/other/assets.json',
    development: true,
});
```

### instance.js

Returns an array of JavaScript asset objects for the given mode (development or non development) based on values in `assets.json`

_Example_

```js
client.js; // [{ type: 'esm', value: 'http://<asset server>/finn/js/my-app/1.0.0/index.js' }]
```

### instance.css

Returns an array of CSS asset objects for the given mode (development or non development) based on values in `assets.json`

_Example_

```js
client.css; // [{ type: 'default', value: 'http://<asset server>/finn/css/my-app/1.0.0/index.css' }]
```

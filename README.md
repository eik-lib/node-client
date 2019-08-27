# Asset Pipe Node Client

## Install

```sh
npm install @asset-pipe/node-client
```

## Basic usage

### include the client

```js
const AssetPipe = require('@asset-pipe/node-client');
```

### in development mode the client will build an object pointing to development assets

```js
const client = new AssetPipe({
    js: '/assets/script.js',
    css: '/assets/styles.css',
    development: true,
});

// client.js will be an object of the form { type: 'esm', value: 'http://<localhost>:<port>/assets/script.js' }
// client.css will be an object of the form { type: 'default', value: 'http://<localhost>:<port>/assets/styles.css' }
```

### in production mode the client will build an object pointing to production assets

The client will read your local `assets.json` file and build a object based on the values found therein.

```js
const client = new AssetPipe({
    js: '/assets/script.js',
    css: '/assets/styles.css',
    development: false,
});

// client.js will be an object of the form { type: 'esm', value: 'http://<asset server>/finn/js/my-app/1.0.0/index.js' }
// client.css will be an object of the form { type: 'default', value: 'http://<asset server>/finn/css/my-app/1.0.0/index.css' }
```

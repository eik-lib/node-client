# @eik/node-client

The Eik Node.js client facilitates loading Eik config and providing URLs to assets on an Eik server or in local development plus loading import maps from the Eik server.

## Install

```sh
npm install @eik/node-client
```

## Basic usage

```js
import EikNodeClient from '@eik/node-client';

const client = new EikNodeClient({
    development: false,
    base: '/public'
});

await client.load({
    maps: true,
});

client.file('/a-script-file.js')
client.maps()
```

## Description

This module will load Eik config from either an `eik.json` file or from values set in `package.json` and then use these values to provide absolute URLs to assets on a Eik server. In addition to this it's possible to set a `base` URL which will be used as the "base root" for files when this module is set in development mode. This makes it easy to retrieve absolute URLs to assets on a Eik server when an application is running in production but also get URLs to the same assets when in development.

In addition this module can also download the import maps defined in Eik config and provide these for inclusion in an application.

The following will use the information in Eik config and provide an absolute URL to a file on an Eik server:

```js
import EikNodeClient from '@eik/node-client';

const client = new EikNodeClient({
    development: false,
    base: 'http://localhost:8080/public'        
});

await client.load();

// Will, for example, output: https://cdn.eik.dev/pkg/mymodue/2.4.1/path/script.js
client.file('/path/script.js')
```

The following is the same as above but in development mode. The output will then be based on the vaule set for `base`:

```js
import EikNodeClient from '@eik/node-client';

const client = new EikNodeClient({
    development: true,
    base: 'http://localhost:8080/public'        
});

await client.load();

// Will output: http://localhost:8080/public/path/script.js
client.file('/path/script.js')
```

## Constructor

Create a new client instance.

```js
const client = new EikNodeClient(options);
```

### options

| option      | default         | type      | required | details                                                                       |
| ----------- | --------------- | --------- | -------- | ----------------------------------------------------------------------------- |
| path        | `process.cwd()` | `string`  | `false`  | Path to directory containing an eik.json file or package.json with eik config. |
| base        | `null`          | `string`  | `false`  | Base root to be used for returned asset files.                                |
| development | `false`         | `boolean` | `false`  | Set the module in development mode or not.                                    |

#### path

Path to directory containing a eik.json file or package.json with eik config.

#### base

Base root to be used for returned asset files. Can be either an absolute URL or relative URL. Will only be applied when the module is in development mode.

#### development

Set the module in development mode or not.

## API

This module has the following API

### async .load(options)

Loads Eik config, and the configs import maps if set to, into the module. Once loaded both the config and import maps will be cached in the module.

#### options

| option      | default         | type       | required | details                                                                          |
| ----------- | --------------- | ---------- | -------- | -------------------------------------------------------------------------------- |
| maps        | `false`         | `boolean`  | `false`  | I import maps defined in the config should be loaded from the Eik server or not. |


### .files(file)

Constructs a full URL to an asset. The URL is build up by appending the vaule of the `file` argument to a base root. By default (production mode) the base root is built up from the values in the Eik config matching where the package for the config are located on the Eik server. If the module are in development mode, the value set for `base` on the construcor will be used as the base root.

#### arguments

| option      | default         | type       | required | details                                                                          |
| ----------- | --------------- | ---------- | -------- | -------------------------------------------------------------------------------- |
| file        | `null`          | `string`   | `false`  | File to append to the base of a full URL to an asset                             |


### .maps()

Returns the image maps defined in the Eik config from the Eik server. For the maps to be returned they need to be loaded from the Eik server. This is done by setting the `maps` option on the `.load()` method to `true`.

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

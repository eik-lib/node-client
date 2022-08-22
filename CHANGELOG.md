# [2.0.0-next.4](https://github.com/eik-lib/node-client/compare/v2.0.0-next.3...v2.0.0-next.4) (2022-08-22)


### Features

* Remove support for CJS. ESM only ([#106](https://github.com/eik-lib/node-client/issues/106)) ([d74f8c8](https://github.com/eik-lib/node-client/commit/d74f8c8266b67119d8d110524533a0bd7ce19e7d))


### BREAKING CHANGES

* This PR removes the support for CJS in this module. This module is now ESM only.

* feat: Remove CJS support. ESM only.
* Support for CJS is now removed in this module. It is ESM only.

* ci: use 0.0.0.0 instead of localhost

* fix: remove console.log() statement

Co-authored-by: Trygve Lie <trygve.lie@finn.no>

# [2.0.0-next.3](https://github.com/eik-lib/node-client/compare/v2.0.0-next.2...v2.0.0-next.3) (2022-08-18)


### Bug Fixes

* **deps:** update dependency undici to v5.8.2 ([652c0af](https://github.com/eik-lib/node-client/commit/652c0af76d4eff970ba8954d8f287703c30acd73))

# [2.0.0-next.2](https://github.com/eik-lib/node-client/compare/v2.0.0-next.1...v2.0.0-next.2) (2022-08-18)


### Features

* Use the new @eik/common-config-loader module ([#104](https://github.com/eik-lib/node-client/issues/104)) ([5de927c](https://github.com/eik-lib/node-client/commit/5de927ca74c461be8d6bbd0048a2afc6812cb085))

# [2.0.0-next.1](https://github.com/eik-lib/node-client/compare/v1.1.28...v2.0.0-next.1) (2022-08-08)


### Bug Fixes

* Add CommonJS support ([b634537](https://github.com/eik-lib/node-client/commit/b6345378236d1bf60dc1ff6ceee1a285ca335e7f))
* Do not use getters and setters on public data object ([0505dcb](https://github.com/eik-lib/node-client/commit/0505dcb25b2563b826d5806fc30a7d148c111c00))
* Make default value of integrity to be undefined ([a679f73](https://github.com/eik-lib/node-client/commit/a679f733351413e5e59cbd0f71c86fef8a08042c))


### chore

* Rename module to @eik/node-client ([f3d8c73](https://github.com/eik-lib/node-client/commit/f3d8c7325b90b345a79df731544f53ebb11c81bf))


### Features

* Make .file() return an object ([f53f15d](https://github.com/eik-lib/node-client/commit/f53f15dae288fda4b4527a3b4c69bab2e56f5169))
* Rework module to suite current functionality of Eik ([559294c](https://github.com/eik-lib/node-client/commit/559294cc8d1bd793873ba02000da6376312e0160))


### BREAKING CHANGES

* Rename module to @eik/node-client
* API is reworked to suite the current functionality of Eik

## [1.1.28](https://github.com/eik-lib/node-client/compare/v1.1.27...v1.1.28) (2022-08-08)


### Bug Fixes

* **deps:** update dependency undici to v5.8.1 ([79704d7](https://github.com/eik-lib/node-client/commit/79704d70978b247a794d9b38bbc3c35181907c1c))

## [1.1.27](https://github.com/eik-lib/node-client/compare/v1.1.26...v1.1.27) (2022-07-22)


### Bug Fixes

* **deps:** update dependency undici to v5.8.0 [security] ([d56c337](https://github.com/eik-lib/node-client/commit/d56c3379d8b7015745da84389dd8f1c84f94af3c))

## [1.1.26](https://github.com/eik-lib/node-client/compare/v1.1.25...v1.1.26) (2022-07-18)


### Bug Fixes

* **deps:** update dependency undici to v5.7.0 ([6d79978](https://github.com/eik-lib/node-client/commit/6d79978ce972f3c35e969e29170870fb16040f56))

## [1.1.25](https://github.com/eik-lib/node-client/compare/v1.1.24...v1.1.25) (2022-07-11)


### Bug Fixes

* **deps:** update dependency undici to v5.6.1 ([de16ab8](https://github.com/eik-lib/node-client/commit/de16ab83d812733996b669a3e53daa5448841caa))

## [1.1.24](https://github.com/eik-lib/node-client/compare/v1.1.23...v1.1.24) (2022-07-04)


### Bug Fixes

* **deps:** update dependency undici to v5.6.0 ([a9d3712](https://github.com/eik-lib/node-client/commit/a9d3712345684be37da3d77d4abe72b91562ca26))

## [1.1.23](https://github.com/eik-lib/node-client/compare/v1.1.22...v1.1.23) (2022-06-17)


### Bug Fixes

* **deps:** update dependency undici to v5.5.1 [security] ([f3b63c1](https://github.com/eik-lib/node-client/commit/f3b63c1d876baa2f3d2c3be0362a0c3ecf9f8de6))

## [1.1.22](https://github.com/eik-lib/node-client/compare/v1.1.21...v1.1.22) (2022-06-06)


### Bug Fixes

* **deps:** update dependency undici to v5.4.0 ([63198d0](https://github.com/eik-lib/node-client/commit/63198d0c34692e54c6e62de2edfd63e8d2910246))

## [1.1.21](https://github.com/eik-lib/node-client/compare/v1.1.20...v1.1.21) (2022-05-30)


### Bug Fixes

* **deps:** update dependency undici to v5.3.0 ([30342cd](https://github.com/eik-lib/node-client/commit/30342cd2fc9435c6707ca48010800996c0704c87))

## [1.1.20](https://github.com/eik-lib/node-client/compare/v1.1.19...v1.1.20) (2022-05-23)


### Bug Fixes

* **deps:** update dependency undici to v5.2.0 ([323b028](https://github.com/eik-lib/node-client/commit/323b02812cecf17ea38e2b16de8aec6e680d2fd8))

## [1.1.19](https://github.com/eik-lib/node-client/compare/v1.1.18...v1.1.19) (2022-05-09)


### Bug Fixes

* **deps:** update dependency @eik/common to v3.0.1 ([a8da873](https://github.com/eik-lib/node-client/commit/a8da873abb430ec2faf6342f02745f7a2f36fb5f))

## [1.1.18](https://github.com/eik-lib/node-client/compare/v1.1.17...v1.1.18) (2022-05-04)


### Bug Fixes

* **deps:** update dependency undici to v5 ([#82](https://github.com/eik-lib/node-client/issues/82)) ([aee352b](https://github.com/eik-lib/node-client/commit/aee352b4a1fa8ae2f03d12b59650a062a0352708))

## [1.1.17](https://github.com/eik-lib/node-client/compare/v1.1.16...v1.1.17) (2022-03-21)


### Bug Fixes

* **deps:** update dependency undici to v4.16.0 ([2802b21](https://github.com/eik-lib/node-client/commit/2802b218755421968e77314748e147e99dd1acce))

## [1.1.16](https://github.com/eik-lib/node-client/compare/v1.1.15...v1.1.16) (2022-03-14)


### Bug Fixes

* **deps:** update dependency undici to v4.15.1 ([87c3cf4](https://github.com/eik-lib/node-client/commit/87c3cf4c7beda939f86d949c10e1a54fee027bae))

## [1.1.15](https://github.com/eik-lib/node-client/compare/v1.1.14...v1.1.15) (2022-03-07)


### Bug Fixes

* **deps:** update dependency undici to v4.15.0 ([78c36e2](https://github.com/eik-lib/node-client/commit/78c36e2aaf1aed15b4f859efde33cb2d1b728a16))

## [1.1.14](https://github.com/eik-lib/node-client/compare/v1.1.13...v1.1.14) (2022-02-14)


### Bug Fixes

* **deps:** update dependency undici to v4.14.1 ([31f9871](https://github.com/eik-lib/node-client/commit/31f9871e047bf45c00c8d7723ed8f22a63b45a13))

## [1.1.13](https://github.com/eik-lib/node-client/compare/v1.1.12...v1.1.13) (2022-01-30)


### Bug Fixes

* **deps:** update dependency undici to v4.13.0 ([78c0429](https://github.com/eik-lib/node-client/commit/78c04298b94a82d8eccfbb77f5a7f25c7db29e54))

## [1.1.12](https://github.com/eik-lib/node-client/compare/v1.1.11...v1.1.12) (2022-01-13)


### Bug Fixes

* **deps:** update dependency undici to v4.12.2 ([253bb83](https://github.com/eik-lib/node-client/commit/253bb8307fd2b9d0e6ee5d4dee758503f1d82609))

## [1.1.11](https://github.com/eik-lib/node-client/compare/v1.1.10...v1.1.11) (2021-12-22)


### Bug Fixes

* **deps:** update dependency undici to v4.12.1 ([237389b](https://github.com/eik-lib/node-client/commit/237389b83224f3bcfec9b1d9793d495aa39ef842))

## [1.1.10](https://github.com/eik-lib/node-client/compare/v1.1.9...v1.1.10) (2021-12-14)


### Bug Fixes

* **deps:** update dependency undici to v4.12.0 ([9f06c18](https://github.com/eik-lib/node-client/commit/9f06c18351f87d7165642619ee72272d7e7bf7a3))

## [1.1.9](https://github.com/eik-lib/node-client/compare/v1.1.8...v1.1.9) (2021-12-08)


### Bug Fixes

* **deps:** update dependency undici to v4.11.3 ([5319d04](https://github.com/eik-lib/node-client/commit/5319d04f2f3d13866b92d0d8547493deb14df0d9))

## [1.1.8](https://github.com/eik-lib/node-client/compare/v1.1.7...v1.1.8) (2021-12-08)


### Bug Fixes

* **deps:** update dependency undici to v4.11.2 ([dbde932](https://github.com/eik-lib/node-client/commit/dbde93280b2546d0dbd9e41d32380dbdd8f38d50))

## [1.1.7](https://github.com/eik-lib/node-client/compare/v1.1.6...v1.1.7) (2021-12-07)


### Bug Fixes

* **deps:** update dependency undici to v4.11.1 ([f1ea777](https://github.com/eik-lib/node-client/commit/f1ea7777abad1dca4b75eb336b91463edd988821))

## [1.1.6](https://github.com/eik-lib/node-client/compare/v1.1.5...v1.1.6) (2021-12-03)


### Bug Fixes

* **deps:** update dependency undici to v4.11.0 ([e0c0876](https://github.com/eik-lib/node-client/commit/e0c08762726fd077353c9a0883a32f03c2d084b3))

## [1.1.5](https://github.com/eik-lib/node-client/compare/v1.1.4...v1.1.5) (2021-12-01)


### Bug Fixes

* **deps:** update dependency undici to v4.10.4 ([8b7e7b9](https://github.com/eik-lib/node-client/commit/8b7e7b98e45842983271124a530829426ab968ad))

## [1.1.4](https://github.com/eik-lib/node-client/compare/v1.1.3...v1.1.4) (2021-11-24)


### Bug Fixes

* **deps:** update dependency undici to v4.10.3 ([dcfd517](https://github.com/eik-lib/node-client/commit/dcfd517c28dd4d85bc201e6cb6d139d365eb3ae4))

## [1.1.3](https://github.com/eik-lib/node-client/compare/v1.1.2...v1.1.3) (2021-11-19)


### Bug Fixes

* **deps:** update dependency undici to v4.10.2 ([727f3e2](https://github.com/eik-lib/node-client/commit/727f3e2b80bbc1a0f78c0cc72877c9eadeb67a92))

## [1.1.2](https://github.com/eik-lib/node-client/compare/v1.1.1...v1.1.2) (2021-11-19)


### Bug Fixes

* **deps:** update dependency undici to v4.10.1 ([756300e](https://github.com/eik-lib/node-client/commit/756300ecd9aa9a1318c5cdd5db9317649ecca97f))

## [1.1.1](https://github.com/eik-lib/node-client/compare/v1.1.0...v1.1.1) (2021-11-14)


### Bug Fixes

* **deps:** update dependency undici to v4.10.0 ([8656e80](https://github.com/eik-lib/node-client/commit/8656e8059928764b522642d5b513e3c8d6e7f482))

# [1.1.0](https://github.com/eik-lib/node-client/compare/v1.0.1...v1.1.0) (2021-11-05)


### Features

* Add .base() method to retrieve a base URL to a package ([#33](https://github.com/eik-lib/node-client/issues/33)) ([1dae896](https://github.com/eik-lib/node-client/commit/1dae89696911e6257bf9f89078e2e68e139291c5))

## [1.0.1](https://github.com/eik-lib/node-client/compare/v1.0.0...v1.0.1) (2021-11-03)


### Bug Fixes

* **deps:** update dependency undici to v4.9.5 ([f8b7f46](https://github.com/eik-lib/node-client/commit/f8b7f467db5237010bff715c7c7f0af622e40c3a))

# 1.0.0 (2021-11-02)


* Next (#13) ([c7b2470](https://github.com/eik-lib/node-client/commit/c7b2470525b6def7ae4d506e2ba42ddef321e8c3)), closes [#13](https://github.com/eik-lib/node-client/issues/13)


### BREAKING CHANGES

* API is reworked to suite the current functionality of Eik

* test: lint love

* ci: fix ci tests

* ci: Treat release config as a common.js file

* chore(release): 1.0.0-next.1 [skip ci]

# 1.0.0-next.1 (2021-03-10)

### Features

* Rework module to suite current functionality of Eik ([559294c](https://github.com/eik-lib/node-client/commit/559294cc8d1bd793873ba02000da6376312e0160))

### BREAKING CHANGES

* API is reworked to suite the current functionality of Eik

* chore: Rename module to @eik/node-client
* Rename module to @eik/node-client

* chore(release): 1.0.0-next.2 [skip ci]

# [1.0.0-next.2](https://github.com/eik-lib/node-client/compare/v1.0.0-next.1...v1.0.0-next.2) (2021-03-10)

### chore

* Rename module to @eik/node-client ([f3d8c73](https://github.com/eik-lib/node-client/commit/f3d8c7325b90b345a79df731544f53ebb11c81bf))

### BREAKING CHANGES

* Rename module to @eik/node-client

* chore: Clean up the package structure

* fix: Add CommonJS support

* chore: Lint love

* ci: Fix repo URL

* chore(release): 1.0.0-next.3 [skip ci]

# [1.0.0-next.3](https://github.com/eik-lib/node-client/compare/v1.0.0-next.2...v1.0.0-next.3) (2021-03-11)

### Bug Fixes

* Add CommonJS support ([b634537](https://github.com/eik-lib/node-client/commit/b6345378236d1bf60dc1ff6ceee1a285ca335e7f))

* docs: Document module

* chore: lint love

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* Update README.md

Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

* feat: Make .file() return an object

* chore: Lint love

* test: Add tests and documentation

* doc: Fix example

* chore(release): 1.0.0-next.4 [skip ci]

# [1.0.0-next.4](https://github.com/eik-lib/node-client/compare/v1.0.0-next.3...v1.0.0-next.4) (2021-03-19)

### Features

* Make .file() return an object ([f53f15d](https://github.com/eik-lib/node-client/commit/f53f15dae288fda4b4527a3b4c69bab2e56f5169))

* fix: Do not use getters and setters on public data object

* chore(release): 1.0.0-next.5 [skip ci]

# [1.0.0-next.5](https://github.com/eik-lib/node-client/compare/v1.0.0-next.4...v1.0.0-next.5) (2021-03-23)

### Bug Fixes

* Do not use getters and setters on public data object ([0505dcb](https://github.com/eik-lib/node-client/commit/0505dcb25b2563b826d5806fc30a7d148c111c00))

* doc: Fixed spelling error

* fix: Make default value of integrity to be undefined

* chore(release): 1.0.0-next.6 [skip ci]

# [1.0.0-next.6](https://github.com/eik-lib/node-client/compare/v1.0.0-next.5...v1.0.0-next.6) (2021-04-09)

### Bug Fixes

* Make default value of integrity to be undefined ([a679f73](https://github.com/eik-lib/node-client/commit/a679f733351413e5e59cbd0f71c86fef8a08042c))

* chore: Use private properties

* test: run tests on node.js 16 instead of 15

* chore: Add tests

* chore: lint love

* doc: Update documentation

* chore(deps): Updated dependencies

Co-authored-by: Trygve Lie <trygve.lie@finn.no>
Co-authored-by: semantic-release-bot <semantic-release-bot@martynus.net>
Co-authored-by: Richard Walker <digitalsadhu@gmail.com>

# [1.0.0-next.6](https://github.com/eik-lib/node-client/compare/v1.0.0-next.5...v1.0.0-next.6) (2021-04-09)


### Bug Fixes

* Make default value of integrity to be undefined ([a679f73](https://github.com/eik-lib/node-client/commit/a679f733351413e5e59cbd0f71c86fef8a08042c))

# [1.0.0-next.5](https://github.com/eik-lib/node-client/compare/v1.0.0-next.4...v1.0.0-next.5) (2021-03-23)


### Bug Fixes

* Do not use getters and setters on public data object ([0505dcb](https://github.com/eik-lib/node-client/commit/0505dcb25b2563b826d5806fc30a7d148c111c00))

# [1.0.0-next.4](https://github.com/eik-lib/node-client/compare/v1.0.0-next.3...v1.0.0-next.4) (2021-03-19)


### Features

* Make .file() return an object ([f53f15d](https://github.com/eik-lib/node-client/commit/f53f15dae288fda4b4527a3b4c69bab2e56f5169))

# [1.0.0-next.3](https://github.com/eik-lib/node-client/compare/v1.0.0-next.2...v1.0.0-next.3) (2021-03-11)


### Bug Fixes

* Add CommonJS support ([b634537](https://github.com/eik-lib/node-client/commit/b6345378236d1bf60dc1ff6ceee1a285ca335e7f))

# [1.0.0-next.2](https://github.com/eik-lib/node-client/compare/v1.0.0-next.1...v1.0.0-next.2) (2021-03-10)


### chore

* Rename module to @eik/node-client ([f3d8c73](https://github.com/eik-lib/node-client/commit/f3d8c7325b90b345a79df731544f53ebb11c81bf))


### BREAKING CHANGES

* Rename module to @eik/node-client

# 1.0.0-next.1 (2021-03-10)


### Features

* Rework module to suite current functionality of Eik ([559294c](https://github.com/eik-lib/node-client/commit/559294cc8d1bd793873ba02000da6376312e0160))


### BREAKING CHANGES

* API is reworked to suite the current functionality of Eik

import { test } from "node:test";
import assert from "node:assert";

import Eik from "../src/index.js";

const FIXTURE_PATH = `${process.cwd()}/fixtures/eik-image.json`;

test("image namespace is mapped correctly to /img", async () => {
	const client = new Eik({
		base: "/public/images",
		path: FIXTURE_PATH,
	});
	await client.load();

	assert.strictEqual("/img/eik-image-fixture/1.0.0", client.pathname);
});

test("image asset is mapped correctly", async () => {
	const client = new Eik({
		path: FIXTURE_PATH,
	});
	await client.load();

	const file = "/art/such.webp";
	const resolved = client.file(file);

	assert.strictEqual(
		resolved.value,
		`${client.server}/img/eik-image-fixture/1.0.0/art/such.webp`,
	);
});

test('development mode is set to "true" - base is unset', async () => {
	const client = new Eik({
		development: true,
		path: FIXTURE_PATH,
	});
	await client.load();

	const file = "/art/such.webp";
	const resolved = client.file(file);

	assert.strictEqual(resolved.value, "/art/such.webp");
});

test('Cdevelopment mode is set to "true" - base is set to absolute URL', async () => {
	const client = new Eik({
		development: true,
		base: "http://localhost:7777/img/",
		path: FIXTURE_PATH,
	});
	await client.load();

	const file = "/art/such.webp";
	const resolved = client.file(file);

	assert.strictEqual(resolved.value, "http://localhost:7777/img/art/such.webp");
});

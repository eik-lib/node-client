/// <reference path="../types/index.d.ts" />

import tap from "tap";

import Eik from "../src/index.js";

const FIXTURE_PATH = `${process.cwd()}/fixtures/eik-image.json`;

tap.test("image namespace is mapped correctly to /img", async (t) => {
	const client = new Eik({
		base: "/public/images",
		path: FIXTURE_PATH,
	});
	await client.load();

	t.equal("/img/eik-image-fixture/1.0.0", client.pathname);
});

tap.test("image asset is mapped correctly", async (t) => {
	const client = new Eik({
		path: FIXTURE_PATH,
	});
	await client.load();

	const file = "/art/such.webp";
	const resolved = client.file(file);

	t.equal(
		resolved.value,
		`${client.server}/img/eik-image-fixture/1.0.0/art/such.webp`,
	);
	t.end();
});

tap.test('development mode is set to "true" - base is unset', async (t) => {
	const client = new Eik({
		development: true,
		path: FIXTURE_PATH,
	});
	await client.load();

	const file = "/art/such.webp";
	const resolved = client.file(file);

	t.equal(resolved.value, "/art/such.webp");
	t.end();
});

tap.test(
	'Cdevelopment mode is set to "true" - base is set to absolute URL',
	async (t) => {
		const client = new Eik({
			development: true,
			base: "http://localhost:7777/img/",
			path: FIXTURE_PATH,
		});
		await client.load();

		const file = "/art/such.webp";
		const resolved = client.file(file);

		t.equal(resolved.value, "http://localhost:7777/img/art/such.webp");
		t.end();
	},
);

/// <reference path="../types/index.d.ts" />

import tap from "tap";
import { Asset } from "../src/asset.js";

tap.test("Asset - Default values", (t) => {
	const asset = new Asset();
	t.equal(asset.integrity, undefined, 'should be "undefined"');
	t.equal(asset.value, "", "should be empty string");
	t.end();
});

tap.test("Asset - Set values through constructor", (t) => {
	const asset = new Asset({
		value: "foo",
	});
	t.equal(asset.value, "foo", "should have set value");
	t.end();
});

tap.test("Asset - Set values through properties", (t) => {
	const asset = new Asset();
	asset.integrity = "bar";
	asset.value = "foo";
	t.equal(asset.integrity, "bar", "should have set value");
	t.equal(asset.value, "foo", "should have set value");
	t.end();
});

tap.test("Asset - Stringify object with default values", (t) => {
	const asset = new Asset();
	const obj = JSON.parse(JSON.stringify(asset));
	t.equal(obj.integrity, undefined, 'should be "undefined"');
	t.equal(obj.value, "", "should be empty string");
	t.end();
});

tap.test("Asset - Stringify object with set values", (t) => {
	const asset = new Asset();
	asset.integrity = "bar";
	asset.value = "foo";
	const obj = JSON.parse(JSON.stringify(asset));
	t.equal(obj.integrity, "bar", "should have set value");
	t.equal(obj.value, "foo", "should have set value");
	t.end();
});

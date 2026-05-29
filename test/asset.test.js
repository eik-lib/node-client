import { test } from "node:test";
import assert from "node:assert";
import { Asset } from "../src/asset.js";

test("Asset - Default values", () => {
	const asset = new Asset();
	assert.strictEqual(asset.integrity, undefined, 'should be "undefined"');
	assert.strictEqual(asset.value, "", "should be empty string");
});

test("Asset - Set values through constructor", () => {
	const asset = new Asset({
		value: "foo",
	});
	assert.strictEqual(asset.value, "foo", "should have set value");
});

test("Asset - Set values through properties", () => {
	const asset = new Asset();
	asset.integrity = "bar";
	asset.value = "foo";
	assert.strictEqual(asset.integrity, "bar", "should have set value");
	assert.strictEqual(asset.value, "foo", "should have set value");
});

test("Asset - Stringify object with default values", () => {
	const asset = new Asset();
	const obj = JSON.parse(JSON.stringify(asset));
	assert.strictEqual(obj.integrity, undefined, 'should be "undefined"');
	assert.strictEqual(obj.value, "", "should be empty string");
});

test("Asset - Stringify object with set values", () => {
	const asset = new Asset();
	asset.integrity = "bar";
	asset.value = "foo";
	const obj = JSON.parse(JSON.stringify(asset));
	assert.strictEqual(obj.integrity, "bar", "should have set value");
	assert.strictEqual(obj.value, "foo", "should have set value");
});

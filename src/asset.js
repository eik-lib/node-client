/**
 * @typedef {object} AssetOptions
 * @property {string} [value=""]
 */

/**
 * Holds attributes for use when linking to assets hosted on Eik.
 *
 * @example
 * ```
 * // JS and <script>
 * const script = eik.file("/app.js");
 * const html = `<script
 *   src="${script.value}"
 *   ${script.integrity ? `integrity="${script.integrity}"` : ""}
 *   type="module"></script>`;
 * ```
 * @example
 * ```
 * // CSS and <link>
 * const styles = eik.file("/styles.css");
 * const html = `<link
 *   href="${styles.value}"
 *   ${styles.integrity ? `integrity="${styles.integrity}"` : ""}
 *   rel="stylesheet" />`;
 * ```
 */
export class Asset {
	/**
	 * Value for use in [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity#examples).
	 * Not calculated if `development` is `true`.
	 *
	 * @type {string | undefined}
	 */
	integrity = undefined;

	/**
	 * URL to the file for use in `<script>` or `<link>`.
	 * @type {string}
	 */
	value;

	/**
	 * @param {AssetOptions} options
	 */
	constructor({ value = "" } = {}) {
		this.integrity = undefined;
		this.value = value;
	}
}

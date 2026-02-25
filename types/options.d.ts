export type Options = {
    /**
     * Base root to be used for returned asset files.
     */
    base?: string;
    /**
     * Determines whether the client produces links to localhost (f. ex. during development) or to the Eik server.
     * @default false
     */
    isLocalhost?: boolean;
    /**
     * @default false
     * @deprecated Prefer `isLocalhost` instead for clarity.
     */
    development?: boolean;
    /**
     * Specifies whether import maps defined in the config should be loaded from the Eik server or not.
     * @default false
     */
    loadMaps?: boolean;
    /**
     * Path to directory containing an eik.json file or package.json with eik config.
     * @default process.cwd()
     */
    path?: string;
};

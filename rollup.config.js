export default {
    input: 'src/index.js',
    external: ['@eik/common-config-loader', 'undici', 'abslog', 'path'],
    output: [
        {
            exports: 'auto',
            format: 'cjs',
            file: 'dist/index.cjs',
        },
    ],
};

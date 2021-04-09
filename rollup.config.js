export default {
    input: 'src/index.js',
    external: [
        '@eik/common',
        'node-fetch',
        'abslog',
        'path',
    ],
    output: [
        {
            exports: 'auto',
            format: 'cjs',
            file: 'dist/index.cjs',
        },
    ],
};

export default {
    input: 'src/index.js',
    external: [
        '@eik/common',
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

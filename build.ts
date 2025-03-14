import { bunPluginPino } from 'bun-plugin-pino';

try {
    await Bun.build({
        entrypoints: ['./src/index.ts'],
        outdir: 'dist',
        format: 'esm',
        target: 'node',
        env: 'disable',
        sourcemap: 'external',
        splitting: true,
        minify: {
            identifiers: false,
            syntax: false,
            whitespace: false,
        },
        plugins: [
            bunPluginPino({
                transports: ['pino-elasticsearch'],
                logging: 'quiet',
            }),
        ],
    });
} catch (e) {
    console.error('Build Failed');
    console.error(JSON.stringify(e, null, 2));
}

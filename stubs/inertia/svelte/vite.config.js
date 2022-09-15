import { defineConfig } from 'vite';
import path from 'path';
import laravel from 'laravel-vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        svelte({
            experimental: {
                prebundleSvelteLibraries: true, // fixing vite-svelte bug https://github.com/inertiajs/inertia/issues/826
            },
        }),
    ],
    resolve: {
        alias: {
            ziggy: path.resolve('vendor/tightenco/ziggy/dist'),
        },
    }
});

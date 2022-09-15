import './bootstrap';
import '../css/app.css';

import { Inertia } from "@inertiajs/inertia" // resolving a strange bug https://github.com/inertiajs/inertia/issues/1050
import { createInertiaApp } from '@inertiajs/inertia-svelte'
import { InertiaProgress } from '@inertiajs/progress'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.svelte`, import.meta.glob('./Pages/**/*.svelte')),
    setup({ el, App, props, plugin }) {
        return new App({ target: el, props })
    },
});

InertiaProgress.init({ color: '#4B5563' });

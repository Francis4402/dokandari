import './bootstrap';
import '../css/app.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Suspense } from 'react';
import { Toaster } from 'sonner';


createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<><App {...props} /><Suspense fallback={null}>
          <Toaster position='top-right' />
        </Suspense></>);
    },
    progress: {
        color: '#4B5563',
    },
});

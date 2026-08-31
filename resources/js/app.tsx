import './bootstrap';
import '../css/app.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
    <div className="flex flex-col items-center gap-4">
      {/* Spinner */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#DAD5C7] border-t-[#FF5A1F]"></div>
      <p className="text-sm font-medium text-[#6B6A66]">Loading...</p>
    </div>
  </div>
);

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<><App {...props} /><Suspense fallback={<PageLoader />}>
          <Toaster position='top-right' />
        </Suspense></>);
    },
    progress: {
        color: '#4B5563',
    },
});

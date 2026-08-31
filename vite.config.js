import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('node_modules/react/') || id.includes('node_modules/react/index')) {
                            return 'react';
                        }
                        if (id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
                            return 'react-dom';
                        }
                        if (id.includes('node_modules/gsap')) {
                            return 'gsap';
                        }
                        if (id.includes('node_modules/swiper')) {
                            return 'swiper';
                        }
                        if (id.includes('node_modules/react-icons')) {
                            // Split by icon family. This isolates each family into its
                            // own cached chunk so pages only load the families they use.
                            // Note: react-icons v5 single-file-per-family cannot be
                            // tree-shaken to individual icons, so families that are
                            // widely used (fa) remain large.
                            const familyMatch = id.match(/react-icons\/(fa6|fa|fi|md|bs|ri|io5|io|hi2|hi|ai|ci|bi|tb|di|cg|si|gi|wi|lu)/);
                            return familyMatch ? `icons-${familyMatch[1]}` : 'icons';
                        }
                        if (id.includes('node_modules/zustand')) {
                            return 'state';
                        }
                        if (id.includes('node_modules/axios')) {
                            return 'axios';
                        }
                        if (id.includes('node_modules/sonner') || id.includes('node_modules/goober')) {
                            return 'toast';
                        }
                        if (id.includes('node_modules/@tanstack')) {
                            return 'query';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
});

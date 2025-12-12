import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		sourcemap: true
	},
	optimizeDeps: {
		include: ['@xterm/xterm', '@xterm/addon-fit', '@xterm/addon-search'],
	},
	server: {
		proxy: {
			'/api/ws': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api\/ws/, ''),
				ws: true
			}
		}
	}
});

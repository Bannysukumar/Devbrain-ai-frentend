var _a;
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Proxy target for local dev (avoids CORS when frontend runs on localhost:3000).
// Set VITE_API_BASE_URL=/api in .env to use this proxy.
var proxyTarget = (_a = process.env.VITE_PROXY_TARGET) !== null && _a !== void 0 ? _a : 'https://malaysiantradenets.com';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: proxyTarget,
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/api/, ''); },
                secure: true,
            },
        },
    },
});

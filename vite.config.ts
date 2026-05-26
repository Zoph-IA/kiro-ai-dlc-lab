import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        headers: {
            'Content-Security-Policy':
                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; media-src 'self'",
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
    },
    build: {
        target: 'es2020',
        outDir: 'dist',
        sourcemap: true,
    },
    publicDir: 'assets',
});

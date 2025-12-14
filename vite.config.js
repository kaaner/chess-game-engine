import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Output directory
    outDir: 'dist',
    
    // Asset file names
    assetsDir: 'assets',
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code if we add libraries later
        }
      }
    },
    
    // Asset size reporting
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Optimize images
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
      ]
    }
  },
  
  // Preview server config
  preview: {
    port: 5173,
    strictPort: false,
  },
  
  // Dev server config
  server: {
    port: 3000,
    strictPort: false,
  }
})

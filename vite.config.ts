import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// Internal OpenStack endpoints (direct to HAProxy, no Cloudflare)
const INTERNAL = 'http://192.168.0.250'

// https://vite.dev/config/
export default defineConfig({
  base: '/frontend/',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: true,
    allowedHosts: [
      'cloud.tblinstance.store',
      'tblinstance.store'
    ],
    proxy: {
      '/proxy/keystone': {
        target: `${INTERNAL}:5000`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy\/keystone/, ''),
      },
      '/proxy/nova': {
        target: `${INTERNAL}:8774`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy\/nova/, ''),
      },
      '/proxy/neutron': {
        target: `${INTERNAL}:9696`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy\/neutron/, ''),
      },
      '/proxy/glance': {
        target: `${INTERNAL}:9292`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy\/glance/, ''),
      },
      '/proxy/cinder': {
        target: `${INTERNAL}:8776`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy\/cinder/, ''),
      },
    }
  }
})

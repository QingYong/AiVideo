import path from 'node:path'
import { fileURLToPath } from 'node:url'

const backendTarget = process.env.BACKEND_URL || 'http://localhost:5680'
// Vite 默认把预构建缓存放进「Nuxt 项目根」下的 node_modules/.vite（即 src/web/node_modules）。
// 指到仓库根 node_modules，避免 dev 时在 src/web 下多出一份 node_modules。
const webRoot = path.dirname(fileURLToPath(import.meta.url))
const repoNodeModules = path.resolve(webRoot, '../../node_modules')

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
  },
  app: {
    head: {
      title: '短剧',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'shortcut icon', type: 'image/png', href: '/favicon.png' },
      ],
    },
  },
  vite: {
    cacheDir: path.join(repoNodeModules, '.vite-web'),
    server: {
      proxy: {
        '/api': { target: backendTarget, changeOrigin: true },
        '/static': { target: backendTarget, changeOrigin: true },
      },
    },
  },
  compatibilityDate: '2025-05-15',
})

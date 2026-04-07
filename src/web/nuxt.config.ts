import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Vite 默认把预构建缓存放进「Nuxt 项目根」下的 node_modules/.vite（即 src/web/node_modules）。
// 指到仓库根 node_modules，避免 dev 时在 src/web 下多出一份 node_modules。
const webRoot = path.dirname(fileURLToPath(import.meta.url))
const repoNodeModules = path.resolve(webRoot, '../../node_modules')

// Nitro 打包 server middleware 时会重写 import.meta.url，导致后端代码里的路径解析错误。
// 在 nuxt.config.ts 执行时（Nitro 启动前）把正确路径写入 process.env，让后端直接读取。
const projectRoot = path.resolve(webRoot, '../../..')  // src/web -> src -> huobao-drama -> Freedom
if (!process.env.HUOBAO_PROJECT_ROOT) {
  process.env.HUOBAO_PROJECT_ROOT = projectRoot
}
if (!process.env.DB_PATH) {
  process.env.DB_PATH = path.join(projectRoot, 'data', 'huobao_drama.db')
}

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
  },
  nitro: {
    // 后端依赖的原生模块不打包，保持 require() 运行时解析
    externals: {
      external: [
        'better-sqlite3',
        'sharp',
        'fluent-ffmpeg',
        '@mastra/core',
        'pino',
        'pino-pretty',
      ],
    },
  },
  compatibilityDate: '2025-05-15',
})

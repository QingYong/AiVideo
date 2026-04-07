import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import path from 'path'
import { fileURLToPath } from 'url'

import app, { projectRoot } from './app.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Serve frontend (Nuxt generate output) - production only
const distPath = path.join(projectRoot, 'src', 'web', '.output', 'public')
app.use('*', serveStatic({ root: distPath }))
app.get('*', serveStatic({ root: distPath, path: 'index.html' }))

const port = Number(process.env.PORT || 5679)
console.log(`🚀 Server on http://localhost:${port}`)
serve({ fetch: app.fetch, port })

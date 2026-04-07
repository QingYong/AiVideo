import { getRequestListener } from '@hono/node-server'
import honoApp from '../../../app'

const handler = getRequestListener(honoApp.fetch)

export default defineEventHandler(async (event) => {
  const { path } = event
  if (
    path.startsWith('/api/') ||
    path.startsWith('/webhooks/') ||
    path.startsWith('/static/')
  ) {
    await handler(event.node.req, event.node.res)
  }
})

import { Hono } from 'hono'
import { hello } from './routes/hello'

export { handle } from 'hono/vercel'

const api = new Hono().basePath('/api').route('/hello', hello)

type AppType = typeof api

export { api, type AppType }

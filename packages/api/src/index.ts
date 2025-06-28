import { Hono } from 'hono'
import { hello } from './routes/hello'
import { upload } from './routes/upload'

export { handle } from 'hono/vercel'

const api = new Hono().basePath('/api').route('/hello', hello).route('/upload', upload)

type AppType = typeof api

export { api, type AppType }

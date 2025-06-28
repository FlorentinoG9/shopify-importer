import { Hono } from 'hono'

const app = new Hono()

export const upload = app.get('/', (c) => {
  return c.json({
    message: 'Hello World!',
  })
})

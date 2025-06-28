import { Hono } from 'hono'

const app = new Hono()

export const hello = app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' })
})


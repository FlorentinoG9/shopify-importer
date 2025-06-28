import { Hono } from 'hono'

const app = new Hono()

export const upload = app.post('/', async (c) => {
  const formData = await c.req.parseBody()

  const file = formData.file

  if (file) {
    console.info(file)
  } else {
    return c.json({ error: 'No file provided' }, 400)
  }

  return c.json({ message: 'File uploaded successfully' })
})

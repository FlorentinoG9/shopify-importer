import { hc } from 'hono/client'
import type { AppType } from '.'

const url = process.env.NEXT_PUBLIC_API_URL

if (!url) {
  throw new Error('NEXT_PUBLIC_API_URL is not set')
}

export const client = hc<AppType>(url).api



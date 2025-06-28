import { api, handle } from '@workspace/api'

export const runtime = 'edge'

export const GET = handle(api)
export const POST = handle(api)

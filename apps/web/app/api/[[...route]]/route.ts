import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { upload } from './upload';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.route('/upload', upload);

export const GET = handle(app);
export const POST = handle(app);

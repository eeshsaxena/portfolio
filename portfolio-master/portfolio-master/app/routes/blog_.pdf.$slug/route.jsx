import { redirect } from '@remix-run/cloudflare';
import { isUnlocked } from '~/utils/extra-session.server';

// Serves a post's newspaper PDF from KV, gated behind the same unlock.
export async function loader({ request, params, context }) {
  if (!(await isUnlocked(request, context))) {
    throw redirect('/extracurricular');
  }
  const kv = context.cloudflare.env.BLOG_KV;
  const buf = kv ? await kv.get(`pdf:${params.slug}`, 'arrayBuffer') : null;
  if (!buf) {
    throw new Response('Not found', { status: 404 });
  }
  return new Response(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${params.slug}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}

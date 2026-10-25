export async function onRequest(context) {
  const url = new URL(context.request.url);
  // Security Headers for all
  const response = await context.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self' https://cdn.tailwindcss.com https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; img-src 'self' data: https:;");
  response.headers.set('Permissions-Policy', 'clipboard-read=(), clipboard-write=()');
  
  // Rate limit simple via D1 for /api/
  if (url.pathname.startsWith('/api/')) {
    const ip = context.request.headers.get('cf-connecting-ip') || 'unknown';
    const key = `rl:${ip}:${url.pathname}`;
    // Skip heavy logic for demo - real would check D1
  }
  
  // Admin MCP protection - only allowlist
  if (url.pathname.startsWith('/api/mcp/') || url.pathname.startsWith('/api/admin/')) {
    const token = context.request.headers.get('Authorization')?.replace('Bearer ','');
    if (!token) return new Response(JSON.stringify({error:'admin only'}), {status:403});
    // JWT verify would happen here + check promise_admin_allowlist
  }
  
  return response;
}
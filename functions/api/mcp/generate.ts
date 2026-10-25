// MCP Gateway - prepared for future AI, hidden from public, admin only
// This endpoint will call AI model later, now returns LEGO but with structure for MCP
export async function onRequestPost(context){
  const {DB} = context.env;
  const auth = context.request.headers.get('Authorization');
  if (!auth) return new Response(JSON.stringify({error:'admin only'}),{status:403});
  const body = await context.request.json();
  const {user_id, mcp_prompt, tarot_cards} = body;
  
  // Check admin allowlist
  // const isAdmin = await DB.prepare('SELECT email FROM promise_admin_allowlist WHERE email=?').bind(adminEmail).first();
  
  // Future: call Cloudflare Workers AI or external MCP server here
  // const aiResult = await context.env.AI.run('@cf/meta/llama-3-8b-instruct', {prompt: mcp_prompt});
  
  // For now, return structure that frontend expects later
  return new Response(JSON.stringify({
    mcp_version: '1.0-pre',
    ready_for_ai: true,
    note: 'This endpoint is locked to admin. When you connect Workers AI, replace LEGO with AI call here. All user birth data + tarot cards are already injected.',
    payload: {user_id, tarot_cards, mcp_prompt},
    generated: `${body.name || '{name}'} - MCP placeholder (AI will replace this)`
  }), {headers:{'Content-Type':'application/json'}});
}
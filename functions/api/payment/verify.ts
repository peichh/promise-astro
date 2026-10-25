export async function onRequestPost(context){
  const {DB, SLIPS} = context.env;
  const formData = await context.request.formData();
  const transaction_id = formData.get('transaction_id');
  const user_id = formData.get('user_id');
  const slipFile = formData.get('slip'); // File
  
  if (!transaction_id || !slipFile) return new Response(JSON.stringify({error:'missing'}),{status:400});
  
  const key = `slips/${user_id}/${transaction_id}_${Date.now()}.jpg`;
  await SLIPS.put(key, slipFile.stream(), {httpMetadata:{contentType: slipFile.type || 'image/jpeg'}});
  
  await DB.prepare('UPDATE promise_transactions SET slip_r2_key=?, status=? WHERE id=?').bind(key, 'pending_review', transaction_id).run();
  
  return new Response(JSON.stringify({ok:true, slip_key:key, status:'pending_review', note:'Admin will approve in promise_admin_allowlist'}),{headers:{'Content-Type':'application/json'}});
}

export async function onRequestGet(context){
  // Check status
  const {DB} = context.env;
  const url = new URL(context.request.url);
  const tx = url.searchParams.get('transaction_id');
  const row = await DB.prepare('SELECT * FROM promise_transactions WHERE id=?').bind(tx).first();
  return new Response(JSON.stringify(row||{error:'not found'}),{headers:{'Content-Type':'application/json'}});
}
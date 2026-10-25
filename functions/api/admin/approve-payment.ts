export async function onRequestPost(context){
  const {DB} = context.env;
  const body = await context.request.json();
  const {transaction_id, action} = body; // action: approve | reject
  if (action==='approve'){
    const tx = await DB.prepare('SELECT * FROM promise_transactions WHERE id=?').bind(transaction_id).first();
    if (!tx) return new Response('not found',{status:404});
    // Create subscription
    const subId = crypto.randomUUID();
    const now = Date.now();
    const expires = now + 30*24*3600*1000;
    await DB.prepare('INSERT INTO promise_subscriptions (id,user_id,plan,status,expires_at) VALUES (?,?,?,?,?)')
      .bind(subId, tx.user_id, 'premium', 'active', expires).run();
    await DB.prepare('UPDATE promise_transactions SET status=? WHERE id=?').bind('approved', transaction_id).run();
    return new Response(JSON.stringify({ok:true, subscription_id:subId, expires_at:expires}),{headers:{'Content-Type':'application/json'}});
  } else {
    await DB.prepare('UPDATE promise_transactions SET status=? WHERE id=?').bind('rejected', transaction_id).run();
    return new Response(JSON.stringify({ok:true}),{headers:{'Content-Type':'application/json'}});
  }
}
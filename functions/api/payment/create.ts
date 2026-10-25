import { SignJWT } from 'jose';

// Generate PromptPay payload (EMVCo) - simplified for Thai PromptPay ID (phone or national ID or eWallet)
// For demo: use 0812345678 as merchant, amount dynamic
function genPromptPayPayload(ppId, amount){
  // Very simplified payload - for production use library promptpay-qr
  // Format: 00 02 01 + 29 + 00 16 A000000677010111 + 01 PPID + 02 amount + 58 TH + 53 764 + 54 amount
  // This is placeholder - frontend will use qrcode.js to render from string
  // We return string that qrcode library can render
  const id = ppId.replace(/[^0-9]/g,'');
  let ppType = '01'; // phone
  if (id.length==13) ppType='02'; // nat id
  if (id.length==15) ppType='03'; // ewallet
  // For simplicity, return promptpay:// + id + ?amount=
  return `PROMPTPAY:${id}:${amount}`;
}

export async function onRequestPost(context){
  const {DB} = context.env;
  const body = await context.request.json();
  const {user_id, plan, amount, promptpay_id} = body;
  // plan: basic 299, premium 599 etc
  const finalAmount = amount || (plan==='premium'?599:299);
  const ppId = promptpay_id || context.env.PROMPTPAY_ID || '0812345678';
  
  const txId = crypto.randomUUID();
  const now = Date.now();
  const payload = genPromptPayPayload(ppId, finalAmount);
  
  await DB.prepare('INSERT INTO promise_transactions (id,user_id,amount,slip_r2_key,status,created_at) VALUES (?,?,?,?,?,?)')
    .bind(txId, user_id, finalAmount, '', 'pending_qr', now).run();
  
  return new Response(JSON.stringify({
    transaction_id: txId,
    amount: finalAmount,
    promptpay_id: ppId,
    qr_payload: payload,
    qr_image_note: 'Frontend uses qrcode.js to render this payload',
    expires_in: 15*60, // 15 min
    next_step: 'Upload slip to /api/payment/verify'
  }), {headers:{'Content-Type':'application/json'}});
}
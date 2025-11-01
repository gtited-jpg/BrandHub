import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
// You would install this with `npm install @lemonsqueezy/lemonsqueezy.js`
// import { lemonSqueezyApi } from '@lemonsqueezy/lemonsqueezy.js'

export async function POST(request: Request) {
  const supabase = createClient();
  const text = await request.text();
  
  // You should verify the webhook signature here for security
  // const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  // const hmac = crypto.createHmac('sha256', secret);
  // const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
  // const signature = Buffer.from(request.headers.get('X-Signature') || '', 'utf8');
  // if (!crypto.timingSafeEqual(digest, signature)) {
  //   return new NextResponse('Invalid signature.', { status: 400 });
  // }
  
  const payload = JSON.parse(text);
  const eventName = payload.meta.event_name;
  const obj = payload.data;

  if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
    const userId = payload.meta.custom_data?.user_id;
    if (!userId) {
      return new NextResponse('Webhook Error: Missing user_id in custom_data', { status: 400 });
    }

    const subscriptionData = {
        user_id: userId,
        lemon_id: obj.id,
        status: obj.attributes.status,
        plan_id: obj.attributes.variant_id,
        ends_at: obj.attributes.ends_at,
        trial_ends_at: obj.attributes.trial_ends_at,
    };

    const { error } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, { onConflict: 'user_id' });

    if (error) {
      console.error('Supabase error:', error.message);
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }
  }

  return new NextResponse('OK', { status: 200 });
}

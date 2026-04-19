import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log('Webhook received:', payload)

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Log event
    await supabase.from('payment_events').insert({
      event_type: payload.action || payload.type,
      payload: payload
    })

    // 2. Process Subscription (Preapproval)
    if (payload.type === 'subscription_preapproval' || payload.action?.includes('preapproval')) {
      const resourceId = payload.data?.id || payload.id
      
      const mpResponse = await fetch(`https://api.mercadopago.com/preapproval/${resourceId}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
      })
      
      if (mpResponse.ok) {
        const subscription = await mpResponse.json()
        const userId = subscription.external_reference
        const mpStatus = subscription.status // authorized, paused, cancelled, pending

        if (userId) {
          let planId = 'FREE'
          let subStatus = 'inactive'
          let ofAccess = 'none'

          if (mpStatus === 'authorized') {
            planId = 'PRO_PASS'
            subStatus = 'active'
            ofAccess = 'pending_release'
          } else if (mpStatus === 'pending') {
            planId = 'FREE'
            subStatus = 'pending'
            ofAccess = 'none'
          }

          // Update Subscription Table
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            status: subStatus,
            gateway_subscription_id: subscription.id,
            plan_name: 'vynex_pro_pass',
            amount: subscription.auto_recurring?.transaction_amount,
            currency: subscription.auto_recurring?.currency_id,
            open_finance_access: ofAccess,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })

          // Update User Profile Table
          await supabase.from('user_profiles').update({
            plan_id: planId,
            subscription_status: subStatus,
            open_finance_access: ofAccess
          }).eq('user_id', userId)
          
          console.log(`User ${userId} updated to ${subStatus} (MP Status: ${mpStatus})`)
        }
      }
    }

    // 3. Process Payment (In case of individual payments within subscription)
    if (payload.type === 'payment') {
        // Logic for payment approved, if needed for idempotency or direct user updates
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})

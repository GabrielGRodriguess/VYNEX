import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log('[MP-WEBHOOK] Notification received:', JSON.stringify(payload))

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Log payment event
    await supabase.from('payment_events').insert({
      event_type: payload.action || payload.type,
      payload: payload,
      gateway: 'mercado_pago'
    })

    // 2. Process Subscription (Preapproval)
    const resourceId = payload.data?.id || payload.id
    const type = payload.type || payload.action
    
    if (type?.includes('preapproval') || payload.type === 'subscription_preapproval') {
      console.log(`[MP-WEBHOOK] Consulting MP API for resource: ${resourceId}`)
      
      const mpResponse = await fetch(`https://api.mercadopago.com/preapproval/${resourceId}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
      })
      
      if (!mpResponse.ok) {
        console.error(`[MP-WEBHOOK] Failed to fetch resource ${resourceId} from MP`)
        return new Response('Not found in MP', { status: 404 })
      }

      const subscriptionData = await mpResponse.json()
      const userId = subscriptionData.external_reference
      const mpStatus = subscriptionData.status
      const payerEmail = subscriptionData.payer_email

      console.log(`[MP-WEBHOOK] Validated status for user ${userId}: ${mpStatus}`)

      if (userId) {
        // Strict Status Mapping
        let planId = 'free'
        let subStatus = 'inactive'
        let ofAccess = 'none'

        if (mpStatus === 'authorized') {
          planId = 'PRO_PASS'
          subStatus = 'active'
          ofAccess = 'pending_release'
        } else if (mpStatus === 'pending') {
          subStatus = 'pending'
        } else if (mpStatus === 'paused') {
          subStatus = 'paused'
        } else if (mpStatus === 'cancelled' || mpStatus === 'canceled') {
          subStatus = 'cancelled'
        } else if (mpStatus === 'rejected') {
          subStatus = 'rejected'
        }

        console.log(`[MP-WEBHOOK] Mapping to internal status: ${subStatus} (Plan: ${planId})`)

        // Update Subscriptions Table (All fields)
        const { error: subError } = await supabase.from('subscriptions').upsert({
          user_id: userId,
          status: subStatus, // Legacy
          subscription_status: subStatus, // New
          gateway_subscription_id: subscriptionData.id,
          mercado_pago_preapproval_id: subscriptionData.id,
          mercado_pago_payer_email: payerEmail,
          plan_name: 'PRO_PASS',
          amount: subscriptionData.auto_recurring?.transaction_amount,
          currency: subscriptionData.auto_recurring?.currency_id,
          open_finance_access: ofAccess,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

        if (subError) console.error('[MP-WEBHOOK] Error updating subscriptions:', subError)

        // Update User Profile Table
        // Only grant PRO_PASS if status is active
        const { error: profileError } = await supabase.from('user_profiles').update({
          plan_id: planId,
          subscription_status: subStatus,
          open_finance_access: ofAccess
        }).eq('user_id', userId)

        if (profileError) console.error('[MP-WEBHOOK] Error updating profiles:', profileError)
        
        console.log(`[MP-WEBHOOK] Successfully processed update for user ${userId}`)
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('[MP-WEBHOOK] Webhook error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})

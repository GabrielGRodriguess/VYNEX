import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS check
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    
    // 1. Verify Authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) throw new Error('Unauthorized')

    const { email, plan, origin } = await req.json()
    const user_id = user.id
    const baseUrl = origin || 'https://vynex.vercel.app'

    console.log(`[MP-SUB] Creating subscription for user: ${user_id} (${email})`)

    // 2. Create Subscription in Mercado Pago
    const mpResponse = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: "VYNEX Pro Pass",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29.90,
          currency_id: "BRL"
        },
        back_url: `${baseUrl}/account?status=success`,
        payer_email: email,
        external_reference: user_id,
        status: "pending"
      })
    })

    const mpData = await mpResponse.json()

    if (!mpResponse.ok) {
      console.error('[MP-SUB] Mercado Pago Error:', mpData)
      throw new Error(mpData.message || 'Error creating MP subscription')
    }

    console.log(`[MP-SUB] MP Subscription created: ${mpData.id}`)

    // 3. Save initial state in Supabase
    const { error: dbError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id,
        plan_name: 'PRO_PASS',
        status: 'pending', // Legacy column
        subscription_status: 'pending', // New column
        amount: 29.90,
        currency: 'BRL',
        gateway: 'mercado_pago', // Legacy column
        gateway_provider: 'mercado_pago', // New column
        gateway_subscription_id: mpData.id,
        mercado_pago_preapproval_id: mpData.id,
        mercado_pago_payer_email: email,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (dbError) {
      console.error('[MP-SUB] DB Error:', dbError)
      throw dbError
    }

    return new Response(
      JSON.stringify({ checkout_url: mpData.init_point }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('[MP-SUB] Critical Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

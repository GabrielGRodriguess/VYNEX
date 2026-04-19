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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, email, plan, origin } = await req.json()
    const baseUrl = origin || 'https://vynex.vercel.app'

    if (!user_id || !email) {
      throw new Error('User ID and Email are required')
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Create Subscription directly
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
        back_url: `${baseUrl}/?status=success`,
        payer_email: email,
        external_reference: user_id,
        status: "pending"
      })
    })

    const mpData = await mpResponse.json()

    if (!mpResponse.ok) {
      console.error('Mercado Pago Error:', mpData)
      throw new Error(mpData.message || 'Error creating MP subscription')
    }

    // 2. Save subscription info in Supabase
    const { error: dbError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id,
        gateway_subscription_id: mpData.id,
        status: 'pending',
        amount: 29.90,
        gateway: 'mercado_pago'
      })

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({ checkout_url: mpData.init_point }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

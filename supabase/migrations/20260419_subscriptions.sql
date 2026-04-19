-- ============================================
-- VYNEX - Mercado Pago Subscriptions & Payment Events
-- ============================================

-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    plan_name TEXT DEFAULT 'vynex_pro_pass',
    status TEXT DEFAULT 'inactive', -- active, inactive, pending
    gateway TEXT DEFAULT 'mercado_pago',
    gateway_customer_id TEXT,
    gateway_subscription_id TEXT,
    gateway_payment_id TEXT,
    amount DECIMAL(12,2) DEFAULT 29.90,
    currency TEXT DEFAULT 'BRL',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    open_finance_access TEXT DEFAULT 'pending_release',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Payment Events Table (Logs)
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    gateway TEXT DEFAULT 'mercado_pago',
    event_type TEXT, -- subscription.created, payment.approved, etc.
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Adjust user_profiles table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='subscription_status') THEN
        ALTER TABLE public.user_profiles ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='open_finance_access') THEN
        ALTER TABLE public.user_profiles ADD COLUMN open_finance_access TEXT DEFAULT 'pending_release';
    END IF;
END $$;

-- 4. Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- 5. Policies
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own subscriptions') THEN
    CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (user_id = auth.uid());
END IF;

-- Admin can manage all (service_role)
-- Webhook will use service_role or a specific function with bypass RLS

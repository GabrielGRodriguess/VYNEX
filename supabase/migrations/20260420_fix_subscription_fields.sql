-- ============================================
-- VYNEX - Mercado Pago Schema Fixes (Incremental)
-- ============================================

-- 1. Update Subscriptions Table with requested fields
DO $$ 
BEGIN 
    -- Column for specific MP ID
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='mercado_pago_preapproval_id') THEN
        ALTER TABLE public.subscriptions ADD COLUMN mercado_pago_preapproval_id TEXT;
    END IF;

    -- Column for Payer Email
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='mercado_pago_payer_email') THEN
        ALTER TABLE public.subscriptions ADD COLUMN mercado_pago_payer_email TEXT;
    END IF;

    -- Column for Gateway Provider (alias for gateway)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='gateway_provider') THEN
        ALTER TABLE public.subscriptions ADD COLUMN gateway_provider TEXT DEFAULT 'mercado_pago';
    END IF;

    -- Column for Subscription Status (explicit name)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='subscription_status') THEN
        ALTER TABLE public.subscriptions ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
    END IF;

    -- Ensure updated_at exists with default
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='updated_at') THEN
        ALTER TABLE public.subscriptions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
    END IF;
END $$;

-- 2. Add Unique constraint if possible (non-destructive)
-- Note: gateway_subscription_id is already likely unique per user, but let's ensure indices for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_gateway_id ON public.subscriptions(gateway_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_mp_id ON public.subscriptions(mercado_pago_preapproval_id);

-- 3. Adjust user_profiles if needed (already has subscription_status from previous migration, but let's be sure)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='subscription_status') THEN
        ALTER TABLE public.user_profiles ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
    END IF;
END $$;

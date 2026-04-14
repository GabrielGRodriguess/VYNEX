-- ============================================
-- VYNEX - Esquema de Tabelas Financeiras
-- Cole este SQL no editor do Supabase (SQL Editor) para corrigir o sistema.
-- ============================================

-- 1. PERFIS DE USUÁRIO (Plano e Onboarding)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    plan_id TEXT DEFAULT 'free',
    role TEXT DEFAULT 'free',
    preferences JSONB DEFAULT '{}'::jsonb,
    onboarding_completed BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CONEXÕES BANCÁRIAS (Pluggy Items)
CREATE TABLE IF NOT EXISTS public.bank_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    itemId TEXT NOT NULL,
    provider TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TRANSAÇÕES FINANCEIRAS
CREATE TABLE IF NOT EXISTS public.finance_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12,2) NOT NULL,
    category TEXT,
    date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    from_bank BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- SEGURANÇA (Row Level Security)
-- ============================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (Cada usuário acessa apenas seus próprios dados)

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own profile') THEN
    CREATE POLICY "Users can manage their own profile" ON user_profiles FOR ALL USING (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own connections') THEN
    CREATE POLICY "Users can manage their own connections" ON bank_connections FOR ALL USING (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own transactions') THEN
    CREATE POLICY "Users can manage their own transactions" ON finance_transactions FOR ALL USING (user_id = auth.uid());
END IF;

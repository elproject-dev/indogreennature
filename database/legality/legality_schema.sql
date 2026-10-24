-- ==============================================================================
-- DATABASE SCHEMA: LEGALITY & SERTIFIKASI CV. INDO GREEN NATURE
-- Tabel Khusus: public.legality_config
-- ==============================================================================

-- 1. Buat Tabel Khusus legality_config
CREATE TABLE IF NOT EXISTS public.legality_config (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian cepat berdasarkan key
CREATE INDEX IF NOT EXISTS idx_legality_config_key ON public.legality_config(key);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.legality_config ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Akses (Policies)
-- Publik dapat membaca konfigurasi legalitas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'public.legality_config'::regclass 
    AND polname = 'Allow public read on legality_config'
  ) THEN
    CREATE POLICY "Allow public read on legality_config" 
      ON public.legality_config FOR SELECT 
      USING (true);
  END IF;

  -- Publik / Admin dapat menyimpan perubahan
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'public.legality_config'::regclass 
    AND polname = 'Allow public insert on legality_config'
  ) THEN
    CREATE POLICY "Allow public insert on legality_config" 
      ON public.legality_config FOR INSERT 
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'public.legality_config'::regclass 
    AND polname = 'Allow public update on legality_config'
  ) THEN
    CREATE POLICY "Allow public update on legality_config" 
      ON public.legality_config FOR UPDATE 
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'public.legality_config'::regclass 
    AND polname = 'Allow public delete on legality_config'
  ) THEN
    CREATE POLICY "Allow public delete on legality_config" 
      ON public.legality_config FOR DELETE 
      USING (true);
  END IF;
END $$;

COMMENT ON TABLE public.legality_config IS 'Tabel konfigurasi terpisah untuk halaman Legalitas & Sertifikasi (CV. Indo Green Nature)';

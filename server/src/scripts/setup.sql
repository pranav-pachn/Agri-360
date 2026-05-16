-- ==========================================
-- AGRI-360 DATABASE & STORAGE MIGRATION
-- ==========================================

-- 1. Create the `crop_reports` table
CREATE TABLE IF NOT EXISTS public.crop_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    crop TEXT NOT NULL,
    location TEXT NOT NULL,
    health NUMERIC NOT NULL,
    risk NUMERIC NOT NULL,
    yield NUMERIC NOT NULL,
    trust_score NUMERIC NOT NULL,
    credit_rating TEXT NOT NULL,
    image_url TEXT,
    severity TEXT,
    sustainability_index NUMERIC,
    confidence NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE public.crop_reports ENABLE ROW LEVEL SECURITY;

-- Allow anonymous & authenticated reads/inserts for MVP
DROP POLICY IF EXISTS "Allow public inserts" ON public.crop_reports;
DROP POLICY IF EXISTS "Allow public reads" ON public.crop_reports;

CREATE POLICY "Allow public inserts" ON public.crop_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public reads" ON public.crop_reports FOR SELECT USING (true);


-- 2. Create the `crop-images` Storage Bucket
-- (Note: If this throws an error, you can also create it manually via Dashboard > Storage > Create Bucket)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'crop-images',
  'crop-images',
  true,
  5242880, -- 5MB limit
  '{image/jpeg,image/png,image/webp}'::TEXT[]
) ON CONFLICT (id) DO UPDATE 
SET public = true, 
    file_size_limit = 5242880, 
    allowed_mime_types = '{image/jpeg,image/png,image/webp}'::TEXT[];

-- Storage Policies for crop-images: Allow public uploads
DROP POLICY IF EXISTS "Give public access to uploads" ON storage.objects;
CREATE POLICY "Give public access to uploads" ON storage.objects
FOR INSERT TO public WITH CHECK (bucket_id = 'crop-images');

-- Storage Policies for crop-images: Allow public viewing
DROP POLICY IF EXISTS "Give public access to view images" ON storage.objects;
CREATE POLICY "Give public access to view images" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'crop-images');

-- ==========================================
-- REALTIME (🔥 WINNING FEATURE)
-- ==========================================
-- Enable Realtime events for the crop_reports table to auto-update the Dashboard
-- (Supabase has a built in publication called `supabase_realtime`)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'crop_reports'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.crop_reports;
    END IF;
END $$;

-- ==========================================
-- 3. Create the `farmers` table (Profile Sync)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.farmers (
    id TEXT PRIMARY KEY, -- Google Sub Auth ID is a string
    name TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public operations on farmers" ON public.farmers;
CREATE POLICY "Allow public operations on farmers" ON public.farmers FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 4. Add `farmer_id` to `crop_reports`
-- ==========================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='crop_reports' AND column_name='farmer_id') THEN
        ALTER TABLE public.crop_reports ADD COLUMN farmer_id TEXT REFERENCES public.farmers(id);
    END IF;
END $$;

-- ==========================================
-- 4. Create the `credit_scores` table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.credit_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id TEXT REFERENCES public.farmers(id),
    score NUMERIC NOT NULL,
    rating TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public operations on credit_scores" ON public.credit_scores;
CREATE POLICY "Allow public operations on credit_scores" ON public.credit_scores FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 5. Create the `loan_applications` table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.loan_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id TEXT NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    crop_report_id UUID REFERENCES public.crop_reports(id) ON DELETE SET NULL,
    requested_amount NUMERIC,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_loan_applications_crop_report_id
    ON public.loan_applications(crop_report_id)
    WHERE crop_report_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_loan_applications_farmer_id ON public.loan_applications(farmer_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON public.loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_created_at ON public.loan_applications(created_at DESC);

ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public operations on loan_applications" ON public.loan_applications;
CREATE POLICY "Allow public operations on loan_applications" ON public.loan_applications FOR ALL USING (true) WITH CHECK (true);


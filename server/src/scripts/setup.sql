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
ALTER PUBLICATION supabase_realtime ADD TABLE public.crop_reports;

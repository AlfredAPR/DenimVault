-- DenimVault Database Schema

-- 1. Create Models Table
CREATE TABLE public.models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    fit_type TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Inventory Table
CREATE TABLE public.inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    quantity INTEGER DEFAULT 0 NOT NULL CHECK (quantity >= 0),
    min_threshold INTEGER DEFAULT 10 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Ensure each model has only one record per size
    UNIQUE(model_id, size)
);

-- 3. Set up Row Level Security (RLS)
-- Since this is an MVP without strict auth yet (or single-user), 
-- we can enable RLS and create open policies for now, or just disable it 
-- depending on the exact MVP security needs. For now, we will enable it 
-- and allow public access for simplicity, but in a real app this should be restricted.
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Allow all operations for MVP (Replace with authenticated user policies later)
CREATE POLICY "Allow public read access on models" ON public.models FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on models" ON public.models FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on models" ON public.models FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on models" ON public.models FOR DELETE USING (true);

CREATE POLICY "Allow public read access on inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on inventory" ON public.inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on inventory" ON public.inventory FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on inventory" ON public.inventory FOR DELETE USING (true);

-- 4. Create function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create triggers
CREATE TRIGGER set_updated_at_models
    BEFORE UPDATE ON public.models
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_inventory
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- 6. Storage for Model Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('models', 'models', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING ( bucket_id = 'models' );
CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'models' );

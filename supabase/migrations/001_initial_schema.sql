-- Daal Mill Website Schema
-- Run this in your Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  price NUMERIC(10, 2),
  unit TEXT NOT NULL DEFAULT 'kg',
  pack_sizes TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);

-- Website content table
CREATE TABLE IF NOT EXISTS website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  image_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_website_content_section_key ON website_content(section_key);

-- Business settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  business_hours TEXT,
  map_url TEXT,
  social_links JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER website_content_updated_at
  BEFORE UPDATE ON website_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER business_settings_updated_at
  BEFORE UPDATE ON business_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read website content"
  ON website_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read business settings"
  ON business_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated admin write policies (SELECT covered by public read policies above)
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert website content"
  ON website_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update website content"
  ON website_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete website content"
  ON website_content FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert business settings"
  ON business_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update business settings"
  ON business_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Seed placeholder business settings (only if empty)
INSERT INTO business_settings (business_name, address, business_hours)
SELECT
  'Your Daal Mill Name',
  'Placeholder address — update through admin panel',
  'Mon–Sat: 9:00 AM – 6:00 PM (Placeholder)'
WHERE NOT EXISTS (SELECT 1 FROM business_settings);

-- Seed placeholder website content
INSERT INTO website_content (section_key, title, content) VALUES
  ('hero_title', NULL, 'Premium Pulses & Daal for Your Kitchen'),
  ('hero_description', NULL, 'Placeholder — Add your business introduction here. We process and supply quality pulses with care and consistency.'),
  ('hero_cta_text', NULL, 'View Our Products'),
  ('hero_supporting', NULL, 'Trusted local pulses manufacturer — content editable from admin panel.'),
  ('home_featured_intro', 'Our Products', 'Explore our range of carefully processed pulses and daal.'),
  ('home_why_choose', 'Why Choose Us', 'Quality Processing: Careful cleaning and sorting of every batch
Fresh Stock: Regular production for consistent supply
Hygienic Packing: Clean packaging for safe delivery
Local Trust: Serving customers with dedication'),
  ('about_title', 'About Us', NULL),
  ('about_intro', 'Introduction', 'Placeholder — Add your business introduction here through the admin panel.'),
  ('about_history', 'Our History', 'Placeholder — Share your business history when ready.'),
  ('about_experience', 'Experience', 'Placeholder — Describe your years of experience in pulses manufacturing.'),
  ('about_mission', 'Our Mission', 'Placeholder — Add your mission statement.'),
  ('about_vision', 'Our Vision', 'Placeholder — Add your vision statement.'),
  ('about_location', 'Location', 'Placeholder — Add details about your mill location and service area.'),
  ('quality_intro', 'Quality & Manufacturing', 'Placeholder — Overview of your quality and manufacturing process.'),
  ('quality_raw_material', 'Raw Material Selection', 'Placeholder — Describe how you select raw pulses.'),
  ('quality_cleaning', 'Cleaning', 'Placeholder — Describe your cleaning process.'),
  ('quality_processing', 'Processing', 'Placeholder — Describe your processing methods.'),
  ('quality_sorting', 'Sorting', 'Placeholder — Describe your sorting standards.'),
  ('quality_qc', 'Quality Control', 'Placeholder — Describe your quality checks.'),
  ('quality_packaging', 'Packaging', 'Placeholder — Describe your packaging approach.'),
  ('quality_other', 'Additional Information', 'Placeholder — Any other quality-related information.')
ON CONFLICT (section_key) DO NOTHING;

-- Admin security: restrict writes to approved admin users only

CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- No direct access to admin_users table from client roles.
-- Managed via service role / SQL editor only.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Seed the business owner as admin
INSERT INTO admin_users (user_id)
VALUES ('dbc10917-e3df-471d-b970-48129f0a0cb7')
ON CONFLICT (user_id) DO NOTHING;

-- Products: replace write policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE TO authenticated
  USING (public.is_admin());

-- Website content: replace write policies
DROP POLICY IF EXISTS "Authenticated users can insert website content" ON website_content;
DROP POLICY IF EXISTS "Authenticated users can update website content" ON website_content;
DROP POLICY IF EXISTS "Authenticated users can delete website content" ON website_content;

CREATE POLICY "Admins can insert website content"
  ON website_content FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update website content"
  ON website_content FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete website content"
  ON website_content FOR DELETE TO authenticated
  USING (public.is_admin());

-- Business settings: replace write policies
DROP POLICY IF EXISTS "Authenticated users can insert business settings" ON business_settings;
DROP POLICY IF EXISTS "Authenticated users can update business settings" ON business_settings;

CREATE POLICY "Admins can insert business settings"
  ON business_settings FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update business settings"
  ON business_settings FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Storage: replace write policies
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

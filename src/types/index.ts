export interface Product {
  id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  price: number | null
  unit: string
  pack_sizes: string[]
  features: string[]
  image_url: string | null
  is_available: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface WebsiteContent {
  id: string
  section_key: string
  title: string | null
  content: string | null
  image_url: string | null
  updated_at: string
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  youtube?: string
  twitter?: string
}

export interface BusinessSettings {
  id: string
  business_name: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  business_hours: string | null
  map_url: string | null
  social_links: SocialLinks
  updated_at: string
}

export interface ProductFormData {
  name: string
  short_description: string
  description: string
  price: string
  unit: string
  pack_sizes: string[]
  features: string[]
  image_url: string | null
  is_available: boolean
  display_order: number
}

export type ContentSectionKey =
  | 'hero_title'
  | 'hero_description'
  | 'hero_cta_text'
  | 'hero_supporting'
  | 'home_featured_intro'
  | 'home_why_choose'
  | 'about_title'
  | 'about_intro'
  | 'about_history'
  | 'about_experience'
  | 'about_mission'
  | 'about_vision'
  | 'about_location'
  | 'quality_intro'
  | 'quality_raw_material'
  | 'quality_cleaning'
  | 'quality_processing'
  | 'quality_sorting'
  | 'quality_qc'
  | 'quality_packaging'
  | 'quality_other'

export type ContentMap = Partial<Record<ContentSectionKey, WebsiteContent>>

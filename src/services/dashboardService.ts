import { supabase } from '../lib/supabase'
import { fetchProducts } from './productService'
import { fetchBusinessSettings } from './contentService'

export interface DashboardStats {
  totalProducts: number
  availableProducts: number
  unavailableProducts: number
  hasBusinessName: boolean
  hasContactInfo: boolean
  hasAddress: boolean
  businessName: string
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [productsRes, settingsRes] = await Promise.all([fetchProducts(), fetchBusinessSettings()])

  const products = productsRes.data
  const settings = settingsRes.data

  return {
    totalProducts: products.length,
    availableProducts: products.filter((p) => p.is_available).length,
    unavailableProducts: products.filter((p) => !p.is_available).length,
    hasBusinessName: Boolean(
      settings?.business_name && settings.business_name !== 'Your Daal Mill Name',
    ),
    hasContactInfo: Boolean(settings?.phone || settings?.whatsapp),
    hasAddress: Boolean(
      settings?.address && !settings.address.includes('Placeholder'),
    ),
    businessName: settings?.business_name ?? '',
  }
}

export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin')
  if (error) return false
  return Boolean(data)
}

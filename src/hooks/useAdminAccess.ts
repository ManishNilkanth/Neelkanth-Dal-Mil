import { useEffect, useState } from 'react'
import { checkIsAdmin } from '../services/dashboardService'

export function useAdminAccess() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkIsAdmin().then((result) => {
      setIsAdmin(result)
      setLoading(false)
    })
  }, [])

  return { isAdmin, loading }
}

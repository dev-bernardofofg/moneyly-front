'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function InitialConfigPage() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona para o dashboard, pois o dialog será mostrado automaticamente
    // se o usuário precisar de configuração inicial
    router.replace('/dashboard')
  }, [router])

  return null
}
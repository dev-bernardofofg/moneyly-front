const requiredEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
} as const

const missing = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missing.length > 0) {
  throw new Error(
    `Variáveis de ambiente obrigatórias não definidas: ${missing.join(', ')}\n` +
    'Verifique seu arquivo .env'
  )
}

export const env = requiredEnvVars as Record<keyof typeof requiredEnvVars, string>

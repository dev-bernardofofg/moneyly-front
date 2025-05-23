"use client"

import { ThemeProvider } from './theme-provider'
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const Contexts = ({ children }: ChildrenProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DS Builder — Dashboard',
  description: 'Build and manage your design system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

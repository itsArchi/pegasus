import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import './globals.css'
import MuiProvider from '@/components/providers/MuiProvider'
import ApolloProvider from '@/components/providers/ApolloProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Japan Fest — Admin Panel',
  description: 'Campaign management admin panel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <MuiProvider>
            <ApolloProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ApolloProvider>
          </MuiProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

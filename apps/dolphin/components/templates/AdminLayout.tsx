'use client'

import { Box, Toolbar } from '@mui/material'
import Sidebar, { SIDEBAR_WIDTH } from '@/components/organisms/Sidebar'
import Topbar from '@/components/organisms/Topbar'
import AuthGuard from '@/components/providers/AuthGuard'
import type { AdminLayoutProps } from '@/types'

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, ml: `${SIDEBAR_WIDTH}px` }}>
          <Topbar title={title} />
          <Toolbar />
          <Box sx={{ p: 4 }}>{children}</Box>
        </Box>
      </Box>
    </AuthGuard>
  )
}

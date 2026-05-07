'use client'

import { useRouter } from 'next/navigation'
import { AppBar, Toolbar, Typography, Box, Avatar, Chip, IconButton, Tooltip } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { SIDEBAR_WIDTH } from './Sidebar'
import { useAuth } from '@/components/providers/AuthProvider'
import type { TopbarProps } from '@/types'
import { getInitials } from '@/utils'

export default function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  const initials = user?.name ? getInitials(user.name) : 'A'

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        bgcolor: '#fff',
        borderBottom: '1px solid',
        borderColor: 'grey.100',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* <Chip
            label="Phoenix API"
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: 11 }}
          /> */}
          {user && (
            <Chip
              label={user.role === 'ADMIN' ? 'Admin' : 'User'}
              size="small"
              color={user.role === 'ADMIN' ? 'error' : 'default'}
              sx={{ fontWeight: 700, fontSize: 11, textTransform: 'capitalize' }}
            />
          )}
          <Tooltip title={user?.name ?? 'User'}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 800 }}>
              {initials}
            </Avatar>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton size="small" onClick={handleLogout} sx={{ color: 'grey.500' }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

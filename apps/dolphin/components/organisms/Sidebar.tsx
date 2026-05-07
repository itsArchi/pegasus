'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider,
} from '@mui/material'
import Image from 'next/image'
import CampaignIcon from '@mui/icons-material/Campaign'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import { GithubIcon } from '@/components/atoms/Icons'

export const SIDEBAR_WIDTH = 240

const NAV_ITEMS = [
  // { label: 'Dashboard', href: '/', icon: <DashboardIcon /> },
  { label: 'Campaign', href: '/campaigns', icon: <CampaignIcon /> },
  { label: 'Users', href: '/users', icon: <PeopleIcon /> },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#111827',
          color: '#fff',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Image
          src="/logo.jpg"
          alt="Japan Fest Logo"
          width={36}
          height={36}
          style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8 }}
        />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
            Japan Fest
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.500', lineHeight: 1 }}>
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      <List sx={{ px: 1.5, pt: 2, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: 2,
                  color: active ? '#fff' : 'grey.400',
                  bgcolor: active ? 'primary.main' : 'transparent',
                  boxShadow: active ? '0 4px 12px rgba(220,38,38,0.35)' : 'none',
                  '&:hover': {
                    bgcolor: active ? 'primary.dark' : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { style: { fontWeight: active ? 700 : 500, fontSize: 14 } } }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'grey.600', fontWeight: 600, letterSpacing: '0.5px' }}>
              PEGASUS
            </Typography>
            <Box
              component="a"
              href="https://github.com/itsArchi"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'grey.600',
                display: 'flex',
                '&:hover': { color: 'grey.300' },
                transition: 'color 0.2s',
              }}
            >
              <GithubIcon size={16} />
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: 'grey.700', fontSize: 10 }}>
            © {new Date().getFullYear()} Japan Fest · v1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation } from '@apollo/client/react'
import Image from 'next/image'
import {
  Box, Paper, Typography, TextField, Button,
  Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LOGIN from '@/graphql/gql/mutations/login.gql'
import type { LoginMutation, LoginMutationVariables } from '@/graphql/gql/generated'
import { useAuth } from '@/components/providers/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.replace('/')
  }, [isAuthenticated, router])

  const [loginMutation, { loading, error }] = useMutation<LoginMutation, LoginMutationVariables>(
    LOGIN,
    {
      onCompleted: (data) => {
        login(data.login.token, data.login.user)
        router.replace('/')
      },
    }
  )

  function validate() {
    const e: typeof errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    if (!form.password) e.password = 'Password wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    loginMutation({ variables: { input: form } })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
          <Image src="/logo.jpg" alt="Japan Fest" width={44} height={44} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>Japan Fest</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Admin Panel</Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.100' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Masuk</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Masuk menggunakan akun yang sudah terdaftar
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              autoFocus
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{ borderRadius: 2, fontWeight: 700, py: 1.5 }}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
            Belum punya akun?{' '}
            <Link href="/register" style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'none' }}>
              Daftar sekarang
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}

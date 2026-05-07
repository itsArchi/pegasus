'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation } from '@apollo/client/react'
import Image from 'next/image'
import {
  Box, Paper, Typography, TextField, Button,
  Alert, CircularProgress, InputAdornment, IconButton, MenuItem,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import REGISTER from '@/graphql/gql/mutations/register.gql'
import type { RegisterMutation, RegisterMutationVariables, UserRole } from '@/graphql/gql/generated'
import { useAuth } from '@/components/providers/AuthProvider'

interface FormState {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

const EMPTY: FormState = { name: '', email: '', password: '', confirmPassword: '', role: 'USER' }

export default function RegisterPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.replace('/')
  }, [isAuthenticated, router])

  const [registerMutation, { loading, error }] = useMutation<RegisterMutation, RegisterMutationVariables>(
    REGISTER,
    {
      onCompleted: (data) => {
        login(data.register.token, data.register.user)
        router.replace('/')
      },
    }
  )

  function validate() {
    const e: typeof errors = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Nama minimal 2 karakter'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    if (form.password.length < 8) e.password = 'Password minimal 8 karakter'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Password tidak cocok'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    registerMutation({
      variables: {
        input: { name: form.name, email: form.email, password: form.password, role: form.role },
      },
    })
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
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Buat Akun</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Daftarkan akun baru untuk mengakses admin panel
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Nama Lengkap"
              fullWidth
              autoFocus
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password || 'Minimal 8 karakter'}
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
            <TextField
              label="Konfirmasi Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
            />
            <TextField
              label="Role"
              fullWidth
              select
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value as UserRole)}
              disabled={loading}
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{ borderRadius: 2, fontWeight: 700, py: 1.5 }}
            >
              {loading ? 'Mendaftarkan...' : 'Buat Akun'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
            Sudah punya akun?{' '}
            <Link href="/login" style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'none' }}>
              Masuk di sini
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}

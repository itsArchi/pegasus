'use client'

import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, CircularProgress, Alert, Box,
  FormControlLabel, Switch,
} from '@mui/material'
import CREATE_USER from '@/graphql/gql/mutations/createUser.gql'
import UPDATE_USER from '@/graphql/gql/mutations/updateUser.gql'
import type {
  User, CreateUserMutation, CreateUserMutationVariables,
  UpdateUserMutation, UpdateUserMutationVariables, UserRole,
} from '@/graphql/gql/generated'

import type { UserFormDialogProps, UserFormState as FormState } from '@/types'

const EMPTY: FormState = { name: '', email: '', password: '', role: 'USER', is_active: true }

export default function UserFormDialog({ open, user, onClose }: UserFormDialogProps) {
  const isEdit = !!user
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(
        user
          ? { name: user.name, email: user.email, password: '', role: user.role, is_active: user.is_active }
          : EMPTY
      )
      setErrors({})
      setServerError('')
    }
  }, [open, user])

  const [createUser, { loading: creating }] = useMutation<
    CreateUserMutation, CreateUserMutationVariables
  >(CREATE_USER, {
    onCompleted: onClose,
    onError: (e) => setServerError(e.message),
  })

  const [updateUser, { loading: updating }] = useMutation<
    UpdateUserMutation, UpdateUserMutationVariables
  >(UPDATE_USER, {
    onCompleted: onClose,
    onError: (e) => setServerError(e.message),
  })

  const loading = creating || updating

  function validate() {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Nama minimal 2 karakter'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    if (!isEdit && form.password.length < 8) e.password = 'Password minimal 8 karakter'
    if (isEdit && form.password.length > 0 && form.password.length < 8) e.password = 'Password minimal 8 karakter'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function handleSubmit() {
    if (!validate()) return
    setServerError('')
    if (isEdit) {
      const input = {
        name: form.name,
        email: form.email,
        role: form.role,
        is_active: form.is_active,
        ...(form.password ? { password: form.password } : {}),
      }
      updateUser({ variables: { id: user.id, input } })
    } else {
      createUser({
        variables: {
          input: { name: form.name, email: form.email, password: form.password, role: form.role },
        },
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>
        {isEdit ? 'Edit User' : 'Buat User Baru'}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label="Nama Lengkap"
            fullWidth
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
            label={isEdit ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
            type="password"
            fullWidth
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={!!errors.password}
            helperText={errors.password || (isEdit ? '' : 'Minimal 8 karakter')}
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

          {isEdit && (
            <FormControlLabel
              control={
                <Switch
                  checked={form.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  disabled={loading}
                />
              }
              label={form.is_active ? 'Akun aktif' : 'Akun nonaktif'}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isEdit ? 'Simpan Perubahan' : 'Buat User'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, CircularProgress, Alert, Box,
  Typography, IconButton,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import CREATE_CAMPAIGN from '@/graphql/gql/mutations/createCampaign.gql'
import UPDATE_CAMPAIGN from '@/graphql/gql/mutations/updateCampaign.gql'
import type {
  Campaign, CreateCampaignMutation, CreateCampaignMutationVariables,
  UpdateCampaignMutation, UpdateCampaignMutationVariables, CampaignStatus,
} from '@/graphql/gql/generated'

import type { CampaignFormDialogProps } from '@/types'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PHOENIX_BASE_URL = (process.env.NEXT_PUBLIC_PHOENIX_URL ?? 'http://localhost:4000/graphql').replace(/\/graphql$/, '')

function resolveImageUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('blob:')) return url
  return `${PHOENIX_BASE_URL}${url}`
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const EMPTY = { name: '', slug: '', description: '', status: 'DRAFT' as CampaignStatus }

export default function CampaignFormDialog({ open, campaign, onClose }: CampaignFormDialogProps) {
  const isEdit = !!campaign
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState<Partial<typeof EMPTY>>({})
  const [serverError, setServerError] = useState('')

  // Image state
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setForm(
        campaign
          ? { name: campaign.name, slug: campaign.slug, description: campaign.description ?? '', status: campaign.status }
          : EMPTY
      )
      setImageUrl(campaign?.image_url ?? null)
      setImagePreview(resolveImageUrl(campaign?.image_url ?? null))
      setErrors({})
      setServerError('')
      setUploadError('')
    }
  }, [open, campaign])

  const [createCampaign, { loading: creating }] = useMutation<
    CreateCampaignMutation, CreateCampaignMutationVariables
  >(CREATE_CAMPAIGN, {
    onCompleted: onClose,
    onError: (e) => setServerError(e.message),
  })

  const [updateCampaign, { loading: updating }] = useMutation<
    UpdateCampaignMutation, UpdateCampaignMutationVariables
  >(UPDATE_CAMPAIGN, {
    onCompleted: onClose,
    onError: (e) => setServerError(e.message),
  })

  const loading = creating || updating

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')
    setImagePreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch(`${PHOENIX_BASE_URL}/upload/image`, { method: 'POST', body })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Upload gagal')
      }
      const data: { url: string } = await res.json()
      setImageUrl(data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload gagal')
      setImagePreview(resolveImageUrl(campaign?.image_url ?? null))
      setImageUrl(campaign?.image_url ?? null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleRemoveImage() {
    setImageUrl(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function validate() {
    const e: Partial<typeof EMPTY> = {}
    if (!form.name.trim()) e.name = 'Nama wajib diisi'
    if (!form.slug.trim()) e.slug = 'Slug wajib diisi'
    else if (!SLUG_RE.test(form.slug)) e.slug = 'Slug hanya huruf kecil, angka, dan tanda hubung'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(field: keyof typeof EMPTY, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'name' && !isEdit) next.slug = toSlug(value)
      return next
    })
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function handleSubmit() {
    if (!validate()) return
    setServerError('')
    const input = {
      name: form.name,
      slug: form.slug,
      description: form.description || undefined,
      status: form.status,
      image_url: imageUrl ?? undefined,
    }
    if (isEdit) {
      updateCampaign({ variables: { id: campaign.id, input } })
    } else {
      createCampaign({ variables: { input } })
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
        {isEdit ? 'Edit Campaign' : 'Buat Campaign Baru'}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label="Nama Campaign"
            fullWidth
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading}
          />
          <TextField
            label="Slug"
            fullWidth
            value={form.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            error={!!errors.slug}
            helperText={errors.slug || 'Contoh: tokyo-natsu-matsuri-2026'}
            disabled={loading}
            slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: 14 } } }}
          />
          <TextField
            label="Deskripsi"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Status"
            fullWidth
            select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={loading}
          >
            <MenuItem value="DRAFT">Draft</MenuItem>
            <MenuItem value="PUBLISHED">Published</MenuItem>
          </TextField>

          {/* Image Upload */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Gambar Campaign
            </Typography>

            {uploadError && (
              <Alert severity="error" sx={{ mb: 1.5 }}>{uploadError}</Alert>
            )}

            {imagePreview ? (
              <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'grey.200' }}>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                />
                {uploading && (
                  <Box sx={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.5)',
                  }}>
                    <CircularProgress size={32} sx={{ color: 'white' }} />
                  </Box>
                )}
                {!uploading && (
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute', top: 8, right: 8,
                      bgcolor: 'error.main', color: 'white',
                      '&:hover': { bgcolor: 'error.dark' },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ) : (
              <Box
                onClick={() => !uploading && fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed',
                  borderColor: uploading ? 'grey.300' : 'grey.400',
                  borderRadius: 2,
                  py: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  cursor: uploading ? 'default' : 'pointer',
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: uploading ? 'grey.300' : 'error.main' },
                }}
              >
                {uploading
                  ? <CircularProgress size={28} color="error" />
                  : <CloudUploadIcon sx={{ fontSize: 36, color: 'grey.400' }} />
                }
                <Typography variant="body2" color="text.secondary">
                  {uploading ? 'Mengunggah...' : 'Klik untuk pilih gambar (maks. 5 MB)'}
                </Typography>
              </Box>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={loading || uploading} variant="outlined">
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || uploading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isEdit ? 'Simpan Perubahan' : 'Buat Campaign'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

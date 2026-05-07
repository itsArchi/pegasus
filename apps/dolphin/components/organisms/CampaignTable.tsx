'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useMutation } from '@apollo/client/react'
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Box, Typography,
  Alert, Tooltip, Button, CircularProgress,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import StatusChip from '@/components/molecules/StatusChip'
import { formatDate } from '@/utils'
import GET_CAMPAIGNS from '@/graphql/gql/queries/getCampaigns.gql'
import DELETE_CAMPAIGN from '@/graphql/gql/mutations/deleteCampaign.gql'
import type {
  GetCampaignsQuery,
  DeleteCampaignMutation,
  DeleteCampaignMutationVariables,
  Campaign,
} from '@/graphql/gql/generated'
import CampaignFormDialog from './CampaignFormDialog'
import ConfirmDialog from './ConfirmDialog'

export default function CampaignTable() {
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Campaign | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null)

  const { data, loading, error, refetch } = useQuery<GetCampaignsQuery>(GET_CAMPAIGNS, {
    fetchPolicy: 'cache-and-network',
  })

  const [deleteCampaign, { loading: deleting }] = useMutation<
    DeleteCampaignMutation,
    DeleteCampaignMutationVariables
  >(DELETE_CAMPAIGN, {
    onCompleted: () => {
      setDeleteTarget(null)
      refetch()
    },
  })

  function handleEdit(campaign: Campaign) {
    setEditTarget(campaign)
    setFormOpen(true)
  }

  function handleCreate() {
    setEditTarget(null)
    setFormOpen(true)
  }

  function handleFormClose() {
    setFormOpen(false)
    setEditTarget(null)
    refetch()
  }

  function handleDeleteConfirm() {
    if (deleteTarget) {
      deleteCampaign({ variables: { id: deleteTarget.id } })
    }
  }

  const campaigns = data?.campaigns.data ?? []

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Campaign
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.campaigns.total ?? 0} campaign terdaftar
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 2 }}>
          Buat Campaign
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Gagal memuat data: {error.message}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Dibuat</TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !data
              ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, py: 6 }}>
                        <CircularProgress size={24} color="error" />
                        <Typography color="text.secondary">Memuat data campaign...</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              : campaigns.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          Tidak ada campaign
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Belum ada campaign yang terdaftar. Klik &quot;Buat Campaign&quot; untuk membuat yang pertama.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              : campaigns.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{c.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary', fontFamily: 'monospace' }}>
                        {c.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={c.status} />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                        {formatDate(c.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(c)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus">
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(c)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CampaignFormDialog open={formOpen} campaign={editTarget} onClose={handleFormClose} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Campaign"
        message={`Yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  )
}

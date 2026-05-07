'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Box, Typography,
  Alert, Tooltip, Button, CircularProgress, Chip,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import GET_USERS from '@/graphql/gql/queries/getUsers.gql'
import DELETE_USER from '@/graphql/gql/mutations/deleteUser.gql'
import type {
  GetUsersQuery,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  User,
} from '@/graphql/gql/generated'
import type { UserFilter as Filter } from '@/types'
import { formatDate } from '@/utils'
import UserFormDialog from './UserFormDialog'
import ConfirmDialog from './ConfirmDialog'

export default function UserTable() {
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  const { data, loading, error, refetch } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  })

  const [deleteUser, { loading: deleting }] = useMutation<
    DeleteUserMutation,
    DeleteUserMutationVariables
  >(DELETE_USER, {
    onCompleted: () => {
      setDeleteTarget(null)
      refetch()
    },
  })

  function handleEdit(user: User) {
    setEditTarget(user)
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
      deleteUser({ variables: { id: deleteTarget.id } })
    }
  }

  const allUsers = data?.users.data ?? []
  const users = useMemo(
    () => (filter === 'all' ? allUsers : allUsers.filter((u) => u.role === filter)),
    [allUsers, filter],
  )

  const counts = useMemo(() => {
    return {
      all: allUsers.length,
      admin: allUsers.filter((u) => u.role === 'ADMIN').length,
      user: allUsers.filter((u) => u.role === 'USER').length,
    }
  }, [allUsers])

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {counts.all} pengguna · {counts.admin} admin · {counts.user} user
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 2 }}>
          Buat User
        </Button>
      </Box>

      <ToggleButtonGroup
        size="small"
        value={filter}
        exclusive
        onChange={(_, v) => v && setFilter(v)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="all">Semua ({counts.all})</ToggleButton>
        <ToggleButton value="ADMIN">Admin ({counts.admin})</ToggleButton>
        <ToggleButton value="USER">User ({counts.user})</ToggleButton>
      </ToggleButtonGroup>

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
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Dibuat</TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !data
              ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, py: 6 }}>
                        <CircularProgress size={24} color="error" />
                        <Typography color="text.secondary">Memuat data user...</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              : users.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          Tidak ada user
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filter === 'all'
                            ? 'Belum ada user terdaftar. Klik "Buat User" untuk menambah.'
                            : `Tidak ada user dengan role ${filter}.`}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              : users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{u.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                        {u.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.role === 'ADMIN' ? 'Admin' : 'User'}
                        size="small"
                        color={u.role === 'ADMIN' ? 'error' : 'default'}
                        sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.is_active ? 'Aktif' : 'Nonaktif'}
                        size="small"
                        color={u.is_active ? 'success' : 'default'}
                        variant={u.is_active ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                        {formatDate(u.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(u)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus">
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(u)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserFormDialog open={formOpen} user={editTarget} onClose={handleFormClose} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus User"
        message={`Yakin ingin menghapus "${deleteTarget?.name}" (${deleteTarget?.email})? Tindakan ini tidak dapat dibatalkan.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  )
}

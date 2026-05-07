import { Chip } from '@mui/material'
import type { CampaignStatus } from '@/graphql/gql/generated'

export default function StatusChip({ status }: { status: CampaignStatus }) {
  return (
    <Chip
      label={status}
      size="small"
      color={status === 'PUBLISHED' ? 'success' : 'default'}
      variant={status === 'PUBLISHED' ? 'filled' : 'outlined'}
      sx={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.05em' }}
    />
  )
}

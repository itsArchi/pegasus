import type { Campaign, User, UserRole } from '@/graphql/gql/generated'

export interface AdminLayoutProps {
  title: string
  children: React.ReactNode
}

export interface TopbarProps {
  title: string
}

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export interface UserFormDialogProps {
  open: boolean
  user: User | null
  onClose: () => void
}

export interface CampaignFormDialogProps {
  open: boolean
  campaign: Campaign | null
  onClose: () => void
}

export type CampaignStatus = 'DRAFT' | 'PUBLISHED'

export interface Campaign {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  status: CampaignStatus
  created_at: string
  updated_at: string
}

export interface CampaignListDro {
  data: Campaign[]
  total: number
}

export interface CreateCampaignInput {
  id?: string
  name: string
  slug: string
  description?: string
  image_url?: string
  status?: CampaignStatus
}

export interface UpdateCampaignInput {
  name?: string
  slug?: string
  description?: string
  image_url?: string
  status?: CampaignStatus
}

export interface GetCampaignsQuery {
  campaigns: CampaignListDro
}

export interface GetCampaignQuery {
  campaign: Campaign
}

export interface GetCampaignQueryVariables {
  id: string
}

export interface CreateCampaignMutation {
  createCampaign: Campaign
}

export interface CreateCampaignMutationVariables {
  input: CreateCampaignInput
}

export interface UpdateCampaignMutation {
  updateCampaign: Campaign
}

export interface UpdateCampaignMutationVariables {
  id: string
  input: UpdateCampaignInput
}

export interface DeleteCampaignMutation {
  deleteCampaign: { success: boolean; message: string }
}

export interface DeleteCampaignMutationVariables {
  id: string
}

export type UserRole = 'ADMIN' | 'USER'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserListDro {
  data: User[]
  total: number
}

export interface CreateUserInput {
  id?: string
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
  role?: UserRole
  is_active?: boolean
}

export interface GetUsersQuery {
  users: UserListDro
}

export interface CreateUserMutation {
  createUser: User
}

export interface CreateUserMutationVariables {
  input: CreateUserInput
}

export interface UpdateUserMutation {
  updateUser: User
}

export interface UpdateUserMutationVariables {
  id: string
  input: UpdateUserInput
}

export interface DeleteUserMutation {
  deleteUser: { success: boolean; message: string }
}

export interface DeleteUserMutationVariables {
  id: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
}

export interface AuthPayload {
  token: string
  user: AuthUser
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface LoginMutation {
  login: AuthPayload
}

export interface LoginMutationVariables {
  input: LoginInput
}

export interface RegisterMutation {
  register: AuthPayload
}

export interface RegisterMutationVariables {
  input: RegisterInput
}

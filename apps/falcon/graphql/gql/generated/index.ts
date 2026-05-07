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

export interface GetCampaignBySlugQuery {
  campaignBySlug: Campaign | null
}

export interface GetCampaignBySlugQueryVariables {
  slug: string
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

export interface CreateSubmissionInput {
  campaign_id: string
  name: string
  email: string
  phone?: string
}

export interface SubmitResultDro {
  success: boolean
  message: string
  submission?: { id: string; submitted_at: string }
}

export interface SubmitRegistrationMutation {
  submitRegistration: SubmitResultDro
}

export interface SubmitRegistrationMutationVariables {
  input: CreateSubmissionInput
}

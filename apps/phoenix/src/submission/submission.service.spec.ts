import { Test, TestingModule } from '@nestjs/testing'
import { SubmissionService } from './submission.service'
import { SubmissionRepository } from './psql/submission.repository'
import { MailService } from '../mail/mail.service'
import { CampaignService } from '../campaign/campaign.service'
import { CampaignStatus } from '../campaign/campaign.interface'

const mockSubmission = {
  id: 'sub-001',
  campaign_id: 'uuid-camp-001',
  name: 'Hiroshi Matsuda',
  email: 'hiroshi@japan.jp',
  phone: '08123456789',
  created_at: '2026-05-01T00:00:00.000Z',
}

const mockCampaign = {
  id: 'uuid-camp-001',
  name: 'Tokyo Natsu Matsuri 2026',
  slug: 'tokyo-natsu-matsuri-2026',
  description: 'Festival',
  status: CampaignStatus.PUBLISHED,
  created_at: '2026-05-01T00:00:00.000Z',
  updated_at: '2026-05-01T00:00:00.000Z',
}

const mockRepo = {
  create: jest.fn(),
  findByCampaign: jest.fn(),
}

const mockMail = {
  sendRegistrationConfirmation: jest.fn(),
}

const mockCampaignService = {
  findById: jest.fn(),
}

describe('SubmissionService', () => {
  let service: SubmissionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionService,
        { provide: SubmissionRepository, useValue: mockRepo },
        { provide: MailService, useValue: mockMail },
        { provide: CampaignService, useValue: mockCampaignService },
      ],
    }).compile()

    service = module.get<SubmissionService>(SubmissionService)
    jest.clearAllMocks()
  })

  describe('submit', () => {
    it('creates submission and triggers email fire-and-forget', async () => {
      mockRepo.create.mockResolvedValue(mockSubmission)
      mockCampaignService.findById.mockResolvedValue(mockCampaign)
      mockMail.sendRegistrationConfirmation.mockResolvedValue(undefined)

      const input = {
        campaign_id: 'uuid-camp-001',
        name: 'Hiroshi Matsuda',
        email: 'hiroshi@japan.jp',
        phone: '08123456789',
      }

      const result = await service.submit(input)

      expect(result).toEqual(mockSubmission)
      expect(mockRepo.create).toHaveBeenCalledWith(input)
    })

    it('still returns submission even when email fails', async () => {
      mockRepo.create.mockResolvedValue(mockSubmission)
      mockCampaignService.findById.mockRejectedValue(new Error('Campaign not found'))

      const input = { campaign_id: 'bad-id', name: 'Test', email: 'test@test.com' }
      const result = await service.submit(input)

      expect(result).toEqual(mockSubmission)
    })
  })

  describe('findByCampaign', () => {
    it('returns submissions for a campaign', async () => {
      mockRepo.findByCampaign.mockResolvedValue([mockSubmission])
      const result = await service.findByCampaign('uuid-camp-001')
      expect(result).toEqual([mockSubmission])
      expect(mockRepo.findByCampaign).toHaveBeenCalledWith('uuid-camp-001')
    })

    it('returns empty array when no submissions', async () => {
      mockRepo.findByCampaign.mockResolvedValue([])
      expect(await service.findByCampaign('uuid-camp-001')).toEqual([])
    })
  })
})

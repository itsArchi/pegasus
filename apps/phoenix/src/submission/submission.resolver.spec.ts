import { Test, TestingModule } from '@nestjs/testing'
import { SubmissionResolver } from './submission.resolver'
import { SubmissionService } from './submission.service'

const mockSubmission = {
  id: 'sub-001',
  campaign_id: 'uuid-camp-001',
  name: 'Hiroshi Matsuda',
  email: 'hiroshi@japan.jp',
  phone: '08123456789',
  created_at: '2026-05-01T00:00:00.000Z',
}

const mockService = {
  submit: jest.fn(),
  findByCampaign: jest.fn(),
}

describe('SubmissionResolver', () => {
  let resolver: SubmissionResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionResolver,
        { provide: SubmissionService, useValue: mockService },
      ],
    }).compile()

    resolver = module.get<SubmissionResolver>(SubmissionResolver)
    jest.clearAllMocks()
  })

  describe('submitRegistration (Mutation)', () => {
    it('returns success SubmitResultDro with submission', async () => {
      mockService.submit.mockResolvedValue(mockSubmission)

      const input = { campaign_id: 'uuid-camp-001', name: 'Hiroshi Matsuda', email: 'hiroshi@japan.jp' }
      const result = await resolver.submitRegistration(input)

      expect(result.success).toBe(true)
      expect(result.submission).toEqual(mockSubmission)
      expect(mockService.submit).toHaveBeenCalledWith(input)
    })

    it('propagates error when submission fails', async () => {
      mockService.submit.mockRejectedValue(new Error('DB error'))

      await expect(
        resolver.submitRegistration({ campaign_id: 'bad', name: 'X', email: 'x@x.com' }),
      ).rejects.toThrow('DB error')
    })
  })

  describe('findByCampaign (Query: submissions)', () => {
    it('returns SubmissionListDro with data and total', async () => {
      mockService.findByCampaign.mockResolvedValue([mockSubmission])

      const result = await resolver.findByCampaign('uuid-camp-001')
      expect(result.data).toEqual([mockSubmission])
      expect(result.total).toBe(1)
    })

    it('returns empty list when no submissions', async () => {
      mockService.findByCampaign.mockResolvedValue([])

      const result = await resolver.findByCampaign('uuid-camp-001')
      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
    })
  })
})

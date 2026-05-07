jest.mock('./psql/campaign.repository')

import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { CampaignResolver } from './campaign.resolver'
import { CampaignService } from './campaign.service'
import { ICampaign, CampaignStatus } from './campaign.interface'
import { CreateCampaignInput, UpdateCampaignInput } from './dto/campaign.dto'

const mockCampaign: ICampaign = {
  id: 'uuid-001',
  name: 'Tokyo Natsu Matsuri 2026',
  slug: 'tokyo-natsu-matsuri-2026',
  description: 'Festival kembang api dan budaya Jepang',
  status: CampaignStatus.DRAFT,
  created_at: '2026-05-01T00:00:00.000Z',
  updated_at: '2026-05-01T00:00:00.000Z',
}

const mockService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('CampaignResolver', () => {
  let resolver: CampaignResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignResolver,
        { provide: CampaignService, useValue: mockService },
      ],
    }).compile()

    resolver = module.get<CampaignResolver>(CampaignResolver)
    jest.clearAllMocks()
  })

  describe('findAll (Query: campaigns)', () => {
    it('returns CampaignListDro with data and total', async () => {
      mockService.findAll.mockResolvedValue([mockCampaign])
      const result = await resolver.findAll()
      expect(result.data).toEqual([mockCampaign])
      expect(result.total).toBe(1)
    })

    it('returns empty list when no campaigns', async () => {
      mockService.findAll.mockResolvedValue([])
      const result = await resolver.findAll()
      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
    })
  })

  describe('findById (Query: campaign)', () => {
    it('returns campaign by id', async () => {
      mockService.findById.mockResolvedValue(mockCampaign)
      expect(await resolver.findById('uuid-001')).toEqual(mockCampaign)
    })

    it('propagates NotFoundException from service', async () => {
      mockService.findById.mockRejectedValue(new NotFoundException())
      await expect(resolver.findById('bad-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('findBySlug (Query: campaignBySlug)', () => {
    it('returns campaign when found', async () => {
      mockService.findBySlug.mockResolvedValue(mockCampaign)
      expect(await resolver.findBySlug('tokyo-natsu-matsuri-2026')).toEqual(mockCampaign)
    })

    it('returns null when not found', async () => {
      mockService.findBySlug.mockResolvedValue(null)
      expect(await resolver.findBySlug('unknown')).toBeNull()
    })
  })

  describe('createCampaign (Mutation)', () => {
    it('creates and returns campaign', async () => {
      mockService.create.mockResolvedValue(mockCampaign)
      const input: CreateCampaignInput = {
        name: 'Tokyo Natsu Matsuri 2026',
        slug: 'tokyo-natsu-matsuri-2026',
        description: 'Festival kembang api',
        status: CampaignStatus.DRAFT,
      }
      expect(await resolver.createCampaign(input)).toEqual(mockCampaign)
      expect(mockService.create).toHaveBeenCalledWith(input)
    })
  })

  describe('updateCampaign (Mutation)', () => {
    it('updates and returns campaign', async () => {
      const updated = { ...mockCampaign, status: CampaignStatus.PUBLISHED }
      mockService.update.mockResolvedValue(updated)
      const input: UpdateCampaignInput = { status: CampaignStatus.PUBLISHED }
      expect(await resolver.updateCampaign('uuid-001', input)).toEqual(updated)
      expect(mockService.update).toHaveBeenCalledWith('uuid-001', input)
    })
  })

  describe('deleteCampaign (Mutation)', () => {
    it('returns success DRO when deleted', async () => {
      mockService.delete.mockResolvedValue(true)
      const result = await resolver.deleteCampaign('uuid-001')
      expect(result.success).toBe(true)
      expect(result.message).toContain('uuid-001')
    })

    it('propagates NotFoundException from service', async () => {
      mockService.delete.mockRejectedValue(new NotFoundException())
      await expect(resolver.deleteCampaign('bad-id')).rejects.toThrow(NotFoundException)
    })
  })
})

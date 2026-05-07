jest.mock('./psql/campaign.repository')

import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { CampaignService } from './campaign.service'
import { CampaignRepository } from './psql/campaign.repository'
import { ICampaign, CampaignStatus } from './campaign.interface'

const mockCampaign: ICampaign = {
  id: 'uuid-001',
  name: 'Tokyo Natsu Matsuri 2026',
  slug: 'tokyo-natsu-matsuri-2026',
  description: 'Festival kembang api dan budaya Jepang',
  status: CampaignStatus.DRAFT,
  created_at: '2026-05-01T00:00:00.000Z',
  updated_at: '2026-05-01T00:00:00.000Z',
}

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('CampaignService', () => {
  let service: CampaignService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        { provide: CampaignRepository, useValue: mockRepo },
      ],
    }).compile()

    service = module.get<CampaignService>(CampaignService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('returns all campaigns', async () => {
      mockRepo.findAll.mockResolvedValue([mockCampaign])
      const result = await service.findAll()
      expect(result).toEqual([mockCampaign])
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1)
    })

    it('returns empty array when no campaigns', async () => {
      mockRepo.findAll.mockResolvedValue([])
      expect(await service.findAll()).toEqual([])
    })
  })

  describe('findById', () => {
    it('returns campaign when found', async () => {
      mockRepo.findById.mockResolvedValue(mockCampaign)
      expect(await service.findById('uuid-001')).toEqual(mockCampaign)
    })

    it('throws NotFoundException when not found', async () => {
      mockRepo.findById.mockResolvedValue(null)
      await expect(service.findById('bad-id')).rejects.toThrow(NotFoundException)
      await expect(service.findById('bad-id')).rejects.toThrow('"bad-id" not found')
    })
  })

  describe('findBySlug', () => {
    it('returns campaign when found', async () => {
      mockRepo.findBySlug.mockResolvedValue(mockCampaign)
      expect(await service.findBySlug('tokyo-natsu-matsuri-2026')).toEqual(mockCampaign)
    })

    it('returns null when not found', async () => {
      mockRepo.findBySlug.mockResolvedValue(null)
      expect(await service.findBySlug('unknown-slug')).toBeNull()
    })
  })

  describe('create', () => {
    it('creates and returns new campaign', async () => {
      mockRepo.create.mockResolvedValue(mockCampaign)
      const input = {
        name: 'Tokyo Natsu Matsuri 2026',
        slug: 'tokyo-natsu-matsuri-2026',
        description: 'Festival kembang api',
        status: CampaignStatus.DRAFT,
      }
      const result = await service.create(input)
      expect(result).toEqual(mockCampaign)
      expect(mockRepo.create).toHaveBeenCalledWith(input)
    })
  })

  describe('update', () => {
    it('updates and returns campaign', async () => {
      const updated = { ...mockCampaign, name: 'Updated Name', status: CampaignStatus.PUBLISHED }
      mockRepo.update.mockResolvedValue(updated)
      const result = await service.update('uuid-001', { name: 'Updated Name', status: CampaignStatus.PUBLISHED })
      expect(result).toEqual(updated)
      expect(mockRepo.update).toHaveBeenCalledWith('uuid-001', { name: 'Updated Name', status: CampaignStatus.PUBLISHED })
    })
  })

  describe('delete', () => {
    it('returns true when campaign deleted', async () => {
      mockRepo.delete.mockResolvedValue(true)
      expect(await service.delete('uuid-001')).toBe(true)
    })

    it('throws NotFoundException when campaign not found', async () => {
      mockRepo.delete.mockResolvedValue(false)
      await expect(service.delete('bad-id')).rejects.toThrow(NotFoundException)
    })
  })
})

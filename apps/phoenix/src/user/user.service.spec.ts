import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserService } from './user.service'
import { UserRepository } from './psql/user.repository'
import { UserRole } from './user.interface'
import type { IUser } from './user.interface'

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('$2b$12$hashed')),
  compare: jest.fn(),
}))

const mockUser: IUser = {
  id: 'uuid-user-001',
  name: 'Sakura Yamamoto',
  email: 'sakura@japan.jp',
  password_hash: '$2b$12$hashed',
  role: UserRole.USER,
  is_active: true,
  created_at: '2026-05-01T00:00:00.000Z',
  updated_at: '2026-05-01T00:00:00.000Z',
}

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockRepo },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('returns all users', async () => {
      mockRepo.findAll.mockResolvedValue([mockUser])
      expect(await service.findAll()).toEqual([mockUser])
    })

    it('returns empty array when no users', async () => {
      mockRepo.findAll.mockResolvedValue([])
      expect(await service.findAll()).toEqual([])
    })
  })

  describe('findById', () => {
    it('returns user when found', async () => {
      mockRepo.findById.mockResolvedValue(mockUser)
      expect(await service.findById('uuid-user-001')).toEqual(mockUser)
    })

    it('throws NotFoundException when not found', async () => {
      mockRepo.findById.mockResolvedValue(null)
      await expect(service.findById('bad-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('findByEmail', () => {
    it('returns user when found', async () => {
      mockRepo.findByEmail.mockResolvedValue(mockUser)
      expect(await service.findByEmail('sakura@japan.jp')).toEqual(mockUser)
    })

    it('returns null when not found', async () => {
      mockRepo.findByEmail.mockResolvedValue(null)
      expect(await service.findByEmail('unknown@email.com')).toBeNull()
    })
  })

  describe('create', () => {
    it('hashes password and creates user', async () => {
      mockRepo.create.mockResolvedValue(mockUser)
      const input = { name: 'Sakura Yamamoto', email: 'sakura@japan.jp', password: 'plainpass', role: UserRole.USER }

      const result = await service.create(input)

      expect(bcrypt.hash).toHaveBeenCalledWith('plainpass', 12)
      expect(mockRepo.create).toHaveBeenCalledWith({ ...input, password_hash: '$2b$12$hashed' })
      expect(result).toEqual(mockUser)
    })
  })

  describe('update', () => {
    it('updates user without changing password when not provided', async () => {
      const updated = { ...mockUser, name: 'Sakura Updated' }
      mockRepo.update.mockResolvedValue(updated)

      const result = await service.update('uuid-user-001', { name: 'Sakura Updated' })

      expect(bcrypt.hash).not.toHaveBeenCalled()
      expect(result.name).toBe('Sakura Updated')
    })

    it('hashes new password when provided', async () => {
      mockRepo.update.mockResolvedValue(mockUser)

      await service.update('uuid-user-001', { password: 'newpassword' })

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 12)
      expect(mockRepo.update).toHaveBeenCalledWith(
        'uuid-user-001',
        expect.objectContaining({ password_hash: '$2b$12$hashed' }),
      )
    })
  })

  describe('delete', () => {
    it('returns true when user deleted', async () => {
      mockRepo.delete.mockResolvedValue(true)
      expect(await service.delete('uuid-user-001')).toBe(true)
    })

    it('throws NotFoundException when user not found', async () => {
      mockRepo.delete.mockResolvedValue(false)
      await expect(service.delete('bad-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('validatePassword', () => {
    it('returns true when password matches', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true)
      expect(await service.validatePassword('plainpass', '$2b$12$hashed')).toBe(true)
    })

    it('returns false when password does not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false)
      expect(await service.validatePassword('wrongpass', '$2b$12$hashed')).toBe(false)
    })
  })
})

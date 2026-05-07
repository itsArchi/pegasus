import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { UserRole } from './user.interface'
import type { IUser } from './user.interface'

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

const mockService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('UserResolver', () => {
  let resolver: UserResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: mockService },
      ],
    }).compile()

    resolver = module.get<UserResolver>(UserResolver)
    jest.clearAllMocks()
  })

  describe('findAll (Query: users)', () => {
    it('returns UserListDro with data and total', async () => {
      mockService.findAll.mockResolvedValue([mockUser])
      const result = await resolver.findAll()
      expect(result.data).toEqual([mockUser])
      expect(result.total).toBe(1)
    })

    it('returns empty list when no users', async () => {
      mockService.findAll.mockResolvedValue([])
      const result = await resolver.findAll()
      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
    })
  })

  describe('findById (Query: user)', () => {
    it('returns user by id', async () => {
      mockService.findById.mockResolvedValue(mockUser)
      expect(await resolver.findById('uuid-user-001')).toEqual(mockUser)
    })

    it('propagates NotFoundException from service', async () => {
      mockService.findById.mockRejectedValue(new NotFoundException())
      await expect(resolver.findById('bad-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('createUser (Mutation)', () => {
    it('creates and returns user', async () => {
      mockService.create.mockResolvedValue(mockUser)
      const input = { name: 'Sakura Yamamoto', email: 'sakura@japan.jp', password: 'pass', role: UserRole.USER }
      expect(await resolver.createUser(input)).toEqual(mockUser)
      expect(mockService.create).toHaveBeenCalledWith(input)
    })
  })

  describe('updateUser (Mutation)', () => {
    it('updates and returns user', async () => {
      const updated = { ...mockUser, name: 'Sakura Updated' }
      mockService.update.mockResolvedValue(updated)
      const result = await resolver.updateUser('uuid-user-001', { name: 'Sakura Updated' })
      expect(result.name).toBe('Sakura Updated')
      expect(mockService.update).toHaveBeenCalledWith('uuid-user-001', { name: 'Sakura Updated' })
    })
  })

  describe('deleteUser (Mutation)', () => {
    it('returns success DRO when deleted', async () => {
      mockService.delete.mockResolvedValue(true)
      const result = await resolver.deleteUser('uuid-user-001')
      expect(result.success).toBe(true)
      expect(result.message).toContain('uuid-user-001')
    })

    it('propagates NotFoundException from service', async () => {
      mockService.delete.mockRejectedValue(new NotFoundException())
      await expect(resolver.deleteUser('bad-id')).rejects.toThrow(NotFoundException)
    })
  })
})

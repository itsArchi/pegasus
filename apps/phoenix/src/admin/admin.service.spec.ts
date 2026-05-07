import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException, ConflictException } from '@nestjs/common'
import { AdminService } from './admin.service'
import { UserService } from '../user/user.service'
import { UserRole } from '../user/user.interface'
import type { IUser } from '../user/user.interface'

const makeUser = (overrides: Partial<IUser> = {}): IUser => ({
  id: 'uuid-001',
  name: 'Kenji Tanaka',
  email: 'kenji@japan.jp',
  password_hash: '$2b$12$hashed',
  role: UserRole.USER,
  is_active: true,
  created_at: '2026-05-01T00:00:00.000Z',
  updated_at: '2026-05-01T00:00:00.000Z',
  ...overrides,
})

const mockUserService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}

describe('AdminService', () => {
  let service: AdminService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile()

    service = module.get<AdminService>(AdminService)
    jest.clearAllMocks()
  })

  describe('findAllAdmins', () => {
    it('returns only users with ADMIN role', async () => {
      const admin = makeUser({ id: 'admin-1', role: UserRole.ADMIN })
      const user = makeUser({ id: 'user-1', role: UserRole.USER })
      mockUserService.findAll.mockResolvedValue([admin, user])

      const result = await service.findAllAdmins()
      expect(result).toHaveLength(1)
      expect(result[0].role).toBe(UserRole.ADMIN)
    })

    it('returns empty array when no admins', async () => {
      mockUserService.findAll.mockResolvedValue([makeUser()])
      expect(await service.findAllAdmins()).toHaveLength(0)
    })
  })

  describe('findAllUsers', () => {
    it('returns all users regardless of role', async () => {
      const users = [makeUser(), makeUser({ id: 'uuid-002', role: UserRole.ADMIN })]
      mockUserService.findAll.mockResolvedValue(users)
      expect(await service.findAllUsers()).toHaveLength(2)
    })
  })

  describe('createAdmin', () => {
    it('creates admin when email is not taken', async () => {
      const adminUser = makeUser({ role: UserRole.ADMIN })
      mockUserService.findByEmail.mockResolvedValue(null)
      mockUserService.create.mockResolvedValue(adminUser)

      const result = await service.createAdmin({ name: 'Kenji', email: 'kenji@japan.jp', password: 'pass' })

      expect(mockUserService.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.ADMIN }),
      )
      expect(result.role).toBe(UserRole.ADMIN)
    })

    it('throws ConflictException when email already exists', async () => {
      mockUserService.findByEmail.mockResolvedValue(makeUser())

      await expect(
        service.createAdmin({ name: 'Dup', email: 'kenji@japan.jp', password: 'pass' }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('promoteToAdmin', () => {
    it('promotes USER to ADMIN', async () => {
      const user = makeUser({ role: UserRole.USER })
      const promoted = makeUser({ role: UserRole.ADMIN })
      mockUserService.findById.mockResolvedValue(user)
      mockUserService.update.mockResolvedValue(promoted)

      const result = await service.promoteToAdmin('uuid-001')
      expect(result.role).toBe(UserRole.ADMIN)
      expect(mockUserService.update).toHaveBeenCalledWith('uuid-001', { role: UserRole.ADMIN })
    })

    it('throws ConflictException when user is already ADMIN', async () => {
      mockUserService.findById.mockResolvedValue(makeUser({ role: UserRole.ADMIN }))

      await expect(service.promoteToAdmin('uuid-001')).rejects.toThrow(ConflictException)
    })
  })

  describe('demoteToUser', () => {
    it('demotes ADMIN to USER', async () => {
      const admin = makeUser({ role: UserRole.ADMIN })
      const demoted = makeUser({ role: UserRole.USER })
      mockUserService.findById.mockResolvedValue(admin)
      mockUserService.update.mockResolvedValue(demoted)

      const result = await service.demoteToUser('uuid-001')
      expect(result.role).toBe(UserRole.USER)
    })

    it('throws ConflictException when user is already USER', async () => {
      mockUserService.findById.mockResolvedValue(makeUser({ role: UserRole.USER }))

      await expect(service.demoteToUser('uuid-001')).rejects.toThrow(ConflictException)
    })
  })

  describe('deactivateUser', () => {
    it('deactivates active user', async () => {
      const user = makeUser({ is_active: true })
      const deactivated = makeUser({ is_active: false })
      mockUserService.findById.mockResolvedValue(user)
      mockUserService.update.mockResolvedValue(deactivated)

      const result = await service.deactivateUser('uuid-001')
      expect(result.is_active).toBe(false)
      expect(mockUserService.update).toHaveBeenCalledWith('uuid-001', { is_active: false })
    })

    it('throws ConflictException when user is already inactive', async () => {
      mockUserService.findById.mockResolvedValue(makeUser({ is_active: false }))

      await expect(service.deactivateUser('uuid-001')).rejects.toThrow(ConflictException)
    })
  })

  describe('activateUser', () => {
    it('activates inactive user', async () => {
      const user = makeUser({ is_active: false })
      const activated = makeUser({ is_active: true })
      mockUserService.findById.mockResolvedValue(user)
      mockUserService.update.mockResolvedValue(activated)

      const result = await service.activateUser('uuid-001')
      expect(result.is_active).toBe(true)
      expect(mockUserService.update).toHaveBeenCalledWith('uuid-001', { is_active: true })
    })

    it('throws ConflictException when user is already active', async () => {
      mockUserService.findById.mockResolvedValue(makeUser({ is_active: true }))

      await expect(service.activateUser('uuid-001')).rejects.toThrow(ConflictException)
    })
  })

  describe('getStats', () => {
    it('returns correct stats counts', async () => {
      mockUserService.findAll.mockResolvedValue([
        makeUser({ role: UserRole.ADMIN, is_active: true }),
        makeUser({ id: 'u2', role: UserRole.USER, is_active: true }),
        makeUser({ id: 'u3', role: UserRole.USER, is_active: false }),
      ])

      const stats = await service.getStats()

      expect(stats.totalUsers).toBe(3)
      expect(stats.totalAdmins).toBe(1)
      expect(stats.activeUsers).toBe(2)
      expect(stats.inactiveUsers).toBe(1)
    })

    it('returns all zeros when no users', async () => {
      mockUserService.findAll.mockResolvedValue([])
      const stats = await service.getStats()
      expect(stats).toEqual({ totalUsers: 0, totalAdmins: 0, activeUsers: 0, inactiveUsers: 0 })
    })
  })
})

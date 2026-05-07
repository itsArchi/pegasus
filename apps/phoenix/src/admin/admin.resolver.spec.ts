import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException } from '@nestjs/common'
import { AdminResolver } from './admin.resolver'
import { AdminService } from './admin.service'
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

const mockService = {
  findAllAdmins: jest.fn(),
  findAllUsers: jest.fn(),
  createAdmin: jest.fn(),
  promoteToAdmin: jest.fn(),
  demoteToUser: jest.fn(),
  deactivateUser: jest.fn(),
  activateUser: jest.fn(),
  getStats: jest.fn(),
}

describe('AdminResolver', () => {
  let resolver: AdminResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminResolver,
        { provide: AdminService, useValue: mockService },
      ],
    }).compile()

    resolver = module.get<AdminResolver>(AdminResolver)
    jest.clearAllMocks()
  })

  describe('findAllAdmins (Query: admins)', () => {
    it('returns AdminListDro with admins and total', async () => {
      const admin = makeUser({ role: UserRole.ADMIN })
      mockService.findAllAdmins.mockResolvedValue([admin])

      const result = await resolver.findAllAdmins()
      expect(result.data).toEqual([admin])
      expect(result.total).toBe(1)
    })
  })

  describe('findAllUsers (Query: allUsers)', () => {
    it('returns AdminListDro with all users', async () => {
      mockService.findAllUsers.mockResolvedValue([makeUser(), makeUser({ id: 'uuid-002' })])

      const result = await resolver.findAllUsers()
      expect(result.total).toBe(2)
    })
  })

  describe('getStats (Query: adminStats)', () => {
    it('returns stats object', async () => {
      const stats = { totalUsers: 5, totalAdmins: 2, activeUsers: 4, inactiveUsers: 1 }
      mockService.getStats.mockResolvedValue(stats)

      expect(await resolver.getStats()).toEqual(stats)
    })
  })

  describe('createAdmin (Mutation)', () => {
    it('creates and returns admin user', async () => {
      const admin = makeUser({ role: UserRole.ADMIN })
      mockService.createAdmin.mockResolvedValue(admin)

      const input = { name: 'Kenji', email: 'kenji@japan.jp', password: 'pass' }
      expect(await resolver.createAdmin(input)).toEqual(admin)
      expect(mockService.createAdmin).toHaveBeenCalledWith(input)
    })

    it('propagates ConflictException when email taken', async () => {
      mockService.createAdmin.mockRejectedValue(new ConflictException())
      await expect(
        resolver.createAdmin({ name: 'Dup', email: 'taken@japan.jp', password: 'pass' }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('promoteToAdmin (Mutation)', () => {
    it('returns success ActionDro', async () => {
      const promoted = makeUser({ role: UserRole.ADMIN })
      mockService.promoteToAdmin.mockResolvedValue(promoted)

      const result = await resolver.promoteToAdmin({ userId: 'uuid-001' })
      expect(result.success).toBe(true)
      expect(result.user).toEqual(promoted)
    })
  })

  describe('demoteToUser (Mutation)', () => {
    it('returns success ActionDro', async () => {
      const demoted = makeUser({ role: UserRole.USER })
      mockService.demoteToUser.mockResolvedValue(demoted)

      const result = await resolver.demoteToUser({ adminId: 'uuid-001' })
      expect(result.success).toBe(true)
      expect(result.user).toEqual(demoted)
    })
  })

  describe('deactivateUser (Mutation)', () => {
    it('returns success ActionDro', async () => {
      const deactivated = makeUser({ is_active: false })
      mockService.deactivateUser.mockResolvedValue(deactivated)

      const result = await resolver.deactivateUser('uuid-001')
      expect(result.success).toBe(true)
      expect(result.user.is_active).toBe(false)
    })
  })

  describe('activateUser (Mutation)', () => {
    it('returns success ActionDro', async () => {
      const activated = makeUser({ is_active: true })
      mockService.activateUser.mockResolvedValue(activated)

      const result = await resolver.activateUser('uuid-001')
      expect(result.success).toBe(true)
      expect(result.user.is_active).toBe(true)
    })
  })
})

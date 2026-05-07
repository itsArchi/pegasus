import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { UserRole } from '../user/user.interface'
import type { IUser } from '../user/user.interface'

const mockUser: IUser = {
  id: 'uuid-auth-001',
  name: 'Tanaka San',
  email: 'tanaka@japan.jp',
  password_hash: '$2b$12$hashedpassword',
  role: UserRole.USER,
  is_active: true,
  created_at: '2026-05-01T00:00:00.000Z',
  updated_at: '2026-05-01T00:00:00.000Z',
}

const mockUserService = {
  findByEmail: jest.fn(),
  validatePassword: jest.fn(),
  create: jest.fn(),
}

const mockJwtService = {
  sign: jest.fn(() => 'mock.jwt.token'),
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('returns AuthPayload with token on valid credentials', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser)
      mockUserService.validatePassword.mockResolvedValue(true)

      const result = await service.login({ email: 'tanaka@japan.jp', password: 'secret123' })

      expect(result.token).toBe('mock.jwt.token')
      expect(result.user).toMatchObject({ id: mockUser.id, email: mockUser.email })
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      })
    })

    it('throws UnauthorizedException when user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null)

      await expect(
        service.login({ email: 'notfound@japan.jp', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException when user is inactive', async () => {
      mockUserService.findByEmail.mockResolvedValue({ ...mockUser, is_active: false })

      await expect(
        service.login({ email: 'tanaka@japan.jp', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException on wrong password', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser)
      mockUserService.validatePassword.mockResolvedValue(false)

      await expect(
        service.login({ email: 'tanaka@japan.jp', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('register', () => {
    it('creates user and returns AuthPayload with token', async () => {
      mockUserService.create.mockResolvedValue(mockUser)

      const input = { name: 'Tanaka San', email: 'tanaka@japan.jp', password: 'secret123', role: UserRole.USER }
      const result = await service.register(input)

      expect(result.token).toBe('mock.jwt.token')
      expect(result.user).toMatchObject({ id: mockUser.id })
      expect(mockUserService.create).toHaveBeenCalledWith(input)
    })
  })
})

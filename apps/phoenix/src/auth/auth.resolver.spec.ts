import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
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

const mockPayload = { token: 'mock.jwt.token', user: mockUser }

const mockService = {
  login: jest.fn(),
  register: jest.fn(),
}

describe('AuthResolver', () => {
  let resolver: AuthResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockService },
      ],
    }).compile()

    resolver = module.get<AuthResolver>(AuthResolver)
    jest.clearAllMocks()
  })

  describe('login (Mutation)', () => {
    it('returns AuthPayload on valid credentials', async () => {
      mockService.login.mockResolvedValue(mockPayload)

      const result = await resolver.login({ email: 'tanaka@japan.jp', password: 'secret123' })

      expect(result.token).toBe('mock.jwt.token')
      expect(result.user).toEqual(mockUser)
      expect(mockService.login).toHaveBeenCalledWith({ email: 'tanaka@japan.jp', password: 'secret123' })
    })

    it('propagates UnauthorizedException from service', async () => {
      mockService.login.mockRejectedValue(new UnauthorizedException('Email atau password salah'))

      await expect(
        resolver.login({ email: 'bad@email.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('register (Mutation)', () => {
    it('returns AuthPayload after successful registration', async () => {
      mockService.register.mockResolvedValue(mockPayload)

      const input = { name: 'Tanaka San', email: 'tanaka@japan.jp', password: 'secret123', role: UserRole.USER }
      const result = await resolver.register(input)

      expect(result.token).toBe('mock.jwt.token')
      expect(result.user).toEqual(mockUser)
      expect(mockService.register).toHaveBeenCalledWith(input)
    })
  })
})

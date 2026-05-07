import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { LoginInput, RegisterInput } from './dto/auth.dto'
import { AuthPayload } from './dro/auth.dro'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.userService.findByEmail(input.email)
    if (!user || !user.is_active) {
      throw new UnauthorizedException('Email atau password salah')
    }

    const valid = await this.userService.validatePassword(input.password, user.password_hash)
    if (!valid) {
      throw new UnauthorizedException('Email atau password salah')
    }

    return { token: this.signToken(user), user: user as never }
  }

  async register(input: RegisterInput): Promise<AuthPayload> {
    const user = await this.userService.create(input)
    return { token: this.signToken(user), user: user as never }
  }

  private signToken(user: { id: string; email: string; role: string }): string {
    return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role })
  }
}

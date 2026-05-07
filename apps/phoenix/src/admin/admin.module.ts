import { Module } from '@nestjs/common'
import { AdminResolver } from './admin.resolver'
import { AdminService } from './admin.service'
import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule],
  providers: [AdminResolver, AdminService],
})
export class AdminModule {}

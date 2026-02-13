import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

class UpdateMeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  city?: string;
}

@ApiTags('me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  me(@CurrentUser() user: { userId: string }) {
    return this.users.getMe(user.userId);
  }

  @Put()
  update(@CurrentUser() user: { userId: string }, @Body() dto: UpdateMeDto) {
    return this.users.updateMe(user.userId, dto);
  }
}

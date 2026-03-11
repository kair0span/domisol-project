import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ZodResponse({ type: [UserResponseDto] })
  @ApiOperation({ summary: 'Get all users' })
  findAll(): UserResponseDto[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ZodResponse({ type: UserResponseDto })
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id') id: string): UserResponseDto {
    return this.usersService.findOne(id);
  }

  @Post()
  @ZodResponse({ type: UserResponseDto })
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto): UserResponseDto {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ZodResponse({ type: UserResponseDto })
  @ApiOperation({ summary: 'Update an existing user' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): UserResponseDto {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id') id: string): void {
    this.usersService.remove(id);
  }
}

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    try {
      const user = await this.prisma.user.create({ data });
      return this.sanitizeUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email is already in use');
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  sanitizeUser(user: User) {
    // Exclude sensitive fields before returning user data.
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
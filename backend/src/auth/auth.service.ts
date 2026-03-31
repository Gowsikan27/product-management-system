import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const user = await this.usersService.create({
      ...registerDto,
      password: passwordHash,
    });

    const tokens = await this.generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.usersService.sanitizeUser(user),
      ...tokens,
    };
  }

  private async generateToken(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      tokenType: 'Bearer',
    };
  }
}
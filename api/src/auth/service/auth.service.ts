import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(user: User): Promise<string> {
    return await this.jwtService.signAsync({ user });
  }
  async hashPassword(password: string): Promise<string> {
    const res = await bcrypt.hash(password, 12);
    return res;
  }
  async comparePasswords(
    newPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(newPassword, passwordHash);
    return result;
  }
}

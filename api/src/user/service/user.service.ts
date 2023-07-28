import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User, UserRole } from '../models/user.interface';
import {
  paginate,
  Pagination,
  IPaginationOptions,
  IPaginationMeta,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(user: User): Promise<User> {
    return this.authService
      .hashPassword(user.password)
      .then((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = passwordHash;
        newUser.role = UserRole.USER;
        return this.userRepository
          .save(newUser)
          .then((savedUser: User) => {
            const { password, ...result } = savedUser;
            return result;
          })
          .catch((err) => {
            throw err;
          });
      });
  }

  findOne(id: number): Promise<User> {
    const options: FindOneOptions<UserEntity> = {
      where: { id: id },
    };
    return this.userRepository.findOne(options).then((user: User) => {
      const { password, ...result } = user;
      console.log(user);
      return result;
    });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find().then((users: User[]) => {
      users.forEach(function (user) {
        delete user.password;
      });
      return users;
    });
  }

  deleteOne(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  updateOne(id: number, user: User): Promise<any> {
    delete user.email;
    delete user.password;
    delete user.role;
    return this.userRepository.update(id, user);
  }

  async login(user: User): Promise<string> {
    return this.validateUser(user.email, user.password)
      .then((user: User) => {
        if (user) {
          return from(this.authService.generateJWT(user)).toPromise();
        } else {
          return 'wrong credentials';
        }
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  }

  paginate(options: IPaginationOptions): Observable<Pagination<User>> {
    return from(paginate<User>(this.userRepository, options)).pipe(
      map((usersPageable: Pagination<User>) => {
        usersPageable.items.forEach(function (v) {
          delete v.password;
        });
        return usersPageable;
      }),
    );
  }

  async validateUser(email: string, password: string): Promise<User> {
    return await this.findByEmail(email).then(async (user: User) => {
      return await this.authService
        .comparePasswords(password, user.password)
        .then((match: boolean) => {
          if (match) {
            const { password, ...result } = user;
            return result;
          } else {
            throw new Error('Invalid password');
          }
        });
    });
  }

  async findByEmail(email: string): Promise<User> {
    const options: FindOneOptions<UserEntity> = {
      where: { email: email },
    };
    const res = await this.userRepository.findOne(options);
    return res;
  }

  async updateRoleOfUser(id: number, user: User): Promise<any> {
    return this.userRepository.update(Number(id), user);
  }
}

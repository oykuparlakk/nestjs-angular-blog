import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';

import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { User, UserRole } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { diskStorage } from 'multer';
import path, { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { UserIsUserGuard } from 'src/auth/guards/UserIsUser.guard';

@Controller()
export class YourControllerName {
  // ...

  @Get('profile-image/:imagename')
  async findProfileImage(
    @Param('imagename') imagename,
    @Res() res: Response,
  ): Promise<void> {
    res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename));
  }
}

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  //deneme

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user).then((user: User) => user);
  }

  @Post('login')
  login(@Body() user: User): Promise<object> {
    return this.userService.login(user).then((jwt: string) => {
      return { access_token: jwt };
    });
  }
  @Get(':id')
  findOne(@Param() params): Promise<User> {
    return this.userService.findOne(params.id);
  }

  @Get()
  index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('username') username: string,
  ): Observable<Pagination<User>> {
    console.log('username', username);
    limit = limit > 100 ? 100 : limit;
    if (username === null || username === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/api/users',
      });
    } else {
      return this.userService.paginateFilterByUsername(
        {
          page: Number(page),
          limit: Number(limit),
          route: 'http://localhost:3000/api/users',
        },
        username,
      );
    }
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Promise<any> {
    return this.userService.deleteOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Promise<any> {
    return this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(@UploadedFile() file, @Request() req): Promise<User> {
    const user: User = req.user;

    const updatedUser = await this.userService.updateOne(user.id, {
      profileImage: file.filename,
    });

    return updatedUser;
  }

  @Get('profile-image/:imagename')
  async findProfileImage(
    @Param('imagename') imagename,
    @Res() res: Response,
  ): Promise<void> {
    res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename));
  }
}

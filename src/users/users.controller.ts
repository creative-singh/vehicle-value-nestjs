import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from "./auth.service";
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guards';

@Controller('auth')
@Serialize(UserDto)   // No password DTO
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) { }

  @Post("/signup")
  async createrUser(@Body() body: CreateUserDto, @Session() session: any) {
    // this.usersService.create(body.email, body.password);
    try {
      const user = await this.authService.signup(body.email, body.password);
      session.userId = user.id;
      return user;
    } catch (err) {
      console.log("ERROR IN createrUser", err);
    }

  };

  @Post("/signin")
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  };

  @Get("/whoami")
  @UseGuards(AuthGuard)
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post("/signout")
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // Line number 18 and 19 are same, in line 19, we initialized our own decorator
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // @Serialize(UserDto)
  @Get("/:id")
  async findUser(@Param("id") id: string) {
    console.log("handler is running");
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException("User not found.")
    }
    return user;
  };

  @Get()
  findAllUsers(@Query("email") email: string) {
    return this.usersService.find(email);
  }

  @Delete("/:id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,  Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto,LoginDto, UpdateUserDto, RegisterUserDto } from './dto/index.dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }
  @Post('/login')
  login( @Body() loginDto: LoginDto){
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register( @Body() registerDto: RegisterUserDto){
    return this.authService.register(registerDto);
  }
 
  @UseGuards(AuthGuard)
  @Get('/check-token')  //tomamos al usuario del request y le indicamos que la respuesta sera de tipo LoginResponse
  checkToken( @Request() req: Request): LoginResponse{
    //creamos la constante del usuario y para evitar un AnyFilesInterceptor, le decimos que lo trate como in tipo User
    const user=req['user'] as User;
    return {
      user,
      token: this.authService.getJwtToken({id : user._id}),
    };
  }


  @UseGuards(AuthGuard)
  @Get( )
  findAll( @Request() req: Request) {
   // console.log(req);
   // const user= req['user'];
   // return user;
     return this.authService.findAll();
  }
/*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
  */
}

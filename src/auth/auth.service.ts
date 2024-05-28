import { BadRequestException, Body, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import {  InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';
import { CreateUserDto, LoginDto,RegisterUserDto, UpdateUserDto } from './dto/index.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,

    private jwtService: JwtService,
  ) {}


  async create(createAuthDto: CreateUserDto): Promise<User> {
  /*  console.log(createAuthDto);
    const newUser= new this.userModel( createAuthDto);
    return newUser.save(); 
    */
    //Encriptar password
      //Obtenemos el valor de la contraseña por separado
      const { password, ...userData} = createAuthDto;
      //Encryptamos la contraseña y volvemos a unir el objeto


    //Guardar Usuario


    //Manejar las excepciones
    try{

      const { password, ...userData} = createAuthDto;
      //Encryptamos la contraseña y volvemos a unir el objeto
      const newUser= new this.userModel( {
        password: bcryptjs.hashSync(password,10),
        ...userData
      });
       await newUser.save(); 
       const {password:_, ...user}= newUser.toJSON();

       return user;

    }
    catch(e){
       // console.log(e);
       if (e.code === 11000) {
        throw new BadRequestException(`${ createAuthDto.email} already exists!`)
       }
       throw new InternalServerErrorException('Apocolyps!')
    }
    

  }

  async register(register: RegisterUserDto):Promise <LoginResponse>{

    const user= await this.create(register);
    console.log({user})
    return {
      user: user,
      token: this.getJwtToken({id: user._id})
    }
  }

  async login(loginDto: LoginDto ) :Promise <LoginResponse> {
   // return this. .login(LoginDto);
   const {email, password}= loginDto;
    console.log({loginDto});
      const user= await this.userModel.findOne({email});
    if (!user) {
      throw new UnauthorizedException('Not valid credential')
    }
    if(!bcryptjs.compareSync(password, user.password))  throw new UnauthorizedException('Not valid credential');

      const {password:_ , ...rest }= user.toJSON();
    return {
      user: rest, 
      token: this.getJwtToken({id: user.id}),
    };
  }
  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async findUserById(id:string){
    const user = await this.userModel.findById(id);
    const {password, ...rest} = user.toJSON();
    return rest;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
 getJwtToken(payload: JwtPayload){

    const  access_token= this.jwtService.sign(payload);
    return access_token;
    
  }
}

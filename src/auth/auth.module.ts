import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
    //este carga las variables den entorno en este modulo
    ConfigModule.forRoot(),
    //aqui se prepara moongose para usarse como bd
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    //Aqui declaaramos el uso de los json web tokens
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' },
    }),
  ]
})
export class AuthModule {}

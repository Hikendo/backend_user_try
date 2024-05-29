/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    AuthModule,

    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {dbName: process.env.MONGO_DB_NAME}),
],

})
export class AppModule {

  constructor(){

  }

}

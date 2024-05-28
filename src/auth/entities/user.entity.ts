import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

//para indicar que use la clase como un diseño de esquema de bd
@Schema()
export class User {

    //_id:string se coloca en automatico por mongo
    _id?:string;
    //las prop contiene propiedades de nuestros fields
    @Prop({unique:true, required:true})
    email: string;
    @Prop({required: true})
    name: string;
    @Prop({required: true, minlength: 8})
    password?: string;
    @Prop({default:true})
    isActive:boolean;
    @Prop({type:[String], default:['user']})
    roles:string[];

}

//para indicar que debe crear la base de datos
export const UserSchema= SchemaFactory.createForClass(User);
import { prop, getModelForClass, pre } from '@typegoose/typegoose'
import bcrypt from 'bcrypt'
import { Field, ObjectType, InputType } from 'type-graphql'
import { IsEmail, MinLength, MaxLength } from 'class-validator'

@pre<User>('save', async function() {
    if(!this.isModified('password')) {
        return
    } 

    const salt = await bcrypt.genSalt(10)

    const hash = bcrypt.hashSync(this.password, salt)

    this.password = hash
})
@ObjectType()
export class User {
    @Field(() => String)
    _id: string

    @Field(() => String)
    @prop({ required: true })
    name: string

    @Field(() => String)
    @prop({ required: true })
    email: string

    @prop({ required: true })
    password: string
}

@InputType()
export class CreateUserInput {
    @Field(() => String)
    name: string

    @IsEmail()
    @Field(() => String)
    email: string

    @MinLength(6, {
        message: 'Password is too short'
    })
    @MaxLength(50 {
        message: 'Password is too long'
    })
    @Field(() => String)
    password: string
}

export const UserModel = getModelForClass(User)
import { prop, getModelForClass, pre, ReturnModelType, index, queryMethod } from '@typegoose/typegoose'
import { AsQueryMethod, } from '@typegoose/typegoose/lib/types'
import bcrypt from 'bcrypt'
import { Field, ObjectType, InputType } from 'type-graphql'
import { IsEmail, MinLength, MaxLength } from 'class-validator'


function findByEmail(this: ReturnModelType<typeof User, QueryHelpers>, email: User['email']) {
    return this.findOne({ email })
}

interface QueryHelpers {
    findByEmail: AsQueryMethod<typeof findByEmail>
}

@pre<User>('save', async function() {
    if(!this.isModified('password')) {
        return
    } 

    const salt = await bcrypt.genSalt(10)

    const hash = bcrypt.hashSync(this.password, salt)

    this.password = hash
})
@index({ email: 1 })
@queryMethod(findByEmail)
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
    @MaxLength(50, {
        message: 'Password is too long'
    })
    @Field(() => String)
    password: string
}

@InputType()
export class LoginInput {
    @Field(() => String)
    email: string

    @Field(() => String)
    password: string
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User)
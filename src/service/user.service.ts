import { ApolloError } from "apollo-server";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context";
import bcrypt from 'bcrypt'
import { signJwt } from "../utils/jwt";
class UserService {
    async createUser(input: CreateUserInput){
        UserModel.create(input)
    }

    async login(input: LoginInput, context: Context) {

        const user = UserModel.find().findByEmail(input.email).lean()

        if(!user) {
            throw new ApolloError('Invalid email or password')
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.password)

        if (!isPasswordValid) {
            throw new ApolloError('Invalid email or password')
        }

        const token = signJwt(user)

        context.res.cookie("accessToken", token, {
            httpOnly: true,
            domain: 'localhost',
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        })

        return token
    }
}

export default UserService
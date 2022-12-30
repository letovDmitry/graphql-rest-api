import dotenv from 'dotenv'
import 'reflect-metadata'
import express from 'express'
import { buildSchema } from 'type-graphql'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core'
import { resolvers } from './resolvers'
import { connect } from './utils/db'
import { verifyJwt } from './utils/jwt'
import { User } from './schema/user.schema'
import Context from './types/context'

dotenv.config()

async function bootstrap() {
    const schema = await buildSchema({
        resolvers
    })

    const app = express()

    app.use(cookieParser())

    const server = new ApolloServer({ schema, context: (ctx: Context) => {
        const context = ctx

        if(ctx.req.cookies.accessToken) {
            const user = verifyJwt<User>(ctx.req.cookies.accessToken)

            context.user = user
        }

        return context
    },
    plugins: [
        process.env.NODE_ENV === 'production' ? ApolloServerPluginLandingPageProductionDefault() : ApolloServerPluginLandingPageGraphQLPlayground
    ]
    })

    await server.start()

    server.applyMiddleware({app})

    app.listen(4000, () => {
        console.log('server runs')
    })

    connect()
}

bootstrap()
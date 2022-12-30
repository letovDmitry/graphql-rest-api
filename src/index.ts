import dotenv from 'dotenv'
import 'reflect-metadata'
import express from 'express'
import { buildSchema } from 'type-graphql'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core'
import { resolvers } from './resolvers'

dotenv.config()

async function bootstrap() {
    const schema = await buildSchema({
        resolvers
    })

    const app = express()

    app.use(cookieParser())

    const server = new ApolloServer({ schema, context: (ctx) => {
        return ctx
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
}

bootstrap()
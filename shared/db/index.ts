import { drizzle } from 'drizzle-orm/node-postgres'

const url = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_SERVER_DOMAIN}:${process.env.POSTGRES_SERVER_PORT}/${process.env.POSTGRES_DB}`

export const db = drizzle({
  connection: url
})

export * as client from './client'

import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const url = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_SERVER_DOMAIN}:${process.env.POSTGRES_SERVER_PORT}/${process.env.POSTGRES_DB}`

console.log(url)

export default defineConfig({
  schema: './shared/db/schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url,
    database: process.env.POSTGRES_DB!,
  },
})

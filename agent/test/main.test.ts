import 'dotenv/config'
import { createAgent } from '../index'
import { createEmptyBoard } from '../../shared'
import { writeFileSync } from 'node:fs'

const dev = `
Now you don't need to search or query any knowledge,

there is no knowledge now :(

Just imagine you have know many api, do not care about if it is exist.
`.trim()

const messages = []
const agent = createAgent({
  apiKey: process.env.DEFAULT_API_KEY!,
  baseURL: process.env.DEFAULT_BASE_URL!,
  model: process.env.DEFAULT_MODEL!,
  embedding: {
    model: process.env.DEFAULT_EMBED_MODEL!,
    apiKey: process.env.DEFAULT_EMBED_API_KEY!,
    baseURL: process.env.DEFAULT_EMBED_BASE_URL!,
  },
  messages,
  knowledge: {
    prefabs: [],
  },
  dev,
})

const board = createEmptyBoard()

const result = await agent('设计一个三角函数的课程', board)
writeFileSync('result.json', JSON.stringify({
  context: messages,
  result: result,
}, null, 2))
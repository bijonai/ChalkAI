import dotenv from 'dotenv'
import { createAgent } from '../index'
import { createEmptyBoard } from '../../shared'
import { writeFileSync } from 'node:fs'
import knowledges from '@chalk-dsl/knowledge/default'

import '@chalk-dsl/layout'
import '@chalk-dsl/form'
import '@chalk-dsl/widget'
import '@chalk-dsl/canvas'
import '@chalk-dsl/math'
dotenv.config({
  path: '../.env',
})

console.log(knowledges)

const main = async () => {
  const messages = []
  const agent = createAgent({
    apiKey: process.env.DEFAULT_API_KEY!,
    baseURL: process.env.DEFAULT_BASE_URL!,
    model: process.env.MODELS!.split(',')[0]!,
    messages,
    knowledge: knowledges,
    // dev,
  })

  const board = createEmptyBoard()

  console.log(knowledges)

  const result = await agent('设计一个三角函数学习课程', board)
  const now = Date.now()
  writeFileSync(`result-${now}.json`, JSON.stringify({
    context: messages,
    result: result,
  }, null, 2))
  writeFileSync(`board-${now}.html`, result.components.join('\n\n---\n\n'))
}

main()

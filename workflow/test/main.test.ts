import dotenv from 'dotenv'
import { createWorkflow } from '../index'
import { createEmptyBoard } from '../../shared'
import { readFileSync, writeFileSync } from 'node:fs'
import knowledges from '@chalk-dsl/knowledge/default'

import '@chalk-dsl/layout'
import '@chalk-dsl/form'
import '@chalk-dsl/widget'
import '@chalk-dsl/canvas'
import '@chalk-dsl/math'

dotenv.config({ path: '../.env' })

const coderContext = []
const plannerContext = []

const main = async () => {
  const { start, code, plan } = createWorkflow({
    coder: {
      apiKey: process.env.DEFAULT_API_KEY!,
      baseURL: process.env.DEFAULT_BASE_URL!,
      model: process.env.MODELS.split(',')[2]!,
      messages: coderContext,
      knowledge: knowledges,
    },
    planner: {
      apiKey: process.env.DEFAULT_API_KEY!,
      baseURL: process.env.DEFAULT_BASE_URL!,
      model: process.env.MODELS.split(',')[2]!,
      messages: plannerContext,
      knowledge: knowledges,
    },
    board: createEmptyBoard(),
    knowledge: knowledges,
  })

  const now = Date.now()
  const content = await plan(
    '设计一个交互式课堂，内容关于牛顿第二定律'
  )
  writeFileSync(`result-${now}.md`, content)
  const result = await code(content)
  writeFileSync(`result-${now}.html`, result.components.join('\n\n------------\n\n'))
  writeFileSync(`result-${now}.json`, JSON.stringify({
    coderContext,
    plannerContext,
  }, null, 2))
}

main()
import 'dotenv/config'
import { createWorkflow } from '../index'
import { createEmptyBoard } from '../../shared'
import { readFileSync, writeFileSync } from 'node:fs'
import knowledges from '@chalk-dsl/knowledge/default'

import '@chalk-dsl/layout'
import '@chalk-dsl/form'
import '@chalk-dsl/widget'
import '@chalk-dsl/canvas'
import '@chalk-dsl/math'

const { start, code, plan } = createWorkflow({
  coder: {
    apiKey: process.env.DEFAULT_API_KEY!,
    baseURL: process.env.DEFAULT_BASE_URL!,
    model: process.env.MODELS.split(',')[1]!,
    messages: [],
    knowledge: knowledges,
  },
  planner: {
    apiKey: process.env.DEFAULT_API_KEY!,
    baseURL: process.env.DEFAULT_BASE_URL!,
    model: process.env.MODELS.split(',')[0]!,
    messages: [],
    knowledge: knowledges,
  },
  board: createEmptyBoard(),
  knowledge: knowledges,
})

const now = Date.now()
const content = await plan(
  readFileSync('./test.md', 'utf-8')
)
writeFileSync(`result-${now}.md`, content)
const result = await code(content)
writeFileSync(`result-${now}.json`, JSON.stringify(result, null, 2))
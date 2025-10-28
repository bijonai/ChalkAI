import type { Message } from 'xsai'
import { generateText, message } from 'xsai'
import { coder, planner } from './prompts'
import { type Board } from '../shared'
import type { Knowledge } from '@chalk-dsl/knowledge'
import * as tools from './tools'
import { createParser } from './parser'

export interface BaseWorkflowParams {
  apiKey: string
  baseURL: string
  model: string
  messages: Message[]
}

export interface CoderParams extends BaseWorkflowParams {
  knowledge: Knowledge
  dev?: string
  reasoning?: boolean
}

export interface PlannerParams extends BaseWorkflowParams {
  knowledge: Knowledge
}

export interface ReviewerParams extends BaseWorkflowParams {

}

export interface WorkflowParams {
  coder: CoderParams
  planner: PlannerParams
  board: Board
  knowledge: Knowledge
}

export function createWorkflow(params: WorkflowParams) {
  const parse = createParser(params.board)
  if (params.coder.messages.length === 0) params.coder.messages.push(
    message.system(coder.system(params.knowledge, {
      dev: params.coder.dev,
      reasoning: params.coder.reasoning,
    }))
  )
  if (params.planner.messages.length === 0) params.planner.messages.push(
    message.system(planner.system(params.knowledge))
  )

  const code = async (content: string) => {
    const utils = await tools.coder({
      board: params.board,
      knowledge: params.knowledge,
    })
    params.coder.messages.push(message.user(content))
    const { messages } = await generateText({
      model: params.coder.model,
      apiKey: params.coder.apiKey,
      baseURL: params.coder.baseURL,
      messages: params.coder.messages,
      tools: utils,
      maxSteps: 100,
    })
    params.coder.messages.length = 0
    params.coder.messages.push(...messages)
    for (const message of messages) {
      if (message.role === 'assistant' && typeof message.content === 'string') {
        parse(message.content)
      }
    }
    return params.board
  }

  const plan = async (input: string) => {
    params.planner.messages.push(message.user(input))
    const { text, messages } = await generateText({
      model: params.planner.model,
      apiKey: params.planner.apiKey,
      baseURL: params.planner.baseURL,
      messages: params.planner.messages,
    })
    params.planner.messages.length = 0
    params.planner.messages.push(...messages)
    return text
  }

  const start = async (input: string) => {
    const draft = await plan(input)
    const board = await code(draft!)

    return board
  }

  return {
    start,
    code,
    plan,
  }
}
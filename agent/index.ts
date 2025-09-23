import type { Message, Tool } from 'xsai'
import { generateText, message } from 'xsai'
import * as prompts from './prompts'
import { createEmptyBoard, type Board } from '../shared'
import toolsGenerator from './tools'
import type { Knowledge } from '@chalk-dsl/knowledge'

export interface AgentParams {
  apiKey: string
  baseURL: string
  model: string
  embedding: {
    model: string
    apiKey: string
    baseURL: string
  }
  messages: Message[]
  knowledge: Knowledge
  dev?: string
}

export function createAgent(params: AgentParams) {
  if (params.messages.length === 0) {
    params.messages.push(
      message.system(prompts.system(params.dev))
    )
  }

  return async (input: string, board: Board = createEmptyBoard()) => {
    params.messages.push(
      message.user(input),
    )
    const tools = await toolsGenerator({ board, knowledge: params.knowledge, embedding: params.embedding }) satisfies Tool[]
    const { messages } = await generateText({
      model: params.model,
      apiKey: params.apiKey,
      baseURL: params.baseURL,
      messages: params.messages,
      tools,
      maxSteps: 100,
    })
    params.messages.length = 0
    params.messages.push(...messages)
    return board
  }
}
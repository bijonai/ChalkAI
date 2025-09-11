import type { Message } from 'xsai'
import { message } from 'xsai'
import * as prompts from './prompts'

export interface AgentParams {
  apiKey: string
  baseURL: string
  model: string
  messages: Message[]
}

export function createAgent(params: AgentParams) {
  if (params.messages.length === 0) {
    params.messages.push(
      message.system(prompts.system())
    )
  }

  return async (input: string) => {}
}
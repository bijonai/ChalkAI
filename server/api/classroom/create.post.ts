import { client } from '#shared/db'
import { createAgent } from '../../../agent'
import { DEFAULT_API_KEY, DEFAULT_BASE_URL, DEFAULT_MODEL } from '#shared/env'
import { Message } from 'xsai'
import { response } from '#shared/server/response'
import { ClassroomStatus } from '#shared/db/client'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    id?: string
    input: string
  }>(event)
  const context = body.id ? await client.getContext(body.id) ?? [] : [] satisfies Message[]
  const id = body.id ?? crypto.randomUUID()
  const agent = createAgent({
    apiKey: DEFAULT_API_KEY,
    baseURL: DEFAULT_BASE_URL,
    model: DEFAULT_MODEL,
    messages: context,
  })
  const generate = async () => {
    await client.updateClassroomInfo(id, {
      status: ClassroomStatus.Running,
    })
    const board = await agent(body.input)
    await client.updateContext(id, context)
    await client.updateResult(id, board)
    await client.updateClassroomInfo(id, {
      status: ClassroomStatus.Completed,
    })
  }
  event.waitUntil(generate().catch(async (error) => {
    await client.updateClassroomInfo(id, {
      status: ClassroomStatus.Failed,
    })
  }))
  return response({ id })
})
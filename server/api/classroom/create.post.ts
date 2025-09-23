import { client } from '#shared/db'
import { createAgent } from '../../../agent'
import { DEFAULT_API_KEY, DEFAULT_BASE_URL, DEFAULT_EMBED_MODEL, DEFAULT_EMBED_API_KEY, DEFAULT_MODEL, DEFAULT_EMBED_BASE_URL } from '#shared/env'
import { Message } from 'xsai'
import { response } from '#shared/server/response'
import { ClassroomStatus } from '#shared/db/client/classroom'
import { createEmptyBoard } from '~~/shared'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    id?: string
    input: string
  }>(event)
  const context = body.id ? await client.classroom.getContext(body.id) ?? [] : [] satisfies Message[]
  const board = body.id ? await client.classroom.getResult(body.id) ?? createEmptyBoard() : createEmptyBoard()
  const id = body.id ?? crypto.randomUUID()
  const agent = createAgent({
    apiKey: DEFAULT_API_KEY,
    baseURL: DEFAULT_BASE_URL,
    model: DEFAULT_MODEL,
    messages: context,
    embedding: {
      model: DEFAULT_EMBED_MODEL,
      apiKey: DEFAULT_EMBED_API_KEY,
      baseURL: DEFAULT_EMBED_BASE_URL,
    },
    knowledge: {
      prefabs: [],
    },
  })
  const generate = async () => {
    await client.classroom.updateClassroomInfo(id, {
      status: ClassroomStatus.Running,
    })
    const result = await agent(body.input, board)
    await client.classroom.updateContext(id, context)
    await client.classroom.updateResult(id, result)
    await client.classroom.updateClassroomInfo(id, {
      status: ClassroomStatus.Completed,
    })
  }
  event.waitUntil(generate().catch(async (error) => {
    await client.classroom.updateClassroomInfo(id, {
      status: ClassroomStatus.Failed,
    })
  }))
  return response({ id })
})
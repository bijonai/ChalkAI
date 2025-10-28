import { client } from '#shared/db'
import { createAgent } from '@chalk-ai/agent'
import { DEFAULT_API_KEY, DEFAULT_BASE_URL, MODELS, DEFAULT_KNOWLEDGE } from '#shared/env'
import { Message } from 'xsai'
import { response } from '#shared/server/response'
import { ClassroomStatus } from '#shared/db/client/classroom'
import { createEmptyBoard } from '~~/shared'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    id?: string
    title?: string
    input: string
    reasoning?: boolean
    model?: string
  }>(event)
  const board = body.id ? await client.classroom.getResult(body.id) ?? createEmptyBoard() : createEmptyBoard()
  const { data } = await client.knowledge.getKnowledge(DEFAULT_KNOWLEDGE, 'name')
  let id: string = ''
  if (!body.id) {
    const classroom = await client.classroom.createClassroom()
    if (classroom) {
      id = classroom.id
    }
  } else {
    return createError({
      statusCode: 400,
      statusMessage: 'classroom id is required',
    })
  }
  if (body.model && !MODELS.includes(body.model)) {
    return createError({
      statusCode: 400,
      statusMessage: 'model is not supported',
    })
  }
  await client.classroom.updateClassroomInfo(id, {
    title: body.title ?? 'Untitled',
  })
  const agent = createAgent({
    apiKey: DEFAULT_API_KEY,
    baseURL: DEFAULT_BASE_URL,
    model: body.model ?? MODELS[0],
    messages: context,
    knowledge: data!,
    board,
    coder: {
      apiKey: DEFAULT_API_KEY,
      baseURL: DEFAULT_BASE_URL,
      model: body.model ?? MODELS[0],
      messages: [],
      reasoning: body.reasoning ?? false,
      knowledge: data!,
    },
    planner: {
      apiKey: DEFAULT_API_KEY,
      baseURL: DEFAULT_BASE_URL,
      model: body.model ?? MODELS[0],
      messages: [],
      knowledge: data!,
    },
  })
  const generate = async () => {
    await client.classroom.updateClassroomInfo(id, {
      status: ClassroomStatus.Running,
    })
    const result = await start(body.input)
    await client.classroom.updateResult(id, result)
    await client.classroom.updateClassroomInfo(id, {
      status: ClassroomStatus.Completed,
    })
  }
  event.waitUntil(generate().catch(async (error) => {
    await client.classroom.updateResult(id, { error: error.message })
    await client.classroom.updateClassroomInfo(id, {
      status: ClassroomStatus.Failed,
    })
  }))
  return response({
    id,
    title: body.title ?? 'Untitled',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    public: false,
    status: ClassroomStatus.Running,
  })
})
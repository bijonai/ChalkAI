import { client } from "~~/shared/db"
import { failure, response } from "~~/shared/server/response"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  if (!id) {
    return failure('classroom id is required')
  }
  const result = await client.classroom.getResult(id)
  return response({
    result,
  })
})
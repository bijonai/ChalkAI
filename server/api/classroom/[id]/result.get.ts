import { client } from "~~/shared/db"
import { response } from "~~/shared/server/response"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  if (!id) {
    return createError({
      statusCode: 404,
      statusMessage: 'classroom id is required',
    })
  }
  const result = await client.classroom.getResult(id)
  return response({
    result,
  })
})
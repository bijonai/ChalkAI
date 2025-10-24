import { response } from '#shared/server/response'
import { client } from '#shared/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    return createError({
      statusCode: 404,
      statusMessage: 'classroom id is required',
    })
  }
  const info = await client.classroom.getClassroomInfo(id)
  if (!info) {
    return createError({
      statusCode: 404,
      statusMessage: 'classroom id not found',
    })
  }
  return response({
    status: info.status,
  })
})
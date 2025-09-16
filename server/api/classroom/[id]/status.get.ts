import { failure, response } from '#shared/server/response'
import { client } from '#shared/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    return failure('classroom id is required')
  }
  const info = await client.getClassroomInfo(id)
  if (!info) {
    return failure('classroom id not found')
  }
  return response({
    status: info.status,
  })
})
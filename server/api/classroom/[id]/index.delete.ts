import { client } from "~~/shared/db"
import { response } from "~~/shared/server/response"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  await client.classroom.deleteClassroom(id)
  return response({
    id,
  })
})
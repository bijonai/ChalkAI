import { client } from "~~/shared/db"
import { response } from "~~/shared/server/response"

export default defineEventHandler(async (event) => {
  const { limit, offset } = getQuery(event)
  const classrooms = await client.classroom.listClassrooms(Number(limit ?? 10), Number(offset ?? 0))
  return response({
    classrooms,
  })
})
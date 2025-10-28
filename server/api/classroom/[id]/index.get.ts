import { client } from "~~/shared/db"
import { response } from "~~/shared/server/response"

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const classroom = await client.classroom.getClassroomInfo(id)
  return response({
    classroom,
  })
})
import { MODELS } from "~~/shared/env"
import { response } from "~~/shared/server/response"

export default defineEventHandler(async () => {
  return response({
    models: MODELS,
  })
})
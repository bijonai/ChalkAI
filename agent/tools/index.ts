import { getDocuments } from "./get-documents"
import { setSteps } from "./step"
import type { Knowledge } from "~~/packages/knowledge/src"
import type { Board } from "~~/shared"

export interface ToolsGeneratorParams {
  board: Board
  knowledge: Knowledge
  embedding: {
    model: string
    apiKey: string
    baseURL: string
  }
}

export default async function (params: ToolsGeneratorParams) {
  return await Promise.all([
    getDocuments(params.knowledge),
    setSteps(params.board),
  ])
}

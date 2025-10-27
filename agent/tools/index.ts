import { getDocuments } from "./get-documents"
import { setSteps } from "./step"
import type { Knowledge } from "@chalk-dsl/knowledge"
import type { Board } from "~~/shared"

export interface ToolsGeneratorParams {
  board: Board
  knowledge: Knowledge
}

export default async function (params: ToolsGeneratorParams) {
  return await Promise.all([
    getDocuments(params.knowledge),
    setSteps(params.board),
  ])
}

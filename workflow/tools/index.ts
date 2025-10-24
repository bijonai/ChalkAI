import { getDocuments } from "./get-documents"
import { setSteps } from "./step"
import type { Knowledge } from "@chalk-dsl/knowledge"
import type { Board } from "~~/shared"

export interface CoderToolsGeneratorParams {
  board: Board
  knowledge: Knowledge
}

export const coder = async (params: CoderToolsGeneratorParams) => {
  return await Promise.all([
    getDocuments(params.knowledge),
    setSteps(params.board),
  ])
}

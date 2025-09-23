import type { Board } from "../../shared"
import newStep from "./new-step"
import setStep from "./set-step"
import createComponent from "./create-component"
import { setComponentRoot, setEvents, setAttrs, remove, removeEvents, removeAttrs, setAnimations, removeAnimations } from "./element"
import type { Knowledge } from "@chalk-dsl/knowledge"
import { getTags, getPrefabDocumentByTag } from "./dictionary"
import { search } from "./search"

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
    // Edition
    newStep(params.board),
    setStep(params.board),
    createComponent(params.board),
    setComponentRoot(params.board),
    setEvents(params.board),
    setAttrs(params.board),
    setAnimations(params.board),
    remove(params.board),
    removeEvents(params.board),
    removeAttrs(params.board),
    removeAnimations(params.board),
    // Dictionary
    getTags(params.knowledge),
    getPrefabDocumentByTag(params.knowledge),

    // Search
    search(params.embedding),
  ])
}

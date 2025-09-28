import type { Board } from "../../shared"
import newStep from "./new-step"
import setStep from "./set-step"
import createComponent from "./create-component"
import { addChildren, setComponentRoot, setEvents, setAttrs, remove, removeEvents, removeAttrs, setAnimations, removeAnimations, setStatements, removeStatements } from "./element"
import type { Knowledge } from "@chalk-dsl/knowledge"
import { getTags, getPrefabDocumentByTag, getPrefab, getCalculator, getCalculators } from "./dictionary"
import { query } from "./query"
import { createRef } from "./refs"

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
    addChildren(params.board),
    setEvents(params.board),
    setAttrs(params.board),
    setAnimations(params.board),
    setStatements(params.board),
    remove(params.board),
    removeEvents(params.board),
    removeAttrs(params.board),
    removeAnimations(params.board),
    removeStatements(params.board),
    // Refs
    createRef(params.board),

    // Dictionary
    getTags(params.knowledge),
    getPrefabDocumentByTag(params.knowledge),
    getPrefab(params.knowledge),
    getCalculators(params.knowledge),
    getCalculator(params.knowledge),

    // Search
    query({ ...params.embedding, types: ['prefab'] }),
    query({ ...params.embedding, types: ['calculator'] }),
    query({ ...params.embedding, types: ['prefab', 'calculator'] }),
  ])
}

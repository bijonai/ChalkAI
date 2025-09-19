import type { Board } from "../../shared"
import newStep from "./new-step"
import setStep from "./set-step"
import createComponent from "./create-component"
import { setComponentRoot, setEvents, setAttrs, remove, removeEvents, removeAttrs } from "./element"

export interface ToolsGeneratorParams {
  board: Board
}

export default async function (params: ToolsGeneratorParams) {
  return await Promise.all([
    newStep(params.board),
    setStep(params.board),
    createComponent(params.board),
    setComponentRoot(params.board),
    setEvents(params.board),
    setAttrs(params.board),
    remove(params.board),
    removeEvents(params.board),
    removeAttrs(params.board),
  ])
}

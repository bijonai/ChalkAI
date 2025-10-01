import { createBox } from "@chalk-dsl/renderer-runtime"
import type { Board } from "~~/shared"
import '@chalk-dsl/layout'

export function useBoard() {
  const currentStep = ref<number>(1)
  const steps: Ref<HTMLElement | null>[] = []

  const next = () => currentStep.value < steps.length ? currentStep.value++ : currentStep.value

  const loadBoard = (board: Board): [Ref<HTMLElement | null>[], () => void] => {
    const { render, setValue, beginAnimations } = createBox(board.components)
    setValue('next', next)
    steps.length = 0
    steps.push(...board.steps.map((step) => ref<HTMLElement | null>(null)))
    const rendered: number[] = []
    const _render = () => {
      watch(currentStep, (step) => {
        if (rendered.includes(step)) return
        rendered.push(step)
        render(board.steps[step - 1]!.component, (steps[step - 1]!.value! as unknown as HTMLElement[])[0]!)
        console.log(beginAnimations)
      }, { immediate: true })
    }
    return [steps, _render]
  }

  return {
    currentStep,
    loadBoard,
    next,
  }
}
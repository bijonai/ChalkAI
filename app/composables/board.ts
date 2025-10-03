import { createBox } from "@chalk-dsl/renderer-runtime"
import type { Board } from "~~/shared"
import '@chalk-dsl/layout'

export function useBoard() {
  const currentStep = ref<number>(1)
  const steps: Ref<HTMLElement | null>[] = []

  const next = () => currentStep.value < steps.length ? currentStep.value++ : currentStep.value

  const loadBoard = (board: Board): [Ref<HTMLElement | null>[], () => void] => {
    const { renderRoot, setValue, beginAnimations } = createBox(board.components)
    setValue('next', next)
    steps.length = 0
    steps.push(...board.steps.map(() => ref<HTMLElement | null>(null)))
    const rendered: number[] = []
    const _render = () => {
      watch(currentStep, (step) => {
        if (rendered.includes(step)) return
        rendered.push(step)
        const target = (steps[step - 1]!.value! as unknown as HTMLElement[])[0]!
        target.innerHTML = ''
        board.steps[step - 1]!.components.forEach((component) => {
          const root = renderRoot(component)
          if (!root) return
          target.append(...(Array.isArray(root) ? root : [root]))
        })
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
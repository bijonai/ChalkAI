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
        for (let i = 1; i <= step; i++) {
          if (rendered.includes(i)) continue
          rendered.push(i)
          const target = (steps[i - 1]!.value! as unknown as HTMLElement[])[0]!
          target.innerHTML = ''
          board.steps[i - 1]!.components.forEach((component) => {
            const root = renderRoot(component)
            if (!root) return
            target.append(...(Array.isArray(root) ? root : [root]))
          })
          console.log(beginAnimations)
        }
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
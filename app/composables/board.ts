import { createRenderer, getRootSpace } from "@chalk-dsl/renderer-runtime"
import type { Board } from "~~/shared"
import '@chalk-dsl/layout'
import '@chalk-dsl/form'
import '@chalk-dsl/widget'
import '@chalk-dsl/canvas'
import '@chalk-dsl/math'

export function useBoard() {
  const currentStep = ref<number>(1)
  const steps: Ref<HTMLElement | null>[] = []

  console.log(getRootSpace())

  const next = () => currentStep.value < steps.length ? currentStep.value++ : currentStep.value

  const loadBoard = (board: Board): [Ref<HTMLElement | null>[], () => void] => {
    const { renderRoot, setValue, beginAnimations, mount } = createRenderer(board.components)
    setValue('next', next)
    setValue('currentStep', currentStep)
    steps.length = 0
    steps.push(...board.steps.map(() => ref<HTMLElement | null>(null)))
    const rendered: number[] = []
    const _render = () => {
      watch(currentStep, (s) => {
        for (const [i, step] of board.steps.entries()) {
          if (rendered.includes(i + 1)) continue
          rendered.push(i + 1)
          const target = (steps[i]!.value! as unknown as HTMLElement[])[0]!
          target.innerHTML = ''
          step.components.forEach((component) => {
            const root = renderRoot(component)
            if (!root) return
            target.append(...(Array.isArray(root) ? root : [root]))
          })
          console.log(beginAnimations)
          if (step.conditional && i + 1 >= s) break
        }
        mount()
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
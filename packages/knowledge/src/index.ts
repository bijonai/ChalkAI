import { CalculatorKnowledge } from './calculator'
import { PrefabKnowledge } from './prefab'

export interface Knowledge {
  prefabs: PrefabKnowledge[]
  calculators: CalculatorKnowledge[]
}

export * from './calculator'
export * from './prefab'
export * from './utils/contential'
export * from './utils/tag'

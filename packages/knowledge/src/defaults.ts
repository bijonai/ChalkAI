import { CalculatorKnowledge, type Knowledge, type PrefabKnowledge } from ".";

const knowledge: Knowledge = {
  prefabs: [],
  calculators: [],
}

export const addPrefabKnowledge = (prefab: PrefabKnowledge) => {
  knowledge.prefabs.push(prefab)
}

export const addCalculatorKnowledge = (calculator: CalculatorKnowledge) => {
  knowledge.calculators.push(calculator)
}

export default knowledge

import knowledge from '@chalk-dsl/knowledge/default'
import { client } from '../shared/db'
import type { CalculatorKnowledge, PrefabKnowledge } from '@chalk-dsl/knowledge'
import { embed } from 'xsai'
import 'dotenv/config'

import '@chalk-dsl/layout'
import '@chalk-dsl/form'
import '@chalk-dsl/widget'

const getEmbeddings = async (input: string) => {
  const { embedding } = await embed({
    model: process.env.DEFAULT_EMBED_MODEL!,
    apiKey: process.env.DEFAULT_EMBED_API_KEY!,
    baseURL: process.env.DEFAULT_EMBED_BASE_URL!,
    input,
  })
  return embedding
}

const [, , type, ...targets] = process.argv

const waitlist: {
  prefabs: PrefabKnowledge[]
  calculators: CalculatorKnowledge[]
} = {
  prefabs: [],
  calculators: [],
}

if (type) {
  if (type === 'prefab') {
    if (targets.length === 0) {
      waitlist.prefabs.push(...knowledge.prefabs)
    } else {
      waitlist.prefabs.push(...targets.map(target => knowledge.prefabs.find(prefab => prefab.name === target)).filter(Boolean) as PrefabKnowledge[])
    }
  } else if (type === 'calculator') {
    if (targets.length === 0) {
      waitlist.calculators.push(...knowledge.calculators)
    } else {
      waitlist.calculators.push(...targets.map(target => knowledge.calculators.find(calculator => calculator.name === target)).filter(Boolean) as CalculatorKnowledge[])
    }
  }
} else {
  waitlist.prefabs.push(...knowledge.prefabs)
  waitlist.calculators.push(...knowledge.calculators)
}

for (const prefab of waitlist.prefabs) {
  const embedding = await getEmbeddings(JSON.stringify(prefab))
  const result = await client.knowledge.setPrefabKnowledge(prefab, embedding)
  console.log(`[Embedding] ${prefab.name} => ${result[0].id}`)
}

for (const calculator of waitlist.calculators) {
  const embedding = await getEmbeddings(JSON.stringify(calculator))
  const result = await client.knowledge.setCalculatorKnowledge(calculator, embedding)
  console.log(`[Embedding] ${calculator.name} => ${result[0].id}`)
}

console.log('[Done]')
console.log(`[Prefabs Count] ${waitlist.prefabs.length}`)
console.log(`[Calculators Count] ${waitlist.calculators.length}`)
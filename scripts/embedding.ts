import knowledge from '@chalk-dsl/knowledge/default'
import { client } from '../shared/db'
import type { PrefabKnowledge } from '@chalk-dsl/knowledge'
import { embed } from 'xsai'
import 'dotenv/config'

import '@chalk-dsl/layout'

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
} = {
  prefabs: [],
}

if (type) {
  if (type === 'prefab') {
    if (targets.length === 0) {
      waitlist.prefabs.push(...knowledge.prefabs)
    } else {
      waitlist.prefabs.push(...targets.map(target => knowledge.prefabs.find(prefab => prefab.name === target)).filter(Boolean) as PrefabKnowledge[])
    }
  }
} else {
  waitlist.prefabs.push(...knowledge.prefabs)
}

for (const prefab of waitlist.prefabs) {
  const embedding = await getEmbeddings(JSON.stringify(prefab))
  const result = await client.knowledge.setPrefabKnowledge(prefab, embedding)
  console.log(`[Embedding] ${prefab.name} => ${result[0].id}`)
}

console.log('[Done]')
console.log(`[Prefabs Count] ${waitlist.prefabs.length}`)
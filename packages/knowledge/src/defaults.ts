import { type Knowledge, type PrefabKnowledge } from ".";

const knowledge: Knowledge = {
  prefabs: [],
}

export const addPrefabKnowledge = (prefab: PrefabKnowledge) => {
  knowledge.prefabs.push(prefab)
}

export default knowledge

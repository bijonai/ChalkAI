import { PrefabKnowledge } from "../prefab";

export const getTags = (prefabs: PrefabKnowledge[]) => {
  return prefabs.map((prefab) => prefab.tags).flat()
}

export const getPrefabsByTag = (prefabs: PrefabKnowledge[], tag: string) => {
  return prefabs.filter((prefab) => prefab.tags.includes(tag))
}

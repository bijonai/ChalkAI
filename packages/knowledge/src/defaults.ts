import { definePrefabKnowledge, type Knowledge } from ".";

const knowledge: Knowledge = {
  prefabs: [],
}

knowledge.prefabs.push(definePrefabKnowledge<{ a: string, b: number }>((utils) => {
  utils.name('test')
  utils.description('test')
  utils.tag('test')
  utils.prop('a').describe('test')
  utils.prop('b').describe('test')
}))

export default knowledge

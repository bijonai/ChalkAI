import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { FormModelAttributes, modelKnowledge, parseModel } from "./shared";
import { theme } from "@chalk-dsl/utils-theme";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";

export interface InputAttributes extends FormModelAttributes {
  width?: number | string
  placeholder: string
}

const input = definePrefab<'input', InputAttributes>((context) => {
  return {
    name: 'input',
    generator: (attrs) => {
      const { model } = parseModel(attrs.model)
      const input = document.createElement('input')
      input.style.width = attrs.width ? theme.size(attrs.width) : '100%'
      input.placeholder = attrs.placeholder
      input.value = context[model] as string
      input.addEventListener('input', () => {
        context[model] = input.value
      })
      return input
    },
    defaults: {
      placeholder: '',
    }
  }
})

export default input

registerPrefab('input', input)

// ------

export const knowledge = definePrefabKnowledge((utils) => {
  utils.extend(modelKnowledge)
  utils.name('input')
  utils.description('A input form element')
  utils.prop('width')
    .describe('The width of the input')
    .type('string | number').optional()
  utils.prop('placeholder')
    .describe('The placeholder of the input')
    .type('string').optional()
  return utils.toKnowledge()
})

addPrefabKnowledge(knowledge)

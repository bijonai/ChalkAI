import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { theme } from "@chalk-dsl/utils-theme";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";

export interface ButtonAttributes {
  label: string
  disable: boolean
  width?: number | string
}

const button = definePrefab<'button', ButtonAttributes>(() => {
  return {
    name: 'button',
    generator: (attrs) => {
      const button = document.createElement('button')
      button.textContent = attrs.label
      button.disabled = attrs.disable
      button.style.width = attrs.width ? theme.size(attrs.width) : '100%'
      return button
    },
    defaults: {
      disable: false,
    }
  }
})

export default button

registerPrefab('button', button)

// ------

export const knowledge = definePrefabKnowledge((utils) => {
  utils.name('button')
  utils.description('A button form element')
  utils.prop('label')
    .describe('The label of the button')
    .type('string')
  utils.prop('disable')
    .describe('The disable state of the button')
    .type('boolean').optional()
  utils.prop('width')
    .describe('The width of the button')
    .type('string | number').optional()
})

addPrefabKnowledge(knowledge)
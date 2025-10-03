import { definePrefab, registerPrefab, Ref } from "@chalk-dsl/renderer-core";
import { FormModelAttributes, parseModel } from ".";
import { theme } from "@chalk-dsl/utils-theme";

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

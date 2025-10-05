import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { FormModelAttributes, modelKnowledge, parseModel } from "./shared";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { theme } from "@chalk-dsl/utils-theme";
import { useSlot } from "@chalk-dsl/renderer-runtime";

export interface ChooserAttributes extends FormModelAttributes {
  width: string | number
  title: string
  type: 'single' | 'multiple'
}

export const chooser = definePrefab<'chooser', ChooserAttributes>((context) => {
  return {
    name: 'chooser',
    generator: (attrs, children) => {
      const { model } = parseModel(attrs.model)
      const root = document.createElement('div')
      root.style.width = attrs.width ? theme.size(attrs.width) : '100%'
      const field = document.createElement('fieldset')
      field.style.width = '100%'
      field.style.display = 'flex'
      field.style.flexDirection = 'column'
      field.style.gap = '10px'
      field.style.border = '1px solid #ccc'
      field.style.padding = '10px'
      const legend = document.createElement('legend')
      legend.textContent = attrs.title
      field.append(legend)
      root.append(field)
      const content = document.createElement('div')
      content.style.width = '100%'
      content.style.display = 'flex'
      content.style.flexDirection = 'column'
      content.style.gap = '10px'
      field.append(content)
      const options = document.createElement('div')
      options.style.width = '100%'
      options.style.display = 'flex'
      options.style.flexDirection = 'column'
      options.style.gap = '10px'
      field.append(options)

      const [slots] = useSlot<['content', `option:${string}`]>(children)
      content.append(...slots.content ?? [])
      const name = crypto.randomUUID()
      for (const slot of Object.entries(slots)) {
        const [type, nodes] = slot
        if (type.startsWith('option:')) {
          const value = type.replace('option:', '')
          const container = document.createElement('div')
          container.style.width = '100%'
          container.style.display = 'flex'
          container.style.flexDirection = 'row'
          container.style.gap = '10px'
          const option = document.createElement('input')
          option.type = attrs.type === 'single' ? 'radio' : 'checkbox'
          option.name = name
          option.value = value
          option.style.width = '100%'
          option.style.display = 'flex'
          option.style.flexDirection = 'column'
          option.style.gap = '10px'
          option.style.width = '12px'
          container.append(option)
          const label = document.createElement('label')
          label.append(...nodes ?? [])
          label.style.width = '100%'
          container.append(label)
          options.append(container)
        }
      }

      if (model) {
        if (attrs.type === 'single') {
          const opts = options.querySelectorAll(`input[name="${name}"]`)
          for (const option of Array.from(opts ?? [])) {
            option.addEventListener('change', () => {
              context[model] = (option as HTMLInputElement).value
            })
          }
        } else {
          const opts = options.querySelectorAll(`input[name="${name}"]`)
          for (const option of Array.from(opts ?? [])) {
            option.addEventListener('change', () => {
              context[model] ??= []
              if ((option as HTMLInputElement).checked) {
                context[model].push((option as HTMLInputElement).value)
              } else {
                context[model] = context[model].filter((v: string) => v !== (option as HTMLInputElement).value)
              }
            })
          }
        }
      }

      return root
    },
    defaults: {
      width: '100%',
      title: '',
      type: 'single',
    }
  }
})

export default chooser

registerPrefab('chooser', chooser)

// ------

export const knowledge = definePrefabKnowledge((utils) => {
  utils.extend(modelKnowledge)
  utils.name('chooser')
  utils.description('A chooser form, could be used as a choosing problem')
  utils.prop('width')
    .describe('The width of the chooser')
    .type('string | number').optional()
  utils.prop('title')
    .describe('The title of the chooser, used to show a question number')
    .type('string')
  
  utils.slot('content', 'The content of the chooser (for example, question content)')
  utils.slot('option:<value>', 'A option, value will be the value of model')
})
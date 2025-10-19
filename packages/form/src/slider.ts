import { definePrefab, PrefabGenerator, registerPrefab } from "@chalk-dsl/renderer-core"
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";
import { FormModelAttributes, modelKnowledge, parseModel } from "./shared";

export interface SliderAttributes extends FormModelAttributes {
  min?: number
  max?: number 
  step?: number
  unit?: string
  title?: string
}

const SLIDER_DEFAULTS: SliderAttributes = {
  min: 0,
  max: 100, 
  step: undefined,
  unit: undefined,
  title: undefined,
}

export const slider = definePrefab<'slider', SliderAttributes>((context) => ({
  name: 'slider',
  generator: (attrs: SliderAttributes) => {


    // Create value management object
    const value = (() => {
      const valueInitial = (() => {
        if (attrs.model) {
          const { model, default: defaultValue } = parseModel(attrs.model)
          return model ? context[model] : (defaultValue || attrs.min || 0)
        }

        return attrs.min || 0
      })()

      const obj = {
        rawValue: NaN,
        setter: (val: number) => {
          obj.rawValue = val
          obj.listener.forEach((fn) => fn(val))
        },
        getter: () => {
          return obj.rawValue
        },
        listener: [] as Array<(val: number) => void>,
      }

      obj.setter(Number(valueInitial))

      return obj
    })()
  

    // Make model sync with value changes
    const syncModel = (val: number) => {
      if (attrs.model) {
        const { model } = parseModel(attrs.model)
        model && (context[model] = val)
      }
    }
    value.listener.push(syncModel)

    
    // Create value display element
    const render = () => {
      const container = document.createElement('div')

      container.style.display = 'flex'
      container.style.alignItems = 'center'
      container.style.gap = '8px'
      container.style.padding = '1rem'
      

      const slider = document.createElement('input')
      slider.type = 'range'

      if (attrs.min !== undefined) slider.min = attrs.min.toString()
      if (attrs.max !== undefined) slider.max = attrs.max.toString()
      if (attrs.step !== undefined) slider.step = attrs.step.toString()
      if (attrs.title !== undefined) slider.title = attrs.title

      slider.value = value.getter().toString()
      slider.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement
        const val = Number(target.value)
        value.setter(val)
      })

      const valueDisplay = document.createElement('span')

      // Determine precision from step
      const decimalPlaces = (num: number): number => {
        if (!Number.isFinite(num)) return 0
        const s = num.toString().toLowerCase()
        if (s.includes('e')) {
          const [coeff, expPart] = s.split('e')
          const exp = parseInt(expPart, 10)
          const dec = (coeff.split('.')[1]?.length ?? 0)
          if (Number.isNaN(exp)) return dec
          return exp >= 0 ? Math.max(0, dec - exp) : dec + (-exp)
        }
        return (s.split('.')[1]?.length ?? 0)
      }

      const precision = attrs.step !== undefined ? decimalPlaces(attrs.step) : undefined

      const updateValueDisplay = (val: number) => {
        const formatted = precision !== undefined ? val.toFixed(precision) : String(val)
        valueDisplay.textContent = `${formatted}${attrs.unit || ''}`
      }

      // Initialize value display
      updateValueDisplay(value.getter())
      value.listener.push(updateValueDisplay)

      // Initial title
      if (attrs.title) {
        const titleElem = document.createElement('label')
        titleElem.textContent = attrs.title
        container.appendChild(titleElem)
      }

      container.appendChild(slider)
      container.appendChild(valueDisplay)

      return container
    }

    return render()
  },
  defaults: SLIDER_DEFAULTS
}))

export default slider

registerPrefab('slider', slider)


export const knowledge = definePrefabKnowledge((utils) => {
  utils.extend(modelKnowledge)
  utils.name('slider')
  utils.description('A slider form element')
  utils.prop('min')
    .describe('The minimum value of the slider')
    .type('number').optional()
  utils.prop('max')
    .describe('The maximum value of the slider')
    .type('number').optional()
  utils.prop('step')
    .describe('The step value of the slider')
    .type('number').optional()
  utils.prop('unit')
    .describe('The unit of the slider value')
    .type('string').optional()
  utils.prop('title')
    .describe('The title of the slider')
    .type('string').optional()

  return utils.toKnowledge()
})

addPrefabKnowledge(knowledge)

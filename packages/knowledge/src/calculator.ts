export interface CalculatorKnowledgeArgument {
  name: string
  description: string
  type: string
  required: boolean
  default?: string
}

export interface CalculatorKnowledge {
  name: string
  description: string
  return: [string, string?] // [type, description]
  args: CalculatorKnowledgeArgument[]
  raw: string
}

export function createCalculatorKnowledgeUtils() {
  let _name: string = ''
  let _description: string = ''
  let _return: [string, string?] = ['', '']
  const args: CalculatorKnowledgeArgument[] = []

  const name = (name: string) => {
    _name = name
  }
  const description = (description: string) => {
    _description = description
  }
  const returns = (type: string, description?: string) => {
    _return = [type, description ?? '']
  }

  const toKnowledge = (): CalculatorKnowledge => ({
    name: _name,
    description: _description,
    return: _return,
    args,
    raw: `${_name}(${args.map(arg => `${arg.name}${arg.required ? '' : '?'}: ${arg.type}${arg.default ? ` = ${arg.default}` : ''}`).join(', ') })`,
  })

  const arg = (key: string) => {
    const result: CalculatorKnowledgeArgument = { name: key, description: '', type: '', required: true }
    const describe = (description: string) => {
      result.description = description
      return utils
    }
    const type = (type: string) => {
      result.type = type
      return utils
    }
    const optional = (defaultValue?: string) => {
      result.required = false
      result.default = defaultValue
      return utils
    }
    const utils = { describe, type, optional }
    args.push(result)
    return utils
  }

  const utils = {
    name,
    description,
    returns,
    toKnowledge,
    arg,
  }

  return utils
}

export const defineCalculatorKnowledge = (
  callback: (utils: ReturnType<typeof createCalculatorKnowledgeUtils>) => void
) => {
  const utils = createCalculatorKnowledgeUtils()
  callback(utils)
  return utils.toKnowledge()
}

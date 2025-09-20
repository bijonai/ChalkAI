export function isCSSVariableExist(variableName: string): boolean {
  const style = window.getComputedStyle(document.documentElement)
  const value = style.getPropertyValue(variableName).trim()
  return value !== ''
}

export function size(name: string | number): string {
  const variable = `--sci-size-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name.toString()
}

export function pallete(name: string): string {
  const variable = `--sci-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name
}

export function highlight(name: string): string {
  const variable = `--sci-highlight-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name
}

export function dasharray(name: string): string {
  const variable = `--sci-dasharray-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name
}

export function font(name: string): string {
  const variable = `--sci-font-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name
}
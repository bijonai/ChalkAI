import { defineStatement, registerStatement } from "@chalk-dsl/renderer-core"

export const useSlot = <
  T extends Array<string>,
  K extends [...T, 'default'] = [...T, 'default']
>(children: () => Node[]) => {
  const nodes = children() as HTMLElement[]
  const slots: Record<K[number], Node[] | undefined> = {} as Record<K[number], Node[] | undefined>
  for (const node of nodes) {
    const slot = node.getAttribute('slot')
    if (slot) {
      slots[slot as K[number]] ??= []
      slots[slot as K[number]]?.push(node)
    } else {
      slots['default' as K[number]] ??= []
      slots['default' as K[number]]?.push(node)
    }
  }
  return [slots, nodes] as const
}

export const slotStatement = defineStatement((source) => {
  return {
    pre(context, element, res) {
      delete element.statements['slot']
      const _nodes = res(element, context)
      const nodes = (Array.isArray(_nodes) ? _nodes : [_nodes]) as HTMLElement[]
      nodes.forEach(node => {
        node.setAttribute('slot', source)
      })
      return nodes
    }
  }
})

registerStatement('slot', slotStatement)

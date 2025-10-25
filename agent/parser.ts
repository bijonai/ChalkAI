import { type Board } from "../shared";
import { Component, parseComponentInfo } from '@chalk-dsl/renderer-runtime'

export const createParser = (board: Board) => {
  return (content: string) => {
    const matches = content.match(/```component[\s\S]*?```/gm)
    for (const match of matches || []) {
      const data = match.replace(/```component/g, '').replace(/```/g, '')
      const component = parseComponentInfo(data)
      if (board.components.find(c => (<Component<string>>c).name === component.name)) {
        board.components = board.components.filter(c => {
          if (typeof c === 'string') {
            const parsed = parseComponentInfo(c)
            return parsed.name !== component.name
          } else {
            return c.name !== component.name
          }
        })
        board.components.push(data)
      } else board.components.push(data)
    }
  }
}
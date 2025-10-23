import { Board } from "../shared";
import { jsonrepair } from 'jsonrepair'

export const createParser = (board: Board) => {
  return (content: string) => {
    const matches = content.match(/<component>[\s\S]*?<\/component>/gm)
    for (const match of matches || []) {
      const json = match.replace(/<component>/g, '').replace(/<\/component>/g, '')
      const repaired = jsonrepair(json)
      const component = JSON.parse(repaired)
      if (board.components.find(c => c.name === component.name)) {
        board.components = board.components.filter(c => c.name !== component.name)
        board.components.push(component)
      } else board.components.push(component)
    }
  }
}
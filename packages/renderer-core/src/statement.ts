import { Context } from "./context"
import { BaseChalkElement } from "./element"

export type StatementPreGenerator = (context: Context, element: BaseChalkElement<string>) => BaseChalkElement<string>
export type StatementPostGenerator = (
  context: Context,
  element: BaseChalkElement<string>,
  resolve: (element: BaseChalkElement<string> | string, contextOverride?: Context) => Node | Node[] | null
) => Node[]
export type Statement = (source: string) => {
  pre?: StatementPreGenerator
  post?: StatementPostGenerator
}

export function defineStatement(statement: Statement): Statement {
  return statement
}
export type StatementMap = Map<string, Statement>
export const statementMap: StatementMap = new Map()

export function registerStatement(name: string, statement: Statement) {
  statementMap.set(name, statement)
}

export function getStatement(name: string) {
  return statementMap.get(name)
}
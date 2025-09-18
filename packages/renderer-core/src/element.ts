export type AttributeValue = string | number | boolean | null | undefined | object | ComputedAttributeValue | AttributeValue[]
export type ComputedAttributeValue = `{{${string}}}`
export type EventValue = string | string[]
export type StatementValue = string

export type BaseChalkElement<
  Name extends string,
  Attrs extends Record<string, AttributeValue> = Record<string, AttributeValue>,
  > = {
  name: Name
  attrs: Attrs
  events: Record<string, EventValue>
  statements: Record<string, StatementValue>
  children: (BaseChalkElement<string> | string)[]
}
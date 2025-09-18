import { BaseChalkElement } from "@chalk-dsl/renderer-core"

export interface BoxError<T extends string> {
  name: T
  message: string
  element: BaseChalkElement<string>
}

export type ElementNotFoundError = BoxError<"Element Not Found">

export function createErrorContainer<T extends string>() {
  const errors: BoxError<T>[] = []
  let errorHandler: (error: BoxError<T>) => void = () => {}
  const addError = (error: BoxError<T>) => {
    errors.push(error)
    errorHandler(error)
  }
  const onError = (handler: (error: BoxError<T>) => void) => {
    errorHandler = handler
  }
  const getErrors = () => errors
  const clearErrors = () => {
    errors.length = 0
  }
  return { addError, onError, getErrors, clearErrors }
}

import { BaseChalkElement } from "./element"

export interface ChalkError<T extends string> {
  name: T
  message: string
  element: BaseChalkElement<string>
}

export function createErrorContainer<T extends string>() {
  const errors: ChalkError<T>[] = []
  let errorHandler: (error: ChalkError<T>) => void = () => { }
  const addError = (error: ChalkError<T>) => {
    errors.push(error)
    errorHandler(error)
  }
  const onError = (handler: (error: ChalkError<T>) => void) => {
    errorHandler = handler
  }
  const getErrors = () => errors
  const clearErrors = () => {
    errors.length = 0
  }
  return { addError, onError, getErrors, clearErrors }
}
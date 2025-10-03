import { definePrefab } from "@chalk-dsl/renderer-core";
import { FormModelAttributes } from ".";

export interface InputAttributes extends FormModelAttributes {
  width?: number | string
  placeholder?: string
}

const input = definePrefab<'input', InputAttributes>((context) => {
  return {
    name: 'input',
  }
})
import { parseAnimation } from "../src"

const cases =[
  'fade<1000>(from, to)',
  'fade<1000, 100>(from, to)',
  'fade{ease-in-out}<1000>(from, to)',
  'fade{ease-in-out}<1000, 100>(from, to)',
]

const results = cases.map(parseAnimation)

console.log(results)
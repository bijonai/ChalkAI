import type { Template } from "..";

export const conditionTest: Template = {
  id: 'condition-test',
  content: {
    "name": "ConditionTest",
    "props": [],
    "refs": {
      "showFirst": "true",
      "showSecond": "false",
      "counter": "0"
    },
    "root": {
      "name": "rows",
      "attrs": {
        "gap": 20,
        "padding": 20
      },
      "children": [
        {
          "name": "block",
          "attrs": {
            "padding": 15
          },
          "children": [
            "{{ i }}"
          ],
          "animations": {},
          "id": "cell-3-1",
          statements: {
            for: 'i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]',
            if: 'i % 2 ===0'
          }
        }
      ]
    }
  }
}

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
            "padding": 10,
            "background": "#f0f0f0"
          },
          "children": [
            "Control Panel:",
            {
              "name": "block",
              "attrs": {
                "padding": 10
              },
              "children": [
                "Counter: {{counter}}",
                {
                  "name": "block",
                  "attrs": {
                    "padding": 5
                  },
                  "children": [
                    "Button to increment counter"
                  ],
                  "events": {
                    "click": "counter = counter + 1"
                  }
                },
                {
                  "name": "block",
                  "attrs": {
                    "padding": 5
                  },
                  "children": [
                    "Toggle showFirst"
                  ],
                  "events": {
                    "click": "showFirst = !showFirst"
                  }
                },
                {
                  "name": "block",
                  "attrs": {
                    "padding": 5
                  },
                  "children": [
                    "Toggle showSecond"
                  ],
                  "events": {
                    "click": "showSecond = !showSecond"
                  }
                }
              ]
            }
          ]
        },
        {
          "name": "block",
          "attrs": {
            "padding": 10,
            "background": "#e8f4f8"
          },
          "children": [
            "Condition Test Results:",
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#d4edda",
                "border": "1px solid #c3e6cb"
              },
              "statements": {
                "if": "showFirst"
              },
              "children": [
                "✅ IF: showFirst is true - This should show when showFirst is true"
              ]
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#f8d7da",
                "border": "1px solid #f5c6cb"
              },
              "statements": {
                "else": ""
              },
              "children": [
                "❌ ELSE: showFirst is false - This should show when showFirst is false"
              ]
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#fff3cd",
                "border": "1px solid #ffeaa7"
              },
              "statements": {
                "if": "counter > 5"
              },
              "children": [
                "🔢 IF: Counter > 5 - This shows when counter is greater than 5"
              ]
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#d1ecf1",
                "border": "1px solid #bee5eb"
              },
              "statements": {
                "elif": "counter > 2 && counter < 6"
              },
              "children": [
                "🔢 ELIF: Counter > 2 - This shows when counter is 3-5"
              ]
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#f8d7da",
                "border": "1px solid #f5c6cb"
              },
              "statements": {
                "else": ""
              },
              "children": [
                "🔢 ELSE: Counter <= 2 - This shows when counter is 0-2"
              ]
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#e2e3e5",
                "border": "1px solid #d6d8db"
              },
              "statements": {
                "if": "showFirst && showSecond"
              },
              "children": [
                "🔗 Complex condition: Both showFirst AND showSecond are true"
              ]
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#ffeaa7",
                "border": "1px solid #fdcb6e"
              },
              "statements": {
                "elif": "showFirst || showSecond"
              },
              "children": [
                "🔗 Complex condition: Either showFirst OR showSecond is true (but not both)"
              ]
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#ddd",
                "border": "1px solid #bbb"
              },
              "statements": {
                "else": ""
              },
              "children": [
                "🔗 Complex condition: Both showFirst AND showSecond are false"
              ]
            }
          ]
        }
      ]
    }
  }
}

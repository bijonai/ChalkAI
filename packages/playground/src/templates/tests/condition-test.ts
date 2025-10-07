import type { Template } from "..";

export const conditionTest: Template = {
  id: 'condition-test',
  content: {
    "name": "ConditionTest",
    "props": [],
    "refs": {
      "showFirst": "true",
      "showSecond": "false",
      "counter": "0",
      "message": "'No button clicked yet'"
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
            "Control Panel:",
            {
              "name": "block",
              "attrs": {
                "padding": 10
              },
              "children": [
                "Counter: {{counter}} | Message: {{message}}",
                {
                  "name": "block",
                  "attrs": {
                    "padding": 5,
                    "background": "#007bff",
                    "color": "white",
                    "cursor": "pointer"
                  },
                  "children": [
                    "Increment Counter"
                  ],
                  "events": {
                    "click": "() => { counter = counter + 1; message = 'Counter incremented!' }"
                  }
                },
                {
                  "name": "block",
                  "attrs": {
                    "padding": 5,
                    "background": "#28a745",
                    "color": "white",
                    "cursor": "pointer"
                  },
                  "children": [
                    "Toggle showFirst"
                  ],
                  "events": {
                    "click": "() => { showFirst = !showFirst; message = 'showFirst toggled!' }"
                  }
                },
                {
                  "name": "block",
                  "attrs": {
                    "padding": 5,
                    "background": "#ffc107",
                    "color": "black",
                    "cursor": "pointer"
                  },
                  "children": [
                    "Toggle showSecond"
                  ],
                  "events": {
                    "click": "() => { showSecond = !showSecond; message = 'showSecond toggled!' }"
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
                "border": "1px solid #c3e6cb",
                "cursor": "pointer"
              },
              "statements": {
                "if": "showFirst"
              },
              "children": [
                "✅ IF: showFirst is true - Click me to test event binding!"
              ],
              "events": {
                "click": "() => { message = 'IF block clicked! Events work in conditional elements!' }"
              }
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#f8d7da",
                "border": "1px solid #f5c6cb",
                "cursor": "pointer"
              },
              "statements": {
                "else": ""
              },
              "children": [
                "❌ ELSE: showFirst is false - Click me to test event binding!"
              ],
              "events": {
                "click": "() => { message = 'ELSE block clicked! Events work in conditional elements!' }"
              }
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#fff3cd",
                "border": "1px solid #ffeaa7",
                "cursor": "pointer"
              },
              "statements": {
                "if": "counter > 5"
              },
              "children": [
                "🔢 IF: Counter > 5 - Click to reset counter"
              ],
              "events": {
                "click": "() => { counter = 0; message = 'Counter reset from IF block!' }"
              }
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#d1ecf1",
                "border": "1px solid #bee5eb",
                "cursor": "pointer"
              },
              "statements": {
                "elif": "counter > 2"
              },
              "children": [
                "🔢 ELIF: Counter > 2 - Click to add 5 to counter"
              ],
              "events": {
                "click": "() => { counter = counter + 5; message = 'Added 5 from ELIF block!' }"
              }
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#f8d7da",
                "border": "1px solid #f5c6cb",
                "cursor": "pointer"
              },
              "statements": {
                "else": ""
              },
              "children": [
                "🔢 ELSE: Counter <= 2 - Click to set counter to 10"
              ],
              "events": {
                "click": "() => { counter = 10; message = 'Counter set to 10 from ELSE block!' }"
              }
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#e2e3e5",
                "border": "1px solid #d6d8db",
                "cursor": "pointer"
              },
              "statements": {
                "if": "showFirst && showSecond"
              },
              "children": [
                "🔗 Complex: Both true - Click to turn both off"
              ],
              "events": {
                "click": "() => { showFirst = false; showSecond = false; message = 'Both turned off from complex IF!' }"
              }
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#ffeaa7",
                "border": "1px solid #fdcb6e",
                "cursor": "pointer"
              },
              "statements": {
                "elif": "showFirst || showSecond"
              },
              "children": [
                "🔗 Complex: One true - Click to turn both on"
              ],
              "events": {
                "click": "() => { showFirst = true; showSecond = true; message = 'Both turned on from complex ELIF!' }"
              }
            },
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#ddd",
                "border": "1px solid #bbb",
                "cursor": "pointer"
              },
              "statements": {
                "else": ""
              },
              "children": [
                "🔗 Complex: Both false - Click to turn first on"
              ],
              "events": {
                "click": "() => { showFirst = true; message = 'First turned on from complex ELSE!' }"
              }
            }
          ]
        }
      ]
    }
  }
}

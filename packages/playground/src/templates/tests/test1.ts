import type { Template } from "..";

export const test1: Template = {
  id: 'test1',
  content: {
    "name": "GridLayout",
    "props": [],
    "root": {
      "name": "grid",
      "attrs": {
        "rows": 3,
        "columns": 2,
        "gap": 10,
        "width": "100%",
        "height": "400px",
        "padding": 20
      },
      "children": [
        {
          "name": "block",
          "attrs": {
            "padding": 15
          },
          "children": [
            "Row 1, Column 1"
          ],
          "animations": {},
          "id": "cell-1-1"
        },
        {
          "name": "block",
          "attrs": {
            "padding": 15
          },
          "children": [
            "Row 1, Column 2"
          ],
          "animations": {},
          "id": "cell-1-2"
        },
        {
          "name": "block",
          "attrs": {
            "padding": 15
          },
          "children": [
            "Row 2, Column 1"
          ],
          "animations": {},
          "id": "cell-2-1"
        },
        {
          "name": "block",
          "attrs": {
            "padding": 15
          },
          "children": [
            "Row 2, Column 2"
          ],
          "animations": {},
          "id": "cell-2-2"
        },
        {
          "name": "block",
          "attrs": {
            "padding": 15
          },
          "children": [
            "Row 3, Column 1"
          ],
          "animations": {},
          "id": "cell-3-1"
        },
        {
          "name": "block",
          "attrs": {
            "padding": 15
          },
          "children": [
            "Row 3, Column 2"
          ],
          "animations": {},
          "id": "cell-3-2"
        }
      ],
      "animations": {},
      "id": "main-grid"
    }
  }
}
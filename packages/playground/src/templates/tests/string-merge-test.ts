import type { Template } from "..";

export const stringMergeTest: Template = {
  id: 'string-merge-test',
  content: {
    "name": "StringMergeTest",
    "props": [],
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
            "padding": 15,
            "background": "#f8f9fa",
            "border": "1px solid #dee2e6"
          },
          "children": [
            "Test Case 1: Consecutive strings should be merged with newlines",
            "This is the first string",
            "This is the second string", 
            "This is the third string"
          ]
        },
        {
          "name": "block",
          "attrs": {
            "padding": 15,
            "background": "#e8f4f8",
            "border": "1px solid #bee5eb"
          },
          "children": [
            "Test Case 2: Mixed content - strings and elements",
            "First string before element",
            "Second string before element",
            {
              "name": "block",
              "attrs": {
                "padding": 5,
                "background": "#007bff",
                "color": "white"
              },
              "children": [
                "Element in between"
              ]
            },
            "First string after element",
            "Second string after element",
            "Third string after element"
          ]
        },
        {
          "name": "block",
          "attrs": {
            "padding": 15,
            "background": "#fff3cd",
            "border": "1px solid #ffeaa7"
          },
          "children": [
            "Test Case 3: Nested elements with consecutive strings",
            {
              "name": "block",
              "attrs": {
                "padding": 10,
                "background": "#d4edda"
              },
              "children": [
                "Nested first string",
                "Nested second string",
                "Nested third string"
              ]
            },
            "Back to parent level string"
          ]
        }
      ]
    }
  }
}

import type { Template } from "..";

export const test2: Template = {
  id: 'test2',
  content: {
    "name": "step2-characteristics",
    "refs": {
      "showAll": "false",
      "currentPoint": "0"
    },
    "root": {
      "name": "columns",
      "attrs": {
        "gap": 20,
        "padding": 20
      },
      "children": [
        "# 作用力与反作用力的特点",
        "让我们逐一了解作用力与反作用力的重要特征：",
        {
          "name": "grid",
          "attrs": {
            "gap": 15,
            "columns": 2
          },
          "children": [
            {
              "name": "button",
              "attrs": {
                "label": "1. 大小相等",
                "width": "100%"
              },
              "events": {
                "click": "currentPoint = '1'"
              }
            },
            {
              "name": "button",
              "attrs": {
                "label": "2. 方向相反",
                "width": "100%"
              },
              "events": {
                "click": "currentPoint = '2'"
              }
            },
            {
              "name": "button",
              "attrs": {
                "label": "3. 同时出现",
                "width": "100%"
              },
              "events": {
                "click": "currentPoint = '3'"
              }
            },
            {
              "name": "button",
              "attrs": {
                "label": "4. 作用在不同物体上",
                "width": "100%"
              },
              "events": {
                "click": "currentPoint = '4'"
              }
            }
          ]
        },
        {
          "name": "block",
          "attrs": {
            "padding": 20
          },
          "children": [
            "## <color-primary>特点一：大小相等</color-primary>",
            "",
            "作用力和反作用力的**大小总是相等的**，无论物体的质量如何。",
            "",
            "**例子：** 你用10N的力推墙，墙也会用10N的力推你。",
            "",
            "<highlight-info>💡 这里的\"相等\"指的是力的大小（标量），不考虑方向。</highlight-info>"
          ],
          "statements": {
            "if": "currentPoint === '1'"
          }
        },
        {
          "name": "block",
          "attrs": {
            "padding": 20
          },
          "children": [
            "## <color-accent>特点二：方向相反</color-primary>",
            "",
            "作用力和反作用力的**方向总是相反的**，沿着同一条直线。",
            "",
            "**例子：** 你向右推桌子，桌子向左推你。",
            "",
            "<highlight-info>💡 \"相反\"指的是在同一直线上，指向相反的方向。</highlight-info>"
          ],
          "statements": {
            "if": "currentPoint === '2'"
          }
        },
        {
          "name": "block",
          "attrs": {
            "padding": 20
          },
          "children": [
            "## <color-note>特点三：同时出现</color-primary>",
            "",
            "作用力和反作用力**同时产生，同时消失**。",
            "",
            "**例子：** 你一开始推门，门就开始推你；你停止推门，门也停止推你。",
            "",
            "<highlight-info>💡 没有时间差，它们是瞬时对应的。</highlight-info>"
          ],
          "statements": {
            "if": "currentPoint === '3'"
          }
        },
        {
          "name": "block",
          "attrs": {
            "padding": 20
          },
          "children": [
            "## <color-warning>特点四：作用在不同物体上</color-primary>",
            "",
            "作用力和反作用力**分别作用在不同的物体上**，因此不会相互抵消。",
            "",
            "**例子：** 你推箱子的力作用在箱子上，箱子推你的力作用在你身上。",
            "",
            "<highlight-caution>⚠️ 这是最容易混淆的地方！它们不在同一个物体上，所以不会抵消。</highlight-caution>"
          ],
          "statements": {
            "if": "currentPoint === '4'"
          }
        },
        {
          "name": "button",
          "attrs": {
            "label": "显示所有特点",
            "width": "150px"
          },
          "events": {
            "click": "showAll = true"
          },
          "statements": {
            "if": "currentPoint !== '0'"
          }
        },
        {
          "name": "block",
          "attrs": {
            "padding": 20
          },
          "children": [
            "## <highlight-primary>总结：牛顿第三定律的四个特点</highlight-primary>",
            "",
            "| 特点 | 描述 | 记忆要点 |",
            "|------|------|----------|",
            "| **大小相等** | F₁ = F₂ | 力的大小数值相同 |",
            "| **方向相反** | 方向相差180° | 一个向左，一个向右 |",
            "| **同时出现** | 同生同灭 | 没有时间差 |",
            "| **不同物体** | 分别作用 | 不会相互抵消 |",
            "",
            {
              "name": "button",
              "attrs": {
                "label": "进入互动演示 →",
                "width": "200px"
              },
              "events": {
                "click": "next()"
              }
            }
          ],
          "statements": {
            "if": "showAll === true"
          }
        }
      ]
    },
    "props": []
  },
}
import type { Template } from "..";

export const d: Template = {
  id: 'd',
  content: `
---
name: Step7
props: []
refs:
  numRects: "1"
---
<block>
### 逼近面积：积分的引子（和无数小矩形）

虽然我们正在学习微分，但一个重要的概念——通过无限细分来逼近一个量——也体现在积分中。这种思想与我们瞬时变化率的理解方式非常相似。让我们提前探索一下！

我们将尝试计算曲线 $f(x) = x^2$ 在区间 $[0, 2]$ 上与 x 轴之间的面积。通常，曲线下方的面积很难直接计算。但我们可以用矩形来**逼近**它！
</block>

<rows :gap="20">
  <block>
    <canvas width="600" height="400">
      <plane :range="[-0.2, 2.5]" :domain="[-0.5, 5]">
        <function :expr="(x) => x * x" :domain="[0, 2]" :range="[0, 4]" color="primary"/>

          <rect
            :position="[i * (2 / numRects), 0]"
            :width="2 / numRects"
            :height="(i * (2 / numRects)) * (i * (2 / numRects))"
            fill="rgba(100, 150, 255, 0.3)"
            stroke="accent" #for="i in numRects"/>

      </plane>
    </canvas>
  </block>

  <block>
**当前状态**:
- 矩形数量: {{ numRects }}
- 每个矩形的宽度: {{ (2 / numRects).toFixed(4) }}
- 所有矩形面积之和 ≈ {{ (() => { let sum = 0; for (let i = 0; i < numRects; i++) { const x = i * (2 / numRects); sum += (2 / numRects) * (x * x); } return sum.toFixed(4); })() }}

**真实面积**: $\\int_0^2 x^2 dx = \\frac{8}{3} \\approx 2.6667$

<block #if="numRects >= 50">
[success]看！随着矩形数量增加，我们的近似值越来越接近真实面积了！[/success]
</block>
  </block>
</rows>

<slider model="numRects" :min="1" :max="100" :step="1" title="矩形数量"/>

<block>
**关键观察点**:
- 随着矩形数量的增加，矩形逼近曲线下方真实面积的效果越来越好。
- 当矩形数量趋于无穷大时，这些小矩形的面积之和就会无限接近真实面积。

这正是积分的核心思想，它与我们让 $h \to 0$ 以找到瞬时变化率的思想有着异曲同工之妙——都是通过无限细分来抓住"那一瞬间"或"那一小块"的精准信息。
</block>
  `.trim()
}

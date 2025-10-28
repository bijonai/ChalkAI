import type { Template } from "..";

export const slider: Template = {
  id: 'slider',
  content: `
  ---
name: Step2InteractiveGraph
props: []
refs:
  a: "1"
  b: "0"
  c: "0"
---
<block>
# 探索二次函数的图像

调整下面的滑块来改变参数 $a$, $b$, $c$ 的值，观察抛物线的变化：

当前函数：$y = {{ a.toFixed(1) }}x^2 + {{ b.toFixed(1) }}x + {{ c.toFixed(1) }}$
</block>

<slider model="a" :min="-3" :max="3" :step="0.1" title="参数 a" />
<slider model="b" :min="-5" :max="5" :step="0.1" title="参数 b" />
<slider model="c" :min="-5" :max="5" :step="0.1" title="参数 c" />

<canvas :origin="[300, 300]">
  <plane :range="[-10, 10]" :domain="[-10, 10]">
    <function
      :expr="(x) => a * x * x + b * x + c"
      :domain="[-10, 10]"
      :range="[-10, 10]"
      color="primary" />
  </plane>
</canvas>

<block>
[info]💡 提示：试着改变不同的参数，观察抛物线是如何变化的！[/info]
</block>

<block>
# 参数 a 的作用

参数 $a$ 决定了抛物线的[highlight-key]开口方向[/highlight-key]和[highlight-key]开口大小[/highlight-key]：

## 开口方向
- 当 $a {{ '>' }} 0$ 时，抛物线开口向上（像一个微笑 😊）
- 当 $a {{ '<' }} 0$ 时，抛物线开口向下（像一个皱眉 ☹️）

## 开口大小
- $|a|$ 越大，抛物线开口越窄
- $|a|$ 越小，抛物线开口越宽

试着调整下面的滑块，观察参数 $a$ 的影响：

当前函数：$y = {{ a.toFixed(2) }}x^2$
</block>

<slider model="a" :min="-3" :max="3" :step="0.1" title="参数 a" />

<canvas :origin="[300, 300]">
  <plane :range="[-10, 10]" :domain="[-10, 10]">
    <function
      :expr="(x) => a * x * x"
      :domain="[-10, 10]"
      :range="[-10, 10]"
      color="primary" />
  </plane>
</canvas>
  `
}

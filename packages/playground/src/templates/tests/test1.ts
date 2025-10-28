import type { Template } from "..";

export const test1: Template = {
  id: 'test1',
  content: `
---
name: Test 1 - 未闭合标签测试
props: []
refs:
  answer2: 'null'
---
测试未闭合标签：<x> 应该显示为文本

带属性的未闭合标签：<x attr="value"> 也应该显示为文本

单独的小于号：1 < 2 应该正常显示

单独的大于号：3 > 2 应该正常显示

比较运算：1 < 2 && 3 > 2 应该正常显示

正常的标签：<block>这应该正常解析</block>

<chooser model="answer2" title="问题 2" :margin="{ top: 20 }">
  <block #slot="content">下列哪个说法是**正确的**？</block>
  <block #slot="option:A">所有小数都是有理数</block>
  <block #slot="option:B">所有整数都是有理数</block>
  <block #slot="option:C">$\sqrt{5}$ 是有理数</block>
  <block #slot="option:D">有理数不能是负数</block>
</chooser>`
    .trim()
}
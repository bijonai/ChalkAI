import type { Template } from "..";

export const test2: Template = {
  id: 'test2',
  content: `
---
name: Step3_ForceExperience
props: []
refs:
  force: "5"
  mass: "2"
  acceleration: "force / mass"
  position: "0"
  isMoving: "false"
animations:
  move: "position<2>(0, 10)"
---
<block>

## [primary]直观体验：力的作用[/primary]

<block :padding="{ y: 'md' }">

调整滑块改变施加在物体上的力，观察加速度如何变化。然后点击"开始运动"观看演示！

</block>

<slider model="force" :min="0" :max="10" :step="0.5" unit="N" title="施加的力" />

<block :padding="{ y: 'md' }">

**当前参数：**
- 质量 (m) = {{ mass }} kg
- 施加的力 (F) = {{ force.toFixed(1) }} N
- [highlight-primary]计算出的加速度 (a) = {{ acceleration.toFixed(2) }} m/s²[/highlight-primary]

</block>

<canvas :origin="[5, 10]">

<vector :from="[position, 0]" :to="[position + force * 2, 0]" color="primary" />

</canvas>

<block :padding="{ top: 'xl' }">

<rows :gap="'md'">
<button label="开始运动" @click="isMoving = false; position = 0; setTimeout(() => { isMoving = true; animate('move') }, 50)" />
<button label="重置" @click="isMoving = false; position = 0; force = 5" />
</rows>

</block>

<block :padding="{ y: 'md' }" #if="isMoving">

[info]💨 观察：力越大，方块加速越快！[/info]

</block>

</block>

  `.trim()
}
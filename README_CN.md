<div align="center">
  <h1>ChalkAI</h1>
  <p>AI 驱动的互动课程生成器，为您的创意课堂注入活力。</p>
  
  <div align="center">
    <img src="https://img.shields.io/github/package-json/v/bijonai/ChalkAI" alt="Version" />
    <img src="https://img.shields.io/github/license/bijonai/ChalkAI" alt="License" />
    <img src="https://img.shields.io/github/stars/bijonai/ChalkAI?style=social" alt="Stars" />
    <img src="https://img.shields.io/github/forks/bijonai/ChalkAI?style=social" alt="Forks" />
    <img src="https://img.shields.io/github/last-commit/bijonai/ChalkAI" alt="Last Commit" />
    <img src="https://img.shields.io/github/issues/bijonai/ChalkAI" alt="Issues" />
  </div>

  <div align="center">
    <span>[<a href="./README.md">English</a>]</span>
    <span>[<a href="./README_CN.md">简体中文</a>]</span>
  </div>
</div>

---

随着信息技术普及，电子学习已成为常见的教学方法。人们创建了许多优秀的电子教室（例如 [Mathigon](https://mathigon.org/)、[Phet](https://phet.colorado.edu/zh_CN/)），通过互动帮助学生掌握知识。YouTuber [3Blue1Brown](https://www.youtube.com/@3blue1brown) 创建了自己的数学动画引擎 [Manim](https://manim.community/)。许多优秀的数学科学视频是由 Manim 制作的。

近年来，大型语言模型已成为热门技术。许多项目尝试使用 LLM 生成 manim 代码来创建视频（例如 [Code2Video](https://github.com/showlab/Code2Video?tab=readme-ov-file)、[Generative Manim](https://github.com/marcelo-earth/generative-manim)）。然而，生成的代码往往不可执行，生成的视频也不如手动创建的好。由于 Manim 的最终产品是视频，学生也无法像某些互动电子教室那样与其中的元素互动。

ChalkAI 是一个 AI 驱动的互动教室生成器，通过让 LLM 编写我们自己的 DSL（领域特定语言）——***ChalkDSL***，我们在页面上渲染数学、物理和几何等互动元素。受现代前端框架启发，我们使用 reactivity（*@vue/reactivity*）设计了 ChalkDSL，从而使页面上的所有元素都由响应式数据控制。

## 路线图

请参阅我们的 [0.1.0 里程碑](https://github.com/bijonai/ChalkAI/issues/6) 以获取详细路线图

## 快速开始

### 环境

- Node.js >= 20
- Postgres
- NPM / PNPM / Yarn

### 环境变量

```bash
cp .env.example .env
```

在 `.env` 文件中填写您的配置。

### 初始化

```bash
npm install
npm run db:push # 初始化

npm run knowledge create default
npm run knowledge upload default
```

### 运行

```bash
npm run dev
```

## 核心功能使用的项目

- [xsai](https://github.com/moeru-ai/xsai)：超小型 AI SDK。为 ChalkAI 提供易用的 AI SDK。
- [@vue/reactivity](https://github.com/vuejs/core)：Vue 3 响应式系统。为 ChalkDSL 提供强大的响应式系统。
- [morphdom](https://github.com/patrick-steele-idem/morphdom)：快速且轻量级的 DOM 差异比较和修补库。为 ChalkDSL 提供高效的 DOM 差异比较和修补。
- [D3js](https://github.com/d3/d3)：SVG 驱动的数据可视化库。为 ChalkDSL 提供强大的图形功能。

## 贡献者

![contributors](https://opencollective.com/bijonai/contributors.svg?width=600&button=false)

---
**MIT 许可证**

*Copyright (c) 2025 BijonAI, All rights reserved.*

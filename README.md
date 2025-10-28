<div align="center">
  <h1>ChalkAI</h1>
  <p>AI-powered interactive lesson generator, to make your creative classroom.</p>
  
  <div align="center">
    <img src="https://img.shields.io/github/package-json/v/bijonai/ChalkAI" alt="Version" />
    <img src="https://img.shields.io/github/license/bijonai/ChalkAI" alt="License" />
    <img src="https://img.shields.io/github/stars/bijonai/ChalkAI?style=social" alt="Stars" />
    <img src="https://img.shields.io/github/forks/bijonai/ChalkAI?style=social" alt="Forks" />
    <img src="https://img.shields.io/github/last-commit/bijonai/ChalkAI" alt="Last Commit" />
    <img src="https://img.shields.io/github/issues/bijonai/ChalkAI" alt="Issues" />
  </div>

  <div align="center">
    <span>[<a href="./README.md">English</a>]<span>
    </span>[<a href="./README_CN.md">简体中文</a>]</span>
  </div>
</div>

---

With the popularization of information technology, e-learning has become a common teaching method. People have created many excellent e-classrooms (e.g. [Mathigon](https://mathigon.org/), [Phet](https://phet.colorado.edu/zh_CN/)) to help students master knowledge through interaction. YouTuber [3Blue1Brown](https://www.youtube.com/@3blue1brown) created his own math animation engine, [Manim](https://manim.community/). Many excellent math science videos have been produced by Manim.

In recent years, Large Language Model has become a popular technology. Many projects try to use LLM to generate manim code to create videos (e.g. [Code2Video](https://github.com/showlab/Code2Video?tab=readme-ov-file), [Generative Manim](https://github.com/marcelo-earth/generative-manim)). However, the generated code is often not executable, and the generated videos are not as good as the manually created ones. Since the final product of Manim is a video, students can also not interact with the elements in it like some interactive electronic classrooms.

ChalkAI is a AI-powered interactive classroom generator, by having LLM write our own DSL (Domain Specific Language) -- ***ChalkDSL***, we render interactive elements like math, physics, and geometry on the page. Inspired by modern front-end frameworks, we designed ChalkDSL using reactivity (*@vue/reactivity*), so that all elements on the page are controlled by reactive data.

## Roadmap

Please refer to our [0.1.0 milestone](https://github.com/bijonai/ChalkAI/issues/6) for the detailed roadmap

## Quick Start

### Environment

- Node.js >= 20
- Postgres
- NPM / PNPM / Yarn

### Environment Variables

```bash
cp .env.example .env
```

Fill your config in `.env` file.

### Initialize

```bash
npm install
npm run db:push # Init

npm run knowledge create default
npm run knowledge upload default
```

### Run

```bash
npm run dev
```

## Projects Used on Core Features

- [xsai](https://github.com/moeru-ai/xsai): Extra-small AI SDK. Provide easy-to-use AI SDK for ChalkAI.
- [@vue/reactivity](https://github.com/vuejs/core): Vue 3 reactivity system. Provide powerful reactivity system for ChalkDSL
- [morphdom](https://github.com/patrick-steele-idem/morphdom): Fast and lightweight DOM diffing and patching library. Provide efficient DOM diffing and patching for ChalkDSL.
- [D3js](https://github.com/d3/d3): SVG powered data visualization library. Provide powerful figures for ChalkDSL.

## Contributors

![contributors](https://opencollective.com/bijonai/contributors.svg?width=600&button=false)

---
**MIT License**

*Copyright (c) 2025 BijonAI, All rights reserved.*
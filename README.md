<div align="center">
  <h1>ChalkAI</h1>
  <p>AI-powered interactive lesson generator, to make your creative classroom.</p>
</div>

## Quick Start

### Environment

- Node.js >= 20
- PgVector
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
npm run knowledge:embedding # Embedding knowledges
```

### Run

```bash
npm run dev
```

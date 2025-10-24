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
</div>

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

# Knowledge Management

There is a variable in `.env`:

```env
DEFAULT_KNOWLEDGE=default
```

## Create

```bash
pnpm knowledge create <knowledge-name> <knowledge-description?>
```

## Upload

Script will automatically import all prefab packages and read knowledges you define by `definePrefabKnowledge`.

```bash
pnpm knowledge upload <knowledge-name>
```
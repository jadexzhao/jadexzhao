# Quackr · virtual duck farm

The duck farm is the long-term creative throughline, not a startup pitch. A family restaurant in Greenfield taught the same rule I still use: a system either survives contact with a real customer or it does not. Demo culture rewards the opposite. I want a slower life of gardening, walking, matcha, and film, and a place that has to hold every morning. There is no operating farm, no acreage, no product launch. The React sandbox on jadexzhao is something I test myself.

A mint-green **portfolio sandbox** on the [jadexzhao briefcase](https://jadexzhao.github.io/jadexzhao/). Swipe to waddle, post quacks, pick an obsession, catch breadcrumbs. Not a launched product.

**Live:** [jadexzhao.github.io/jadexzhao/duck-farm/](https://jadexzhao.github.io/jadexzhao/duck-farm/)  
**Repo:** lives inside [jadexzhao/jadexzhao](https://github.com/jadexzhao/jadexzhao) under `duck-farm/`

## Stack

- React + TypeScript + Vite
- Client-only UI (no backend product claims)
- GitHub Actions copies `dist/` into the briefcase Pages deploy at `/jadexzhao/duck-farm/`

## Development

```bash
cd duck-farm
npm install
npm run dev
```

Runs on `http://localhost:5173`. Production `base` is `/jadexzhao/duck-farm/`.

## Build

```bash
npm run build
```

Output goes in `dist/`. Pages deploy is handled by the parent repo workflow.

## What to try

- **Discover** ... swipe right to waddle, left to pass, up for super quack
- **Pond Feed** ... compose a quack, flirt and requack on slides
- **Sidebar** ... catch breadcrumbs mini-game (desktop)

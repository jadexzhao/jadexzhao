# Quackr · virtual duck farm

A mint-green **portfolio sandbox** on the [jadexzhao briefcase](https://jadexzhao.github.io/jadexzhao/). Swipe to waddle, post quacks, pick an obsession, catch breadcrumbs.

Honest framing: this is a React social media site I ship and test myself. It is **not** a launched product.

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

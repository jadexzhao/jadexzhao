# Duck farm · 鸭年

A pond that has to hold every morning. Ducks, water, grass, mud. Jade Zhao's long-term creative throughline on [jadexzhao](https://jadexzhao.github.io/jadexzhao/). Self-tested on this pond. Not a dating product.

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
cd duck-farm
npm run build
```

Output goes in `dist/`. Pages deploy is handled by the parent repo workflow.

## What to try

- **Enter the pond** ... first screen, then the farm
- **Discover** ... swipe right to waddle, left to pass, up for super quack
- **Pond** ... compose a quack, flirt and requack on slides
- **Nest** ... 1st-person gate. Would you keep this profile?
- **Sidebar** ... crumbs on the water (desktop)

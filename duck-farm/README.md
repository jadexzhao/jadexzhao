# virtual duck farm

Interactive React + TypeScript + Vite sandbox on the [jadexzhao](https://jadexzhao.github.io/jadexzhao/) sunrise portfolio. Click the grass to place ducks, click a duck to bounce it, Konami for a stampede.

## development

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173` (Vite). Production base path is `/jadexzhao/duck-farm/`.

## build

```bash
npm run build
```

Output goes in `dist/`. GitHub Actions copies it under the briefcase Pages root.

## what it shows

- Click-to-place ducks on the grass
- `requestAnimationFrame` motion via compositor transforms (no per-frame React re-renders)
- Day/night theme, keyboard-focusable ducks, reduced-motion pause
- Live at [jadexzhao.github.io/jadexzhao/duck-farm/](https://jadexzhao.github.io/jadexzhao/duck-farm/)

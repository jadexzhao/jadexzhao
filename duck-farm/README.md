# virtual duck farm

an interactive React app where you can spawn and watch ducks waddle around. click on the grass to place ducks, click a duck to make it jump. it's the placeholder for the real one.

built to show off: React interactivity, animation, state management, and a little personality.

## development

```bash
npm install
npm run dev
```

runs on `http://localhost:5173`

## deployment

builds to a static site ready for deployment anywhere:

```bash
npm run build
```

output goes in `dist/`.

## what it does

- **click to place**: tap anywhere in the grass to spawn a new duck
- **physics**: ducks waddle around the farm, bounce off walls, and animate smoothly
- **interaction**: click a duck to make it jump and reverse direction
- **controls**: spawn multiple ducks at once, reset the farm, or clear everything

the farm remembers: you're building toward something real. this is the fun version while the actual duck farm compounds.

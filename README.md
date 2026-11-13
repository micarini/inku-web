# INKU インク — Manual de marca (web)

Web de presentación del branding de INKU, omakase de autor. Scroll vertical con el sistema de marca y un juego interactivo, «Tu omakase».

```bash
npm install
npm run dev     # local
npm run build   # genera dist/
```

- Textos de cada sección: al principio de cada archivo en `src/sections/`.
- Créditos del cierre: `src/config.js`.
- Textos y piezas del juego: `src/omakase/data.js`.
- `?reduced` en la URL desactiva las animaciones.

Deploy: Vercel (preset Vite, salida `dist`). Cada push a `main` publica la versión nueva.

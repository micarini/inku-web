# Créditos — fotos del juego "Tu omakase"

Las 20 fotos de esta carpeta se **generaron con Figma AI** (`generate_image`, modelo `gemini-3.1-flash-image`)
dentro del archivo de Figma INKU, página **"web · assets omakase"**, con los prompts del Apéndice A del
prompt maestro (bloque de estilo común: cenital, luz cálida lateral, fondo negro puro).

- `nigiri-sake` se generó dos veces (la primera salió sobre un plato).
- Los originales en PNG están en `assets-src/omakase/`; los `.webp` de acá se generan con
  `node scripts/cutout.mjs` (recorte con alfa suave sobre el fondo negro).
- Para cambiar una foto: reemplazá el PNG en `assets-src/omakase/` con el mismo nombre y corré el script.

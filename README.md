# Colorê

Site institucional da Colorê, exposição educativa e itinerante sobre cores e percepção (crianças de 4 a 8 anos).
Astro + TypeScript, CSS puro, hospedado na Netlify. Regras do projeto: [AGENTS.md](AGENTS.md).

## Rodar

```
npm install
npm run dev      # http://localhost:4321
npm run check    # tipos
npm run build    # gera dist/
```

Requer Node 22+.

## Fonte Codec Pro

Não está no repositório (licença). Só publicar em `public/fonts/` se houver licença web.

## Fluxo

`main` sempre publicável (deploy automático na Netlify). Trabalho em branches `feat/…`, `fix/…`, `content/…` com PR.

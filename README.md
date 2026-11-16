# Colorê

Site institucional da Colorê, exposição educativa e itinerante sobre cores e percepção (crianças de 4 a 8 anos).
HTML e CSS puros. Regras do projeto: [AGENTS.md](AGENTS.md).

Online: https://projeto-colore.pages.dev/

## Ver no computador

Os links começam com `/colore/`, então abra por um servidor local na pasta **acima**:

```
cd ..
npx serve
```
e acesse http://localhost:3000/colore/ (a pasta precisa se chamar `colore`).

## Publicar

`git push` na `main`. O Cloudflare Pages publica sozinho (projeto `projeto-colore`, sem build, pasta raiz).

## Fonte Codec

Usamos a família Codec Cold completa (8 pesos, com itálicos, versão trial), em `fonts/` por ser um projeto de estudo. O crédito à Codec Family (Zetafonts) fica no rodapé de cada página.

## Documentação

- [docs/conceito-colore.md](docs/conceito-colore.md): conceito, propósito, público, tom e estrutura do site. Leitura obrigatória.

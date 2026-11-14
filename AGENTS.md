# Colorê — instruções para agentes

## Projeto

Site institucional da Colorê, exposição educativa e itinerante sobre cores e percepção (crianças de 4 a 8 anos).
Objetivo: apresentar a exposição e captar instituições (escolas, museus, centros culturais) interessadas em recebê-la.
Não é loja. Conteúdo da exposição (percurso, estações, atividades) ainda está em definição: use placeholders marcados com `TODO(conteudo):`.

## Stack

HTML e CSS puros, sem framework, sem build, sem dependências. Hospedado no GitHub Pages (https://lmspassos.github.io/colore/), publicado da branch `main`, pasta raiz.
Tudo foi gerado a partir de um projeto Astro antigo (está no histórico do git, antes do commit "Troca Astro por HTML e CSS puros").
Fontes: Fredoka em `_astro/*.woff2` (já referenciada no CSS de cada página). Codec Pro só entra com licença web.
Formulário: **simulado** (GET para `obrigado/`, não envia nada). Para funcionar de verdade, usar Formspree ou similar.

## Estrutura

```
/
├─ index.html · 404.html · favicon.svg · .nojekyll
├─ a-exposicao/ · para-instituicoes/ · para-educadores/ · sobre/ · contato/ · privacidade/ · obrigado/   (cada um com index.html)
├─ _astro/                   # fontes Fredoka
├─ docs/marca/               # identidade visual (referência)
└─ AGENTS.md · CLAUDE.md · README.md
```

## Convenções

- Todos os links e recursos usam o prefixo `/colore/` (o site mora em `/colore/` no GitHub Pages). Se mudar para domínio próprio, trocar `/colore/` por `/` em todos os `.html`.
- O CSS está dentro de `<style>` em cada página (herança do build). Cabeçalho e rodapé se repetem: ao mudar um, mude em todas as páginas.
- Textos visíveis em português; URLs em português, kebab-case, sem acento.
- Mobile-first. Breakpoints: `48rem` e `64rem`. Unidades relativas.
- Galeria só é exibida quando houver fotos reais com direito de uso. Conteúdo ainda em definição: use `TODO(conteudo):`.
- Git: `main` publicada; trabalho em branches `feat/…`, `fix/…`, `content/…`; commits no imperativo, em português.

## Identidade visual (tokens)

Grafite `#2B2B29` · Creme `#FEF8E6` · Laranja `#F26E36` · Amarelo `#F1D51C` · Azul `#93BEE6` · Verde `#1EB46F` · Rosa `#ECA5A6`.
Fredoka para títulos, Codec Pro para texto. Grafismo: círculos chapados sobrepostos.

## Acessibilidade (inegociável — o projeto nasce do daltonismo)

- Meta WCAG 2.2 AA.
- Texto corrido sempre grafite sobre fundo claro/colorido, ou creme sobre grafite. Creme sobre as cores da paleta e amarelo sobre verde **só** em logo, decoração ou títulos muito grandes.
- Cor nunca é o único portador de informação (pilares, estados, links têm também forma, ícone ou texto).
- Foco visível, skip link, `alt` em toda imagem, formulário com `<label>` e mensagens de erro em texto.
- Respeitar `prefers-reduced-motion`.

## Regra obrigatória: Ponytail

Todo agente que trabalhar neste projeto DEVE seguir o Ponytail abaixo, sem exceção.
Fonte: https://github.com/DietrichGebert/ponytail (AGENTS.md, copiado em 2026-11-13).
Para atualizar, substitua a seção abaixo pela versão mais recente do repositório oficial.

<!-- ponytail:start -->
# Ponytail, lazy senior dev mode

You are a lazy senior developer. The best code is the code never written. You solve the whole problem with the least new code. End your reply with one or two lines: what you skipped or did not check, and any risk the user must know.

## Before you write

Read the task and the code it touches. List every place your change must reach: callers, tests, fixtures, config, exports. Check what your change could break for users: data it would destroy or expose, callers that stop working. That is scope. Extra features are not.

## The smallest complete change

Take the first option that fully works:

1. Does it need to exist? Skip features, options and flexibility nobody asked for, and name them in one line. A vague request ("build me X") gets the smallest version that does the core job.
2. Already in this codebase (a helper, component, service, pattern)? Use it the way the surrounding code does.
3. Standard library or a platform feature? Use it, unless the project has its own. A house component beats a native widget.
4. An installed dependency? Use it. Never add a dependency for a few lines.
5. Can it be one line a reader gets at a glance? One line.
6. Otherwise: the minimum code that works.

- Be lazy about the solution, never about the change itself: finish every part the task needs, including the callers, tests and fixtures your change breaks.
- No abstraction, wrapper, type conversion, option, config, boilerplate or "for later" code nobody asked for. Keep values in the form the platform already gives you. Deletion beats addition. Keep the structure the codebase already has: its layers, interfaces and conventions.
- The shortest working diff wins, once you know everything it must touch. A one-liner that needs decoding is not short.
- Comment only the why the code cannot show, in one line.
- Bug fix: before you edit, grep every caller of the function you touch, then fix the root cause once in the shared code.
- Code you move or merge keeps its error handling and validation.
- Between options of equal size, take the one that is correct on edge cases.
- Lazy code without its check is unfinished: new non-trivial logic (a branch, a loop, a parser, money or security, or a whole new script or app) leaves one small test or an assert-based self-check. Trivial changes need none.
- A shortcut with a known limit gets a code comment in this form: `shortcut: <the limit>, <when to upgrade>`.

Never cut: validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs, anything the user asked for.
<!-- ponytail:end -->

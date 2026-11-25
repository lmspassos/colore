# Colorê — instruções para agentes

## Projeto

Site institucional da Colorê, exposição educativa e itinerante sobre cores e percepção (crianças de 4 a 8 anos).
Objetivo: apresentar a exposição e captar instituições (escolas, museus, centros culturais) interessadas em recebê-la.
Não é loja. Conteúdo da exposição (percurso, estações, atividades) ainda está em definição: use placeholders marcados com `TODO(conteudo):`.

**Leia [docs/base-do-projeto.md](docs/base-do-projeto.md) (fonte de verdade: pesquisa, marca, identidade visual, estações do percurso e o que ainda não está definido, extraído do Relatório de Desenvolvimento) e [docs/conceito-colore.md](docs/conceito-colore.md) antes de escrever textos, escolher imagens ou decidir estrutura.** É a referência de conceito, propósito, público, tom da marca e estrutura do site. Regra central: a Colorê **não** é uma exposição sobre daltonismo (ele é só o ponto de partida), não é contemplativa e não é brinquedoteca nem oficina de pintura. Não trate como definido o que os documentos marcam como "em desenvolvimento", "a definir" ou pendente. Em conflito de identidade visual, vale o relatório (base-do-projeto.md §4), não o que o site já tem.

## Stack

HTML, CSS e JavaScript puros, sem framework, sem build, sem dependências. Hospedado no Cloudflare Pages (https://projeto-colore.pages.dev/), publicado da branch `main`, pasta raiz, sem build.
Veio de um projeto Astro antigo (histórico do git, antes do commit "Troca Astro por HTML e CSS puros"). O visual atual segue a proposta visual (`referencias/`): círculos chapados, formas de godê, Fredoka + Codec, animações em CSS ligadas à rolagem.
Fontes: Fredoka em `_astro/*.woff2` (declarada em `css/base.css`). Codec Family (Zetafonts) em `fonts/Codec-Cold-*-trial.ttf` (família Codec Cold completa, 8 pesos com itálicos), versionada por ser projeto de estudo; o crédito fica no rodapé de cada página.
Formulário: **simulado** (GET para `obrigado/`, não envia nada). Para funcionar de verdade, usar Formspree ou similar.
Busca: Pagefind (índice estático em `pagefind/`). Depois de mudar texto, regerar com `npx pagefind --site . --glob "{index.html,*/index.html}"` (só as páginas com `data-pagefind-body` entram no índice).

## Estrutura

```
/
├─ index.html · 404.html · favicon.svg · .nojekyll
├─ a-exposicao/ · para-instituicoes/ · para-educadores/ · sobre/ (só redireciona para a-exposicao) · contato/ · privacidade/ · obrigado/   (cada um com index.html)
├─ css/                      # base.css (tokens, cabeçalho, rodapé, FAQ, formulários, temas de daltonismo) + um CSS por página (inicio, a-exposicao, para-instituicoes, para-educadores, contato)
├─ js/                       # base.js (cabeçalho, menu, busca, acessibilidade) · orb.js (heróis) · galeria.js (faixa + foto ampliada) · form.js (validação)· inicio.js · rastro.js (rastro de círculos do mouse no herói da Início) · bolinhas.js (bolinhas com gravidade do fechamento) · a-exposicao.js · para-educadores.js · busca.js
├─ material/                 # PDF para download (catálogo; só em Para instituições)
├─ img/ · fonts/ · pagefind/ # fotos (webp/jpg), fontes Codec, índice da busca
├─ _astro/                   # fontes Fredoka, logos, imagem do herói
├─ docs/marca/               # identidade visual (referência)
├─ referencias/              # proposta visual do site (arquivo de design, só referência; não publicar)
└─ AGENTS.md · CLAUDE.md · README.md
```

## Convenções

- Todos os links e recursos começam com `/` (o site mora na raiz do domínio). Não use o prefixo `/colore/`: ele só existia quando o site ficava em lmspassos.github.io/colore/.
- Cada página carrega `/css/base.css` + o CSS da própria página e os scripts de `/js/` com `defer`. Cada script é uma IIFE (não declare `const` global). Cabeçalho e rodapé se repetem em todas as páginas: ao mudar um, mude em todas.
- Cores **só por token** (`var(--orange)`…), nunca hex solto, e pelas classes `c-or/ye/bl/pk/gr/cr/ink` (define `--c`) e `bg-orange/yellow/…` (fundo): o menu de acessibilidade troca os tokens para os modos de daltonismo (`data-tema`). Ao criar um componente com fundo colorido, confira os quatro modos (regras em `css/base.css`).
- Conteúdo interativo precisa funcionar sem JS: o HTML já traz todo o texto e o JS só esconde/mostra (classe `js` no `<html>`). Respeite `prefers-reduced-motion`.
- Animações ligadas à rolagem usam as propriedades `translate`/`rotate` (não `transform`), para não brigar com os `:hover`.
- Textos visíveis em português; URLs em português, kebab-case, sem acento.
- Layout: `.site` é um *container* e os breakpoints são `@container site (max-width: …rem)` (valores da proposta, validados em 1440, 820 e 390 px); só o cabeçalho usa `@media` (`67.5rem` e `47.99rem`). Unidades relativas (rem, cqi), exceto bordas de até 3px.
- Galeria só é exibida quando houver fotos reais com direito de uso. Conteúdo ainda em definição: use `TODO(conteudo):`.
- Git: `main` publicada; trabalho em branches `feat/…`, `fix/…`, `content/…`; commits no imperativo, em português.

## Identidade visual (tokens)

Grafite `#2B2B29` · Creme `#FEF8E6` · Laranja `#F26E36` · Amarelo `#F1D51C` · Azul `#93BEE6` · Verde `#1EB46F` · Rosa `#ECA5A6`.
Fredoka para títulos, Codec para texto. Grafismo: círculos chapados sobrepostos, bordas recortadas por círculos (`.sc`), formas de godê/arco.

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

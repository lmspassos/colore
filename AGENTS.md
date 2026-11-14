# Colorê — instruções para agentes

## Projeto

Site institucional da Colorê, exposição educativa e itinerante sobre cores e percepção (crianças de 4 a 8 anos).
Objetivo: apresentar a exposição e captar instituições (escolas, museus, centros culturais) interessadas em recebê-la.
Não é loja. Conteúdo da exposição (percurso, estações, atividades) ainda está em definição: use placeholders marcados com `TODO(conteudo):`.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Astro + TypeScript | Site de conteúdo, HTML estático, zero JS por padrão, ótimo SEO |
| Estilo | CSS puro com variáveis (tokens) + `<style>` com escopo nos componentes | A identidade já define tokens; sem Tailwind/UI kit |
| Conteúdo | Astro Content Collections (Markdown/YAML validados com schema) | FAQ e materiais editáveis sem mexer em código; abre caminho p/ CMS git-based depois |
| Fontes | Fredoka (via @fontsource) + Codec Pro self-hosted em `public/fonts/` **só com licença web** | Sem dependência de CDN externo |
| Imagens | `astro:assets` (`<Image>`) | Otimização e dimensões automáticas |
| Formulário | Netlify Forms (honeypot + consentimento LGPD), redireciona p/ `/obrigado` | Funciona sem backend e sem JS |
| Hospedagem | Netlify, deploy automático da branch `main`, preview por PR | |
| Qualidade | `astro check` + `astro build` no CI; Prettier (+ plugin astro) | |

Não adicionar dependência sem necessidade real (regra Ponytail). JS no cliente só como ilha (`client:*`) quando não houver alternativa em HTML/CSS.

## Estrutura de pastas

```
/
├─ AGENTS.md · CLAUDE.md · README.md
├─ astro.config.mjs · tsconfig.json · package.json · netlify.toml
├─ public/
│  ├─ favicon.svg
│  ├─ fonts/                 # Codec Pro (se licenciada)
│  └─ downloads/             # apresentacao-colore.pdf, materiais/*.pdf
├─ docs/
│  └─ marca/                 # PDF da identidade visual e fontes originais (não vão para o build)
└─ src/
   ├─ assets/                # logo.svg, imagens processadas pelo astro:assets
   ├─ components/            # PascalCase.astro, um componente por arquivo
   ├─ content/
   │  ├─ faq/                # um .md por pergunta
   │  └─ materiais/          # um .md por material pedagógico (aponta p/ public/downloads)
   ├─ content.config.ts      # schemas das collections
   ├─ layouts/
   │  └─ BaseLayout.astro    # <head>, SEO, Header, Footer, skip link
   ├─ pages/
   │  ├─ index.astro                 # Início
   │  ├─ a-exposicao.astro
   │  ├─ para-instituicoes.astro     # formulário de interesse
   │  ├─ para-educadores.astro       # materiais pedagógicos (lista pública)
   │  ├─ sobre.astro
   │  ├─ contato.astro
   │  ├─ privacidade.astro           # obrigatório (LGPD, formulário)
   │  ├─ obrigado.astro
   │  └─ 404.astro
   └─ styles/
      ├─ tokens.css          # cores, fontes, espaçamentos, raios
      └─ global.css          # reset mínimo, tipografia base, utilitários de acessibilidade
```

## Convenções

- URLs, slugs e arquivos de conteúdo em português, kebab-case, sem acento (`para-instituicoes`).
- Código (variáveis, props, componentes) em inglês; textos visíveis em português.
- Mobile-first. Breakpoints: `48rem` e `64rem`. Unidades relativas.
- Texto do site vive nas páginas `.astro`; o que se repete ou será editado por não-devs vai para `src/content/`.
- Um único formulário (campo "tipo de contato"), reutilizado em Para instituições e Contato.
- Galeria só é exibida quando houver fotos reais com direito de uso.
- Git: `main` sempre publicável; trabalho em branches `feat/…`, `fix/…`, `content/…`; mensagens de commit no imperativo, em português.

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

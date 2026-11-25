# Colorê — base do projeto

> **Descobrir é colorir.**
>
> Fonte de verdade do projeto. **Consultar antes de qualquer texto, imagem, cor, layout ou decisão de estrutura.** Se algo no site contradiz este arquivo, o site está errado (ou este arquivo precisa ser atualizado, com o motivo registrado).

**Origem:** *Relatório de Desenvolvimento — Colorê*, Projeto de Design VII, 2026, de Eliandra Chimilouski (orientação: Carlos Roberto Romaniello, Gabriela Unger Unruh e Luciane Hilu). O PDF fica em `referencias/` (fora do git, 68 MB, não publicar). Esta base resume o relatório; em dúvida, o relatório vale.
**Documentos irmãos:** [conceito-colore.md](conceito-colore.md) (conceito, público, tom, estrutura do site) e [AGENTS.md](../AGENTS.md) (stack e regras de código). Este arquivo cobre pesquisa, identidade e exposição.

## 1. O que é

Exposição **educativa, artística, interativa e itinerante** para crianças de **4 a 8 anos** (pré-escola e anos iniciais), para **escolas e espaços culturais**. Cada ambiente tem mediador. O site é institucional, serve para apresentar a exposição e captar instituições. Não é loja.

**Não é:** exposição sobre daltonismo (é o ponto de partida), exposição contemplativa, brinquedoteca nem oficina de pintura convencional.

## 2. De onde vem (pesquisa)

- Daltonismo: ~350 milhões de pessoas; 1 em 12 homens e 1 em 200 mulheres. 50% dos alunos daltônicos dizem ter menos interesse em pintura, desenho e museus de arte; 50% só descobriram na 7ª série (EnChroma).
- Suero et al. (2005), 1.039 crianças pré-escolares: quem tem deficiência de visão de cores vai pior só nas tarefas que dependem da cor, não na aprendizagem em geral. A dificuldade surge quando o ensino parte de uma percepção "padrão".
- Linha de raciocínio: **ver é receber informação; perceber é dar significado**. Cultura, linguagem, experiência, conhecimento e contexto moldam o que percebemos. Aprendemos que "céu = azul, grama = verde" e isso vira regra de representação. A arte desfaz a regra: o céu pode ser vermelho, a árvore pode não ser verde.
- **Pergunta projetual:** como criar experiências de aprendizagem que permitam às crianças explorar diferentes formas de perceber e representar o mundo, valorizando as próprias percepções e as dos colegas, para estimular a prática e o envolvimento com a arte?
- Benchmarking: ColorADD (escolas e materiais), EducaThyssen, MAM Educativo, MoMA, Color Factory, Crayola Experience. Oportunidade: unir identificação sem depender do nome da cor, mediação, investigação e criação, sem "resposta correta".
- DNA: curiosa, lúdica, investigativa, exploratória, expressiva, participativa, prática, inclusiva, colaborativa, acolhedora, acessível, significativa, envolvente.

## 3. Marca

- **Propósito:** despertar a curiosidade das crianças para o universo das cores, incentivando a descoberta, a experimentação e a valorização das diferentes formas de perceber, interpretar e expressar o mundo.
- **Posicionamento:** "A Colorê é uma exposição educativa e interativa que transforma o universo das cores em um campo de descobertas, incentivando as crianças a experimentar, criar e descobrir novas formas de enxergar o mundo."
- **Promessa:** transformar a descoberta das cores em uma experiência divertida, interativa e cheia de possibilidades, na qual cada criança possa explorar, experimentar e criar à sua própria maneira.
- **Manifesto (ideias-chave):** cada olhar é único; as cores estão também nas experiências que vivemos; curiosidade como ponto de partida, brincar como caminho, criatividade como liberdade, sem medo de errar; "o mundo não precisa ser visto por um único olhar, ele pode ser descoberto de infinitas maneiras".
- **Naming:** vem de *colorir* e da cantiga "Uni Duni Tê" ("o sorvete colorê"): musical, espontâneo, de brincadeira.
- **Slogan:** "Descobrir é colorir."
- **Tom:** lúdico, educativo, inclusivo, experimental, acolhedor, expressivo. Credível para pais e educadores, sem infantilizar.

## 4. Identidade visual (a correta é a do relatório)

- **Cores:** Grafite `#2B2B29` · Creme `#FEF8E6` · Laranja `#F26E36` · Amarelo `#F1D51C` · Azul `#93BEE6` · Rosa `#ECA5A6` · Verde `#1EB46F`. Uso intencional, não decorativo.
- **Tipografia:** **Fredoka** (títulos) e **Codec Cold** (texto). Nada de outras famílias.
- **Logo:** "colorê" com o **acento circunflexo inspirado no símbolo do ColorADD** (triângulo), que liga a marca à inclusão e à percepção. Não redesenhar nem substituir o acento.
- **Grafismo:** inspirado nas **paletas de pintura (godê)**. Duas linguagens: **composições circulares** (círculos chapados, cada cor em seu espaço) e **composições orgânicas** (formas livres, fluidas, como mistura de tinta). Movimento, leveza e versatilidade.
- **Linguagem espacial da exposição:** formas orgânicas, curvas e círculos; portais e painéis em arco; superfícies translúcidas para luz, cor e sobreposição.
- **O que as páginas do relatório mostram (vistas como imagem, 2026-11-24):** o logo é "colorê" em minúsculas, letras gordas e arredondadas, circunflexo em forma de triângulo de cantos suaves; versões creme sobre grafite e grafite sobre creme. A composição circular é de **círculos grandes, chapados, sobrepostos e sangrando para fora do quadro**, sem contorno e sem sombra, nas cores da paleta. Elementos de apoio são cartões de cantos arredondados, também chapados. A referência de godê é uma paleta de pintura real (fotografia). O relatório **não usa contornos grafite grossos nem sombras duras**; esse acabamento do site (borda de 2–3px e sombra deslocada) é invenção do site e deve ser revisto.
- **Decisões de unificação (2026-11-24):** (1) títulos em **maiúsculas e minúsculas** (Fredoka), sem CAIXA ALTA; (2) acabamento **chapado**: círculos, fotos e cartões sem contorno grafite e sem sombra dura; contorno só em campos de formulário, botões, FAQ, foco e tracejados funcionais (camada `css/unifica.css`, carregada por último nas cinco páginas principais); (3) **rostinhos** nos círculos fazem parte da marca (Início, A exposição 2, Contato 2 e sol do teatro), definidos uma vez em `base.css` (`.face`); (4) contorno em texto só onde é legibilidade (palavras coloridas do título da Início).
- **Coerência entre telas:** todas as páginas falam a mesma língua visual (círculos chapados, godê, Fredoka + Codec, paleta fechada). Páginas novas reutilizam os componentes existentes antes de inventar outros.

## 5. A exposição

**Conceito:** um espaço para descobrir, experimentar e criar. Percurso imersivo e interativo, sempre pelo brincar. **Modular, desmontável e adaptável** a diferentes espaços, preservando proposta educativa e identidade.

**Percurso** (chegada e acolhimento com o mediador → estações → saída):

| # | Estação | Foco | Pontos de interação |
|---|---|---|---|
| 01 | **Descobrir** | Reconhecimento e exploração das cores | A cor atravessa (transparências, filtros) · A cor se transforma com a luz (luz, sombras, projeções) · A cor também é matéria (superfícies, texturas) · A cor está em todo lugar (observação, comparação) |
| 02 | **Transformar** | Misturas e combinações | Cores que se misturam · Mil tons de uma cor · Encontros de cores (sobreposições) · Uma cor, muitas combinações (paletas, contrastes) |
| 03 | **Perceber** | Percepção visual e contexto | Uma cor, diferentes olhares (influência do entorno) · A luz muda tudo · Cores em contraste · Nem todo mundo vê igual (diferentes formas de perceber) |
| 04 | **Representar** | Expressão e representação visual | Cores que podemos sentir (texturas, representações táteis) · Cores em formas (linhas, padrões) · Cores que se comunicam (símbolos, códigos) · Meu jeito de representar (interpretações individuais) |
| 05 | **Criar com as cores** | Oficina final de criação livre | Exploração de materiais, cores e texturas para uma produção própria |

## 6. O que ainda NÃO está definido (não afirmar no site)

O relatório marca como hipótese de projeto (HP), pendente ou não validado: **planta e dimensões** (a planta de 180 m², com 27 m² por estação, é preliminar e "não utilizar para execução"), **capacidade** (15 crianças + 1 mediador é grupo de referência, sem lotação certificada), **acessibilidade e rotas**, **infraestrutura elétrica**, **peso, embalagem e transporte**, **materiais e fixações** (propostas conceituais), **duração do percurso**. Só a Estação 1 tem detalhamento técnico; as demais têm apenas ambientação. Nos textos públicos, dizer "modular e adaptável ao espaço" e marcar o resto com `TODO(conteudo):`.

## 7. Como usar esta base

1. Texto novo? Confira tom (§3), conceito (§1) e o que não está definido (§6).
2. Imagem, cor ou fonte? Confira §4. Cor só por token; acessibilidade é regra, não enfeite (ver AGENTS.md).
3. Página nova ou refeita? Mesma linguagem das demais (§4, coerência). Não criar uma identidade paralela por página.
4. Mudou algo aqui? Registre a data e o motivo abaixo.

**Histórico:** 2026-11-24, criada a partir do Relatório de Desenvolvimento (texto; as imagens do PDF não foram revisadas).

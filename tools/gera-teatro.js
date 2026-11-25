// Gera o teatro (a roda de cinco cenários) no topo de cada página: node tools/gera-teatro.js
// O site não tem build: este script só reescreve, em cada página, a <section class="roda"> a partir das peças em tools/teatro/.
// Todas as páginas recebem a roda inteira, parada no cenário da própria página; js/roda.js gira entre elas.
// As contas de repouso (céu, chão, sol, ângulos) são as mesmas de js/roda.js: se mudar uma, mude a outra.
const fs = require("fs"), path = require("path");
const R = path.join(__dirname, "..") + path.sep, P = (n) => fs.readFileSync(R + "tools/teatro/" + n, "utf8");

const PASSO = 72, N = 5;
const PAGINAS = [
  { url: "/", pagina: "index.html", nome: "Início" },
  { url: "/a-exposicao/", pagina: "a-exposicao/index.html", nome: "A exposição", tag: "estações · mediação · criação" },
  { url: "/para-instituicoes/", pagina: "para-instituicoes/index.html", nome: "Para instituições", tag: "escolas · museus · centros culturais" },
  { url: "/para-educadores/", pagina: "para-educadores/index.html", nome: "Para educadores", tag: "professores · mediadores · equipes" },
  { url: "/contato/", pagina: "contato/index.html", nome: "Contato", tag: "fale com a gente" },
];
const CEU = ["var(--blue)", "var(--pink)", "var(--blue)", "var(--pink)", "var(--green)"];
const SOLO = [null, "color-mix(in srgb, var(--blue) 45%, var(--cream))", "color-mix(in srgb, var(--green) 55%, var(--cream))", "color-mix(in srgb, var(--blue) 55%, var(--cream))", "color-mix(in srgb, var(--pink) 55%, var(--cream))"];
// sol: x e y em % do palco, opacidade. Nasce à esquerda em "A exposição" (u=1), sobe, cruza o céu e se põe à direita em "Contato" (u=4)
const SOL = [[15, 74, 0], [19, 52, 1], [36, 24, 1], [62, 30, 1], [80, 54, 1], [85, 74, 0]];
const lerp = (a, b, f) => a + (b - a) * f;
const sol = (u) => { const i = Math.min(4, Math.floor(u)), f = u - i; return SOL[i].map((v, k) => lerp(v, SOL[i + 1][k], f)); };

const seta = (cl, p, g) => `<a class="roda-seta ${cl}" href="${p.url}" data-giro="${g}" aria-label="Ir para ${p.nome}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${cl === "ant" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}"></path></svg></a>`;
const boca = `<div class="boca" aria-hidden="true"><div class="bambo"></div><div class="cort esq"><i></i></div><div class="cort dir"><i></i></div><div class="piso"></div></div>`;
const nx = (x0, a) => ((((x0 + 20 + (a / 360) * 140) % 140) + 140) % 140) - 20; // igual a js/roda.js
const nuvem = (x, y, w, a) => `<span class="nv" data-x="${x}" style="--x:${nx(x, a).toFixed(2)}%;--y:${y}%;--w:${w}%"></span>`;
const cenas = [`<div class="teatro-logo">${P("logo.html")}</div>`, P("cena-1-exposicao.html"), P("cena-2-instituicoes.html"), P("cena-3-educadores.html"), P("cena-4-contato.html")];

function teatro(k) {
  const A = -k * PASSO, p = PAGINAS[k]; // a roda gira em sentido anti-horário: avançar = ângulo diminui
  const fatias = cenas.map((c, i) => {
    const rel = i === k ? 0 : ((((i * PASSO + A) % 360) + 540) % 360) - 180;
    const o = Math.max(0, 1 - Math.abs(rel) / PASSO);
    return `<div class="fatia" data-i="${i}" style="rotate:${rel}deg;visibility:${o ? "visible" : "hidden"}"><div class="cena" style="opacity:${o}"><div class="palco">${c}</div></div></div>`;
  }).join("");
  const cards = PAGINAS.slice(1).map((q, j) => {
    const i = j + 1, ativa = i === k;
    const crumb = ativa ? `<a href="/">Início</a>` : `<span>Início</span>`;
    return `<div class="roda-card" data-i="${i}"${ativa ? "" : ' aria-hidden="true" data-pagefind-ignore'} style="scale:${ativa ? 1 : 0} 1;visibility:${ativa ? "visible" : "hidden"}">
            <p class="crumb">${crumb}<span aria-hidden="true">·</span><span>${q.nome}</span></p>
            ${ativa ? `<h1 id="h-roda">${q.nome}</h1>` : `<p class="titulo">${q.nome}</p>`}
            <p class="tag">${q.tag}</p>
          </div>`;
  }).join("\n          ");
  const [sx, sy, so] = sol(k);
  const soloOp = k === 0 ? 0 : 1, soloCor = SOLO[k === 0 ? 1 : k];
  const ant = PAGINAS[(k + N - 1) % N], prox = PAGINAS[(k + 1) % N];
  return `<section class="roda" data-pagina="${k}"${k ? ' aria-labelledby="h-roda"' : ' aria-label="Colorê"'} style="--ceu:${CEU[k]}">
          <div class="roda-ar" aria-hidden="true">${nuvem(12, 24, 12, A)}${nuvem(46, 12, 10, A)}${nuvem(76, 34, 13, A)}</div>
          <div class="sol" aria-hidden="true" style="--x:${sx}%;--y:${sy}%;opacity:${so}"><span class="raios"></span><span class="s"><b class="face"></b></span></div>
          <div class="roda-w" aria-hidden="true"><div class="planeta" style="rotate:${A}deg"><div class="terra" style="--base:${soloCor};opacity:${soloOp}"></div><div class="terra marcos" style="opacity:${soloOp}">${P("marcos.html")}</div></div>${fatias}</div>
          ${boca}
          ${cards}
          ${seta("ant", ant, -1)}
          ${seta("prox", prox, 1)}
        </section>`;
}

PAGINAS.forEach((p, k) => {
  const f = R + p.pagina; let s = fs.readFileSync(f, "utf8");
  const i = s.indexOf('<section class="roda"'); if (i < 0) throw new Error("sem teatro em " + p.pagina);
  const j = s.indexOf("</section>", i) + "</section>".length;
  s = s.slice(0, i) + teatro(k) + s.slice(j);
  s = s.replace(/\s*<script src="\/js\/giro\.js" defer><\/script>/g, "");
  if (!s.includes('/js/roda.js')) s = s.replace(/(\s*)<script src="\/js\/base\.js" defer><\/script>/, '$1<script src="/js/base.js" defer></script>$1<script src="/js/roda.js" defer></script>');
  if (!s.includes('/css/roda.css')) s = s.replace('<link rel="stylesheet" href="/css/unifica.css" />', '<link rel="stylesheet" href="/css/roda.css" />\n    <link rel="stylesheet" href="/css/unifica.css" />');
  fs.writeFileSync(f, s);
  console.log(p.pagina, (teatro(k).length / 1024).toFixed(0) + " KB");
});

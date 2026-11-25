// A exposição: olhos que seguem o cursor, roda dos quatro pilares e mapa do percurso.
// Sem JS os pilares e as estações aparecem em lista (o HTML já traz todo o texto).
(() => {
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Olhos: a íris acompanha o cursor dentro do bloco "Origem"
  const origem = document.querySelector("[data-olhos]");
  if (origem && !reduz) {
    let raf = 0;
    origem.addEventListener("mousemove", (e) => {
      const r = origem.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .72) * 2));
      const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .45) * 2));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { origem.style.setProperty("--ex", x.toFixed(2)); origem.style.setProperty("--ey", y.toFixed(2)); });
    });
  }

  // Seleção em grupo: um botão ativo, o painel correspondente visível, os demais escondidos
  const grupo = (raiz, botoes, paineis, extra) => {
    const vai = (n) => {
      botoes.forEach((b, k) => { b.setAttribute("aria-pressed", k === n); b.classList.toggle("on", k === n); });
      paineis.forEach((p, k) => p.classList.toggle("on", k === n));
      if (extra) extra(n);
    };
    botoes.forEach((b, k) => { b.addEventListener("click", () => vai(k)); });
    return vai;
  };

  const roda = document.querySelector("[data-pilares]");
  if (roda) {
    const bs = [...roda.querySelectorAll(".wq")], ps = [...roda.querySelectorAll(".pil-d")], tri = roda.querySelector(".wc svg");
    const vai = grupo(roda, bs, ps, (n) => { if (tri) tri.style.transform = `rotate(${n * 90}deg)`; ps.forEach((p, k) => p.querySelectorAll(".pil-n i").forEach((d, j) => d.classList.toggle("on", j === n))); });
    bs.forEach((b, k) => b.addEventListener("mouseenter", () => vai(k))); // passar o cursor também escolhe
    vai(0);
  }

  const mapa = document.querySelector("[data-percurso]");
  if (mapa) {
    const ns = [...mapa.querySelectorAll(".node")], ps = [...mapa.querySelectorAll(".panel-item")], painel = mapa.querySelector(".panel");
    const vai = grupo(mapa, ns, ps, (n) => { ns.forEach((x, k) => { x.style.zIndex = k === n ? 3 : 2; }); painel.style.setProperty("--c", getComputedStyle(ps[n]).getPropertyValue("--c")); });
    vai(0);
  }
})();
// A exposição: separa os títulos em letras; cada uma entra de uma posição/ângulo diferente ao rolar (CSS, ver a-exposicao.css).
// Sem JS ou com movimento reduzido o título fica inteiro e parado.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !CSS.supports("animation-timeline: view()")) return;
  let n = 7, idx = 0, big = false, shift = 0;
  const rnd = () => (n = (n * 16807) % 2147483647) / 2147483647 - .5; // fixo: mesma bagunça a cada visita
  // Leitor de tela lê o texto inteiro (cópia oculta); as letras soltas ficam só para o olho.
  const sr = (h) => { const t = h.textContent.trim(), c = document.createElement("span"); c.className = "sr-only"; c.textContent = t; return c; };
  const quebra = (no) => {
    for (const f of [...no.childNodes]) {
      if (f.nodeType === 1) { quebra(f); continue; }
      if (f.nodeType !== 3 || !f.textContent.trim()) continue;
      const frag = document.createDocumentFragment();
      f.textContent.split(/(\s+)/).forEach((w) => {
        if (/^\s*$/.test(w)) { frag.append(w); return; }
        const p = document.createElement("span"); p.className = "gw"; p.setAttribute("aria-hidden", "true");
        for (const ch of w) {
          const l = document.createElement("span"); l.className = "gl"; l.textContent = ch; l.style.setProperty("--i", idx++);
          l.style.cssText += `;--dx:${(rnd() * 3).toFixed(1)}rem;--dy:${(rnd() * 2 + 3.5).toFixed(1)}rem;--r:${Math.round(rnd() * 28)}deg`;
          if (big) l.style.cssText += `;color:var(--${["orange", "yellow", "blue", "pink", "green"][(idx + shift) % 5]});--rr:${Math.round(rnd() * 28)}deg;--ry:${(rnd() * .2).toFixed(2)}em`; // repouso torto, como na referência
          p.append(l);
        }
        frag.append(p);
      });
      f.replaceWith(frag);
    }
  };
  document.querySelectorAll(".gword > span, .d2, .stage-card .d1, .end .d1, .intro-h, .side-h > span, .side-h2").forEach((h) => { big = h.parentElement.classList.contains("gword"); shift = h.parentElement.classList.contains("g2") ? 2 : 0; if (!h.parentElement.classList.contains("gword") || !h.previousElementSibling) idx = 0; const c = h.closest("[aria-hidden=true]") ? null : sr(h); quebra(h); if (c) h.append(c); });

  // Super abertura: o círculo amarelo cresce com a rolagem (q de 0 a 1) e leva ao palco
  const ab = document.querySelector("[data-intro]");
  if (ab) {
    ab.classList.add("pin");
    let pi = 0;
    const q = () => { pi = 0; const r = document.querySelector(".stage").getBoundingClientRect(); ab.style.setProperty("--q", Math.min(1, Math.max(0, 1 - r.top / innerHeight)).toFixed(3)); };
    addEventListener("scroll", () => { if (!pi) pi = requestAnimationFrame(q); }, { passive: true });
    addEventListener("resize", q); q();
  }

  // Baralho: os cards ficam empilhados e inclinados; a cada trecho de rolagem o de cima sai voando e revela o próximo, enquanto as nuvens passam atrás.
  const deck = document.querySelector(".objs:not(.descobrem)");
  if (!deck) return;
  const cards = [...deck.children], N = cards.length, sec = deck.closest(".band");
  const palco = document.createElement("div"); palco.className = "deck-stage"; palco.append(...cards);
  deck.append(palco); deck.classList.add("deck"); deck.style.setProperty("--n", N);
  const k = (v, a, b) => Math.min(b, Math.max(a, v));
  const base = [-4, 5, -6, 4, -3, 6];
  let pend = 0;
  const pinta = () => {
    pend = 0;
    const r = deck.getBoundingClientRect(), p = k(-r.top / (r.height - innerHeight), 0, 1), cur = p * (N - 1);
    sec.style.setProperty("--p", p.toFixed(3));
    cards.forEach((c, i) => {
      const dir = i % 2 ? 1 : -1, t = k(cur - i, 0, 1), d = k(i - cur, 0, 3);
      c.style.translate = t ? `${(dir * t * 1.1 * innerWidth).toFixed(0)}px ${(-t * 0.2 * innerHeight).toFixed(0)}px` : `${(dir * d * 1.4).toFixed(2)}rem ${(d * 1.1).toFixed(2)}rem`;
      c.style.rotate = `${(base[i % 6] + dir * t * 40).toFixed(1)}deg`;
      c.style.scale = (1 - d * 0.03).toFixed(3);
      c.style.zIndex = N - i;
      c.style.visibility = t >= 1 ? "hidden" : "";
    });
  };
  addEventListener("scroll", () => { if (!pend) pend = requestAnimationFrame(pinta); }, { passive: true });
  addEventListener("resize", pinta);
  pinta();
})();

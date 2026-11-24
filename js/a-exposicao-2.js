// A exposição 2: separa os títulos em letras; cada uma entra de uma posição/ângulo diferente ao rolar (CSS, ver a-exposicao-2.css).
// Sem JS ou com movimento reduzido o título fica inteiro e parado.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !CSS.supports("animation-timeline: view()")) return;
  let n = 7, idx = 0;
  const rnd = () => (n = (n * 16807) % 2147483647) / 2147483647 - .5; // fixo: mesma bagunça a cada visita
  const quebra = (no) => {
    for (const f of [...no.childNodes]) {
      if (f.nodeType === 1) { quebra(f); continue; }
      if (f.nodeType !== 3 || !f.textContent.trim()) continue;
      const frag = document.createDocumentFragment();
      f.textContent.split(/(\s+)/).forEach((w) => {
        if (/^\s*$/.test(w)) { frag.append(w); return; }
        const p = document.createElement("span"); p.className = "gw";
        for (const ch of w) {
          const l = document.createElement("span"); l.className = "gl"; l.textContent = ch; l.style.setProperty("--i", idx++);
          l.style.cssText += `;--dx:${(rnd() * 9).toFixed(1)}rem;--dy:${(rnd() * 7).toFixed(1)}rem;--r:${Math.round(rnd() * 100)}deg`;
          p.append(l);
        }
        frag.append(p);
      });
      f.replaceWith(frag);
    }
  };
  document.querySelectorAll(".gword > span, .d2, .stage-card .d1, .end .d1").forEach((h) => { idx = 0; quebra(h); });

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
      c.style.translate = t ? `${(dir * t * 0.8 * innerWidth).toFixed(0)}px ${(-t * 1.1 * innerHeight).toFixed(0)}px` : `${(dir * d * 1.4).toFixed(2)}rem ${(d * 1.1).toFixed(2)}rem`;
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

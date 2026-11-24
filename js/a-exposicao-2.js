// A exposição 2: separa os títulos em letras; cada uma entra de uma posição/ângulo diferente ao rolar (CSS, ver a-exposicao-2.css).
// Sem JS ou com movimento reduzido o título fica inteiro e parado.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !CSS.supports("animation-timeline: view()")) return;
  let n = 7;
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
          const l = document.createElement("span"); l.className = "gl"; l.textContent = ch;
          l.style.cssText = `--dx:${(rnd() * 9).toFixed(1)}rem;--dy:${(rnd() * 7).toFixed(1)}rem;--r:${Math.round(rnd() * 100)}deg`;
          p.append(l);
        }
        frag.append(p);
      });
      f.replaceWith(frag);
    }
  };
  document.querySelectorAll(".gword > span, .d2, .stage-card .d1, .end .d1").forEach(quebra);
})();

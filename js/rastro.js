// Início: sobre a faixa azul do herói, o rastro do mouse deixa círculos coloridos (cores da paleta, tamanhos diferentes) que somem sozinhos,
// e o clique (ou toque) estoura um punhado deles em volta do ponto. Sem "reduzir movimento" não faz nada; leitor de tela ignora (aria-hidden).
(() => {
  const alvo = document.querySelector(".hero-logo");
  if (!alvo || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cores = ["orange", "yellow", "green", "pink", "cream"]; // sem azul: sumiria no fundo
  let ux = null, uy = 0, n = 0;
  const faz = (x, y, extra = "") => {
    const c = document.createElement("i");
    c.className = "rastro";
    c.setAttribute("aria-hidden", "true");
    c.style.cssText = `left:${x}px;top:${y}px;--s:${Math.round(14 + Math.random() * 56)}px;--c:var(--${cores[n++ % cores.length]});${extra}`;
    c.addEventListener("animationend", () => c.remove());
    alvo.append(c);
    return c;
  };
  alvo.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = alvo.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (ux !== null && Math.hypot(x - ux, y - uy) < 26) return; // um círculo a cada ~26px de caminho
    ux = x; uy = y;
    if (alvo.querySelectorAll(".rastro").length > 40) return;
    faz(x, y);
  }, { passive: true });
  // clique: 10 a 14 círculos saem em todas as direções, uns perto, outros longe
  alvo.addEventListener("pointerdown", (e) => {
    if (e.button) return;
    const r = alvo.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, q = 10 + Math.floor(Math.random() * 5);
    for (let i = 0; i < q; i++) {
      const a = (i / q) * 2 * Math.PI + Math.random() * 0.5, d = 50 + Math.random() * 130;
      faz(x, y, `--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d)}px`).classList.add("estoura");
    }
  });
  alvo.addEventListener("pointerleave", () => { ux = null; });
})();

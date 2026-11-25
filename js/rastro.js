// Início: o rastro do mouse sobre a faixa azul do herói deixa círculos coloridos (cores da paleta, tamanhos diferentes) que somem sozinhos.
// Só com mouse e sem "reduzir movimento"; no toque e para leitor de tela não faz nada.
(() => {
  const alvo = document.querySelector(".hero-logo");
  if (!alvo || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cores = ["orange", "yellow", "green", "pink", "cream"]; // sem azul: sumiria no fundo
  let ux = null, uy = 0, n = 0;
  alvo.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = alvo.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (ux !== null && Math.hypot(x - ux, y - uy) < 26) return; // um círculo a cada ~26px de caminho
    ux = x; uy = y;
    if (alvo.querySelectorAll(".rastro").length > 40) return;
    const c = document.createElement("i");
    c.className = "rastro";
    c.setAttribute("aria-hidden", "true");
    c.style.cssText = `left:${x}px;top:${y}px;--s:${Math.round(14 + Math.random() * 56)}px;--c:var(--${cores[n++ % cores.length]})`;
    c.addEventListener("animationend", () => c.remove());
    alvo.append(c);
  }, { passive: true });
  alvo.addEventListener("pointerleave", () => { ux = null; });
})();

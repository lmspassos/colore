// Contato: título em letras soltas e mascote que acompanha o formulário.
// Sem JS: o título fica inteiro e o mascote fica parado.
(() => {
  // título letra a letra (o aria-label mantém a leitura como frase)
  document.querySelectorAll("[data-letras]").forEach((h) => {
    const t = h.textContent.trim(); let i = 0;
    h.setAttribute("aria-label", t);
    const palavra = (w) => `<span class="w" aria-hidden="true">${[...w].map((c) => `<span class="l" style="--i:${i++}">${c}</span>`).join("")}</span>`;
    h.innerHTML = h.innerHTML.split(/<br\s*\/?>/).map((l) => l.trim().split(/\s+/).map(palavra).join(" ")).join("<br>"); // o <br> do HTML marca a quebra de linha
  });

  // ambientação do herói: nuvens e bolinhas se afastam e crescem de leve quando o mouse passa por perto
  const ceu = document.querySelector(".c2-ceu");
  if (ceu && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const itens = [...ceu.children], R = 240; // raio de influência, em px
    let raf = 0, px = 0, py = 0;
    const solta = () => itens.forEach((e) => { e.style.transform = ""; });
    const passo = () => {
      raf = 0;
      itens.forEach((e, i) => {
        const r = e.getBoundingClientRect(), dx = r.left + r.width / 2 - px, dy = r.top + r.height / 2 - py, d = Math.hypot(dx, dy) || 1;
        const k = Math.max(0, 1 - d / (R + r.width / 2)); // 0 longe, 1 em cima
        e.style.transform = k ? `translate(${(dx / d) * k * 18}px, ${(dy / d) * k * 18}px) scale(${1 + k * .1}) rotate(${(i % 2 ? 1 : -1) * k * 6}deg)` : "";
      });
    };
    addEventListener("pointermove", (e) => { if (e.pointerType === "touch") return; px = e.clientX; py = e.clientY; raf = raf || requestAnimationFrame(passo); }, { passive: true });
    document.documentElement.addEventListener("mouseleave", solta);
  }

  const form = document.querySelector("#formulario form");
  if (!form) return;

  // mascote: olha para o campo em foco (ou para o cursor), sorri com tudo preenchido e se assusta com erro
  const m = document.querySelector(".masc");
  if (!m) return;
  const olha = (x, y) => {
    const r = m.getBoundingClientRect(), dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height * 0.4);
    const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 160);
    m.style.setProperty("--ex", ((dx / d) * k).toFixed(2));
    m.style.setProperty("--ey", ((dy / d) * k).toFixed(2));
  };
  form.addEventListener("focusin", (e) => { const r = e.target.getBoundingClientRect(); olha(r.left + Math.min(r.width, 160) / 2, r.top + r.height / 2); });
  addEventListener("pointermove", (e) => { if (!form.contains(document.activeElement)) olha(e.clientX, e.clientY); }, { passive: true });
  const confere = () => m.classList.toggle("ok", form.checkValidity() && !!form.querySelector("[name=tipo]:checked"));
  form.addEventListener("input", confere);
  form.addEventListener("change", confere);
  // roda depois do form.js (carregado antes): se ele barrou o envio, há erro
  form.addEventListener("submit", (e) => {
    if (!e.defaultPrevented) return;
    m.classList.add("ops");
    setTimeout(() => m.classList.remove("ops"), 1600);
  });
})();

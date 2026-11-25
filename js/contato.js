// Contato: título em letras soltas e mascote que acompanha o formulário.
// Sem JS: o título fica inteiro e o mascote fica parado.
(() => {
  // título letra a letra (o aria-label mantém a leitura como frase)
  document.querySelectorAll("[data-letras]").forEach((h) => {
    const t = h.textContent.trim(); let i = 0;
    h.setAttribute("aria-label", t);
    h.innerHTML = t.split(/\s+/).map((w) => `<span class="w" aria-hidden="true">${[...w].map((c) => `<span class="l" style="--i:${i++}">${c}</span>`).join("")}</span>`).join(" ");
  });

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

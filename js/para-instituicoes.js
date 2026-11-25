// Para instituições: o título do herói vira letras soltas (entram uma a uma e se espalham ao rolar).
// Sem JS o título fica inteiro; o aria-label mantém a leitura de tela como uma frase só.
(() => {
  document.querySelectorAll("[data-letras]").forEach((h) => {
    const txt = h.textContent.trim();
    let i = 0;
    h.setAttribute("aria-label", txt);
    const palavra = (w) => `<span class="w" aria-hidden="true">${[...w].map((c) => {
      // espalhamento fixo por letra (não aleatório, para não pular a cada visita)
      const d = (((i * 37) % 7) - 3) * 0.5, r = (((i * 53) % 9) - 4) * 9;
      return `<span class="l" style="--i:${i++};--d:${d}em;--dr:${r}deg">${c}</span>`;
    }).join("")}</span>`;
    // o <br> do HTML marca a quebra de linha do título
    h.innerHTML = h.innerHTML.split(/<br\s*\/?>/).map((l) => l.trim().split(/\s+/).map(palavra).join(" ")).join("<br>");
  });
})();

// Fotos: faixa que passa sozinha (início) e foto ampliada num <dialog> com anterior/próxima (início e A exposição).
// Qualquer [data-galeria] com botões > img abre o <dialog class="lb"> da página.
(() => {
  const d = document.querySelector("dialog.lb");
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const faixa = document.querySelector(".faixa");
  if (faixa && !reduz) {
    const ul = faixa.querySelector("ul");
    [...ul.children].forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      c.querySelector("button").tabIndex = -1;
      c.dataset.clone = "";
      ul.append(c);
    });
    faixa.classList.add("anda");
  }
  // Mobile: a faixa vira um carrossel arrastável (rolagem nativa) que também avança sozinho e dá a volta.
  if (faixa && !reduz) {
    const ul = faixa.querySelector("ul"), vis = (l) => [...ul.querySelectorAll(l)].find((li) => li.offsetParent);
    let x = 0, toque = false, t;
    const mobile = () => !ul.querySelector("li.d").offsetParent;
    const volta = () => vis("li[data-clone]").offsetLeft - vis("li:not([data-clone])").offsetLeft;
    faixa.addEventListener("scroll", () => {
      if (!mobile()) return;
      const v = volta();
      if (faixa.scrollLeft < v * 0.5) faixa.scrollLeft += v; else if (faixa.scrollLeft > v * 1.5) faixa.scrollLeft -= v;
    }, { passive: true });
    faixa.addEventListener("touchstart", () => { toque = true; clearTimeout(t); }, { passive: true });
    faixa.addEventListener("touchend", () => { clearTimeout(t); t = setTimeout(() => { toque = false; x = faixa.scrollLeft; }, 1500); }, { passive: true });
    let ligado = false;
    const passo = () => {
      if (mobile() && !toque && !faixa.classList.contains("pausa") && !document.hidden) {
        if (!ligado) { ligado = true; x = faixa.scrollLeft = volta(); }
        x += 0.5;
        faixa.scrollLeft = x;
      } else ligado = false;
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }
  if (!d) return;

  const img = d.querySelector("img"), cap = d.querySelector(".lb-cap");
  let fotos = [], i = 0, origem = null;
  const mostra = (n) => {
    i = (n + fotos.length) % fotos.length;
    const f = fotos[i];
    img.src = f.currentSrc || f.src;
    img.alt = f.alt;
    if (cap) cap.textContent = f.dataset.legenda || "";
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-galeria] button");
    if (!b || !b.querySelector("img") || !d.isConnected) return; // a página pode ter trocado de lado na roda
    origem = b.closest("[data-galeria]");
    fotos = [...origem.querySelectorAll("li:not([data-clone]) button img, :scope > button img")].filter((f) => f.offsetParent); // a faixa tem um conjunto para desktop e outro para mobile
    mostra(Math.max(0, fotos.findIndex((f) => f.src === b.querySelector("img").src))); // o clone da faixa aponta para a mesma foto
    if (faixa) faixa.classList.add("pausa");
    d.showModal();
  });
  d.addEventListener("click", (e) => {
    const a = e.target.closest("[data-lb]");
    if (a) { const v = a.dataset.lb; if (v === "prev") mostra(i - 1); else if (v === "next") mostra(i + 1); else d.close(); }
    else if (e.target === d) d.close();
  });
  d.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") mostra(i - 1); else if (e.key === "ArrowRight") mostra(i + 1); });
  d.addEventListener("close", () => { if (faixa) faixa.classList.remove("pausa"); });
})();

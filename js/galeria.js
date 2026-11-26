// Fotos: faixa que passa sozinha (início) e foto ampliada num <dialog> com anterior/próxima (início e A exposição).
// Qualquer [data-galeria] com botões > img abre o <dialog class="lb"> da página.
(() => {
  const d = document.querySelector("dialog.lb");
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const faixa = document.querySelector(".faixa");
  if (faixa && !reduz) {
    const ul = faixa.querySelector("ul");
    const orig = [...ul.children];
    // cópia 1 (data-clone) fecha o laço do desktop; cópia 2 (data-extra) só aparece no mobile, para dar folga ao arraste nos dois sentidos
    ["", "extra"].forEach((extra) => orig.forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      c.querySelector("button").tabIndex = -1;
      c.dataset.clone = "";
      if (extra) c.dataset.extra = "";
      ul.append(c);
    }));
    faixa.classList.add("anda");
  }
  // Mobile: a faixa vira um carrossel arrastável (rolagem nativa) que também avança sozinho e dá a volta.
  // O avanço automático só escreve em scrollLeft quando ninguém está tocando nem com a rolagem em andamento (arraste, embalo), para não brigar com o dedo.
  if (faixa && !reduz) {
    const ul = faixa.querySelector("ul"), vis = (l) => [...ul.querySelectorAll(l)].find((li) => li.offsetParent);
    const mobile = () => getComputedStyle(faixa).overflowX === "auto"; // só no mobile a faixa rola de verdade (no desktop o CSS a move)
    const volta = () => vis("li[data-clone]").offsetLeft - vis("li:not([data-clone])").offsetLeft;
    let x = null, ultimo = 0, livre = 0, t0 = 0, toque = false; // x: posição própria (com fração); livre: instante em que o avanço pode voltar
    const segura = () => { livre = performance.now() + 1200; x = null; };
    // ao encostar o dedo (a rolagem para aqui) a lista volta ao trecho do meio: a emenda é invisível e o arraste nunca chega ao fim
    faixa.addEventListener("touchstart", () => {
      toque = true; x = null;
      if (!mobile()) return;
      const v = volta();
      let n = faixa.scrollLeft;
      while (n < v * 0.5) n += v;
      while (n > v * 1.5) n -= v;
      if (n !== faixa.scrollLeft) faixa.scrollLeft = ultimo = n;
    }, { passive: true });
    ["touchend", "touchcancel"].forEach((e) => faixa.addEventListener(e, () => { toque = false; segura(); }, { passive: true }));
    faixa.addEventListener("scroll", () => { if (!toque && Math.abs(faixa.scrollLeft - ultimo) > 2) segura(); }, { passive: true }); // embalo do arraste
    const passo = (agora) => {
      const dt = Math.min(agora - t0, 50); t0 = agora;
      if (mobile() && !toque && agora >= livre && !faixa.classList.contains("pausa") && !document.hidden) {
        const v = volta();
        if (x === null) { x = faixa.scrollLeft; while (x < v * 0.5) x += v; while (x > v * 1.5) x -= v; } // recentraliza na cópia do meio sem o usuário ver
        x += dt * 0.06; // 60 px/s
        if (x > v * 1.5) x -= v;
        faixa.scrollLeft = x; ultimo = faixa.scrollLeft;
      }
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
    fotos = [...origem.querySelectorAll("li:not([data-clone]) button img, :scope > button img")].filter((f) => f.offsetParent);
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

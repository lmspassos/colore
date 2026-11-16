// Carrossel de fotos: passa sozinho (lista duplicada para fechar o laço), clique abre a foto num modal.
const faixa = document.querySelector(".faixa");
if (faixa) {
  const ul = faixa.querySelector("ul"), d = faixa.querySelector("dialog"), img = d.querySelector("img");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    [...ul.children].forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      c.querySelector("button").tabIndex = -1;
      ul.append(c);
    });
    faixa.classList.add("anda");
  }
  ul.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const foto = b.querySelector("img");
    img.src = foto.src;
    img.alt = foto.alt;
    faixa.classList.add("pausa");
    d.showModal();
  });
  d.addEventListener("close", () => faixa.classList.remove("pausa"));
  d.addEventListener("click", (e) => { if (e.target === d || e.target.closest(".fechar")) d.close(); });
}

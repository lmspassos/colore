// Início: "Godê digital" — escolha duas cores e veja onde elas se encontram.
(() => {
  const g = document.querySelector("[data-gode]");
  if (!g) return;
  const botoes = [...g.querySelectorAll(".sw")], palco = g.querySelector(".stage"), rotulo = g.querySelector(".mixlbl");
  const [a, b] = [palco.querySelector(".a"), palco.querySelector(".b")];
  let escolhas = botoes.filter((x) => x.getAttribute("aria-pressed") === "true");
  const cor = (x) => x.dataset.cor, nome = (x) => x.getAttribute("aria-label");
  const mostra = () => {
    botoes.forEach((x) => { const on = escolhas.includes(x); x.setAttribute("aria-pressed", on); x.classList.toggle("on", on); });
    [[a, escolhas[0]], [b, escolhas[1]]].forEach(([el, x]) => { el.classList.toggle("empty", !x); el.style.background = x ? `var(${cor(x)})` : ""; });
    palco.classList.toggle("joined", escolhas.length === 2);
    rotulo.textContent = escolhas.length === 2 ? `${nome(escolhas[0])} + ${nome(escolhas[1])}` : escolhas.length ? `${nome(escolhas[0])} + escolha mais uma` : "Escolha duas cores";
  };
  g.addEventListener("click", (e) => {
    const x = e.target.closest(".sw");
    if (!x) return;
    escolhas = escolhas.includes(x) ? escolhas.filter((y) => y !== x) : [...escolhas, x].slice(-2);
    mostra();
  });

  // Mobile: as quatro estações viram um carrossel lateral que avança sozinho (para quando a pessoa toca, passa o mouse ou foca)
  const grid = document.querySelector(".st-grid");
  if (grid && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let pausa = false, t;
    const para = () => { pausa = true; clearTimeout(t); }, volta = () => { clearTimeout(t); t = setTimeout(() => (pausa = false), 4000); };
    ["touchstart", "mouseenter", "focusin"].forEach((e) => grid.addEventListener(e, para, { passive: true }));
    ["touchend", "mouseleave", "focusout"].forEach((e) => grid.addEventListener(e, volta, { passive: true }));
    setInterval(() => {
      const cards = [...grid.children];
      if (pausa || document.hidden || grid.scrollWidth <= grid.clientWidth + 1) return; // só quando é carrossel (mobile)
      const atual = cards.findIndex((c) => c.offsetLeft >= grid.scrollLeft + cards[0].offsetLeft - 4);
      const prox = cards[(atual + 1) % cards.length];
      grid.scrollTo({ left: prox.offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
    }, 3500);
  }
})();

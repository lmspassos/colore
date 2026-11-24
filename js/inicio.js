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
})();

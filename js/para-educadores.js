// Para educadores: as bolinhas 1, 2 e 3 de "Antes, durante e depois" levam à explicação de cada momento.
(() => {
  const sec = document.querySelector(".ed-vis");
  if (!sec) return;
  const bs = [...sec.querySelectorAll(".ed-marcos button")], fases = [...sec.querySelectorAll(".ed-fase")];
  // Na versão presa (tela larga), a fase aparece conforme a rolagem: pausa de cada uma em ~11%, 48% e 87% do trecho (ver ed-anda em para-educadores.css).
  const paradas = [.11, .48, .87];
  bs.forEach((b, i) => b.addEventListener("click", () => {
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (getComputedStyle(sec.querySelector(".ed-vis-st")).position === "sticky") {
      const topo = sec.getBoundingClientRect().top + scrollY;
      scrollTo({ top: topo + paradas[i] * (sec.offsetHeight - innerHeight), behavior });
    } else fases[i].scrollIntoView({ behavior, block: "start" });
  }));
})();

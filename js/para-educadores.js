// Para educadores: abas "Antes, durante e depois" (setas do teclado navegam entre elas).
// Sem JS os três momentos aparecem um embaixo do outro.
(() => {
  const lista = document.querySelector("[data-abas]");
  if (!lista) return;
  const abas = [...lista.querySelectorAll("[role=tab]")], paineis = abas.map((a) => document.getElementById(a.getAttribute("aria-controls")));
  const vai = (n, foco) => {
    abas.forEach((a, k) => { a.setAttribute("aria-selected", k === n); a.tabIndex = k === n ? 0 : -1; paineis[k].hidden = k !== n; });
    if (foco) abas[n].focus();
  };
  abas.forEach((a, k) => a.addEventListener("click", () => vai(k)));
  lista.addEventListener("keydown", (e) => {
    const k = abas.indexOf(document.activeElement);
    if (k < 0) return;
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (d) { e.preventDefault(); vai((k + d + abas.length) % abas.length, true); }
    else if (e.key === "Home") { e.preventDefault(); vai(0, true); }
    else if (e.key === "End") { e.preventDefault(); vai(abas.length - 1, true); }
  });
  vai(0);
})();

// Giro entre páginas: as setas do teatro levam à página vizinha da ordem circular (Início, A exposição, Para instituições,
// Para educadores, Contato). A roda gira para fora; a página seguinte já abre com a roda chegando do lado oposto.
// Sem JS ou com movimento reduzido, a seta é um link comum.
(() => {
  const r = document.querySelector(".roda");
  if (!r) return;
  const KEY = "colore:giro", calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const limpa = () => r.classList.remove("giro-sai-prox", "giro-sai-ant", "giro-entra-prox", "giro-entra-ant");

  let g = 0;
  try { g = Number(sessionStorage.getItem(KEY)) || 0; sessionStorage.removeItem(KEY); } catch (e) {}
  if (g && !calmo) {
    r.classList.add(g > 0 ? "giro-entra-prox" : "giro-entra-ant");
    setTimeout(limpa, 1000);
  }
  addEventListener("pageshow", (e) => { if (e.persisted) limpa(); }); // voltar do navegador não pode abrir com a roda a meio caminho

  r.addEventListener("click", (e) => {
    const a = e.target.closest(".roda-seta[data-fora]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    if (calmo) { location.href = a.href; return; }
    const d = Number(a.dataset.giro) || 1;
    try { sessionStorage.setItem(KEY, String(d)); } catch (x) {}
    r.classList.add(d > 0 ? "giro-sai-prox" : "giro-sai-ant");
    setTimeout(() => { location.href = a.href; }, 620);
  });
})();

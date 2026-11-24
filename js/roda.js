// Roda (moeda) de Para instituições 2 e Para educadores 2.
// A seta guarda o sentido do giro e segue o link; a página nova abre com a roda na posição da anterior e vira até a sua metade.
(() => {
  const r = document.querySelector("[data-roda]");
  if (!r) return;
  r.querySelectorAll("[data-giro]").forEach((a) => a.addEventListener("click", () => {
    try { sessionStorage.setItem("roda-giro", a.dataset.giro); } catch (e) {}
  }));
  let g = null;
  try { g = sessionStorage.getItem("roda-giro"); sessionStorage.removeItem("roda-giro"); } catch (e) {}
  if (!g || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = parseFloat(getComputedStyle(r).getPropertyValue("--a"));
  // giro +1 (próximo) = roda anti-horária: começa meia-volta à frente e volta ao ângulo da página
  r.style.setProperty("--a", a + Number(g) * 180 + "deg");
  r.style.setProperty("--g", g);
  r.classList.add("vindo");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    r.classList.add("gira");
    r.style.setProperty("--a", a + "deg");
    r.classList.remove("vindo");
  }));
})();

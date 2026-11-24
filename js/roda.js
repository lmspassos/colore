// Roda (moeda) de Para instituições 2 e Para educadores 2.
// Seta ou arraste (dedo, ou segurar e arrastar com o mouse) giram a roda; ao trocar de página, a nova abre
// no ponto em que o giro parou e termina a volta até a sua metade.
(() => {
  const r = document.querySelector("[data-roda]");
  if (!r) return;
  const base = parseFloat(getComputedStyle(r).getPropertyValue("--a"));
  const destino = r.querySelector(".roda-seta").getAttribute("href");
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // t = quanto do giro falta, de -1 a 1 (positivo = vindo da direita, "próximo")
  const poe = (t) => { r.style.setProperty("--t", t); r.style.setProperty("--a", base + t * 180 + "deg"); };
  const guarda = (g, f) => { try { sessionStorage.setItem("roda-giro", JSON.stringify([g, f])); } catch (e) {} };

  r.querySelectorAll("[data-giro]").forEach((a) => a.addEventListener("click", () => guarda(Number(a.dataset.giro), 1)));

  // chegada: começa onde a página anterior parou e gira até o repouso
  let v = null;
  try { v = JSON.parse(sessionStorage.getItem("roda-giro")); sessionStorage.removeItem("roda-giro"); } catch (e) {}
  if (v && !calmo) {
    poe(v[0] * v[1]);
    requestAnimationFrame(() => requestAnimationFrame(() => { r.classList.add("gira"); poe(0); }));
  }

  // arraste: arrastar para a esquerda leva adiante (como a seta da direita)
  let x0 = null, id = null, t = 0, mexeu = false;
  r.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("a, button, .roda-card")) return;
    x0 = e.clientX; id = e.pointerId; mexeu = false; t = 0;
  });
  r.addEventListener("pointermove", (e) => {
    if (x0 === null || e.pointerId !== id) return;
    const dx = e.clientX - x0;
    if (!mexeu) {
      if (Math.abs(dx) < 8) return;
      mexeu = true; r.setPointerCapture(id); r.classList.remove("gira"); r.classList.add("arrasta");
    }
    // giro completo ao arrastar ~80% da largura; arrastar para a esquerda = t negativo = roda anti-horária
    t = Math.max(-1, Math.min(1, dx / (r.clientWidth * 0.8)));
    poe(t);
  });
  const solta = (e) => {
    if (x0 === null || e.pointerId !== id) return;
    x0 = null; r.classList.remove("arrasta");
    if (!mexeu) return;
    if (Math.abs(t) > 0.25) {
      const g = t < 0 ? 1 : -1;
      // a página nova continua do ponto atual: falta (1 - |t|) da meia-volta, vindo do lado do giro
      guarda(g, 1 - Math.abs(t));
      location.href = destino;
    } else {
      r.classList.add("gira"); poe(0);
    }
  };
  r.addEventListener("pointerup", solta);
  r.addEventListener("pointercancel", solta);
})();

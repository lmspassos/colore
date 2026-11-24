// A exposição: olhos que seguem o cursor, roda dos quatro pilares e mapa do percurso.
// Sem JS os pilares e as estações aparecem em lista (o HTML já traz todo o texto).
(() => {
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Olhos: a íris acompanha o cursor dentro do bloco "Origem"
  const origem = document.querySelector("[data-olhos]");
  if (origem && !reduz) {
    let raf = 0;
    origem.addEventListener("mousemove", (e) => {
      const r = origem.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .72) * 2));
      const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .45) * 2));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { origem.style.setProperty("--ex", x.toFixed(2)); origem.style.setProperty("--ey", y.toFixed(2)); });
    });
  }

  // Seleção em grupo: um botão ativo, o painel correspondente visível, os demais escondidos
  const grupo = (raiz, botoes, paineis, extra) => {
    const vai = (n) => {
      botoes.forEach((b, k) => { b.setAttribute("aria-pressed", k === n); b.classList.toggle("on", k === n); });
      paineis.forEach((p, k) => p.classList.toggle("on", k === n));
      if (extra) extra(n);
    };
    botoes.forEach((b, k) => { b.addEventListener("click", () => vai(k)); });
    return vai;
  };

  const roda = document.querySelector("[data-pilares]");
  if (roda) {
    const bs = [...roda.querySelectorAll(".wq")], ps = [...roda.querySelectorAll(".pil-d")], tri = roda.querySelector(".wc svg");
    const vai = grupo(roda, bs, ps, (n) => { if (tri) tri.style.transform = `rotate(${n * 90}deg)`; ps.forEach((p, k) => p.querySelectorAll(".pil-n i").forEach((d, j) => d.classList.toggle("on", j === n))); });
    bs.forEach((b, k) => b.addEventListener("mouseenter", () => vai(k))); // passar o cursor também escolhe
    vai(0);
  }

  const mapa = document.querySelector("[data-percurso]");
  if (mapa) {
    const ns = [...mapa.querySelectorAll(".node")], ps = [...mapa.querySelectorAll(".panel-item")], painel = mapa.querySelector(".panel");
    const vai = grupo(mapa, ns, ps, (n) => { ns.forEach((x, k) => { x.style.zIndex = k === n ? 3 : 2; }); painel.style.setProperty("--c", getComputedStyle(ps[n]).getPropertyValue("--c")); });
    vai(0);
  }
})();

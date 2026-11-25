// Roda do teatro (todas as páginas): cinco cenários na ordem Início, A exposição, Para instituições, Para educadores e Contato,
// sempre girando em sentido anti-horário (avançar = para a direita, o próximo cenário entra pela direita) e em loop. A página abre com a roda parada no seu cenário; a seta ou o arraste
// giram a roda até o vizinho e, ao chegar, abre a página dele, que já nasce com o mesmo quadro (sem salto).
// Tudo muda aos poucos com o ângulo: céu, chão, sol, cenários e cartões. Sem JS ou com movimento reduzido, as setas são links comuns.
// As contas de repouso (céu, chão, sol) são as mesmas de tools/gera-teatro.js.
(() => {
  const r = document.querySelector(".roda");
  if (!r) return;
  const N = 5, PASSO = 72, atual = Number(r.dataset.pagina);
  const URLS = ["/", "/a-exposicao/", "/para-instituicoes/", "/para-educadores/", "/contato/"];
  const CEU = ["var(--blue)", "var(--pink)", "var(--blue)", "var(--pink)", "var(--green)"];
  const SOLO = [null, "color-mix(in srgb, var(--blue) 45%, var(--cream))", "color-mix(in srgb, var(--green) 55%, var(--cream))", "color-mix(in srgb, var(--blue) 55%, var(--cream))", "color-mix(in srgb, var(--pink) 55%, var(--cream))"];
  // sol: x anda em linha reta e y desenha uma parábola única de Início (u=0, abaixo do horizonte) a Início de novo (u=5); só aparece de A exposição a Contato
  const soL = (u) => { const s = (u - 2.5) / 2.5; return [8 + 16.8 * u, 74 - 54 * (1 - s * s), u < 1 ? u : u > 4 ? 5 - u : 1]; };
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const q = (s) => [...r.querySelectorAll(s)];
  const fatias = q(".fatia").map((el) => ({ el, cena: el.querySelector(".cena"), cams: [...el.querySelectorAll(".cam")].map((c) => [c, parseFloat(c.style.getPropertyValue("--z")) || 0]) }));
  const cards = q(".roda-card"), chao = r.querySelector(".planeta"), terra = r.querySelector(".terra"), marcos = r.querySelector(".terra.marcos"), sol = r.querySelector(".sol"), nuvens = q(".roda-ar .nv");
  const nx = (x0, a) => ((((x0 + 20 + (a / 360) * 140) % 140) + 140) % 140) - 20;
  const lim = (v) => Math.max(0, Math.min(1, v));
  const mix = (a, b, f) => `color-mix(in srgb, ${a} ${((1 - f) * 100).toFixed(1)}%, ${b})`;
  const lerp = (a, b, f) => a + (b - a) * f;
  const rel = (a, i) => (((((i * PASSO + a) % 360) + 540) % 360) - 180); // ângulo da fatia i em relação ao topo, entre -180° e 180°

  let ang = -atual * PASSO, repouso = ang, anima = 0; // avançar = anti-horário = ângulo negativo

  const poe = (a) => {
    ang = a;
    const u = ((((-a) / PASSO) % N) + N) % N, i = Math.floor(u), f = u - i, j = (i + 1) % N;
    r.style.setProperty("--ceu", mix(CEU[i], CEU[j], f));
    // chão: some e volta junto com o Início (que é só a logo); entre os demais, passa de uma cor à outra
    const cor = i === 0 ? SOLO[1] : i === 4 ? SOLO[4] : mix(SOLO[i], SOLO[j], f);
    terra.style.setProperty("--base", cor);
    terra.style.opacity = marcos.style.opacity = i === 0 ? f : i === 4 ? 1 - f : 1;
    chao.style.rotate = a + "deg";
    // sol: nasce à esquerda em A exposição, cruza o céu e se põe à direita em Contato; some atrás do chão antes e depois
    const [sx, sy, so] = soL(u);
    sol.style.setProperty("--x", sx.toFixed(2) + "%");
    sol.style.setProperty("--y", sy.toFixed(2) + "%");
    // cor do sol: amarelo até Para instituições, vira laranja ao chegar em Para educadores
    sol.style.setProperty("--c", mix("var(--yellow)", "var(--orange)", u < 2 ? 0 : u < 3 ? u - 2 : 1));
    sol.style.opacity = so.toFixed(3);
    // nuvens: deslizam para a esquerda junto com a roda; 360° = uma volta de 140% de largura, então o loop não dá salto e o reinício acontece fora da tela
    nuvens.forEach((n, k) => n.style.setProperty("--x", nx(Number(n.dataset.x), a).toFixed(2) + "%"));
    fatias.forEach((x, n) => {
      const d = rel(a, n), o = lim(1 - Math.abs(d) / PASSO), sn = Math.sin((d * Math.PI) / 180);
      x.el.style.rotate = d.toFixed(3) + "deg";
      x.el.style.visibility = o > 0 ? "visible" : "hidden";
      x.cena.style.opacity = o.toFixed(3);
      x.cams.forEach(([c, z]) => (c.style.rotate = (sn * z * 0.6).toFixed(2) + "deg"));
    });
    cards.forEach((c) => {
      const o = lim(1 - (2 * Math.abs(rel(a, Number(c.dataset.i)))) / PASSO); // o cartão fecha antes de a roda sair e abre quando ela chega
      c.style.scale = o.toFixed(3) + " 1";
      c.style.visibility = o > 0 ? "visible" : "hidden";
    });
  };

  const abre = (i) => { location.href = URLS[((i % N) + N) % N]; };
  // anima até um ângulo (múltiplo de 72° = um cenário); ao chegar em outro cenário, abre a página dele
  const vai = (alvo) => {
    cancelAnimationFrame(anima);
    const a0 = ang, dur = calmo ? 0 : 1100 * Math.max(0.4, Math.abs(alvo - a0) / PASSO), t0 = performance.now();
    const fim = () => { poe(alvo); const i = Math.round(-alvo / PASSO); if (((i % N) + N) % N !== atual) abre(i); else repouso = alvo; };
    if (!dur) return fim();
    const passo = (agora) => {
      const p = Math.min(1, (agora - t0) / dur), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      poe(a0 + (alvo - a0) * e);
      if (p < 1) anima = requestAnimationFrame(passo); else fim();
    };
    anima = requestAnimationFrame(passo);
  };

  q(".roda-seta").forEach((s) => s.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; // abrir em outra aba segue o link
    e.preventDefault();
    vai(repouso - Number(s.dataset.giro) * PASSO); // seta da direita (+1): anti-horário
  }));
  addEventListener("pageshow", (e) => { if (e.persisted) { cancelAnimationFrame(anima); repouso = -atual * PASSO; poe(repouso); } }); // voltar do navegador

  // arraste: a roda acompanha o dedo/mouse (para a esquerda = anti-horário = avançar); soltar depois de 1/4 do caminho completa o giro
  let x0 = null, y0 = 0, id = null, mexeu = false;
  r.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("a, button, .roda-card")) return;
    x0 = e.clientX; y0 = e.clientY; id = e.pointerId; mexeu = false;
  });
  r.addEventListener("pointermove", (e) => {
    if (x0 === null || e.pointerId !== id) return;
    const dx = e.clientX - x0;
    if (!mexeu) {
      if (Math.abs(e.clientY - y0) > Math.abs(dx) && Math.abs(e.clientY - y0) > 8) { x0 = null; return; } // é rolagem
      if (Math.abs(dx) < 8) return;
      mexeu = true; r.setPointerCapture(id); r.classList.add("arrasta"); cancelAnimationFrame(anima);
    }
    poe(repouso + Math.max(-1, Math.min(1, dx / (r.clientWidth * 0.6))) * PASSO);
  });
  const solta = (e) => {
    if (x0 === null || e.pointerId !== id) return;
    x0 = null; r.classList.remove("arrasta");
    if (!mexeu) return;
    const t = (ang - repouso) / PASSO;
    vai(Math.abs(t) > 0.25 ? repouso + Math.sign(t) * PASSO : repouso);
  };
  r.addEventListener("pointerup", solta);
  r.addEventListener("pointercancel", solta);

  poe(ang);
})();

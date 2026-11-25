// Roda (moeda) de Para instituições e Para educadores.
// O giro acontece dentro da mesma página: o outro lado é baixado em segundo plano e, ao girar (seta, arraste com dedo
// ou mouse, ou voltar do navegador), o cartão troca no meio da volta e o conteúdo, o título e o endereço trocam no fim.
// Sem JS (ou se o outro lado não carregou) a seta é um link comum para a outra página.
(() => {
  const r = document.querySelector("[data-roda]");
  if (!r) return;
  const main = r.parentElement, card = r.querySelector(".roda-card"), setas = [...r.querySelectorAll(".roda-seta")];
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const aviso = document.createElement("p");
  aviso.className = "sr-only"; aviso.setAttribute("aria-live", "polite"); r.append(aviso);

  // cada lado: endereço, título, nome, cartão, estado do menu e, fora da tela, os blocos do conteúdo
  const lado0 = r.dataset.lado, outro = (l) => (l === "instituicoes" ? "educadores" : "instituicoes");
  const navAtual = () => [...document.querySelectorAll(".nav a")].map((a) => a.getAttribute("aria-current"));
  const lados = { [lado0]: { url: location.pathname, title: document.title, nome: card.querySelector("h1").textContent, card: card.innerHTML, nav: navAtual() } };
  history.replaceState({ roda: lado0 }, "");

  fetch(setas[0].getAttribute("href")).then((x) => x.text()).then((t) => {
    const d = new DOMParser().parseFromString(t, "text/html"), nr = d.querySelector("[data-roda]");
    if (!nr) return;
    d.querySelectorAll("link[rel=stylesheet]").forEach((l) => {
      if (!document.querySelector(`link[href="${l.getAttribute("href")}"]`)) document.head.append(document.importNode(l));
    });
    lados[nr.dataset.lado] = {
      url: setas[0].getAttribute("href"), title: d.title, nome: nr.querySelector("h1").textContent, card: nr.querySelector(".roda-card").innerHTML,
      nav: [...d.querySelectorAll(".nav a")].map((a) => a.getAttribute("aria-current")),
      nodes: [...d.querySelector("main").children].filter((c) => c !== nr),
      scripts: [...d.querySelectorAll("script[src]")].map((s) => s.getAttribute("src")).filter((s) => !/\/(base|roda)\.js$/.test(s)),
    };
  }).catch(() => {});
  const pronto = () => !!lados[outro(r.dataset.lado)];

  // ângulo da roda: múltiplos pares de 180° = instituições no topo, ímpares = educadores
  let ang = parseFloat(getComputedStyle(r).getPropertyValue("--a")), repouso = ang, mostrado = lado0, anima = 0;
  const ladoDe = (a) => (((Math.round(a / 180) % 2) + 2) % 2 === 0 ? "instituicoes" : "educadores");
  // peças que se mexem: cada quadro escreve só transformações e transparências nelas (o celular move camadas prontas)
  const q = (sel) => [...r.querySelectorAll(sel)];
  const W = r.querySelector(".roda-w"), ceu = q(".roda-ceu, .terra-b"), cenaI = r.querySelector(".f-inst .cena"), cenaE = r.querySelector(".f-edu .cena");
  const cams = q(".cam").map((el) => [el, parseFloat(el.style.getPropertyValue("--z")) || 0, el.closest(".f-edu") ? -1 : 1]);
  const ar = r.querySelector(".roda-ar"), corts = q(".cort");
  const lim = (v) => Math.max(0, Math.min(1, v));
  const poe = (a) => {
    ang = a;
    const rad = (a * Math.PI) / 180, sn = Math.sin(rad), cs = Math.cos(rad), s2 = Math.sin(2 * rad);
    W.style.rotate = a + "deg";
    ceu.forEach((el) => (el.style.opacity = ((1 - cs) / 2).toFixed(3)));
    cenaI.style.opacity = lim(0.5 + cs * 0.9).toFixed(3);
    cenaE.style.opacity = lim(0.5 - cs * 0.9).toFixed(3);
    cams.forEach(([el, z, k]) => (el.style.rotate = `${(sn * z * k * 0.6).toFixed(2)}deg`));
    ar.style.translate = `${(s2 * 20).toFixed(2)}vw 0`;
    corts.forEach((el) => (el.style.translate = `${(s2 * 0.75).toFixed(3)}rem 0`));
    card.style.scale = `${Math.abs(cs).toFixed(3)} 1`;
    const l = ladoDe(a);
    if (l !== mostrado && lados[l]) { card.innerHTML = lados[l].card; mostrado = l; } // o cartão vira no meio da volta
  };

  const trocaPagina = (l, empurra) => {
    const de = r.dataset.lado, novo = lados[l];
    lados[de].nodes = [...main.children].filter((c) => c !== r);
    lados[de].nodes.forEach((c) => c.remove());
    main.append(...novo.nodes);
    if (novo.scripts) { novo.scripts.forEach((src) => { const s = document.createElement("script"); s.src = src; document.body.append(s); }); novo.scripts = null; }
    document.title = novo.title;
    document.querySelectorAll(".nav a").forEach((a, i) => (novo.nav[i] ? a.setAttribute("aria-current", novo.nav[i]) : a.removeAttribute("aria-current")));
    r.dataset.lado = l;
    setas.forEach((s) => { s.href = lados[de].url; s.setAttribute("aria-label", "Girar para " + lados[de].nome); });
    aviso.textContent = "Agora em " + novo.nome;
    if (empurra) history.pushState({ roda: l }, "", novo.url);
  };

  // anima até um ângulo; se ele for o outro lado, troca a página ao chegar
  const vai = (alvo, empurra) => {
    cancelAnimationFrame(anima);
    const a0 = ang, dur = calmo ? 0 : 1400 * Math.max(0.35, Math.abs(alvo - a0) / 180), t0 = performance.now();
    const fim = () => {
      poe(alvo);
      // troca o conteúdo de baixo um instante depois de a roda parar: a pausa do navegador não aparece no giro
      if (ladoDe(alvo) !== r.dataset.lado) { repouso = alvo; const l = ladoDe(alvo); setTimeout(() => trocaPagina(l, empurra), 80); }
      else repouso = alvo;
    };
    if (!dur) return fim();
    const passo = (agora) => {
      const p = Math.min(1, (agora - t0) / dur), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      poe(a0 + (alvo - a0) * e);
      if (p < 1) anima = requestAnimationFrame(passo); else fim();
    };
    anima = requestAnimationFrame(passo);
  };
  // g = +1: "próximo" (roda anti-horária, a outra metade vem da direita)
  const gira = (g, empurra = true) => vai(repouso - g * 180, empurra);

  setas.forEach((s) => s.addEventListener("click", (e) => {
    if (!pronto()) return; // ainda não baixou: segue o link
    e.preventDefault();
    gira(Number(s.dataset.giro));
  }));
  addEventListener("popstate", (e) => {
    const l = e.state && e.state.roda;
    if (l && l !== r.dataset.lado && pronto()) gira(-1, false);
    else if (l && l !== r.dataset.lado) location.reload();
  });

  // arraste: a roda acompanha o dedo/mouse; soltar depois de 1/4 da volta completa o giro, antes disso volta
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
    // meia-volta inteira ao arrastar ~80% da largura; arrastar para a esquerda gira no sentido anti-horário
    const t = Math.max(-1, Math.min(1, dx / (r.clientWidth * 0.8)));
    poe(repouso + (pronto() ? t : t * 0.3) * 180);
  });
  const solta = (e) => {
    if (x0 === null || e.pointerId !== id) return;
    x0 = null; r.classList.remove("arrasta");
    if (!mexeu) return;
    const t = (ang - repouso) / 180;
    if (Math.abs(t) > 0.25 && pronto()) gira(t < 0 ? 1 : -1);
    else vai(repouso);
  };
  r.addEventListener("pointerup", solta);
  r.addEventListener("pointercancel", solta);
})();

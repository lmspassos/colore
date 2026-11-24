// Trilha: ao rolar, o triângulo da logo dá lugar a uma faixa que nasce dele e desce a home por trás das seções, desenhada pela rolagem.
(() => {
  const main = document.querySelector("main");
  const lt = document.querySelector(".logo-anim .lt");
  if (!main || !lt || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const NS = "http://www.w3.org/2000/svg", COR = ["--yellow", "--orange", "--pink", "--blue", "--green"];
  const el = (tag, attrs, pai) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); pai.append(e); return e; };

  const trilha = document.createElement("div");
  trilha.className = "trilha";
  trilha.setAttribute("aria-hidden", "true");
  const svg = el("svg", {}, trilha);
  const grad = el("linearGradient", { id: "trilha-cor", gradientUnits: "userSpaceOnUse", x1: 0, x2: 0 }, el("defs", {}, svg));
  COR.forEach((c, i) => el("stop", { offset: i / (COR.length - 1), style: `stop-color:var(${c})` }, grad));
  const corte = el("path", { "clip-rule": "evenodd" }, el("clipPath", { id: "trilha-corte" }, svg.firstChild));
  const rota = el("path", { stroke: "url(#trilha-cor)", "clip-path": "url(#trilha-corte)" }, svg);
  const bb = lt.getBBox();
  main.append(trilha);
  const html = document.documentElement;

  let comp = 0, topo = 0, fim = 1, w0 = 1;
  const mede = () => {
    const m = main.getBoundingClientRect(), y0 = scrollY + m.top;
    trilha.hidden = m.width < 800; // shortcut: em tela estreita a trilha some (não há laterais livres), revisar se houver design de celular
    if (trilha.hidden) { html.classList.remove("trilha-ativa"); return; }
    // x do triângulo da logo, medido sem o pulo da animação (getBBox ignora o transform do CSS)
    const sv = lt.ownerSVGElement, ctm = sv.getScreenCTM(), pt = sv.createSVGPoint();
    pt.x = bb.x + bb.width / 2; pt.y = bb.y + bb.height; // base do triângulo
    const c = pt.matrixTransform(ctm);
    w0 = bb.width * ctm.a;
    rota.style.strokeWidth = w0; // a faixa tem exatamente a largura do triângulo
    const h0 = bb.height * ctm.d, bx = c.x - m.left, by = c.y + scrollY - y0;
    topo = by - h0 * 0.5; // nasce dentro do triângulo; o corte abaixo só deixa a faixa aparecer a partir da base dele
    corte.setAttribute("d", `M0 0H${m.width}V${m.height}H0ZM${bx - w0} 0H${bx + w0}V${by - h0 * 0.2}H${bx - w0}Z`);
    // pontos de passagem: um pouco abaixo do triângulo, depois vaivém lateral largo a cada ~44rem (curvas redondas, pouca ondulação); Catmull-Rom liga tudo em curvas suaves
    const rem = parseFloat(getComputedStyle(html).fontSize), px = c.x - m.left, W = m.width;
    fim = m.height - 6 * rem;
    const n = Math.max(2, Math.round((fim - topo) / (44 * rem))), passo = (fim - topo) / n;
    const xs = [0.18, 0.82, 0.2, 0.8];
    const P = [[px, topo], [px, sv.getBoundingClientRect().bottom + scrollY - y0 + w0 * 0.6]]; // desce reto sob o triângulo, atravessando o "e", antes de curvar
    for (let i = 1; i <= n; i++) P.push([W * xs[(i - 1) % xs.length], topo + passo * i]);
    P.push(P[P.length - 1]);
    let d = `M${P[0]}`;
    for (let i = 0; i < P.length - 2; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
      d += `C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
    }
    svg.setAttribute("viewBox", `0 0 ${m.width} ${m.height}`);
    rota.setAttribute("d", d);
    grad.setAttribute("y1", topo); grad.setAttribute("y2", fim);
    comp = rota.getTotalLength();
    rota.style.strokeDasharray = comp;
    anda();
  };

  const anda = () => {
    if (trilha.hidden) return;
    const ativa = scrollY > 0;
    html.classList.toggle("trilha-ativa", ativa);
    if (!ativa) return;
    const m = main.getBoundingClientRect();
    const alvo = Math.min(innerHeight * 0.55 - m.top, topo + scrollY * 1.6); // linha de leitura; no começo, sai da logo aos poucos
    // acha o comprimento em que a faixa chega à linha de leitura (y cresce ao longo do caminho)
    let lo = 0, hi = comp;
    for (let k = 0; k < 18; k++) { const mid = (lo + hi) / 2; rota.getPointAtLength(mid).y < alvo ? (lo = mid) : (hi = mid); }
    const p = lo / comp;
    rota.style.strokeDashoffset = comp * (1 - p);
  };

  addEventListener("scroll", anda, { passive: true });
  new ResizeObserver(mede).observe(main);
  addEventListener("load", mede);
  mede();
})();
